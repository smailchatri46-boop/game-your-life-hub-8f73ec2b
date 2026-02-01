import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { 
  getRecentActivities, 
  logActivity as logActivityService,
  ActivityType,
  ActivityLog 
} from "@/services/supabase/activity";
import { formatDistanceToNow } from "date-fns";

export interface RecentActivity {
  id: string;
  emoji: string;
  text: string;
  timeAgo: string;
  activityType: ActivityType;
}

// Demo activities for unauthenticated users
const DEMO_ACTIVITIES: RecentActivity[] = [
  { id: "demo-1", emoji: "💪", text: "Completed 'Exercise'", timeAgo: "2 hours ago", activityType: "habit_completed" },
  { id: "demo-2", emoji: "💧", text: "Completed 'Drink Water'", timeAgo: "3 hours ago", activityType: "habit_completed" },
  { id: "demo-3", emoji: "📓", text: "Wrote a journal entry", timeAgo: "Yesterday", activityType: "journal_created" },
  { id: "demo-4", emoji: "🧘", text: "Completed 'Morning Meditation'", timeAgo: "Yesterday", activityType: "habit_completed" },
];

function formatActivityText(activity: ActivityLog): string {
  switch (activity.activity_type) {
    case "habit_completed":
      return `Completed '${activity.entity_name}'`;
    case "task_completed":
      return `Completed a task`;
    case "journal_created":
      return "Wrote a journal entry";
    case "mood_logged":
      return "Logged mood & motivation";
    case "goal_created":
      return `Created goal '${activity.entity_name}'`;
    default:
      return activity.entity_name;
  }
}

function formatTimeAgo(timestamp: string): string {
  try {
    const date = new Date(timestamp);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return "Recently";
  }
}

export function useRecentActivity() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const isDemo = !user;

  const activitiesQuery = useQuery({
    queryKey: ["recent_activities", user?.id],
    queryFn: async () => {
      if (!user) return [];
      return await getRecentActivities(user.id, 4);
    },
    enabled: !!user,
    staleTime: 1000 * 30, // 30 seconds
  });

  const logActivityMutation = useMutation({
    mutationFn: async ({
      activityType,
      entityName,
      emoji,
      entityId,
    }: {
      activityType: ActivityType;
      entityName: string;
      emoji: string;
      entityId?: string;
    }) => {
      if (!user) return null;
      return await logActivityService(user.id, activityType, entityName, emoji, entityId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recent_activities"] });
    },
  });

  // Transform raw activities to display format
  const activities: RecentActivity[] = isDemo
    ? DEMO_ACTIVITIES
    : (activitiesQuery.data || []).map((activity) => ({
        id: activity.id,
        emoji: activity.emoji,
        text: formatActivityText(activity),
        timeAgo: formatTimeAgo(activity.created_at),
        activityType: activity.activity_type,
      }));

  return {
    activities,
    isLoading: activitiesQuery.isLoading,
    isDemo,
    logActivity: logActivityMutation.mutate,
    logActivityAsync: logActivityMutation.mutateAsync,
  };
}
