// Firestore service for user profiles collection
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import type { Profile } from "./types";

const PROFILES_COLLECTION = "profiles";

// Helper to get current timestamp as ISO string
const now = () => new Date().toISOString();

export async function getProfile(userId: string): Promise<Profile | null> {
  if (!isFirebaseConfigured() || !db) {
    console.warn("Firebase not configured - returning null profile");
    return null;
  }

  const profileRef = doc(db, PROFILES_COLLECTION, userId);
  const snapshot = await getDoc(profileRef);

  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() } as Profile;
}

export async function createProfile(
  userId: string,
  email: string | null,
  fullName: string | null,
  avatarUrl: string | null
): Promise<Profile> {
  if (!isFirebaseConfigured() || !db) {
    throw new Error("Firebase not configured");
  }

  const profileRef = doc(db, PROFILES_COLLECTION, userId);
  const timestamp = now();

  const newProfile = {
    id: userId,
    email,
    full_name: fullName,
    avatar_url: avatarUrl,
    created_at: timestamp,
    updated_at: timestamp,
  };

  await setDoc(profileRef, newProfile);
  return newProfile;
}

export async function updateProfile(
  userId: string,
  updates: Partial<Pick<Profile, "full_name" | "avatar_url" | "email">>
): Promise<void> {
  if (!isFirebaseConfigured() || !db) {
    throw new Error("Firebase not configured");
  }

  const profileRef = doc(db, PROFILES_COLLECTION, userId);
  await updateDoc(profileRef, {
    ...updates,
    updated_at: now(),
  });
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
