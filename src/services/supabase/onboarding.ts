import { supabase } from "@/integrations/supabase/client";
import type { OnboardingData } from "@/hooks/use-onboarding";

export interface OnboardingRecord {
  id: string;
  user_id: string;
  survey_answers: Record<string, string | null>;
  focus_areas: string[];
  struggles: string[];
  tracking_struggles: string[];
  unique_about: string | null;
  current_apps: string | null;
  past_experience: Record<string, string[]>;
  ai_preferences: Record<string, unknown>;
  commitment_name: string | null;
  checked_affirmations: string[];
  completed: boolean;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Get onboarding data for the current user
 */
export async function getOnboardingData(userId: string): Promise<OnboardingRecord | null> {
  const { data, error } = await supabase
    .from("onboarding_data")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("Error fetching onboarding data:", error);
    return null;
  }

  return data as OnboardingRecord | null;
}

/**
 * Check if user has completed onboarding
 */
export async function hasCompletedOnboarding(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("onboarding_data")
    .select("completed")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("Error checking onboarding status:", error);
    return false;
  }

  return data?.completed ?? false;
}

/**
 * Save or update onboarding data for the current user
 */
export async function saveOnboardingData(
  userId: string,
  data: OnboardingData,
  completed: boolean = false
): Promise<{ success: boolean; error: Error | null }> {
  const record = {
    user_id: userId,
    survey_answers: data.surveyAnswers,
    focus_areas: data.focusAreas,
    struggles: data.struggles,
    tracking_struggles: data.trackingStruggles,
    unique_about: data.uniqueAbout || null,
    current_apps: data.currentApps || null,
    past_experience: data.pastExperience,
    ai_preferences: data.aiPreferences,
    commitment_name: data.commitmentName || null,
    checked_affirmations: data.checkedAffirmations,
    completed,
    completed_at: completed ? new Date().toISOString() : null,
  };

  const { error } = await supabase
    .from("onboarding_data")
    .upsert(record, { onConflict: "user_id" });

  if (error) {
    console.error("Error saving onboarding data:", error);
    return { success: false, error: error as unknown as Error };
  }

  return { success: true, error: null };
}

/**
 * Mark onboarding as complete
 */
export async function completeOnboardingInDb(userId: string): Promise<boolean> {
  const { error } = await supabase
    .from("onboarding_data")
    .update({ 
      completed: true, 
      completed_at: new Date().toISOString() 
    })
    .eq("user_id", userId);

  if (error) {
    console.error("Error completing onboarding:", error);
    return false;
  }

  return true;
}
