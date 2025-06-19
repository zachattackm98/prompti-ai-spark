
import { supabase } from '@/integrations/supabase/client';
import { GeneratedPrompt } from '../types';
import { FormState } from './types';

export const createSingleSceneProject = async (
  user: any,
  formState: FormState,
  generatedPrompt: GeneratedPrompt
) => {
  if (!user) return null;

  try {
    console.log('[PROMPT-GENERATION] Creating single-scene project for automatic save');
    
    // Create a project for the single scene
    const projectId = crypto.randomUUID();
    const projectTitle = `Generated Scene - ${new Date().toLocaleDateString()}`;
    
    // First, save the project
    const { data: projectData, error: projectError } = await supabase
      .from('cinematic_projects')
      .insert({
        id: projectId,
        user_id: user.id,
        title: projectTitle,
        current_scene_index: 0
      })
      .select()
      .single();

    if (projectError) {
      console.error('[PROMPT-GENERATION] Error creating project:', projectError);
      throw new Error(projectError.message);
    }

    console.log('[PROMPT-GENERATION] Project created:', projectData.id);

    // Create scene data from current form state
    const sceneData = {
      id: crypto.randomUUID(),
      project_id: projectId,
      scene_number: 1,
      scene_idea: formState.sceneIdea,
      selected_platform: formState.selectedPlatform,
      selected_emotion: formState.selectedEmotion,
      dialog_settings: formState.dialogSettings as any,
      sound_settings: formState.soundSettings as any,
      camera_settings: formState.cameraSettings as any,
      lighting_settings: formState.lightingSettings as any,
      style_reference: formState.styleReference,
      generated_prompt: generatedPrompt as any // Cast to Json type for database
    };

    // Save the scene with the generated prompt
    const { data: sceneData_response, error: sceneError } = await supabase
      .from('cinematic_scenes')
      .insert(sceneData)
      .select()
      .single();

    if (sceneError) {
      console.error('[PROMPT-GENERATION] Error creating scene:', sceneError);
      throw new Error(sceneError.message);
    }

    console.log('[PROMPT-GENERATION] Scene created and saved to history:', sceneData_response.id);
    return { project: projectData, scene: sceneData_response };
  } catch (error) {
    console.error('[PROMPT-GENERATION] Error in createSingleSceneProject:', error);
    throw error;
  }
};
