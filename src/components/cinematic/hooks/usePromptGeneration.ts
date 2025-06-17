
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { GeneratedPrompt, MultiSceneProject } from './types';

interface FormState {
  sceneIdea: string;
  selectedPlatform: string;
  selectedEmotion: string;
  dialogSettings: any;
  soundSettings: any;
  cameraSettings: any;
  lightingSettings: any;
  styleReference: string;
  currentProject: MultiSceneProject | null;
  isMultiScene: boolean;
}

interface PreviousScenePrompt {
  sceneNumber: number;
  sceneIdea: string;
  mainPrompt: string;
  technicalSpecs: string;
  styleNotes: string;
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
  currentProject: MultiSceneProject | null,
  updateScenePrompt: (sceneIndex: number, prompt: GeneratedPrompt) => void
) => {
  const buildPreviousScenePrompts = (): PreviousScenePrompt[] => {
    if (!currentProject || currentProject.currentSceneIndex === 0) {
      return [];
    }

    const previousScenes = currentProject.scenes.slice(0, currentProject.currentSceneIndex);
    
    return previousScenes
      .filter(scene => scene.generatedPrompt) // Only include scenes with generated prompts
      .map(scene => ({
        sceneNumber: scene.sceneNumber,
        sceneIdea: scene.sceneIdea,
        mainPrompt: scene.generatedPrompt!.mainPrompt,
        technicalSpecs: scene.generatedPrompt!.technicalSpecs,
        styleNotes: scene.generatedPrompt!.styleNotes
      }));
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
      // Build enhanced context for multi-scene projects
      let sceneNumber = 1;
      let totalScenes = 1;
      let isMultiScene = false;
      let previousScenePrompts: PreviousScenePrompt[] = [];

      if (currentProject && currentProject.scenes.length > 0) {
        isMultiScene = true;
        sceneNumber = currentProject.currentSceneIndex + 1;
        totalScenes = currentProject.scenes.length;
        
        // Build detailed context from previous scenes with generated prompts
        previousScenePrompts = buildPreviousScenePrompts();
        
        console.log('Enhanced multi-scene context:', {
          isMultiScene,
          sceneNumber,
          totalScenes,
          previousScenesWithPrompts: previousScenePrompts.length
        });
      }

      const requestData = {
        sceneIdea: formState.sceneIdea,
        platform: formState.selectedPlatform,
        emotion: formState.selectedEmotion,
        styleReference: formState.styleReference,
        dialogSettings: formState.dialogSettings,
        soundSettings: formState.soundSettings,
        cameraSettings: formState.cameraSettings,
        lightingSettings: formState.lightingSettings,
        tier: subscription.tier,
        enhancedPrompts: canUseFeature('enhancedPrompts'),
        // Enhanced multi-scene context
        previousScenePrompts,
        sceneNumber,
        totalScenes,
        isMultiScene
      };

      console.log('Generating prompt with enhanced context:', {
        isMultiScene,
        sceneNumber,
        totalScenes,
        previousScenesCount: previousScenePrompts.length
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
        const generatedPrompt: GeneratedPrompt = {
          ...data.prompt,
          sceneNumber,
          totalScenes
        };
        
        setGeneratedPrompt(generatedPrompt);
        
        // Update the scene prompt in multi-scene project
        if (currentProject) {
          updateScenePrompt(currentProject.currentSceneIndex, generatedPrompt);
        }
        
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
