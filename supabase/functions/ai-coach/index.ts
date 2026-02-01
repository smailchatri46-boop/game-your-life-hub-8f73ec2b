import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// Usage limits
const MONTHLY_MESSAGE_LIMIT = 3000;
const DAILY_MESSAGE_LIMIT = 180;

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
          message: "You've reached your AI coaching limit for this month 😊 Your usage resets at the start of next month."
        }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Check if user hit daily limit
      if (todayCount >= DAILY_MESSAGE_LIMIT) {
        return new Response(JSON.stringify({ 
          error: "daily_limit_reached",
          message: "You've reached your AI coaching limit for today 😊 Come back tomorrow!"
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
    let habitsSummary = 'No habits tracked yet';
    let recentCompletions = 'No completions yet';
    let journalSummary = 'No journal entries yet';
    let moodSummary = 'No mood data yet';
    let completedToday = 0;
    let totalHabits = 0;

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
        .limit(100);

      const { data: journals } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20);

      const { data: moodLogs } = await supabase
        .from('mood_logs')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false })
        .limit(30);

      habitsSummary = habits?.map(h => 
        `- ${h.name} (${h.category}): target ${h.target}x/day, importance ${h.importance}%`
      ).join('\n') || 'No habits tracked yet';

      recentCompletions = completions?.slice(0, 30).map(c => {
        const habit = habits?.find(h => h.id === c.habit_id);
        return `${c.date}: ${habit?.name || 'Unknown'} - ${c.value}x`;
      }).join('\n') || 'No completions yet';

      journalSummary = journals?.map(j => 
        `[${new Date(j.created_at).toLocaleDateString()}] ${j.emoji || ''} ${j.content.substring(0, 200)}...`
      ).join('\n\n') || 'No journal entries yet';

      moodSummary = moodLogs?.map(m => 
        `${m.date}: Mood ${m.mood}/10, Motivation ${m.motivation}/10${m.reflection ? ` - "${m.reflection}"` : ''}`
      ).join('\n') || 'No mood data yet';

      const todayCompletions = completions?.filter(c => c.date === today) || [];
      completedToday = todayCompletions.filter(c => {
        const habit = habits?.find(h => h.id === c.habit_id);
        return habit && c.value >= habit.target;
      }).length;
      totalHabits = habits?.length || 0;
    }

    const systemPrompt = `# Role & Identity

You are an AI wellness coach built into a habit-tracking app.
Your job is to help users with: habits, routine building, motivation, consistency, overwhelm & burnout prevention, mood & reflection.
You are supportive but realistic, friendly and simple.
You are NOT a therapist, doctor, or emergency support.

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
- Completed ${completedToday} out of ${totalHabits} habits today

# Core Behavior Rules

1. Always be supportive + encouraging, but also realistic
2. Keep answers SHORT (2-5 sentences max), straight to the point
3. Use simple language anyone can understand
4. Always include emojis (but don't overdo — 2-5 per answer)
5. Avoid strange formatting or symbols
6. Never lecture, shame, or guilt users
7. Never tell users to "just try harder"
8. Avoid extreme productivity culture
9. Tone: warm, practical, kind, honest, normal human friend energy

# Burnout-Prevention Philosophy (VERY IMPORTANT)

You STRONGLY discourage "all-or-nothing" pushing.
Consistently remind users that:
- Starting small is best
- Doing too much too fast causes burnout
- Progress is built gradually
- Habits compound slowly
- Missing days is normal
- Perfection is NOT the goal

# Response Length Rule

ALWAYS keep replies SHORT. Target: 1-2 short paragraphs maximum.

Remember: You have access to their REAL data, so be specific! Reference their actual habits, journal entries, and progress.`;

    console.log('Sending request to AI gateway');

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        max_tokens: 300,
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
