
# Plan: Enhanced AI Buddy with Full User Data Context

## Problem Analysis

The AI Buddy currently receives a severely limited data summary (approximately 30-50 tokens). It's missing:
- Goals and goal progress
- Daily tasks (todos)
- Full habit names and their targets
- Mood trends and patterns
- Journal content beyond 60 characters
- Historical completion rates per habit

## Solution Overview

Enhance the `ai-coach` edge function to fetch comprehensive user data and build a rich context document that the AI can actually use to provide meaningful insights.

## Technical Implementation

### 1. Expand Data Fetching in Edge Function

Modify `supabase/functions/ai-coach/index.ts` to fetch:

| Data Type | Current | Proposed |
|-----------|---------|----------|
| Habits | Names only | Full details with targets, categories |
| Completions | Last 50 | Last 30 days with per-habit breakdown |
| Goals | None | All active goals with progress % |
| Daily Todos | None | Last 7 days of tasks |
| Mood Logs | Last 7 (number only) | Last 30 days with trends |
| Journal Entries | Last 3 (60 chars) | Last 10 entries (200 chars each) |

### 2. Build Structured Context Document

Create a formatted context block that reads like a "user profile document":

```text
=== USER PROGRESS REPORT ===

HABITS (5 total):
- Morning meditation (target: 1/day): 85% this week, 70% this month
- Exercise (target: 3/day): 40% this week, streak: 2 days
- Read 30 mins: 100% this week, streak: 7 days
...

GOALS (2 active):
- "Run a marathon" - 45% complete (45/100 workouts), ends Mar 15
- "Learn Spanish" - 20% complete, ends Jun 1
...

TODAY'S TASKS:
- [x] Call mom
- [ ] Finish report
- [ ] Grocery shopping
...

MOOD TREND (last 7 days):
Mon: 6/10, Tue: 7/10, Wed: 5/10 (declining trend)
Average: 6.2/10, Motivation avg: 7.1/10
...

RECENT REFLECTIONS:
- Jan 30: "Feeling overwhelmed with work deadlines..."
- Jan 28: "Great progress on my morning routine..."
...

PATTERNS DETECTED:
- Best habit day: Saturday (92% completion)
- Weakest habit: Exercise (needs attention)
- Mood dips on Wednesdays (workday stress?)
```

### 3. Upgrade System Prompt

Create a comprehensive prompt that instructs the AI how to use this data:

```text
You are the Neyler AI Buddy - a personal wellness coach with full visibility 
into the user's habits, goals, mood, and daily reflections.

YOUR DATA ACCESS:
You have the user's complete progress report below. Use it to:
- Identify patterns (good and concerning)
- Celebrate streaks and achievements
- Gently address declining trends
- Connect mood patterns to habit performance
- Reference specific habits/goals by name

RESPONSE STYLE:
- Warm, supportive, never judgmental
- Reference specific data ("I see your meditation streak is at 7 days!")
- Provide actionable, personalized insights
- Maximum 150 words, 1-2 emojis max
- No markdown formatting

USER DATA:
{context_document}
```

### 4. Token Budget Management

To stay within cost limits while providing rich context:

| Component | Max Tokens |
|-----------|------------|
| System prompt base | ~100 |
| Context document | ~400 |
| Conversation history | ~300 |
| AI response | ~150 |
| **Total per request** | ~950 |

Upgrade model from `gemini-2.5-flash-lite` to `gemini-2.5-flash` for better reasoning with this context (still cost-efficient).

### 5. Files to Modify

**Primary change:**
- `supabase/functions/ai-coach/index.ts` - Complete rewrite of data fetching and prompt construction

**No frontend changes needed** - the AI Buddy UI already works; only the backend intelligence needs enhancement.

## Implementation Steps

1. **Expand database queries** - Fetch habits with details, goals, todos, mood logs (30 days), journals (10 entries)

2. **Calculate analytics** - Per-habit completion rates, streaks, trends, weekly/monthly averages

3. **Build context document** - Format all data into a readable text block (~400 tokens)

4. **Update system prompt** - Instruct AI on how to use the data effectively

5. **Upgrade model** - Switch to `gemini-2.5-flash` for better reasoning

6. **Deploy and test** - Verify the AI can now reference specific habits, goals, and patterns

## Expected Outcome

After implementation, conversations will look like:

**User**: "How am I doing with my habits?"

**AI**: "You're doing great! Your meditation streak is at 7 days - that's your longest yet! Exercise has been tricky this week (2/7 days), but I noticed you crushed it on weekends. Your mood averaged 7.2/10, which is up from last week. Want to focus on making exercise easier on weekdays?"

Instead of the current generic responses that don't reference actual user data.
