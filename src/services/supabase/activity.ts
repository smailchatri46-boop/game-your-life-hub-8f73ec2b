// Supabase service for activity logs
import { supabase } from "@/integrations/supabase/client";

export type ActivityType = 
  | "habit_completed" 
  | "task_completed" 
  | "journal_created" 
  | "mood_logged" 
  | "goal_created";

export interface ActivityLog {
  id: string;
  user_id: string;
  activity_type: ActivityType;
  entity_id: string | null;
  entity_name: string;
  emoji: string;
  created_at: string;
}

export async function getRecentActivities(
  userId: string,
  limit: number = 4
): Promise<ActivityLog[]> {
  const { data, error } = await supabase
    .from("activity_logs")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching activity logs:", error);
    return [];
  }

  return (data || []) as ActivityLog[];
}

export async function logActivity(
  userId: string,
  activityType: ActivityType,
  entityName: string,
  emoji: string,
  entityId?: string
): Promise<ActivityLog | null> {
  const { data, error } = await supabase
    .from("activity_logs")
    .insert({
      user_id: userId,
      activity_type: activityType,
      entity_id: entityId || null,
      entity_name: entityName,
      emoji,
    })
    .select()
    .single();

  if (error) {
    console.error("Error logging activity:", error);
    return null;
  }

  return data as ActivityLog;
}

export async function clearOldActivities(
  userId: string,
  keepCount: number = 50
): Promise<void> {
  // Get IDs of activities to keep
  const { data: keepIds } = await supabase
    .from("activity_logs")
    .select("id")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(keepCount);

  if (!keepIds || keepIds.length < keepCount) return;

  const idsToKeep = keepIds.map((r) => r.id);

  // Delete older activities
  await supabase
    .from("activity_logs")
    .delete()
    .eq("user_id", userId)
    .not("id", "in", `(${idsToKeep.join(",")})`);
}
