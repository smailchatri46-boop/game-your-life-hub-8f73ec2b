// Firestore service for chat conversations and messages
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
import type { ChatConversation, ChatMessage, AIUsage } from "./types";

const CONVERSATIONS_COLLECTION = "chat_conversations";
const MESSAGES_COLLECTION = "chat_messages";
const USAGE_COLLECTION = "ai_usage";

// Helper to get current timestamp as ISO string
const now = () => new Date().toISOString();

// ============ CONVERSATIONS ============

export async function getConversations(userId: string): Promise<ChatConversation[]> {
  if (!isFirebaseConfigured() || !db) {
    console.warn("Firebase not configured - returning empty conversations");
    return [];
  }

  const convsRef = collection(db, CONVERSATIONS_COLLECTION);
  const q = query(
    convsRef,
    where("user_id", "==", userId),
    orderBy("updated_at", "desc")
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as ChatConversation[];
}

export async function createConversation(
  userId: string,
  title: string = "New conversation"
): Promise<ChatConversation> {
  if (!isFirebaseConfigured() || !db) {
    throw new Error("Firebase not configured");
  }

  const convsRef = collection(db, CONVERSATIONS_COLLECTION);
  const timestamp = now();

  const newConv = {
    user_id: userId,
    title,
    created_at: timestamp,
    updated_at: timestamp,
  };

  const docRef = await addDoc(convsRef, newConv);
  return { id: docRef.id, ...newConv };
}

export async function updateConversation(
  conversationId: string,
  userId: string,
  updates: Partial<Pick<ChatConversation, "title">>
): Promise<void> {
  if (!isFirebaseConfigured() || !db) {
    throw new Error("Firebase not configured");
  }

  const convRef = doc(db, CONVERSATIONS_COLLECTION, conversationId);
  await updateDoc(convRef, {
    ...updates,
    updated_at: now(),
  });
}

export async function deleteConversation(
  conversationId: string,
  userId: string
): Promise<void> {
  if (!isFirebaseConfigured() || !db) {
    throw new Error("Firebase not configured");
  }

  // Delete all messages in the conversation
  const messagesRef = collection(db, MESSAGES_COLLECTION);
  const q = query(
    messagesRef,
    where("conversation_id", "==", conversationId),
    where("user_id", "==", userId)
  );
  const snapshot = await getDocs(q);
  const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref));
  await Promise.all(deletePromises);

  // Delete the conversation
  const convRef = doc(db, CONVERSATIONS_COLLECTION, conversationId);
  await deleteDoc(convRef);
}

// ============ MESSAGES ============

export async function getMessages(
  conversationId: string,
  userId: string
): Promise<ChatMessage[]> {
  if (!isFirebaseConfigured() || !db) {
    console.warn("Firebase not configured - returning empty messages");
    return [];
  }

  const messagesRef = collection(db, MESSAGES_COLLECTION);
  const q = query(
    messagesRef,
    where("conversation_id", "==", conversationId),
    where("user_id", "==", userId),
    orderBy("created_at", "asc")
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as ChatMessage[];
}

export async function createMessage(
  userId: string,
  conversationId: string,
  content: string,
  role: "user" | "assistant"
): Promise<ChatMessage> {
  if (!isFirebaseConfigured() || !db) {
    throw new Error("Firebase not configured");
  }

  const messagesRef = collection(db, MESSAGES_COLLECTION);
  const timestamp = now();

  const newMessage = {
    user_id: userId,
    conversation_id: conversationId,
    content,
    role,
    created_at: timestamp,
  };

  const docRef = await addDoc(messagesRef, newMessage);

  // Update conversation's updated_at
  const convRef = doc(db, CONVERSATIONS_COLLECTION, conversationId);
  await updateDoc(convRef, { updated_at: timestamp });

  return { id: docRef.id, ...newMessage };
}

// ============ AI USAGE ============

export async function getAIUsage(
  userId: string,
  monthYear: string
): Promise<AIUsage | null> {
  if (!isFirebaseConfigured() || !db) {
    return null;
  }

  const usageRef = collection(db, USAGE_COLLECTION);
  const q = query(
    usageRef,
    where("user_id", "==", userId),
    where("month_year", "==", monthYear)
  );

  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() } as AIUsage;
}

export async function updateAIUsage(
  userId: string,
  monthYear: string,
  messageCount: number
): Promise<void> {
  if (!isFirebaseConfigured() || !db) {
    throw new Error("Firebase not configured");
  }

  const today = new Date().toISOString().split("T")[0];
  const existing = await getAIUsage(userId, monthYear);

  if (existing) {
    const usageRef = doc(db, USAGE_COLLECTION, existing.id);
    await updateDoc(usageRef, {
      message_count: messageCount,
      last_message_date: today,
      updated_at: now(),
    });
  } else {
    const usageRef = collection(db, USAGE_COLLECTION);
    await addDoc(usageRef, {
      user_id: userId,
      month_year: monthYear,
      message_count: messageCount,
      last_message_date: today,
      voice_seconds_today: 0,
      voice_last_date: today,
      voice_seconds_used: 0,
      created_at: now(),
      updated_at: now(),
    });
  }
}

export async function getTodayMessageCount(userId: string): Promise<number> {
  if (!isFirebaseConfigured() || !db) {
    return 0;
  }

  const today = new Date().toISOString().split("T")[0];
  const todayStart = `${today}T00:00:00.000Z`;

  const messagesRef = collection(db, MESSAGES_COLLECTION);
  const q = query(
    messagesRef,
    where("user_id", "==", userId),
    where("role", "==", "user"),
    where("created_at", ">=", todayStart)
  );

  const snapshot = await getDocs(q);
  return snapshot.size;
}
