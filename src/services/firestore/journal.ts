// Firestore service for journal entries collection
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
import type { JournalEntry } from "./types";

const JOURNAL_COLLECTION = "journal_entries";

// Helper to get current timestamp as ISO string
const now = () => new Date().toISOString();

export async function getJournalEntries(
  userId: string,
  limitCount: number = 50
): Promise<JournalEntry[]> {
  if (!isFirebaseConfigured() || !db) {
    console.warn("Firebase not configured - returning empty journal entries");
    return [];
  }

  const journalRef = collection(db, JOURNAL_COLLECTION);
  const q = query(
    journalRef,
    where("user_id", "==", userId),
    orderBy("created_at", "desc"),
    limit(limitCount)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as JournalEntry[];
}

export async function createJournalEntry(
  userId: string,
  entry: Omit<JournalEntry, "id" | "user_id" | "created_at" | "updated_at">
): Promise<JournalEntry> {
  if (!isFirebaseConfigured() || !db) {
    throw new Error("Firebase not configured");
  }

  const journalRef = collection(db, JOURNAL_COLLECTION);
  const timestamp = now();

  const newEntry = {
    ...entry,
    user_id: userId,
    created_at: timestamp,
    updated_at: timestamp,
  };

  const docRef = await addDoc(journalRef, newEntry);
  return { id: docRef.id, ...newEntry };
}

export async function updateJournalEntry(
  entryId: string,
  userId: string,
  updates: Partial<Omit<JournalEntry, "id" | "user_id" | "created_at">>
): Promise<void> {
  if (!isFirebaseConfigured() || !db) {
    throw new Error("Firebase not configured");
  }

  const entryRef = doc(db, JOURNAL_COLLECTION, entryId);
  await updateDoc(entryRef, {
    ...updates,
    updated_at: now(),
  });
}

export async function deleteJournalEntry(entryId: string, userId: string): Promise<void> {
  if (!isFirebaseConfigured() || !db) {
    throw new Error("Firebase not configured");
  }

  const entryRef = doc(db, JOURNAL_COLLECTION, entryId);
  await deleteDoc(entryRef);
}

export async function getJournalEntryCount(userId: string): Promise<number> {
  if (!isFirebaseConfigured() || !db) {
    return 0;
  }

  const journalRef = collection(db, JOURNAL_COLLECTION);
  const q = query(journalRef, where("user_id", "==", userId));
  const snapshot = await getDocs(q);
  return snapshot.size;
}
