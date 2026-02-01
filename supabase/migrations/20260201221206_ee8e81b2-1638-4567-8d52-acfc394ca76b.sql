-- Create table for storing user onboarding data
CREATE TABLE public.onboarding_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  
  -- Survey answers
  survey_answers JSONB DEFAULT '{}'::jsonb,
  
  -- About the user
  focus_areas TEXT[] DEFAULT '{}',
  struggles TEXT[] DEFAULT '{}',
  tracking_struggles TEXT[] DEFAULT '{}',
  unique_about TEXT,
  current_apps TEXT,
  
  -- Past experience
  past_experience JSONB DEFAULT '{}'::jsonb,
  
  -- AI preferences
  ai_preferences JSONB DEFAULT '{}'::jsonb,
  
  -- Commitment
  commitment_name TEXT,
  checked_affirmations TEXT[] DEFAULT '{}',
  
  -- Status
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.onboarding_data ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own onboarding data" 
ON public.onboarding_data 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own onboarding data" 
ON public.onboarding_data 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own onboarding data" 
ON public.onboarding_data 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_onboarding_data_updated_at
BEFORE UPDATE ON public.onboarding_data
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();