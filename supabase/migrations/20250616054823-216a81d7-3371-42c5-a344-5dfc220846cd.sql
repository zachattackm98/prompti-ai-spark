
-- Create prompt_usage table to track user prompt counts
CREATE TABLE IF NOT EXISTS public.prompt_usage (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    prompt_count INTEGER NOT NULL DEFAULT 0,
    reset_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.prompt_usage ENABLE ROW LEVEL SECURITY;

-- Create policies for users to access their own usage data
CREATE POLICY "Users can view their own prompt usage" ON public.prompt_usage
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own prompt usage" ON public.prompt_usage
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own prompt usage" ON public.prompt_usage
    FOR UPDATE USING (auth.uid() = user_id);

-- Create unique index to ensure one record per user per month
CREATE UNIQUE INDEX IF NOT EXISTS idx_prompt_usage_user_date ON public.prompt_usage(user_id, reset_date);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_prompt_usage_user_id ON public.prompt_usage(user_id);

-- Function to get or create current month's usage record
CREATE OR REPLACE FUNCTION public.get_or_create_prompt_usage(user_uuid UUID)
RETURNS public.prompt_usage
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    usage_record public.prompt_usage;
    current_month_start DATE;
BEGIN
    -- Calculate the start of the current month
    current_month_start := DATE_TRUNC('month', CURRENT_DATE)::DATE;
    
    -- Try to get existing record for current month
    SELECT * INTO usage_record 
    FROM public.prompt_usage 
    WHERE user_id = user_uuid AND reset_date = current_month_start;
    
    -- If no record exists, create one
    IF NOT FOUND THEN
        INSERT INTO public.prompt_usage (user_id, prompt_count, reset_date)
        VALUES (user_uuid, 0, current_month_start)
        RETURNING * INTO usage_record;
    END IF;
    
    RETURN usage_record;
END;
$$;

-- Function to increment prompt count
CREATE OR REPLACE FUNCTION public.increment_prompt_count(user_uuid UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_count INTEGER;
    current_month_start DATE;
BEGIN
    current_month_start := DATE_TRUNC('month', CURRENT_DATE)::DATE;
    
    -- Insert or update the prompt count
    INSERT INTO public.prompt_usage (user_id, prompt_count, reset_date, updated_at)
    VALUES (user_uuid, 1, current_month_start, NOW())
    ON CONFLICT (user_id, reset_date)
    DO UPDATE SET 
        prompt_count = prompt_usage.prompt_count + 1,
        updated_at = NOW()
    RETURNING prompt_count INTO new_count;
    
    RETURN new_count;
END;
$$;
