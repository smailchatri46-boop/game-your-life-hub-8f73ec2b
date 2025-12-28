-- Add voice usage tracking columns to ai_usage table
ALTER TABLE public.ai_usage 
ADD COLUMN IF NOT EXISTS voice_seconds_used integer NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS voice_last_date date NOT NULL DEFAULT CURRENT_DATE,
ADD COLUMN IF NOT EXISTS voice_seconds_today integer NOT NULL DEFAULT 0;