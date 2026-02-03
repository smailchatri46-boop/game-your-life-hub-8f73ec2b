import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// Cost-controlled usage limits ($2/month budget)
// Monthly: 1200 messages, Daily: 40 messages
const MONTHLY_MESSAGE_LIMIT = 1200;
const DAILY_MESSAGE_LIMIT = 40;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, userId } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Create Supabase client to fetch user data
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get current month and today's date
    const now = new Date();
    const monthYear = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const today = now.toISOString().split('T')[0];

    // Check usage limits if userId is provided
    if (userId) {
      const { data: usageData } = await supabase
        .from('ai_usage')
        .select('*')
        .eq('user_id', userId)
        .eq('month_year', monthYear)
        .single();

      let currentMonthCount = usageData?.message_count || 0;
      let lastMessageDate = usageData?.last_message_date;
      
      // Count messages sent today
      let todayCount = 0;
      if (lastMessageDate === today && usageData) {
        const { count } = await supabase
          .from('chat_messages')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)
          .eq('role', 'user')
          .gte('created_at', `${today}T00:00:00Z`);
        todayCount = count || 0;
      }

      // Check if user hit monthly limit
      if (currentMonthCount >= MONTHLY_MESSAGE_LIMIT) {
        return new Response(JSON.stringify({ 
          error: "limit_reached",
          message: "You've reached your AI limit for this month. It resets next month so we can keep Neyler sustainable 🌱"
        }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Check if user hit daily limit
      if (todayCount >= DAILY_MESSAGE_LIMIT) {
        return new Response(JSON.stringify({ 
          error: "daily_limit_reached",
          message: "You've reached today's AI limit. Come back tomorrow for more guidance 🌱"
        }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Update or create usage record
      if (usageData) {
        await supabase
          .from('ai_usage')
          .update({ 
            message_count: currentMonthCount + 1,
            last_message_date: today
          })
          .eq('id', usageData.id);
      } else {
        await supabase
          .from('ai_usage')
          .insert({ 
            user_id: userId,
            month_year: monthYear,
            message_count: 1,
            last_message_date: today
          });
      }
    }

    // Fetch user's data for context
    let completedToday = 0;
    let totalHabits = 0;
    let weeklyAvg = 0;
    let latestMood = '';
    let latestJournal = '';

    if (userId) {
      const { data: habits } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', userId);

      const { data: completions } = await supabase
        .from('habit_completions')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false })
        .limit(50);

      const { data: journals } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(3);

      const { data: moodLogs } = await supabase
        .from('mood_logs')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false })
        .limit(7);

      // Calculate weekly average
      if (completions?.length) {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const weeklyCompletions = completions.filter((c: { date: string }) => new Date(c.date) >= weekAgo);
        weeklyAvg = Math.round((weeklyCompletions.length / 7) * 100);
      }

      // Today's progress
      const todayCompletions = completions?.filter((c: { date: string }) => c.date === today) || [];
      completedToday = todayCompletions.filter((c: { habit_id: string; value: number }) => {
        const habit = habits?.find((h: { id: string; target: number }) => h.id === c.habit_id);
        return habit && c.value >= habit.target;
      }).length;
      totalHabits = habits?.length || 0;

      // Latest mood
      if (moodLogs?.[0]) {
        latestMood = `Mood: ${moodLogs[0].mood}/10`;
      }

      // Latest journal (truncated)
      if (journals?.[0]) {
        latestJournal = `Last note: "${journals[0].content.substring(0, 60)}..."`;
      }
    }

    // Build concise data summary (cost control - minimal tokens)
    const dataSummary = `Stats: ${completedToday}/${totalHabits} today, ${weeklyAvg}% weekly. ${latestMood} ${latestJournal}`.trim();

    const systemPrompt = `You are a supportive wellness coach. Help with habits, motivation, consistency, avoiding burnout. Be warm, realistic, never shame. Max 120 words, 1 emoji max. No markdown or bullets.

User data: ${dataSummary}

Rules: Encourage gently if behind. Suggest balance if over-performing. Prioritize emotional support if mood drops. Focus on progress, not perfection.`;

    console.log('Sending request to AI gateway');

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        max_tokens: 150, // ~120 words max for cost control
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Usage limit reached. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || "I'm here to help with your habits and goals! What would you like to discuss?";

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("AI coach error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
