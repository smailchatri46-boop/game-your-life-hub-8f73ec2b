// Supabase service for user profiles
import { supabase } from "@/integrations/supabase/client";
import type { Profile } from "@/services/supabase/types";

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.error("Error fetching profile:", error);
    return null;
  }

  return data;
}

export async function createProfile(
  userId: string,
  email: string | null,
  fullName: string | null,
  avatarUrl: string | null
): Promise<Profile> {
  const now = new Date().toISOString();

  const newProfile = {
    id: userId,
    email,
    full_name: fullName,
    avatar_url: avatarUrl,
    created_at: now,
    updated_at: now,
  };

  const { data, error } = await supabase
    .from("profiles")
    .insert(newProfile)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create profile: ${error.message}`);
  }

  return data;
}

export async function updateProfile(
  userId: string,
  updates: Partial<Pick<Profile, "full_name" | "avatar_url" | "email">>
): Promise<void> {
  const { error } = await supabase
    .from("profiles")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);

  if (error) {
    throw new Error(`Failed to update profile: ${error.message}`);
  }
}

export async function ensureProfile(
  userId: string,
  email: string | null,
  fullName: string | null,
  avatarUrl: string | null
): Promise<Profile> {
  const existing = await getProfile(userId);
  if (existing) return existing;
  return createProfile(userId, email, fullName, avatarUrl);
}
