
import { supabase } from '@/integrations/supabase/client';
import { GeneratedPrompt, MultiSceneProject } from '../types';
import { FormState } from './types';

export const generatePrompt = async (
  subscription: any,
  formState: FormState,
  currentProject: MultiSceneProject | null
): Promise<GeneratedPrompt> => {
  console.log('[PROMPT-GENERATION] Calling cinematic prompt generator API');
  
  // Use the subscription tier directly from the subscription object
  const userTier = subscription?.tier || 'starter';
  console.log('[PROMPT-GENERATION] Using subscription tier:', userTier);
  
  const requestBody = {
    sceneIdea: formState.sceneIdea,
    selectedPlatform: formState.selectedPlatform,
    selectedEmotion: formState.selectedEmotion,
    dialogSettings: formState.dialogSettings,
    soundSettings: formState.soundSettings,
    cameraSettings: formState.cameraSettings,
    lightingSettings: formState.lightingSettings,
    styleReference: formState.styleReference,
    tier: userTier,
    sceneNumber: currentProject ? 
      (currentProject.scenes[currentProject.currentSceneIndex]?.sceneNumber || 1) : 1,
    totalScenes: currentProject ? currentProject.scenes.length : 1,
    isMultiScene: !!currentProject
  };

  console.log('[PROMPT-GENERATION] Request payload:', {
    ...requestBody,
    sceneIdea: requestBody.sceneIdea.substring(0, 50) + '...',
    tier: requestBody.tier
  });

  const { data, error } = await supabase.functions.invoke('cinematic-prompt-generator', {
    body: requestBody
  });

  if (error) {
    console.error('[PROMPT-GENERATION] API error:', error);
    throw error;
  }

  if (!data || !data.prompt) {
    console.error('[PROMPT-GENERATION] Invalid response data:', data);
    throw new Error('Invalid response from prompt generator');
  }

  console.log('[PROMPT-GENERATION] Prompt generated successfully');
  
  return {
    mainPrompt: data.prompt.mainPrompt,
    technicalSpecs: data.prompt.technicalSpecs,
    styleNotes: data.prompt.styleNotes,
    platform: formState.selectedPlatform,
    sceneNumber: requestBody.sceneNumber,
    totalScenes: requestBody.totalScenes
  };
};
