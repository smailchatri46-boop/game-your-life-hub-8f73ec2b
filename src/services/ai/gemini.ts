// Gemini AI service for chat functionality
// This service calls Gemini API directly for AI coaching

import {
  getHabits,
  getCompletions,
  getRecentMoodLogs,
  getJournalEntries,
  getAIUsage,
  updateAIUsage,
  getTodayMessageCount,
} from "@/services/supabase";

// Usage limits
const MONTHLY_MESSAGE_LIMIT = 3000;
const DAILY_MESSAGE_LIMIT = 180;

// Gemini API endpoint
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent";

export interface ChatMessage {
  role: "user" | "assistant" | "model";
  content: string;
}

export interface GeminiResponse {
  text: string;
  error?: string;
}

// Check if Gemini is configured
export const isGeminiConfigured = (): boolean => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  return !!apiKey;
};

// Check usage limits
export async function checkUsageLimits(userId: string): Promise<{
  canSend: boolean;
  error?: string;
  remainingDaily: number;
  remainingMonthly: number;
}> {
  const now = new Date();
  const monthYear = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const usage = await getAIUsage(userId, monthYear);
  const currentMonthCount = usage?.message_count || 0;
  const todayCount = await getTodayMessageCount(userId);

  const remainingMonthly = MONTHLY_MESSAGE_LIMIT - currentMonthCount;
  const remainingDaily = DAILY_MESSAGE_LIMIT - todayCount;

  if (currentMonthCount >= MONTHLY_MESSAGE_LIMIT) {
    return {
      canSend: false,
      error: "You've reached your AI coaching limit for this month 😊 Your usage resets at the start of next month.",
      remainingDaily: 0,
      remainingMonthly: 0,
    };
  }

  if (todayCount >= DAILY_MESSAGE_LIMIT) {
    return {
      canSend: false,
      error: "You've reached your AI coaching limit for today 😊 Come back tomorrow!",
      remainingDaily: 0,
      remainingMonthly,
    };
  }

  return { canSend: true, remainingDaily, remainingMonthly };
}

// Build context about user's data for the AI
async function buildUserContext(userId: string): Promise<string> {
  const now = new Date();
  const today = now.toISOString().split("T")[0];
  const startOfMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
  const endOfMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()).padStart(2, "0")}`;

  try {
    const [habits, completions, moodLogs, journals] = await Promise.all([
      getHabits(userId),
      getCompletions(userId, startOfMonth, endOfMonth),
      getRecentMoodLogs(userId, 30),
      getJournalEntries(userId, 20),
    ]);

    const habitsSummary = habits.length > 0
      ? habits.map(h => `- ${h.name} (${h.category}): target ${h.target}x/day, importance ${h.importance}%`).join("\n")
      : "No habits tracked yet";

    const recentCompletions = completions.slice(0, 30).map(c => {
      const habit = habits.find(h => h.id === c.habit_id);
      return `${c.date}: ${habit?.name || "Unknown"} - ${c.value}x`;
    }).join("\n") || "No completions yet";

    const journalSummary = journals.map(j =>
      `[${new Date(j.created_at).toLocaleDateString()}] ${j.emoji || ""} ${j.content.substring(0, 200)}...`
    ).join("\n\n") || "No journal entries yet";

    const moodSummary = moodLogs.map(m =>
      `${m.date}: Mood ${m.mood}/10, Motivation ${m.motivation}/10${m.reflection ? ` - "${m.reflection}"` : ""}`
    ).join("\n") || "No mood data yet";

    const todayCompletions = completions.filter(c => c.date === today);
    const completedToday = todayCompletions.filter(c => {
      const habit = habits.find(h => h.id === c.habit_id);
      return habit && c.value >= habit.target;
    }).length;

    return `
### Habits Being Tracked:
${habitsSummary}

### Recent Habit Completions (last 30 days):
${recentCompletions}

### Recent Journal Entries:
${journalSummary}

### Mood & Motivation Logs:
${moodSummary}

### Today's Progress:
- Completed ${completedToday} out of ${habits.length} habits today
`;
  } catch (error) {
    console.error("Error building user context:", error);
    return "Unable to load user data.";
  }
}

// Build the system prompt
function buildSystemPrompt(userContext: string, remainingDaily: number, remainingMonthly: number): string {
  return `# Role & Identity

You are an AI wellness coach built into a habit-tracking app.
Your job is to help users with: habits, routine building, motivation, consistency, overwhelm & burnout prevention, mood & reflection.
You are supportive but realistic, friendly and simple.
You are NOT a therapist, doctor, or emergency support.

## User's Current Data:
${userContext}

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

# Response Length Rule

ALWAYS keep replies SHORT. Avoid essays. Target: 1-2 short paragraphs maximum.
${remainingDaily <= 3 ? "IMPORTANT: User is running low on daily messages - keep this response extra brief!" : ""}

Remember: You have access to their REAL data, so be specific! Reference their actual habits, journal entries, and progress.`;
}

// Send message to Gemini and get streaming response
export async function sendMessageToGemini(
  userId: string,
  messages: ChatMessage[],
  onChunk: (text: string) => void,
  onComplete: () => void,
  onError: (error: string) => void
): Promise<void> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    onError("Gemini API key not configured. Please add VITE_GEMINI_API_KEY to your environment.");
    return;
  }

  // Check usage limits
  const { canSend, error, remainingDaily, remainingMonthly } = await checkUsageLimits(userId);
  if (!canSend) {
    onError(error || "Usage limit reached");
    return;
  }

  // Build user context
  const userContext = await buildUserContext(userId);
  const systemPrompt = buildSystemPrompt(userContext, remainingDaily, remainingMonthly);

  // Convert messages to Gemini format
  const geminiMessages = messages.map(m => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  // Add system instruction as first user message if not present
  const requestBody = {
    system_instruction: {
      parts: [{ text: systemPrompt }],
    },
    contents: geminiMessages,
    generationConfig: {
      maxOutputTokens: 300,
      temperature: 0.7,
    },
  };

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}&alt=sse`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", response.status, errorText);
      onError(`AI service error: ${response.status}`);
      return;
    }

    // Update usage
    const now = new Date();
    const monthYear = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const usage = await getAIUsage(userId, monthYear);
    await updateAIUsage(userId, monthYear, (usage?.message_count || 0) + 1);

    // Parse streaming response
    const reader = response.body?.getReader();
    if (!reader) {
      onError("Failed to read response stream");
      return;
    }

    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") continue;

          try {
            const data = JSON.parse(jsonStr);
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) {
              onChunk(text);
            }
          } catch {
            // Ignore parsing errors for incomplete JSON
          }
        }
      }
    }

    onComplete();
  } catch (error) {
    console.error("Gemini API call failed:", error);
    onError(error instanceof Error ? error.message : "Unknown error");
  }
}

// Non-streaming version for simpler use cases
export async function getGeminiResponse(
  userId: string,
  messages: ChatMessage[]
): Promise<GeminiResponse> {
  let fullText = "";
  let errorMsg = "";

  await new Promise<void>((resolve) => {
    sendMessageToGemini(
      userId,
      messages,
      (chunk) => { fullText += chunk; },
      () => { resolve(); },
      (error) => { errorMsg = error; resolve(); }
    );
  });

  if (errorMsg) {
    return { text: "", error: errorMsg };
  }

  return { text: fullText };
}
