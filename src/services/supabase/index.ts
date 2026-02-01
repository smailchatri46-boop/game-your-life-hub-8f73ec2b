// Supabase services - centralized exports
// Types
export type {
  Profile,
  Habit,
  HabitCompletion,
  Goal,
  GoalHabit,
  JournalEntry,
  MoodLog,
  DailyTodo,
  ChatConversation,
  ChatMessage,
  AIUsage,
} from "@/services/firestore/types";

// Habits
export {
  getHabits,
  createHabit,
  updateHabit,
  deleteHabit,
  getCompletions,
  getCompletionForDate,
  upsertCompletion,
  deleteCompletion,
} from "./habits";

// Goals
export {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
  incrementGoalProgress,
  getGoalHabits,
  linkHabitToGoal,
  unlinkHabitFromGoal,
} from "./goals";

// Journal
export {
  getJournalEntries,
  createJournalEntry,
  updateJournalEntry,
  deleteJournalEntry,
  getJournalEntryCount,
} from "./journal";

// Mood
export {
  getMoodLogs,
  getMoodLogForDate,
  upsertMoodLog,
  deleteMoodLog,
  getRecentMoodLogs,
} from "./mood";

// Todos
export {
  getTodosForDate,
  createTodo,
  updateTodo,
  toggleTodo,
  deleteTodo,
} from "./todos";

// Chat
export {
  getConversations,
  createConversation,
  updateConversation,
  deleteConversation,
  getMessages,
  createMessage,
  getAIUsage,
  updateAIUsage,
  getTodayMessageCount,
} from "./chat";

// Profiles
export {
  getProfile,
  createProfile,
  updateProfile,
  ensureProfile,
} from "./profiles";

// Activity Logs
export {
  getRecentActivities,
  logActivity,
  clearOldActivities,
} from "./activity";
export type { ActivityType, ActivityLog } from "./activity";
