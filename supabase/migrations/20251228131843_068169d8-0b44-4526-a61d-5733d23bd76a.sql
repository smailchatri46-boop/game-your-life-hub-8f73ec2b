-- Create habits table
CREATE TABLE public.habits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT '✨',
  category TEXT NOT NULL DEFAULT 'Other',
  category_color TEXT,
  target INTEGER NOT NULL DEFAULT 1,
  importance INTEGER DEFAULT 50,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create habit completions table
CREATE TABLE public.habit_completions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  habit_id UUID NOT NULL REFERENCES public.habits(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  date DATE NOT NULL,
  value INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(habit_id, date)
);

-- Create journal entries table
CREATE TABLE public.journal_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  emoji TEXT DEFAULT '😊',
  bg_color TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create mood tracking table
CREATE TABLE public.mood_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  date DATE NOT NULL,
  mood INTEGER CHECK (mood >= 1 AND mood <= 10),
  motivation INTEGER CHECK (motivation >= 1 AND motivation <= 10),
  reflection TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Create AI chat messages table
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mood_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- RLS policies for habits
CREATE POLICY "Users can view their own habits" ON public.habits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own habits" ON public.habits FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own habits" ON public.habits FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own habits" ON public.habits FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for habit_completions
CREATE POLICY "Users can view their own completions" ON public.habit_completions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own completions" ON public.habit_completions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own completions" ON public.habit_completions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own completions" ON public.habit_completions FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for journal_entries
CREATE POLICY "Users can view their own journals" ON public.journal_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own journals" ON public.journal_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own journals" ON public.journal_entries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own journals" ON public.journal_entries FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for mood_logs
CREATE POLICY "Users can view their own mood logs" ON public.mood_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own mood logs" ON public.mood_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own mood logs" ON public.mood_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own mood logs" ON public.mood_logs FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for chat_messages
CREATE POLICY "Users can view their own messages" ON public.chat_messages FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own messages" ON public.chat_messages FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Add triggers for updated_at
CREATE TRIGGER update_habits_updated_at BEFORE UPDATE ON public.habits FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_journal_entries_updated_at BEFORE UPDATE ON public.journal_entries FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();