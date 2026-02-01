-- Create subscriptions table to store user subscription data securely
CREATE TABLE public.subscriptions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE,
    polar_customer_id TEXT,
    polar_subscription_id TEXT,
    plan TEXT CHECK (plan IN ('monthly', 'yearly')),
    status TEXT DEFAULT 'inactive',
    current_period_end TIMESTAMP WITH TIME ZONE,
    cancel_at_period_end BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies - users can only view/update their own subscription
CREATE POLICY "Users can view their own subscription" 
ON public.subscriptions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscription" 
ON public.subscriptions 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Service role can insert/update (for edge functions using service role)
-- No INSERT policy for users - subscriptions are created via webhooks/edge functions with service role

-- Create index for faster lookups
CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_polar_customer_id ON public.subscriptions(polar_customer_id);
CREATE INDEX idx_subscriptions_polar_subscription_id ON public.subscriptions(polar_subscription_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_subscriptions_updated_at
BEFORE UPDATE ON public.subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();