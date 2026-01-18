// Firestore service for daily todos collection
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
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import type { DailyTodo } from "./types";

const TODOS_COLLECTION = "daily_todos";

// Helper to get current timestamp as ISO string
const now = () => new Date().toISOString();

export async function getTodosForDate(
  userId: string,
  date: string
): Promise<DailyTodo[]> {
  if (!isFirebaseConfigured() || !db) {
    console.warn("Firebase not configured - returning empty todos");
    return [];
  }

  const todosRef = collection(db, TODOS_COLLECTION);
  const q = query(
    todosRef,
    where("user_id", "==", userId),
    where("date", "==", date),
    orderBy("created_at", "asc")
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as DailyTodo[];
}

export async function createTodo(
  userId: string,
  text: string,
  date: string
): Promise<DailyTodo> {
  if (!isFirebaseConfigured() || !db) {
    throw new Error("Firebase not configured");
  }

  const todosRef = collection(db, TODOS_COLLECTION);
  const timestamp = now();

  const newTodo = {
    user_id: userId,
    text,
    date,
    completed: false,
    created_at: timestamp,
  };

  const docRef = await addDoc(todosRef, newTodo);
  return { id: docRef.id, ...newTodo };
}

export async function updateTodo(
  todoId: string,
  userId: string,
  updates: Partial<Pick<DailyTodo, "text" | "completed">>
): Promise<void> {
  if (!isFirebaseConfigured() || !db) {
    throw new Error("Firebase not configured");
  }

  const todoRef = doc(db, TODOS_COLLECTION, todoId);
  await updateDoc(todoRef, updates);
}

export async function toggleTodo(
  todoId: string,
  userId: string,
  completed: boolean
): Promise<void> {
  if (!isFirebaseConfigured() || !db) {
    throw new Error("Firebase not configured");
  }

  const todoRef = doc(db, TODOS_COLLECTION, todoId);
  await updateDoc(todoRef, { completed });
}

export async function deleteTodo(todoId: string, userId: string): Promise<void> {
  if (!isFirebaseConfigured() || !db) {
    throw new Error("Firebase not configured");
  }

  const todoRef = doc(db, TODOS_COLLECTION, todoId);
  await deleteDoc(todoRef);
}
