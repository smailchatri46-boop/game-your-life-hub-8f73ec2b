// Firestore service for mood logs collection
import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import type { MoodLog } from "./types";

const MOOD_COLLECTION = "mood_logs";

// Helper to get current timestamp as ISO string
const now = () => new Date().toISOString();

export async function getMoodLogs(
  userId: string,
  startDate: string,
  endDate: string
): Promise<MoodLog[]> {
  if (!isFirebaseConfigured() || !db) {
    console.warn("Firebase not configured - returning empty mood logs");
    return [];
  }

  const moodRef = collection(db, MOOD_COLLECTION);
  const q = query(
    moodRef,
    where("user_id", "==", userId),
    where("date", ">=", startDate),
    where("date", "<=", endDate),
    orderBy("date", "desc")
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as MoodLog[];
}

export async function getMoodLogForDate(
  userId: string,
  date: string
): Promise<MoodLog | null> {
  if (!isFirebaseConfigured() || !db) {
    return null;
  }

  const moodRef = collection(db, MOOD_COLLECTION);
  const q = query(
    moodRef,
    where("user_id", "==", userId),
    where("date", "==", date)
  );

  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() } as MoodLog;
}

export async function upsertMoodLog(
  userId: string,
  date: string,
  mood?: number,
  motivation?: number,
  reflection?: string
): Promise<MoodLog> {
  if (!isFirebaseConfigured() || !db) {
    throw new Error("Firebase not configured");
  }

  const existing = await getMoodLogForDate(userId, date);

  if (existing) {
    // Update existing
    const moodRef = doc(db, MOOD_COLLECTION, existing.id);
    const updates: Partial<MoodLog> = {};
    if (mood !== undefined) updates.mood = mood;
    if (motivation !== undefined) updates.motivation = motivation;
    if (reflection !== undefined) updates.reflection = reflection;

    await updateDoc(moodRef, updates);
    return { ...existing, ...updates };
  } else {
    // Create new
    const moodRef = collection(db, MOOD_COLLECTION);
    const timestamp = now();
    const newLog = {
      user_id: userId,
      date,
      mood: mood ?? null,
      motivation: motivation ?? null,
      reflection: reflection ?? null,
      created_at: timestamp,
    };
    const docRef = await addDoc(moodRef, newLog);
    return { id: docRef.id, ...newLog };
  }
}

export async function deleteMoodLog(logId: string, userId: string): Promise<void> {
  if (!isFirebaseConfigured() || !db) {
    throw new Error("Firebase not configured");
  }

  const moodRef = doc(db, MOOD_COLLECTION, logId);
  await deleteDoc(moodRef);
}

export async function getRecentMoodLogs(
  userId: string,
  limitCount: number = 30
): Promise<MoodLog[]> {
  if (!isFirebaseConfigured() || !db) {
    return [];
  }

  const moodRef = collection(db, MOOD_COLLECTION);
  const q = query(
    moodRef,
    where("user_id", "==", userId),
    orderBy("date", "desc"),
    limit(limitCount)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as MoodLog[];
}
