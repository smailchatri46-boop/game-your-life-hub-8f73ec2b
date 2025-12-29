-- Create goals table
CREATE TABLE public.goals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  category_emoji TEXT NOT NULL DEFAULT '🎯',
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  target_count INTEGER NOT NULL,
  completed_count INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT goals_status_check CHECK (status IN ('active', 'completed')),
  CONSTRAINT goals_duration_check CHECK (end_date >= start_date + INTERVAL '3 months')
);

-- Create goal_habits junction table
CREATE TABLE public.goal_habits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  goal_id UUID NOT NULL REFERENCES public.goals(id) ON DELETE CASCADE,
  habit_id UUID NOT NULL REFERENCES public.habits(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(goal_id, habit_id)
);

-- Enable RLS
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goal_habits ENABLE ROW LEVEL SECURITY;

-- Goals policies
CREATE POLICY "Users can view their own goals" ON public.goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own goals" ON public.goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own goals" ON public.goals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own goals" ON public.goals FOR DELETE USING (auth.uid() = user_id);

-- Goal habits policies
CREATE POLICY "Users can view their own goal habits" ON public.goal_habits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own goal habits" ON public.goal_habits FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own goal habits" ON public.goal_habits FOR DELETE USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_goals_updated_at
BEFORE UPDATE ON public.goals
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to update goal progress when habit is completed
CREATE OR REPLACE FUNCTION public.update_goal_progress()
RETURNS TRIGGER AS $$
BEGIN
  -- Update completed_count for all goals linked to this habit
  UPDATE public.goals g
  SET completed_count = (
    SELECT COALESCE(SUM(hc.value), 0)
    FROM public.goal_habits gh
    JOIN public.habit_completions hc ON hc.habit_id = gh.habit_id
    WHERE gh.goal_id = g.id
    AND hc.date >= g.start_date
    AND hc.date <= g.end_date
  ),
  status = CASE 
    WHEN (
      SELECT COALESCE(SUM(hc.value), 0)
      FROM public.goal_habits gh
      JOIN public.habit_completions hc ON hc.habit_id = gh.habit_id
      WHERE gh.goal_id = g.id
      AND hc.date >= g.start_date
      AND hc.date <= g.end_date
    ) >= g.target_count THEN 'completed'
    ELSE 'active'
  END
  WHERE g.id IN (
    SELECT gh.goal_id FROM public.goal_habits gh WHERE gh.habit_id = NEW.habit_id
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger on habit_completions
CREATE TRIGGER update_goal_progress_on_completion
AFTER INSERT OR UPDATE OR DELETE ON public.habit_completions
FOR EACH ROW
EXECUTE FUNCTION public.update_goal_progress();