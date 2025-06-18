
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { GeneratedPrompt, MultiSceneProject } from './types';
import { saveSceneToHistory } from './database/sceneOperations';

interface FormState {
  sceneIdea: string;
  selectedPlatform: string;
  selectedEmotion: string;
  dialogSettings: any;
  soundSettings: any;
  cameraSettings: any;
  lightingSettings: any;
  styleReference: string;
  currentProject?: MultiSceneProject | null;
  isMultiScene?: boolean;
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
  updateScenePrompt?: (sceneIndex: number, prompt: GeneratedPrompt) => Promise<MultiSceneProject | null>
) => {
  const { toast } = useToast();

  const handleGenerate = useCallback(async () => {
    console.log('[PROMPT-GENERATION] Starting prompt generation');
    
    if (!user) {
      console.log('[PROMPT-GENERATION] User not authenticated, showing auth dialog');
      setShowAuthDialog(true);
      return;
    }

    if (!canUseFeature('cinematic_prompts')) {
      console.log('[PROMPT-GENERATION] User cannot use cinematic prompts feature');
      toast({
        title: "Upgrade Required",
        description: "Please upgrade your plan to generate cinematic prompts.",
        variant: "destructive"
      });
      return;
    }

    if (!formState.sceneIdea.trim()) {
      toast({
        title: "Scene Required",
        description: "Please describe your scene idea before generating.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log('[PROMPT-GENERATION] Calling cinematic prompt generator API');
      
      const requestBody = {
        sceneIdea: formState.sceneIdea,
        selectedPlatform: formState.selectedPlatform,
        selectedEmotion: formState.selectedEmotion,
        dialogSettings: formState.dialogSettings,
        soundSettings: formState.soundSettings,
        cameraSettings: formState.cameraSettings,
        lightingSettings: formState.lightingSettings,
        styleReference: formState.styleReference,
        sceneNumber: currentProject ? 
          (currentProject.scenes[currentProject.currentSceneIndex]?.sceneNumber || 1) : 1,
        totalScenes: currentProject ? currentProject.scenes.length : 1,
        isMultiScene: !!currentProject
      };

      console.log('[PROMPT-GENERATION] Request payload:', {
        ...requestBody,
        sceneIdea: requestBody.sceneIdea.substring(0, 50) + '...'
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
      
      const generatedPrompt: GeneratedPrompt = {
        mainPrompt: data.prompt.mainPrompt,
        technicalSpecs: data.prompt.technicalSpecs,
        styleNotes: data.prompt.styleNotes,
        platform: formState.selectedPlatform,
        sceneNumber: requestBody.sceneNumber,
        totalScenes: requestBody.totalScenes
      };

      setGeneratedPrompt(generatedPrompt);

      // If we're in a multi-scene project, update the scene with the new prompt
      if (currentProject && updateScenePrompt) {
        console.log('[PROMPT-GENERATION] Updating multi-scene project with new prompt');
        await updateScenePrompt(currentProject.currentSceneIndex, generatedPrompt);
      }

      // Reload prompt history to show the new prompt
      loadPromptHistory();

      toast({
        title: "Prompt Generated!",
        description: "Your cinematic prompt has been created and saved to your history.",
      });

    } catch (error: any) {
      console.error('[PROMPT-GENERATION] Generation failed:', error);
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate cinematic prompt. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [
    user,
    canUseFeature,
    setShowAuthDialog,
    formState,
    setGeneratedPrompt,
    setIsLoading,
    currentProject,
    updateScenePrompt,
    loadPromptHistory,
    toast
  ]);

  const manualSaveToHistory = useCallback(async () => {
    console.log('[PROMPT-GENERATION] Starting manual save to history');
    
    if (!user) {
      console.log('[PROMPT-GENERATION] User not authenticated for manual save');
      setShowAuthDialog(true);
      return false;
    }

    // Get current scene data
    let currentSceneData;
    if (currentProject) {
      currentSceneData = currentProject.scenes[currentProject.currentSceneIndex];
      if (!currentSceneData) {
        console.error('[PROMPT-GENERATION] No current scene data found');
        toast({
          title: "Save Failed",
          description: "No scene data found to save.",
          variant: "destructive"
        });
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
      toast({
        title: "Nothing to Save",
        description: "Generate a prompt first before saving to history.",
        variant: "destructive"
      });
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
        toast({
          title: "Saved to History!",
          description: "Your prompt has been saved to your history.",
        });
        
        // Reload history to show the new entry
        loadPromptHistory();
        return true;
      } else {
        console.error('[PROMPT-GENERATION] Failed to save to history');
        toast({
          title: "Save Failed",
          description: "Failed to save prompt to history. Please try again.",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error('[PROMPT-GENERATION] Error during manual save:', error);
      toast({
        title: "Save Error",
        description: "An error occurred while saving to history.",
        variant: "destructive"
      });
      return false;
    }
  }, [user, currentProject, formState, setShowAuthDialog, loadPromptHistory, toast]);

  return {
    handleGenerate,
    manualSaveToHistory,
    savingToHistory: false // We can add a loading state later if needed
  };
};
