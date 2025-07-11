-- Add detailed settings columns to prompt_history table
ALTER TABLE public.prompt_history 
ADD COLUMN dialog_settings JSONB DEFAULT '{"language": "", "hasDialog": false, "dialogType": "", "dialogStyle": "", "dialogContent": ""}'::jsonb,
ADD COLUMN sound_settings JSONB DEFAULT '{"hasSound": false, "soundDescription": ""}'::jsonb,
ADD COLUMN camera_settings JSONB DEFAULT '{"shot": "", "angle": "", "movement": ""}'::jsonb,
ADD COLUMN lighting_settings JSONB DEFAULT '{"mood": "", "style": "", "timeOfDay": ""}'::jsonb,
ADD COLUMN previous_scene_context JSONB DEFAULT NULL,
ADD COLUMN is_continuation BOOLEAN DEFAULT false;

-- Add index for better query performance on continuation scenes
CREATE INDEX idx_prompt_history_continuation ON public.prompt_history(user_id, is_continuation);

-- Add index for better performance on scene context queries
CREATE INDEX idx_prompt_history_context ON public.prompt_history(user_id, created_at) WHERE previous_scene_context IS NOT NULL;