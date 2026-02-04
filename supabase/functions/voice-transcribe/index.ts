import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// Cost limit: $1/month split across 30 days = ~$0.033/day
// Gemini 2.5 Flash costs roughly $0.0001 per 1 second of audio
// So daily limit: ~330 seconds (5.5 min) per user per day
const DAILY_SECONDS_LIMIT = 60; // 1 minute per day to be safe (stays well under $1/month)
const MONTHLY_SECONDS_LIMIT = 600; // 10 minutes total per month

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get user from auth header
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
    
    // Verify the JWT and get user
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      console.error('Auth error:', authError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { audioBase64, durationSeconds = 10 } = await req.json();
    
    if (!audioBase64) {
      return new Response(
        JSON.stringify({ error: 'No audio data provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check usage limits
    const today = new Date().toISOString().split('T')[0];
    const monthYear = today.substring(0, 7); // YYYY-MM
    
    // Get or create usage record
    const { data: usageData, error: usageError } = await supabase
      .from('ai_usage')
      .select('*')
      .eq('user_id', user.id)
      .eq('month_year', monthYear)
      .single();

    let currentDailySeconds = 0;
    let currentMonthlySeconds = 0;

    if (usageData) {
      // Reset daily counter if it's a new day
      if (usageData.voice_last_date !== today) {
        currentDailySeconds = 0;
      } else {
        currentDailySeconds = usageData.voice_seconds_today || 0;
      }
      currentMonthlySeconds = usageData.voice_seconds_used || 0;
    }

    // Check limits
    if (currentDailySeconds >= DAILY_SECONDS_LIMIT) {
      console.log(`User ${user.id} hit daily voice limit: ${currentDailySeconds}s`);
      return new Response(
        JSON.stringify({ error: 'Daily voice limit reached. Try again tomorrow!' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (currentMonthlySeconds >= MONTHLY_SECONDS_LIMIT) {
      console.log(`User ${user.id} hit monthly voice limit: ${currentMonthlySeconds}s`);
      return new Response(
        JSON.stringify({ error: 'Monthly voice limit reached. Limit resets next month.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`User ${user.id} voice usage: ${currentDailySeconds}s today, ${currentMonthlySeconds}s this month`);
    console.log('Received audio data, length:', audioBase64.length);

    // Use Lovable AI to transcribe audio using Gemini's multimodal capabilities
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'You are a transcription assistant. Transcribe the audio exactly as spoken. Output ONLY the transcribed text, nothing else. If you cannot understand the audio, output an empty string.'
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Please transcribe this audio recording:'
              },
              {
                type: 'input_audio',
                input_audio: {
                  data: audioBase64,
                  format: 'wav'
                }
              }
            ]
          }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Usage limit reached. Please add credits.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: 'Failed to transcribe audio' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const result = await response.json();
    const transcribedText = result.choices?.[0]?.message?.content?.trim() || '';
    
    console.log('Transcription result:', transcribedText.substring(0, 100));

    // Update usage tracking
    const newDailySeconds = currentDailySeconds + durationSeconds;
    const newMonthlySeconds = currentMonthlySeconds + durationSeconds;

    if (usageData) {
      await supabase
        .from('ai_usage')
        .update({
          voice_seconds_today: usageData.voice_last_date === today ? newDailySeconds : durationSeconds,
          voice_seconds_used: newMonthlySeconds,
          voice_last_date: today,
          updated_at: new Date().toISOString(),
        })
        .eq('id', usageData.id);
    } else {
      await supabase
        .from('ai_usage')
        .insert({
          user_id: user.id,
          month_year: monthYear,
          voice_seconds_today: durationSeconds,
          voice_seconds_used: durationSeconds,
          voice_last_date: today,
        });
    }

    return new Response(
      JSON.stringify({ text: transcribedText }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Voice transcribe error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
