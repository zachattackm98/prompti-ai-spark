
-- Create prompt_history table
CREATE TABLE IF NOT EXISTS public.prompt_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    scene_idea TEXT NOT NULL,
    platform TEXT NOT NULL,
    style TEXT,
    emotion TEXT NOT NULL,
    generated_prompt TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.prompt_history ENABLE ROW LEVEL SECURITY;

-- Create policy for users to access their own prompt history
CREATE POLICY "Users can view their own prompt history" ON public.prompt_history
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own prompt history" ON public.prompt_history
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_prompt_history_user_id_created_at ON public.prompt_history(user_id, created_at DESC);
