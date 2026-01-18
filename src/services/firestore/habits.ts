// Firestore service for habits collection
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import type { Habit, HabitCompletion } from "./types";

const HABITS_COLLECTION = "habits";
const COMPLETIONS_COLLECTION = "habit_completions";

// Helper to generate UUID
const generateId = () => crypto.randomUUID();

// Helper to get current timestamp as ISO string
const now = () => new Date().toISOString();

// ============ HABITS ============

export async function getHabits(userId: string): Promise<Habit[]> {
  if (!isFirebaseConfigured() || !db) {
    console.warn("Firebase not configured - returning empty habits");
    return [];
  }

  const habitsRef = collection(db, HABITS_COLLECTION);
  const q = query(
    habitsRef,
    where("user_id", "==", userId),
    orderBy("created_at", "asc")
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Habit[];
}

export async function createHabit(
  userId: string,
  habit: Omit<Habit, "id" | "user_id" | "created_at" | "updated_at">
): Promise<Habit> {
  if (!isFirebaseConfigured() || !db) {
    throw new Error("Firebase not configured");
  }

  const habitsRef = collection(db, HABITS_COLLECTION);
  const timestamp = now();

  const newHabit = {
    ...habit,
    user_id: userId,
    created_at: timestamp,
    updated_at: timestamp,
  };

  const docRef = await addDoc(habitsRef, newHabit);
  return { id: docRef.id, ...newHabit };
}

export async function updateHabit(
  habitId: string,
  userId: string,
  updates: Partial<Omit<Habit, "id" | "user_id" | "created_at">>
): Promise<void> {
  if (!isFirebaseConfigured() || !db) {
    throw new Error("Firebase not configured");
  }

  const habitRef = doc(db, HABITS_COLLECTION, habitId);
  await updateDoc(habitRef, {
    ...updates,
    updated_at: now(),
  });
}

export async function deleteHabit(habitId: string, userId: string): Promise<void> {
  if (!isFirebaseConfigured() || !db) {
    throw new Error("Firebase not configured");
  }

  // Delete the habit
  const habitRef = doc(db, HABITS_COLLECTION, habitId);
  await deleteDoc(habitRef);

  // Also delete all completions for this habit
  const completionsRef = collection(db, COMPLETIONS_COLLECTION);
  const q = query(
    completionsRef,
    where("habit_id", "==", habitId),
    where("user_id", "==", userId)
  );
  const snapshot = await getDocs(q);
  
  const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref));
  await Promise.all(deletePromises);
}

// ============ HABIT COMPLETIONS ============

export async function getCompletions(
  userId: string,
  startDate: string,
  endDate: string
): Promise<HabitCompletion[]> {
  if (!isFirebaseConfigured() || !db) {
    console.warn("Firebase not configured - returning empty completions");
    return [];
  }

  const completionsRef = collection(db, COMPLETIONS_COLLECTION);
  const q = query(
    completionsRef,
    where("user_id", "==", userId),
    where("date", ">=", startDate),
    where("date", "<=", endDate)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as HabitCompletion[];
}

export async function getCompletionForDate(
  habitId: string,
  userId: string,
  date: string
): Promise<HabitCompletion | null> {
  if (!isFirebaseConfigured() || !db) {
    return null;
  }

  const completionsRef = collection(db, COMPLETIONS_COLLECTION);
  const q = query(
    completionsRef,
    where("habit_id", "==", habitId),
    where("user_id", "==", userId),
    where("date", "==", date)
  );

  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() } as HabitCompletion;
}

export async function upsertCompletion(
  habitId: string,
  userId: string,
  date: string,
  value: number
): Promise<HabitCompletion | null> {
  if (!isFirebaseConfigured() || !db) {
    throw new Error("Firebase not configured");
  }

  // Check if completion exists
  const existing = await getCompletionForDate(habitId, userId, date);

  if (value === 0) {
    // Delete if exists
    if (existing) {
      const completionRef = doc(db, COMPLETIONS_COLLECTION, existing.id);
      await deleteDoc(completionRef);
    }
    return null;
  }

  if (existing) {
    // Update existing
    const completionRef = doc(db, COMPLETIONS_COLLECTION, existing.id);
    await updateDoc(completionRef, { value });
    return { ...existing, value };
  } else {
    // Create new
    const completionsRef = collection(db, COMPLETIONS_COLLECTION);
    const timestamp = now();
    const newCompletion = {
      habit_id: habitId,
      user_id: userId,
      date,
      value,
      created_at: timestamp,
    };
    const docRef = await addDoc(completionsRef, newCompletion);
    return { id: docRef.id, ...newCompletion };
  }
}

export async function deleteCompletion(
  habitId: string,
  userId: string,
  date: string
): Promise<void> {
  if (!isFirebaseConfigured() || !db) {
    throw new Error("Firebase not configured");
  }

  const existing = await getCompletionForDate(habitId, userId, date);
  if (existing) {
    const completionRef = doc(db, COMPLETIONS_COLLECTION, existing.id);
    await deleteDoc(completionRef);
  }
}
