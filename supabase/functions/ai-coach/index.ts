import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// Cost-controlled usage limits ($2/month budget)
const MONTHLY_MESSAGE_LIMIT = 1200;
const DAILY_MESSAGE_LIMIT = 40;

interface Habit {
  id: string;
  name: string;
  icon: string;
  category: string;
  target: number;
  importance: number | null;
}

interface HabitCompletion {
  habit_id: string;
  date: string;
  value: number;
}

interface Goal {
  id: string;
  name: string;
  category: string;
  category_emoji: string;
  start_date: string;
  end_date: string;
  target_count: number;
  completed_count: number;
  status: string;
}

interface MoodLog {
  date: string;
  mood: number | null;
  motivation: number | null;
  reflection: string | null;
}

interface JournalEntry {
  content: string;
  emoji: string | null;
  created_at: string;
}

interface Todo {
  text: string;
  completed: boolean;
  date: string;
}

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

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const now = new Date();
    const monthYear = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const today = now.toISOString().split('T')[0];

    // Check usage limits
    if (userId) {
      const { data: usageData } = await supabase
        .from('ai_usage')
        .select('*')
        .eq('user_id', userId)
        .eq('month_year', monthYear)
        .single();

      let currentMonthCount = usageData?.message_count || 0;
      let lastMessageDate = usageData?.last_message_date;
      
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

    // ===== FETCH COMPREHENSIVE USER DATA =====
    let userDataContext = "";

    if (userId) {
      // Calculate date ranges
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split('T')[0];
      
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0];

      // Fetch all user data in parallel
      const [
        { data: habits },
        { data: completions },
        { data: goals },
        { data: moodLogs },
        { data: journals },
        { data: todos },
        { data: profile }
      ] = await Promise.all([
        supabase.from('habits').select('*').eq('user_id', userId),
        supabase.from('habit_completions').select('*').eq('user_id', userId).gte('date', thirtyDaysAgoStr).order('date', { ascending: false }),
        supabase.from('goals').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
        supabase.from('mood_logs').select('*').eq('user_id', userId).gte('date', thirtyDaysAgoStr).order('date', { ascending: false }),
        supabase.from('journal_entries').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(10),
        supabase.from('daily_todos').select('*').eq('user_id', userId).gte('date', sevenDaysAgoStr).order('date', { ascending: false }),
        supabase.from('profiles').select('*').eq('id', userId).single()
      ]);

      const typedHabits = (habits || []) as Habit[];
      const typedCompletions = (completions || []) as HabitCompletion[];
      const typedGoals = (goals || []) as Goal[];
      const typedMoodLogs = (moodLogs || []) as MoodLog[];
      const typedJournals = (journals || []) as JournalEntry[];
      const typedTodos = (todos || []) as Todo[];

      // Build comprehensive context
      const contextParts: string[] = [];

      // User profile
      if (profile?.full_name) {
        contextParts.push(`User name: ${profile.full_name}`);
      }

      // ===== HABITS SECTION =====
      if (typedHabits.length > 0) {
        const habitLines: string[] = [];
        habitLines.push(`\n=== HABITS (${typedHabits.length} total) ===`);
        
        for (const habit of typedHabits) {
          const habitCompletions = typedCompletions.filter(c => c.habit_id === habit.id);
          
          // Calculate stats
          const last7Days = habitCompletions.filter(c => c.date >= sevenDaysAgoStr);
          const last30Days = habitCompletions;
          
          const completedLast7 = last7Days.filter(c => c.value >= habit.target).length;
          const completedLast30 = last30Days.filter(c => c.value >= habit.target).length;
          
          const todayCompletion = habitCompletions.find(c => c.date === today);
          const todayStatus = todayCompletion 
            ? (todayCompletion.value >= habit.target ? "✓ Done" : `${todayCompletion.value}/${habit.target}`)
            : "Not done";
          
          // Calculate streak
          let streak = 0;
          const sortedDates = [...new Set(habitCompletions.filter(c => c.value >= habit.target).map(c => c.date))].sort().reverse();
          for (let i = 0; i < sortedDates.length; i++) {
            const expectedDate = new Date();
            expectedDate.setDate(expectedDate.getDate() - i);
            const expectedStr = expectedDate.toISOString().split('T')[0];
            if (sortedDates[i] === expectedStr) {
              streak++;
            } else {
              break;
            }
          }
          
          habitLines.push(`• ${habit.icon} ${habit.name} (${habit.category})`);
          habitLines.push(`  Target: ${habit.target}/day | Today: ${todayStatus} | Streak: ${streak} days`);
          habitLines.push(`  Last 7 days: ${completedLast7}/7 (${Math.round(completedLast7/7*100)}%) | Last 30 days: ${completedLast30}/30 (${Math.round(completedLast30/30*100)}%)`);
        }
        
        contextParts.push(habitLines.join('\n'));
      } else {
        contextParts.push('\n=== HABITS ===\nNo habits created yet.');
      }

      // ===== GOALS SECTION =====
      if (typedGoals.length > 0) {
        const goalLines: string[] = [];
        goalLines.push(`\n=== GOALS (${typedGoals.length} total) ===`);
        
        for (const goal of typedGoals) {
          const progress = goal.target_count > 0 ? Math.round((goal.completed_count / goal.target_count) * 100) : 0;
          const daysLeft = Math.ceil((new Date(goal.end_date).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          
          goalLines.push(`• ${goal.category_emoji} ${goal.name} (${goal.category})`);
          goalLines.push(`  Progress: ${goal.completed_count}/${goal.target_count} (${progress}%) | Status: ${goal.status}`);
          goalLines.push(`  Period: ${goal.start_date} to ${goal.end_date} | Days remaining: ${daysLeft > 0 ? daysLeft : 'Ended'}`);
        }
        
        contextParts.push(goalLines.join('\n'));
      } else {
        contextParts.push('\n=== GOALS ===\nNo goals created yet.');
      }

      // ===== MOOD & MOTIVATION SECTION =====
      if (typedMoodLogs.length > 0) {
        const moodLines: string[] = [];
        moodLines.push(`\n=== MOOD & MOTIVATION (Last 30 days) ===`);
        
        const avgMood = typedMoodLogs.filter(m => m.mood !== null).reduce((sum, m) => sum + (m.mood || 0), 0) / (typedMoodLogs.filter(m => m.mood !== null).length || 1);
        const avgMotivation = typedMoodLogs.filter(m => m.motivation !== null).reduce((sum, m) => sum + (m.motivation || 0), 0) / (typedMoodLogs.filter(m => m.motivation !== null).length || 1);
        
        moodLines.push(`Average mood: ${avgMood.toFixed(1)}/10 | Average motivation: ${avgMotivation.toFixed(1)}/10`);
        moodLines.push(`Total entries: ${typedMoodLogs.length}`);
        
        // Recent mood trend
        moodLines.push('\nRecent entries:');
        for (const log of typedMoodLogs.slice(0, 7)) {
          const moodStr = log.mood !== null ? `Mood: ${log.mood}/10` : '';
          const motivStr = log.motivation !== null ? `Motivation: ${log.motivation}/10` : '';
          const reflectionStr = log.reflection ? ` - "${log.reflection.substring(0, 50)}..."` : '';
          moodLines.push(`  ${log.date}: ${moodStr} ${motivStr}${reflectionStr}`);
        }
        
        contextParts.push(moodLines.join('\n'));
      } else {
        contextParts.push('\n=== MOOD ===\nNo mood logs yet.');
      }

      // ===== JOURNAL SECTION =====
      if (typedJournals.length > 0) {
        const journalLines: string[] = [];
        journalLines.push(`\n=== RECENT JOURNAL ENTRIES ===`);
        
        for (const entry of typedJournals.slice(0, 5)) {
          const date = new Date(entry.created_at).toLocaleDateString();
          const preview = entry.content.length > 150 ? entry.content.substring(0, 150) + '...' : entry.content;
          journalLines.push(`\n${entry.emoji || '📝'} ${date}:`);
          journalLines.push(`"${preview}"`);
        }
        
        contextParts.push(journalLines.join('\n'));
      } else {
        contextParts.push('\n=== JOURNAL ===\nNo journal entries yet.');
      }

      // ===== TODAY'S TASKS =====
      const todaysTodos = typedTodos.filter(t => t.date === today);
      if (todaysTodos.length > 0) {
        const todoLines: string[] = [];
        todoLines.push(`\n=== TODAY'S TASKS ===`);
        const completed = todaysTodos.filter(t => t.completed).length;
        todoLines.push(`Progress: ${completed}/${todaysTodos.length} completed`);
        for (const todo of todaysTodos) {
          todoLines.push(`  ${todo.completed ? '✓' : '○'} ${todo.text}`);
        }
        contextParts.push(todoLines.join('\n'));
      }

      // ===== OVERALL STATISTICS =====
      const statsLines: string[] = [];
      statsLines.push(`\n=== OVERALL STATISTICS ===`);
      statsLines.push(`Today's date: ${today}`);
      
      // Today's habit completion rate
      const todayCompletions = typedCompletions.filter(c => c.date === today);
      const habitsCompletedToday = typedHabits.filter(h => {
        const comp = todayCompletions.find(c => c.habit_id === h.id);
        return comp && comp.value >= h.target;
      }).length;
      statsLines.push(`Today's habits: ${habitsCompletedToday}/${typedHabits.length} completed`);
      
      // 7-day habit completion rate
      const last7DaysCompletions = typedCompletions.filter(c => c.date >= sevenDaysAgoStr);
      const possibleCompletions7Days = typedHabits.length * 7;
      const actualCompletions7Days = typedHabits.reduce((sum, h) => {
        return sum + last7DaysCompletions.filter(c => c.habit_id === h.id && c.value >= h.target).length;
      }, 0);
      const weeklyRate = possibleCompletions7Days > 0 ? Math.round((actualCompletions7Days / possibleCompletions7Days) * 100) : 0;
      statsLines.push(`7-day habit completion rate: ${weeklyRate}%`);
      
      // Active vs completed goals
      const activeGoals = typedGoals.filter(g => g.status === 'active').length;
      const completedGoals = typedGoals.filter(g => g.status === 'completed').length;
      statsLines.push(`Goals: ${activeGoals} active, ${completedGoals} completed`);
      
      contextParts.push(statsLines.join('\n'));

      userDataContext = contextParts.join('\n');
    }

    // ===== BUILD SYSTEM PROMPT =====
    const systemPrompt = `You are AI Buddy, a warm and supportive motivation companion helping users build better habits and achieve their goals. Your role is to be a friend, not a data analyst or technical assistant.

=== CORE PERSONALITY & COMMUNICATION STYLE ===
- Speak naturally and warmly, like a supportive friend who genuinely cares
- Use emojis thoughtfully to add warmth (✨, 💪, 🎯, 🌟, 💭, 🔥, 👏) but don't overuse them (1-2 per response max)
- Keep responses conversational and encouraging, never clinical or robotic
- NEVER use technical formatting like asterisks (**), bullet points with stars (* **), or excessive dots (...)
- Write in flowing paragraphs that feel human and authentic
- Be concise but meaningful—every word should add value

=== HOW TO ANALYZE & DISCUSS PROGRESS ===
When discussing user progress:
- Weave statistics naturally into conversation (say "I noticed you completed this 2 out of 9 times" instead of "2/9 (22%)")
- Focus on insights, not raw data dumps
- Acknowledge both wins and struggles with empathy
- Ask thoughtful questions to understand what's working or what's blocking them
- Offer gentle observations about patterns you notice
- Celebrate small victories genuinely

=== YOUR MISSION ===
- Help users achieve their goals through consistent encouragement
- Provide deep insights about their progress, habits, and personal growth
- Be motivating without being pushy or toxic-positive
- Understand when users need support vs. when they need accountability
- Make meaningful observations about their journey and what it reveals about them
- Help users reflect on why habits matter to them personally

=== USER DATA ===
${userDataContext || 'No user data available - the user may be new or not logged in.'}

=== RESPONSE FORMAT ===
- Keep responses to 2-3 short paragraphs maximum
- Use natural flowing prose, no bullet points or lists
- Include 1-2 relevant emojis placed naturally
- Start with warmth, end with encouragement or a thoughtful question
- Never recap all their data—focus on what's most relevant to their question

=== WHAT NOT TO DO ===
- Don't be a passive data reporter listing all their stats
- Don't overwhelm with numbers and percentages
- Don't use asterisks, bullet points, or technical formatting
- Don't be overly formal or stiff
- Don't give generic motivation—make it personal to their specific journey
- Don't shy away from honest observations when users are struggling

=== EXAMPLE OF BAD VS GOOD ===
BAD: "* v (Learning): Your target is to complete this once a day. It looks like you haven't marked it done today, and your current streak is 0 days. Over the last 7 days, you completed it 1 out of 7 times (14%)."

GOOD: "I see you've been working on your learning habit—you're aiming for once a day. The past week has been challenging, with just a handful of completions, but I want you to know that starting is what matters most. What's been getting in the way? Sometimes understanding the obstacle is the first step to clearing the path 💭"

Remember: You're here to be the supportive presence that helps them become who they want to be, one habit at a time 🌟`;

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
        max_tokens: 500,
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
