-- Create a table for daily to-do items (standalone, not linked to habits)
CREATE TABLE public.daily_todos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  date DATE NOT NULL,
  text TEXT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create unique constraint on user_id, date, and text to prevent duplicates
CREATE INDEX idx_daily_todos_user_date ON public.daily_todos(user_id, date);

-- Enable Row Level Security
ALTER TABLE public.daily_todos ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own todos" 
ON public.daily_todos 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own todos" 
ON public.daily_todos 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own todos" 
ON public.daily_todos 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own todos" 
ON public.daily_todos 
FOR DELETE 
USING (auth.uid() = user_id);