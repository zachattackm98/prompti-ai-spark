
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { usePromptUsage } from '@/hooks/usePromptUsage';
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
  selectedMode: 'instant' | 'animal-vlog' | 'creative';
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
  updateScenePrompt: (sceneIndex: number, prompt: GeneratedPrompt) => void,
  // Mode-specific state
  animalType?: string,
  selectedVibe?: string,
  hasDialogue?: boolean,
  dialogueContent?: string
) => {
  const { triggerUsageUpdate } = usePromptUsage();

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
      // Build context for multi-scene projects
      let sceneContext = '';
      let sceneNumber = 1;
      let totalScenes = 1;
      let isMultiScene = false;

      if (currentProject && currentProject.scenes.length > 0) {
        isMultiScene = true;
        sceneNumber = currentProject.currentSceneIndex + 1;
        totalScenes = currentProject.scenes.length;
        
        // Build context from previous scenes
        const previousScenes = currentProject.scenes.slice(0, currentProject.currentSceneIndex);
        if (previousScenes.length > 0) {
          sceneContext = previousScenes.map((scene, index) => {
            let context = `Scene ${index + 1}: ${scene.sceneIdea}`;
            if (scene.generatedPrompt) {
              context += `\nGenerated content: ${scene.generatedPrompt.mainPrompt.substring(0, 200)}...`;
            }
            return context;
          }).join('\n\n');
        }
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
        // Multi-scene context
        sceneContext,
        sceneNumber,
        totalScenes,
        isMultiScene,
        // Mode-specific data
        mode: formState.selectedMode,
        animalType: formState.selectedMode === 'animal-vlog' ? animalType : undefined,
        selectedVibe: formState.selectedMode === 'animal-vlog' ? selectedVibe : undefined,
        hasDialogue: formState.selectedMode === 'animal-vlog' ? hasDialogue : undefined,
        dialogueContent: formState.selectedMode === 'animal-vlog' && hasDialogue ? dialogueContent : undefined
      };

      console.log('Generating prompt with mode-specific context:', {
        mode: formState.selectedMode,
        isMultiScene,
        sceneNumber,
        totalScenes,
        hasContext: !!sceneContext,
        animalType: formState.selectedMode === 'animal-vlog' ? animalType : 'N/A',
        selectedVibe: formState.selectedMode === 'animal-vlog' ? selectedVibe : 'N/A'
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
