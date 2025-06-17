
import { supabase } from '@/integrations/supabase/client';
import { SceneData } from '../types';

export const saveScenes = async (projectId: string, scenes: SceneData[]): Promise<void> => {
  try {
    const scenesData = scenes.map(scene => ({
      id: scene.id || undefined,
      project_id: projectId,
      scene_number: scene.sceneNumber,
      scene_idea: scene.sceneIdea,
      selected_platform: scene.selectedPlatform,
      selected_emotion: scene.selectedEmotion,
      dialog_settings: scene.dialogSettings as any,
      sound_settings: scene.soundSettings as any,
      camera_settings: scene.cameraSettings as any,
      lighting_settings: scene.lightingSettings as any,
      style_reference: scene.styleReference,
      generated_prompt: scene.generatedPrompt as any,
      updated_at: new Date().toISOString()
    }));

    const { error: scenesError } = await supabase
      .from('cinematic_scenes')
      .upsert(scenesData);

    if (scenesError) {
      console.error('Error saving scenes:', scenesError);
      throw new Error(scenesError.message);
    }
  } catch (err) {
    console.error('Error in saveScenes:', err);
    throw err;
  }
};

export const loadScenes = async (projectId: string): Promise<SceneData[]> => {
  try {
    const { data: scenesData, error: scenesError } = await supabase
      .from('cinematic_scenes')
      .select('*')
      .eq('project_id', projectId)
      .order('scene_number');

    if (scenesError) {
      console.error('Error loading scenes:', scenesError);
      throw new Error(scenesError.message);
    }

    return scenesData.map(scene => ({
      id: scene.id,
      sceneNumber: scene.scene_number,
      sceneIdea: scene.scene_idea,
      selectedPlatform: scene.selected_platform,
      selectedEmotion: scene.selected_emotion,
      dialogSettings: scene.dialog_settings as any,
      soundSettings: scene.sound_settings as any,
      cameraSettings: scene.camera_settings as any,
      lightingSettings: scene.lighting_settings as any,
      styleReference: scene.style_reference,
      generatedPrompt: scene.generated_prompt as any
    }));
  } catch (err) {
    console.error('Error in loadScenes:', err);
    return [];
  }
};
