
-- Create projects table to store multi-scene cinematic projects
CREATE TABLE public.cinematic_projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  current_scene_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create scenes table to store individual scenes within projects
CREATE TABLE public.cinematic_scenes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.cinematic_projects(id) ON DELETE CASCADE,
  scene_number INTEGER NOT NULL,
  scene_idea TEXT NOT NULL,
  selected_platform TEXT NOT NULL DEFAULT 'veo3',
  selected_emotion TEXT NOT NULL DEFAULT 'cinematic',
  dialog_settings JSONB NOT NULL DEFAULT '{"hasDialog": false, "dialogType": "", "dialogStyle": "", "language": "", "dialogContent": ""}',
  sound_settings JSONB NOT NULL DEFAULT '{"hasSound": false, "soundDescription": ""}',
  camera_settings JSONB NOT NULL DEFAULT '{"angle": "", "movement": "", "shot": ""}',
  lighting_settings JSONB NOT NULL DEFAULT '{"mood": "", "style": "", "timeOfDay": ""}',
  style_reference TEXT NOT NULL DEFAULT '',
  generated_prompt JSONB NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(project_id, scene_number)
);

-- Enable Row Level Security
ALTER TABLE public.cinematic_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cinematic_scenes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for cinematic_projects
CREATE POLICY "Users can view their own projects" 
  ON public.cinematic_projects 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own projects" 
  ON public.cinematic_projects 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects" 
  ON public.cinematic_projects 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects" 
  ON public.cinematic_projects 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- RLS Policies for cinematic_scenes
CREATE POLICY "Users can view scenes from their own projects" 
  ON public.cinematic_scenes 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.cinematic_projects 
      WHERE id = project_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create scenes in their own projects" 
  ON public.cinematic_scenes 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.cinematic_projects 
      WHERE id = project_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update scenes in their own projects" 
  ON public.cinematic_scenes 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.cinematic_projects 
      WHERE id = project_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete scenes from their own projects" 
  ON public.cinematic_scenes 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.cinematic_projects 
      WHERE id = project_id AND user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_cinematic_projects_user_id ON public.cinematic_projects(user_id);
CREATE INDEX idx_cinematic_scenes_project_id ON public.cinematic_scenes(project_id);
CREATE INDEX idx_cinematic_scenes_scene_number ON public.cinematic_scenes(project_id, scene_number);
