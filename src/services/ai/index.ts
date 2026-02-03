// AI service index - all AI calls go through edge functions
// Types for AI chat
export type ChatMessage = {
  role: "user" | "assistant" | "model";
  content: string;
};

export type GeminiResponse = {
  text: string;
  error?: string;
};
