import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Voice usage limits for $2/month budget
// Whisper costs $0.006/minute
// $1.80 budget for voice = 300 minutes/month = 18000 seconds
// Daily limit: 600 seconds (10 min) to spread usage
const MONTHLY_VOICE_SECONDS = 18000; // 300 minutes
const DAILY_VOICE_SECONDS = 600; // 10 minutes
const MAX_AUDIO_DURATION_SECONDS = 60; // Max 60 seconds per recording

// Process base64 in chunks to prevent memory issues
function processBase64Chunks(base64String: string, chunkSize = 32768) {
  const chunks: Uint8Array[] = [];
  let position = 0;
  
  while (position < base64String.length) {
    const chunk = base64String.slice(position, position + chunkSize);
    const binaryChunk = atob(chunk);
    const bytes = new Uint8Array(binaryChunk.length);
    
    for (let i = 0; i < binaryChunk.length; i++) {
      bytes[i] = binaryChunk.charCodeAt(i);
    }
    
    chunks.push(bytes);
    position += chunkSize;
  }

  const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;

  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }

  return result;
}

// Estimate audio duration from file size (rough estimate)
// WebM audio is typically ~12-16 kbps = ~1.5-2 KB/sec
function estimateAudioDuration(audioBytes: Uint8Array): number {
  const fileSizeKB = audioBytes.length / 1024;
  // Assume ~2 KB per second for WebM audio
  return Math.ceil(fileSizeKB / 2);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { audio, mimeType, userId } = await req.json();
    
    if (!audio) {
      throw new Error('No audio data provided');
    }

    if (!userId) {
      throw new Error('User ID is required');
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get current month and today's date
    const now = new Date();
    const monthYear = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const today = now.toISOString().split('T')[0];

    // Process audio to estimate duration
    const binaryAudio = processBase64Chunks(audio);
    const estimatedDuration = estimateAudioDuration(binaryAudio);

    console.log(`Estimated audio duration: ${estimatedDuration} seconds`);

    // Check if audio is too long
    if (estimatedDuration > MAX_AUDIO_DURATION_SECONDS) {
      return new Response(JSON.stringify({ 
        error: "audio_too_long",
        message: `Audio is too long 😅 Please keep recordings under ${MAX_AUDIO_DURATION_SECONDS} seconds for better results!`
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check usage limits
    const { data: usageData } = await supabase
      .from('ai_usage')
      .select('*')
      .eq('user_id', userId)
      .eq('month_year', monthYear)
      .single();

    const currentMonthSeconds = usageData?.voice_seconds_used || 0;
    const voiceLastDate = usageData?.voice_last_date;
    let todaySeconds = usageData?.voice_seconds_today || 0;

    // Reset daily counter if it's a new day
    if (voiceLastDate !== today) {
      todaySeconds = 0;
    }

    // Check monthly limit
    if (currentMonthSeconds + estimatedDuration > MONTHLY_VOICE_SECONDS) {
      const remainingMinutes = Math.floor((MONTHLY_VOICE_SECONDS - currentMonthSeconds) / 60);
      return new Response(JSON.stringify({ 
        error: "monthly_limit_reached",
        message: `You've used your voice input budget for this month 😊 You have about ${remainingMinutes} minutes left. Usage resets next month! 📄✨`
      }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check daily limit
    if (todaySeconds + estimatedDuration > DAILY_VOICE_SECONDS) {
      const remainingMinutes = Math.floor((DAILY_VOICE_SECONDS - todaySeconds) / 60);
      return new Response(JSON.stringify({ 
        error: "daily_limit_reached",
        message: `You've used your voice input for today 😊 About ${remainingMinutes} minutes remaining. Come back tomorrow to continue! ✨`
      }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Processing audio for Whisper transcription...');
    console.log('MIME type:', mimeType || 'audio/webm');
    
    // Determine file extension from mime type
    const extension = mimeType?.includes('mp4') ? 'mp4' : 
                      mimeType?.includes('wav') ? 'wav' : 
                      mimeType?.includes('ogg') ? 'ogg' : 'webm';
    
    // Prepare form data
    const formData = new FormData();
    const blob = new Blob([binaryAudio], { type: mimeType || 'audio/webm' });
    formData.append('file', blob, `audio.${extension}`);
    formData.append('model', 'whisper-1');
    formData.append('language', 'en');

    console.log('Sending to OpenAI Whisper API...');

    // Send to OpenAI
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${errorText}`);
    }

    const result = await response.json();
    console.log('Transcription successful:', result.text?.substring(0, 50) + '...');

    // Update usage tracking after successful transcription
    if (usageData) {
      await supabase
        .from('ai_usage')
        .update({ 
          voice_seconds_used: currentMonthSeconds + estimatedDuration,
          voice_last_date: today,
          voice_seconds_today: voiceLastDate === today ? todaySeconds + estimatedDuration : estimatedDuration
        })
        .eq('id', usageData.id);
    } else {
      // Create new usage record if none exists
      await supabase
        .from('ai_usage')
        .insert({ 
          user_id: userId,
          month_year: monthYear,
          message_count: 0,
          last_message_date: today,
          voice_seconds_used: estimatedDuration,
          voice_last_date: today,
          voice_seconds_today: estimatedDuration
        });
    }

    return new Response(
      JSON.stringify({ text: result.text }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Whisper transcription error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});