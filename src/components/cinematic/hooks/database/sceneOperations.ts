
import { supabase } from '@/integrations/supabase/client';
import { SceneData } from '../types';

export const saveScenes = async (projectId: string, scenes: SceneData[]): Promise<void> => {
  try {
    console.log('[SCENE-OPERATIONS] Starting to save scenes for project:', projectId);
    console.log('[SCENE-OPERATIONS] Number of scenes to save:', scenes.length);

    // Process scenes one by one to handle conflicts properly
    for (const scene of scenes) {
      console.log(`[SCENE-OPERATIONS] Processing scene ${scene.sceneNumber}:`, {
        id: scene.id,
        sceneNumber: scene.sceneNumber,
        hasPrompt: !!scene.generatedPrompt
      });

      const sceneData = {
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
      };

      // Try to upsert the scene, handling duplicate key conflicts
      const { error: sceneError } = await supabase
        .from('cinematic_scenes')
        .upsert(sceneData, {
          onConflict: 'project_id,scene_number',
          ignoreDuplicates: false
        });

      if (sceneError) {
        console.error(`[SCENE-OPERATIONS] Error saving scene ${scene.sceneNumber}:`, sceneError);
        
        // If it's a duplicate key error, try to update instead
        if (sceneError.message.includes('duplicate key')) {
          console.log(`[SCENE-OPERATIONS] Attempting to update existing scene ${scene.sceneNumber}`);
          
          const { error: updateError } = await supabase
            .from('cinematic_scenes')
            .update({
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
            })
            .eq('project_id', projectId)
            .eq('scene_number', scene.sceneNumber);

          if (updateError) {
            console.error(`[SCENE-OPERATIONS] Failed to update scene ${scene.sceneNumber}:`, updateError);
            throw new Error(`Failed to save scene ${scene.sceneNumber}: ${updateError.message}`);
          } else {
            console.log(`[SCENE-OPERATIONS] Successfully updated scene ${scene.sceneNumber}`);
          }
        } else {
          throw new Error(`Failed to save scene ${scene.sceneNumber}: ${sceneError.message}`);
        }
      } else {
        console.log(`[SCENE-OPERATIONS] Successfully saved scene ${scene.sceneNumber}`);
      }
    }

    console.log('[SCENE-OPERATIONS] All scenes saved successfully');
  } catch (err) {
    console.error('[SCENE-OPERATIONS] Error in saveScenes:', err);
    throw err;
  }
};

export const loadScenes = async (projectId: string): Promise<SceneData[]> => {
  try {
    console.log('[SCENE-OPERATIONS] Loading scenes for project:', projectId);
    
    const { data: scenesData, error: scenesError } = await supabase
      .from('cinematic_scenes')
      .select('*')
      .eq('project_id', projectId)
      .order('scene_number');

    if (scenesError) {
      console.error('[SCENE-OPERATIONS] Error loading scenes:', scenesError);
      throw new Error(scenesError.message);
    }

    console.log(`[SCENE-OPERATIONS] Loaded ${scenesData?.length || 0} scenes`);

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
    console.error('[SCENE-OPERATIONS] Error in loadScenes:', err);
    return [];
  }
};

// New function to save a single scene to history (for manual saves)
export const saveSceneToHistory = async (sceneData: SceneData, projectTitle?: string): Promise<boolean> => {
  try {
    console.log('[SCENE-OPERATIONS] Starting manual save to history:', {
      sceneNumber: sceneData.sceneNumber,
      hasPrompt: !!sceneData.generatedPrompt,
      projectTitle
    });

    if (!sceneData.generatedPrompt) {
      console.warn('[SCENE-OPERATIONS] No generated prompt to save');
      return false;
    }

    // Check if user is authenticated
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error('[SCENE-OPERATIONS] User not authenticated for manual save');
      return false;
    }

    // Generate a unique project ID for single scene saves
    const historyProjectId = crypto.randomUUID();
    const historyProjectTitle = projectTitle || `Scene ${sceneData.sceneNumber} - ${new Date().toLocaleDateString()}`;

    console.log('[SCENE-OPERATIONS] Creating history project:', {
      id: historyProjectId,
      title: historyProjectTitle,
      userId: user.id
    });

    // Create a project entry for this single scene save
    const { error: projectError } = await supabase
      .from('cinematic_projects')
      .insert({
        id: historyProjectId,
        user_id: user.id,
        title: historyProjectTitle,
        current_scene_index: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (projectError) {
      console.error('[SCENE-OPERATIONS] Error creating history project:', projectError);
      return false;
    }

    // Save the scene with a unique ID to avoid conflicts
    const historySceneId = crypto.randomUUID();
    const { error: sceneError } = await supabase
      .from('cinematic_scenes')
      .insert({
        id: historySceneId,
        project_id: historyProjectId,
        scene_number: 1, // Always 1 for single scene saves
        scene_idea: sceneData.sceneIdea,
        selected_platform: sceneData.selectedPlatform,
        selected_emotion: sceneData.selectedEmotion,
        dialog_settings: sceneData.dialogSettings as any,
        sound_settings: sceneData.soundSettings as any,
        camera_settings: sceneData.cameraSettings as any,
        lighting_settings: sceneData.lightingSettings as any,
        style_reference: sceneData.styleReference,
        generated_prompt: sceneData.generatedPrompt as any,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (sceneError) {
      console.error('[SCENE-OPERATIONS] Error saving scene to history:', sceneError);
      return false;
    }

    console.log('[SCENE-OPERATIONS] Successfully saved scene to history');
    return true;
  } catch (err) {
    console.error('[SCENE-OPERATIONS] Error in saveSceneToHistory:', err);
    return false;
  }
};
