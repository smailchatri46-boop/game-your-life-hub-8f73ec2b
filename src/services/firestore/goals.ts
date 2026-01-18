// Firestore service for goals collection
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
  writeBatch,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import type { Goal, GoalHabit } from "./types";

const GOALS_COLLECTION = "goals";
const GOAL_HABITS_COLLECTION = "goal_habits";

// Helper to get current timestamp as ISO string
const now = () => new Date().toISOString();

// ============ GOALS ============

export async function getGoals(userId: string): Promise<Goal[]> {
  if (!isFirebaseConfigured() || !db) {
    console.warn("Firebase not configured - returning empty goals");
    return [];
  }

  const goalsRef = collection(db, GOALS_COLLECTION);
  const q = query(
    goalsRef,
    where("user_id", "==", userId),
    orderBy("created_at", "desc")
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Goal[];
}

export async function createGoal(
  userId: string,
  goal: Omit<Goal, "id" | "user_id" | "created_at" | "updated_at" | "completed_count" | "status">,
  habitIds: string[] = []
): Promise<Goal> {
  if (!isFirebaseConfigured() || !db) {
    throw new Error("Firebase not configured");
  }

  const goalsRef = collection(db, GOALS_COLLECTION);
  const timestamp = now();

  const newGoal = {
    ...goal,
    user_id: userId,
    completed_count: 0,
    status: "active" as const,
    created_at: timestamp,
    updated_at: timestamp,
  };

  const docRef = await addDoc(goalsRef, newGoal);
  const createdGoal = { id: docRef.id, ...newGoal };

  // Link habits if provided
  if (habitIds.length > 0) {
    const goalHabitsRef = collection(db, GOAL_HABITS_COLLECTION);
    const linkPromises = habitIds.map((habitId) =>
      addDoc(goalHabitsRef, {
        goal_id: docRef.id,
        habit_id: habitId,
        user_id: userId,
        created_at: timestamp,
      })
    );
    await Promise.all(linkPromises);
  }

  return createdGoal;
}

export async function updateGoal(
  goalId: string,
  userId: string,
  updates: Partial<Omit<Goal, "id" | "user_id" | "created_at">>
): Promise<void> {
  if (!isFirebaseConfigured() || !db) {
    throw new Error("Firebase not configured");
  }

  const goalRef = doc(db, GOALS_COLLECTION, goalId);
  await updateDoc(goalRef, {
    ...updates,
    updated_at: now(),
  });
}

export async function deleteGoal(goalId: string, userId: string): Promise<void> {
  if (!isFirebaseConfigured() || !db) {
    throw new Error("Firebase not configured");
  }

  // Delete goal habits first
  const goalHabitsRef = collection(db, GOAL_HABITS_COLLECTION);
  const q = query(
    goalHabitsRef,
    where("goal_id", "==", goalId),
    where("user_id", "==", userId)
  );
  const snapshot = await getDocs(q);
  
  const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref));
  await Promise.all(deletePromises);

  // Delete the goal
  const goalRef = doc(db, GOALS_COLLECTION, goalId);
  await deleteDoc(goalRef);
}

export async function incrementGoalProgress(
  goalId: string,
  userId: string,
  currentCount: number,
  targetCount: number,
  amount: number = 1
): Promise<void> {
  if (!isFirebaseConfigured() || !db) {
    throw new Error("Firebase not configured");
  }

  const newCount = Math.min(currentCount + amount, targetCount);
  const newStatus = newCount >= targetCount ? "completed" : "active";

  const goalRef = doc(db, GOALS_COLLECTION, goalId);
  await updateDoc(goalRef, {
    completed_count: newCount,
    status: newStatus,
    updated_at: now(),
  });
}

// ============ GOAL HABITS ============

export async function getGoalHabits(userId: string): Promise<GoalHabit[]> {
  if (!isFirebaseConfigured() || !db) {
    console.warn("Firebase not configured - returning empty goal habits");
    return [];
  }

  const goalHabitsRef = collection(db, GOAL_HABITS_COLLECTION);
  const q = query(goalHabitsRef, where("user_id", "==", userId));

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as GoalHabit[];
}

export async function linkHabitToGoal(
  goalId: string,
  habitId: string,
  userId: string
): Promise<GoalHabit> {
  if (!isFirebaseConfigured() || !db) {
    throw new Error("Firebase not configured");
  }

  const goalHabitsRef = collection(db, GOAL_HABITS_COLLECTION);
  const timestamp = now();

  const newLink = {
    goal_id: goalId,
    habit_id: habitId,
    user_id: userId,
    created_at: timestamp,
  };

  const docRef = await addDoc(goalHabitsRef, newLink);
  return { id: docRef.id, ...newLink };
}

export async function unlinkHabitFromGoal(
  goalId: string,
  habitId: string,
  userId: string
): Promise<void> {
  if (!isFirebaseConfigured() || !db) {
    throw new Error("Firebase not configured");
  }

  const goalHabitsRef = collection(db, GOAL_HABITS_COLLECTION);
  const q = query(
    goalHabitsRef,
    where("goal_id", "==", goalId),
    where("habit_id", "==", habitId),
    where("user_id", "==", userId)
  );

  const snapshot = await getDocs(q);
  const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref));
  await Promise.all(deletePromises);
}
