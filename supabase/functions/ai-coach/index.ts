import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    // Fetch user's habits with completions
    const { data: habits } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', userId);

    const { data: completions } = await supabase
      .from('habit_completions')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .limit(100);

    // Fetch journal entries
    const { data: journals } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20);

    // Fetch mood logs
    const { data: moodLogs } = await supabase
      .from('mood_logs')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .limit(30);

    // Build context about user's data
    const habitsSummary = habits?.map(h => 
      `- ${h.name} (${h.category}): target ${h.target}x/day, importance ${h.importance}%`
    ).join('\n') || 'No habits tracked yet';

    const recentCompletions = completions?.slice(0, 30).map(c => {
      const habit = habits?.find(h => h.id === c.habit_id);
      return `${c.date}: ${habit?.name || 'Unknown'} - ${c.value}x`;
    }).join('\n') || 'No completions yet';

    const journalSummary = journals?.map(j => 
      `[${new Date(j.created_at).toLocaleDateString()}] ${j.emoji || ''} ${j.content.substring(0, 200)}...`
    ).join('\n\n') || 'No journal entries yet';

    const moodSummary = moodLogs?.map(m => 
      `${m.date}: Mood ${m.mood}/10, Motivation ${m.motivation}/10${m.reflection ? ` - "${m.reflection}"` : ''}`
    ).join('\n') || 'No mood data yet';

    // Calculate some stats
    const today = new Date().toISOString().split('T')[0];
    const todayCompletions = completions?.filter(c => c.date === today) || [];
    const completedToday = todayCompletions.filter(c => {
      const habit = habits?.find(h => h.id === c.habit_id);
      return habit && c.value >= habit.target;
    }).length;

    const systemPrompt = `You are an empathetic and insightful AI wellness coach for a habit tracking app. Your role is to help users stay motivated, analyze their progress, and provide personalized guidance.

## User's Current Data:

### Habits Being Tracked:
${habitsSummary}

### Recent Habit Completions (last 30 days):
${recentCompletions}

### Recent Journal Entries:
${journalSummary}

### Mood & Motivation Logs:
${moodSummary}

### Today's Progress:
- Completed ${completedToday} out of ${habits?.length || 0} habits today

## Your Approach:
1. Be warm, encouraging, and specific to their actual data
2. Reference their real habits, journal entries, and mood patterns
3. Identify patterns and trends in their behavior
4. Celebrate wins, no matter how small
5. Offer practical, actionable advice
6. Be concise but thoughtful - don't overwhelm with too much at once
7. Ask follow-up questions to understand their situation better
8. When they're struggling, validate their feelings before offering solutions

Remember: You have access to their real data, so be specific! Don't give generic advice - reference their actual habits, journal entries, and progress.`;

    console.log('Sending request to AI gateway with user context');

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
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

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("AI coach error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
