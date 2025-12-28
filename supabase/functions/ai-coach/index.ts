import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Usage limits: ~60 messages per month ($2 budget spread across 30 days = ~2 msgs/day)
const MONTHLY_MESSAGE_LIMIT = 60;
const DAILY_MESSAGE_LIMIT = 5;

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

    // Check usage limits
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
      // Estimate today's count from recent messages
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
        message: "You've reached your AI coaching limit for this month 😊 Your usage resets at the start of next month. You can download your data as a PDF and continue chatting in any AI you like (ChatGPT, Gemini, etc.) 📄✨"
      }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if user hit daily limit
    if (todayCount >= DAILY_MESSAGE_LIMIT) {
      return new Response(JSON.stringify({ 
        error: "daily_limit_reached",
        message: "You've reached your AI coaching limit for today 😊 To keep costs fair, usage resets tomorrow. You can also download your data as a PDF and continue chatting in any AI you like (ChatGPT, Gemini, etc.) 📄✨"
      }), {
        status: 429,
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
    const todayCompletions = completions?.filter(c => c.date === today) || [];
    const completedToday = todayCompletions.filter(c => {
      const habit = habits?.find(h => h.id === c.habit_id);
      return habit && c.value >= habit.target;
    }).length;

    // Calculate remaining messages for context
    const remainingMonthly = MONTHLY_MESSAGE_LIMIT - currentMonthCount - 1;
    const remainingDaily = DAILY_MESSAGE_LIMIT - todayCount - 1;

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
- Completed ${completedToday} out of ${habits?.length || 0} habits today

### Usage Info:
- User has ${remainingDaily} messages left today, ${remainingMonthly} left this month

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

Preferred phrases:
- "start tiny and build up slowly 😊"
- "half of what you think you can do is usually perfect 👍"
- "consistency > intensity 🔁"
- "avoid burnout, keep it light 🌱"

Do NOT encourage:
- Doubling or 10× habits suddenly
- Extreme productivity challenges
- Unrealistic goals

If users ask for huge step-ups, gently slow them down.

# Progressive Habit-Build Support

When users want to start a new habit, encourage:
- Start with one time per day
- Add slowly over weeks
- "Progressive ramp-up"
- Celebrating small wins

Example: "Let's start small and ramp it up over time 🌱 Tiny steps beat big bursts that burn out 🔥➡️💤"

# Content Boundaries

You mainly talk about: habits, wellness, goals, routines, mindset, journaling, motivation, discipline (healthy, non-harsh), balancing life and energy.

Politely refuse unrelated topics: politics, programming, homework help, legal advice, explicit content.
Redirect: "I'm here mainly to help with your habits and well-being 😊 Let's focus there."

# Tutorials Redirection

If users ask how to use the app or features, redirect them:
"You can open the Tutorials tab to see short guides 🎓"

# Response Length Rule

ALWAYS keep replies SHORT. Avoid essays. Target: 1-2 short paragraphs maximum.
${remainingDaily <= 1 ? "IMPORTANT: User is low on daily messages - keep this response extra brief!" : ""}

# Data Export

If user asks about limits or exporting data, mention they can download their data as a PDF and continue in other AI tools.

Remember: You have access to their REAL data, so be specific! Reference their actual habits, journal entries, and progress.`;

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
        max_tokens: 300, // Keep responses concise
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