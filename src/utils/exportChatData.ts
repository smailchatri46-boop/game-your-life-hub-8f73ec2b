import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

export async function exportUserData(userId: string): Promise<string> {
  const lines: string[] = [];
  
  lines.push("=".repeat(60));
  lines.push("YOUR PERSONAL WELLNESS DATA EXPORT");
  lines.push(`Exported on: ${format(new Date(), "MMMM d, yyyy 'at' h:mm a")}`);
  lines.push("=".repeat(60));
  lines.push("");
  lines.push("You can upload this file to ChatGPT, Claude, or Gemini to continue");
  lines.push("your coaching conversation with full context about your journey.");
  lines.push("");
  
  // Fetch habits
  const { data: habits } = await supabase
    .from("habits")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  
  if (habits && habits.length > 0) {
    lines.push("-".repeat(60));
    lines.push("HABITS");
    lines.push("-".repeat(60));
    habits.forEach((habit) => {
      lines.push(`• ${habit.name} (${habit.category})`);
      lines.push(`  Target: ${habit.target} | Icon: ${habit.icon}`);
      lines.push(`  Created: ${format(new Date(habit.created_at), "MMM d, yyyy")}`);
      lines.push("");
    });
  }
  
  // Fetch habit completions (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const { data: completions } = await supabase
    .from("habit_completions")
    .select("*, habits(name)")
    .eq("user_id", userId)
    .gte("date", thirtyDaysAgo.toISOString().split("T")[0])
    .order("date", { ascending: false });
  
  if (completions && completions.length > 0) {
    lines.push("-".repeat(60));
    lines.push("HABIT COMPLETIONS (Last 30 Days)");
    lines.push("-".repeat(60));
    const grouped: Record<string, string[]> = {};
    completions.forEach((c) => {
      const date = c.date;
      if (!grouped[date]) grouped[date] = [];
      const habitName = (c.habits as any)?.name || "Unknown";
      grouped[date].push(`${habitName} (${c.value}x)`);
    });
    Object.entries(grouped).forEach(([date, habits]) => {
      lines.push(`${format(new Date(date), "MMM d, yyyy")}: ${habits.join(", ")}`);
    });
    lines.push("");
  }
  
  // Fetch journal entries
  const { data: journals } = await supabase
    .from("journal_entries")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);
  
  if (journals && journals.length > 0) {
    lines.push("-".repeat(60));
    lines.push("JOURNAL ENTRIES");
    lines.push("-".repeat(60));
    journals.forEach((entry) => {
      lines.push(`[${format(new Date(entry.created_at), "MMM d, yyyy")}] ${entry.emoji || ""}`);
      lines.push(entry.content);
      lines.push("");
    });
  }
  
  // Fetch mood logs
  const { data: moods } = await supabase
    .from("mood_logs")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false })
    .limit(30);
  
  if (moods && moods.length > 0) {
    lines.push("-".repeat(60));
    lines.push("MOOD & MOTIVATION LOGS");
    lines.push("-".repeat(60));
    moods.forEach((log) => {
      const moodText = log.mood !== null ? `Mood: ${log.mood}/10` : "";
      const motivationText = log.motivation !== null ? `Motivation: ${log.motivation}/10` : "";
      lines.push(`${format(new Date(log.date), "MMM d, yyyy")}: ${[moodText, motivationText].filter(Boolean).join(" | ")}`);
      if (log.reflection) {
        lines.push(`  Reflection: ${log.reflection}`);
      }
    });
    lines.push("");
  }
  
  // Fetch chat messages
  const { data: messages } = await supabase
    .from("chat_messages")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: true })
    .limit(100);
  
  if (messages && messages.length > 0) {
    lines.push("-".repeat(60));
    lines.push("AI COACH CONVERSATION HISTORY");
    lines.push("-".repeat(60));
    messages.forEach((msg) => {
      const role = msg.role === "user" ? "You" : "AI Coach";
      lines.push(`[${format(new Date(msg.created_at), "MMM d h:mm a")}] ${role}:`);
      lines.push(msg.content);
      lines.push("");
    });
  }
  
  lines.push("=".repeat(60));
  lines.push("END OF EXPORT");
  lines.push("=".repeat(60));
  
  return lines.join("\n");
}

export function downloadTextFile(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
