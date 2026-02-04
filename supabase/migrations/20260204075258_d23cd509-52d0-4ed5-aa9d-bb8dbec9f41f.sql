-- Add schedule_days column to habits table (array of days 0-6 where 0=Sunday, 1=Monday, etc.)
-- null or empty means "daily" (shows every day)
ALTER TABLE public.habits ADD COLUMN IF NOT EXISTS schedule_days integer[] DEFAULT NULL;

-- Add position column for ordering habits
ALTER TABLE public.habits ADD COLUMN IF NOT EXISTS position integer DEFAULT 0;

-- Add emoji column to daily_todos for storing selected emoji
ALTER TABLE public.daily_todos ADD COLUMN IF NOT EXISTS emoji text DEFAULT '📝';

-- Add position column for ordering todos
ALTER TABLE public.daily_todos ADD COLUMN IF NOT EXISTS position integer DEFAULT 0;

-- Create index for faster habit ordering
CREATE INDEX IF NOT EXISTS idx_habits_user_position ON public.habits(user_id, position);

-- Create index for faster todo ordering  
CREATE INDEX IF NOT EXISTS idx_todos_user_date_position ON public.daily_todos(user_id, date, position);