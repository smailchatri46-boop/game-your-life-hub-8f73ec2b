-- Create activity log table for tracking recent user actions
CREATE TABLE public.activity_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  activity_type TEXT NOT NULL, -- 'habit_completed', 'task_completed', 'journal_created', 'mood_logged', 'goal_created'
  entity_id TEXT, -- ID of the related entity
  entity_name TEXT NOT NULL, -- Display name
  emoji TEXT NOT NULL DEFAULT '✨',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- RLS policies for activity_logs
CREATE POLICY "Users can view their own activity logs"
  ON public.activity_logs
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own activity logs"
  ON public.activity_logs
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own activity logs"
  ON public.activity_logs
  FOR DELETE
  USING (auth.uid() = user_id);

-- Index for efficient querying
CREATE INDEX idx_activity_logs_user_created ON public.activity_logs(user_id, created_at DESC);