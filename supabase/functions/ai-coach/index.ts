import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// Cost-controlled usage limits ($2/month budget)
const MONTHLY_MESSAGE_LIMIT = 1200;
const DAILY_MESSAGE_LIMIT = 40;

// Type definitions for database records
interface Habit {
  id: string;
  name: string;
  target: number;
  category: string;
  icon: string;
}

interface HabitCompletion {
  habit_id: string;
  date: string;
  value: number;
}

interface Goal {
  id: string;
  name: string;
  target_count: number;
  completed_count: number;
  start_date: string;
  end_date: string;
  status: string;
  category_emoji: string;
}

interface Todo {
  text: string;
  completed: boolean;
  date: string;
}

interface MoodLog {
  date: string;
  mood: number | null;
  motivation: number | null;
  reflection: string | null;
}

interface JournalEntry {
  content: string;
  created_at: string;
  emoji: string | null;
}

// Calculate streak for a habit
function calculateStreak(habitId: string, completions: HabitCompletion[], target: number): number {
  const habitCompletions = completions
    .filter(c => c.habit_id === habitId && c.value >= target)
    .map(c => c.date)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  if (habitCompletions.length === 0) return 0;

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < habitCompletions.length; i++) {
    const expectedDate = new Date(today);
    expectedDate.setDate(expectedDate.getDate() - i);
    const expectedStr = expectedDate.toISOString().split('T')[0];

    if (habitCompletions.includes(expectedStr)) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

// Calculate completion rate for a period
function calculateCompletionRate(
  habitId: string,
  completions: HabitCompletion[],
  target: number,
  days: number
): number {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  const cutoffStr = cutoff.toISOString().split('T')[0];

  const relevantCompletions = completions.filter(
    c => c.habit_id === habitId && c.date >= cutoffStr && c.value >= target
  );

  return Math.round((relevantCompletions.length / days) * 100);
}

// Detect best and worst performing habits
function detectPatterns(habits: Habit[], completions: HabitCompletion[]): { bestHabit: string | null; worstHabit: string | null; bestDay: string | null } {
  const habitRates: { name: string; rate: number }[] = [];

  for (const habit of habits) {
    const rate = calculateCompletionRate(habit.id, completions, habit.target, 7);
    habitRates.push({ name: habit.name, rate });
  }

  habitRates.sort((a, b) => b.rate - a.rate);

  // Calculate best day of week
  const dayCompletions: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
  const dayCounts: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };

  for (const completion of completions) {
    const day = new Date(completion.date).getDay();
    dayCompletions[day] += completion.value;
    dayCounts[day]++;
  }

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  let bestDay: string | null = null;
  let bestDayRate = 0;

  for (let d = 0; d < 7; d++) {
    if (dayCounts[d] > 0) {
      const rate = dayCompletions[d] / dayCounts[d];
      if (rate > bestDayRate) {
        bestDayRate = rate;
        bestDay = dayNames[d];
      }
    }
  }

  return {
    bestHabit: habitRates.length > 0 && habitRates[0].rate > 50 ? habitRates[0].name : null,
    worstHabit: habitRates.length > 0 && habitRates[habitRates.length - 1].rate < 50 ? habitRates[habitRates.length - 1].name : null,
    bestDay,
  };
}

// Build the structured context document
function buildContextDocument(
  habits: Habit[],
  completions: HabitCompletion[],
  goals: Goal[],
  todos: Todo[],
  moodLogs: MoodLog[],
  journals: JournalEntry[],
  today: string
): string {
  const lines: string[] = ['=== USER PROGRESS REPORT ===', ''];

  // HABITS SECTION
  lines.push(`HABITS (${habits.length} total):`);
  if (habits.length === 0) {
    lines.push('- No habits created yet');
  } else {
    for (const habit of habits) {
      const weekRate = calculateCompletionRate(habit.id, completions, habit.target, 7);
      const monthRate = calculateCompletionRate(habit.id, completions, habit.target, 30);
      const streak = calculateStreak(habit.id, completions, habit.target);
      lines.push(`- ${habit.icon} ${habit.name} (target: ${habit.target}/day): ${weekRate}% this week, ${monthRate}% this month${streak > 1 ? `, streak: ${streak} days` : ''}`);
    }
  }
  lines.push('');

  // GOALS SECTION
  const activeGoals = goals.filter(g => g.status === 'active');
  lines.push(`GOALS (${activeGoals.length} active):`);
  if (activeGoals.length === 0) {
    lines.push('- No active goals');
  } else {
    for (const goal of activeGoals) {
      const progress = goal.target_count > 0 
        ? Math.round((goal.completed_count / goal.target_count) * 100) 
        : 0;
      const endDate = new Date(goal.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      lines.push(`- ${goal.category_emoji} "${goal.name}" - ${progress}% complete (${goal.completed_count}/${goal.target_count}), ends ${endDate}`);
    }
  }
  lines.push('');

  // TODAY'S TASKS SECTION
  const todayTodos = todos.filter(t => t.date === today);
  lines.push(`TODAY'S TASKS (${todayTodos.length}):`);
  if (todayTodos.length === 0) {
    lines.push('- No tasks for today');
  } else {
    for (const todo of todayTodos) {
      lines.push(`- [${todo.completed ? 'x' : ' '}] ${todo.text}`);
    }
  }
  lines.push('');

  // MOOD TREND SECTION
  const recentMoods = moodLogs.slice(0, 7);
  lines.push('MOOD TREND (last 7 days):');
  if (recentMoods.length === 0) {
    lines.push('- No mood logs recorded');
  } else {
    const moodAvg = recentMoods.reduce((sum, m) => sum + (m.mood || 0), 0) / recentMoods.length;
    const motivationAvg = recentMoods.reduce((sum, m) => sum + (m.motivation || 0), 0) / recentMoods.length;
    
    const moodStrs = recentMoods.map(m => {
      const day = new Date(m.date).toLocaleDateString('en-US', { weekday: 'short' });
      return `${day}: ${m.mood || '?'}/10`;
    });
    lines.push(moodStrs.join(', '));
    lines.push(`Average mood: ${moodAvg.toFixed(1)}/10, Motivation: ${motivationAvg.toFixed(1)}/10`);
    
    // Detect trend
    if (recentMoods.length >= 3) {
      const recent3 = recentMoods.slice(0, 3).map(m => m.mood || 5);
      const older3 = recentMoods.slice(3, 6).map(m => m.mood || 5);
      if (older3.length > 0) {
        const recentAvg = recent3.reduce((a, b) => a + b, 0) / recent3.length;
        const olderAvg = older3.reduce((a, b) => a + b, 0) / older3.length;
        if (recentAvg > olderAvg + 0.5) {
          lines.push('Trend: Improving 📈');
        } else if (recentAvg < olderAvg - 0.5) {
          lines.push('Trend: Declining 📉 (may need support)');
        } else {
          lines.push('Trend: Stable');
        }
      }
    }
  }
  lines.push('');

  // RECENT REFLECTIONS SECTION
  lines.push('RECENT REFLECTIONS:');
  if (journals.length === 0) {
    lines.push('- No journal entries yet');
  } else {
    for (const journal of journals.slice(0, 5)) {
      const date = new Date(journal.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const preview = journal.content.substring(0, 150).replace(/\n/g, ' ');
      lines.push(`- ${date}: "${preview}${journal.content.length > 150 ? '...' : ''}"`);
    }
  }
  lines.push('');

  // PATTERNS SECTION
  if (habits.length > 0 && completions.length > 0) {
    const patterns = detectPatterns(habits, completions);
    lines.push('PATTERNS DETECTED:');
    if (patterns.bestDay) {
      lines.push(`- Best habit day: ${patterns.bestDay}`);
    }
    if (patterns.bestHabit) {
      lines.push(`- Strongest habit: ${patterns.bestHabit} (keep it up!)`);
    }
    if (patterns.worstHabit) {
      lines.push(`- Needs attention: ${patterns.worstHabit}`);
    }
  }

  return lines.join('\n');
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, userId: providedUserId } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Authenticate user from JWT if Authorization header is present
    let userId = providedUserId;
    const authHeader = req.headers.get('Authorization');
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '');
      const authClient = createClient(supabaseUrl, supabaseAnonKey, {
        global: { headers: { Authorization: authHeader } }
      });
      const { data: claimsData, error: claimsError } = await authClient.auth.getClaims(token);
      if (!claimsError && claimsData?.claims?.sub) {
        // Use authenticated user ID instead of provided one (prevents spoofing)
        userId = claimsData.claims.sub as string;
      }
    }

    const now = new Date();
    const monthYear = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const today = now.toISOString().split('T')[0];
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // Check usage limits if userId is provided
    if (userId) {
      const { data: usageData } = await supabase
        .from('ai_usage')
        .select('*')
        .eq('user_id', userId)
        .eq('month_year', monthYear)
        .single();

      const currentMonthCount = usageData?.message_count || 0;
      const lastMessageDate = usageData?.last_message_date;

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

      if (currentMonthCount >= MONTHLY_MESSAGE_LIMIT) {
        return new Response(JSON.stringify({ 
          error: "limit_reached",
          message: "You've reached your AI limit for this month. It resets next month so we can keep Neyler sustainable 🌱"
        }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (todayCount >= DAILY_MESSAGE_LIMIT) {
        return new Response(JSON.stringify({ 
          error: "daily_limit_reached",
          message: "You've reached today's AI limit. Come back tomorrow for more guidance 🌱"
        }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Update usage record
      if (usageData) {
        await supabase
          .from('ai_usage')
          .update({ message_count: currentMonthCount + 1, last_message_date: today })
          .eq('id', usageData.id);
      } else {
        await supabase
          .from('ai_usage')
          .insert({ user_id: userId, month_year: monthYear, message_count: 1, last_message_date: today });
      }
    }

    // Fetch comprehensive user data
    let contextDocument = 'No user data available - user is not logged in.';

    if (userId) {
      // Parallel fetch all user data
      const [habitsResult, completionsResult, goalsResult, todosResult, moodLogsResult, journalsResult] = await Promise.all([
        supabase.from('habits').select('id, name, target, category, icon').eq('user_id', userId),
        supabase.from('habit_completions').select('habit_id, date, value').eq('user_id', userId).gte('date', thirtyDaysAgo).order('date', { ascending: false }),
        supabase.from('goals').select('id, name, target_count, completed_count, start_date, end_date, status, category_emoji').eq('user_id', userId),
        supabase.from('daily_todos').select('text, completed, date').eq('user_id', userId).gte('date', sevenDaysAgo).order('date', { ascending: false }),
        supabase.from('mood_logs').select('date, mood, motivation, reflection').eq('user_id', userId).gte('date', thirtyDaysAgo).order('date', { ascending: false }),
        supabase.from('journal_entries').select('content, created_at, emoji').eq('user_id', userId).order('created_at', { ascending: false }).limit(10),
      ]);

      const habits = (habitsResult.data || []) as Habit[];
      const completions = (completionsResult.data || []) as HabitCompletion[];
      const goals = (goalsResult.data || []) as Goal[];
      const todos = (todosResult.data || []) as Todo[];
      const moodLogs = (moodLogsResult.data || []) as MoodLog[];
      const journals = (journalsResult.data || []) as JournalEntry[];

      contextDocument = buildContextDocument(habits, completions, goals, todos, moodLogs, journals, today);
    }

    const systemPrompt = `You are the Neyler AI Buddy - a personal wellness coach with full visibility into the user's habits, goals, mood, and daily reflections.

YOUR DATA ACCESS:
You have the user's complete progress report below. Use it to:
- Identify patterns (good and concerning)
- Celebrate streaks and achievements
- Gently address declining trends
- Connect mood patterns to habit performance
- Reference specific habits/goals by name

RESPONSE STYLE:
- Warm, supportive, never judgmental
- Reference specific data when available ("I see your meditation streak is at 7 days!")
- Provide actionable, personalized insights
- Maximum 150 words
- Use 1-2 emojis max
- No markdown formatting (no bullets, bold, or headers)
- Write in flowing sentences, not lists

IMPORTANT RULES:
- If user asks about their data, reference the specific numbers from their report
- If they're struggling, acknowledge it gently and offer one small actionable step
- If they're doing well, celebrate specifically what's working
- Never make up data - only reference what's in the report below
- If no data exists for something, acknowledge it and encourage them to start tracking

USER DATA:
${contextDocument}`;

    console.log('Sending request to AI gateway with enhanced context');

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
        max_tokens: 200,
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
