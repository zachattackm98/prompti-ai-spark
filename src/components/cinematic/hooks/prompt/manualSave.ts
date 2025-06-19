
import { saveSceneToHistory } from '../database/sceneOperations';
import { GeneratedPrompt, MultiSceneProject } from '../types';
import { FormState } from './types';

export const performManualSave = async (
  user: any,
  currentProject: MultiSceneProject | null,
  formState: FormState,
  canUseFeature: (feature: string) => boolean
): Promise<boolean> => {
  console.log('[PROMPT-GENERATION] Starting manual save to history');
  
  if (!user) {
    console.log('[PROMPT-GENERATION] User not authenticated for manual save');
    return false;
  }

  // Check if user can save to history
  if (!canUseFeature('promptHistory')) {
    return false;
  }

  // Get current scene data
  let currentSceneData;
  if (currentProject) {
    currentSceneData = currentProject.scenes[currentProject.currentSceneIndex];
    if (!currentSceneData) {
      console.error('[PROMPT-GENERATION] No current scene data found');
      return false;
    }
  } else {
    // Create scene data from form state
    currentSceneData = {
      id: crypto.randomUUID(),
      sceneNumber: 1,
      sceneIdea: formState.sceneIdea,
      selectedPlatform: formState.selectedPlatform,
      selectedEmotion: formState.selectedEmotion,
      dialogSettings: formState.dialogSettings,
      soundSettings: formState.soundSettings,
      cameraSettings: formState.cameraSettings,
      lightingSettings: formState.lightingSettings,
      styleReference: formState.styleReference,
      generatedPrompt: null
    };
  }

  if (!currentSceneData.generatedPrompt) {
    console.warn('[PROMPT-GENERATION] No generated prompt to save');
    return false;
  }

  try {
    const projectTitle = currentProject ? 
      currentProject.title : 
      `Manual Save - ${new Date().toLocaleDateString()}`;

    console.log('[PROMPT-GENERATION] Saving to history with title:', projectTitle);
    
    const success = await saveSceneToHistory(currentSceneData, projectTitle);
    
    if (success) {
      console.log('[PROMPT-GENERATION] Successfully saved to history');
      return true;
    } else {
      console.error('[PROMPT-GENERATION] Failed to save to history');
      return false;
    }
  } catch (error) {
    console.error('[PROMPT-GENERATION] Error during manual save:', error);
    return false;
  }
};
