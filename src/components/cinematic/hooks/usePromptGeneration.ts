
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { usePromptUsage } from '@/hooks/usePromptUsage';
import { GeneratedPrompt, PreviousSceneContext } from './types';

interface FormState {
  sceneIdea: string;
  selectedPlatform: string;
  selectedEmotion: string;
  dialogSettings: any;
  soundSettings: any;
  cameraSettings: any;
  lightingSettings: any;
  styleReference: string;
  previousSceneContext?: PreviousSceneContext;
  isContinuingScene?: boolean;
}

export const usePromptGeneration = (
  user: any,
  subscription: any,
  canUseFeature: (feature: string) => boolean,
  setShowAuthDialog: (show: boolean) => void,
  loadPromptHistory: () => void,
  formState: FormState,
  setGeneratedPrompt: (prompt: GeneratedPrompt | null) => void,
  setIsLoading: (loading: boolean) => void,
  setCurrentStep?: (step: number) => void,
  clearContinuationMode?: () => void
) => {
  const { triggerUsageUpdate } = usePromptUsage();

  // Helper function to check if camera settings are default/empty
  const isCameraSettingsEmpty = (cameraSettings: any): boolean => {
    return !cameraSettings || 
           (!cameraSettings.angle && !cameraSettings.movement && !cameraSettings.shot) ||
           (cameraSettings.angle === '' && cameraSettings.movement === '' && cameraSettings.shot === '');
  };

  const handleGenerate = async () => {
    if (!user) {
      setShowAuthDialog(true);
      return;
    }

    if (!formState.sceneIdea.trim()) {
      return;
    }

    setIsLoading(true);

    try {
      // Build base request data
      const requestData: any = {
        sceneIdea: formState.sceneIdea,
        platform: formState.selectedPlatform,
        emotion: formState.selectedEmotion,
        styleReference: formState.styleReference,
        dialogSettings: formState.dialogSettings,
        soundSettings: formState.soundSettings,
        lightingSettings: formState.lightingSettings,
        tier: subscription.tier,
        enhancedPrompts: canUseFeature('enhancedPrompts'),
        // Include previous scene context for continuity
        isMultiScene: formState.isContinuingScene || false,
        sceneContext: formState.previousSceneContext || null
      };

      // Only include camera settings if they are explicitly set (not empty/default)
      // This is especially important when continuing a scene - we don't want to force
      // the previous scene's camera work unless the user specifically chose camera settings
      if (!isCameraSettingsEmpty(formState.cameraSettings)) {
        requestData.cameraSettings = formState.cameraSettings;
      }

      console.log('Generating prompt:', {
        sceneIdea: formState.sceneIdea,
        platform: formState.selectedPlatform
      });

      const { data, error } = await supabase.functions.invoke('cinematic-prompt-generator', {
        body: requestData
      });

      if (error) {
        console.error('Error generating prompt:', error);
        if (error.message?.includes('limit exceeded') || error.message?.includes('usage limit')) {
          // Handle usage limit errors gracefully
          return;
        }
        throw error;
      }

      if (data?.prompt) {
        const generatedPrompt: GeneratedPrompt = data.prompt;
        
        setGeneratedPrompt(generatedPrompt);
        
        // Navigate to step 8 to show the generated prompt
        if (setCurrentStep) {
          setCurrentStep(8);
        }
        
        // Clear continuation mode when prompt is successfully generated
        if (clearContinuationMode) {
          clearContinuationMode();
        }
        
        // Trigger automatic usage update - this will cause all components to re-render
        triggerUsageUpdate();
        
        loadPromptHistory();
      }
    } catch (error) {
      console.error('Error generating prompt:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return { handleGenerate };
};
