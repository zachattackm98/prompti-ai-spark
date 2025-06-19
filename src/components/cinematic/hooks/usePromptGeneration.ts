
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { GeneratedPrompt } from './types';
import { PromptGenerationHookParams } from './prompt/types';
import { createSingleSceneProject } from './prompt/projectCreation';
import { generatePrompt } from './prompt/promptGeneration';
import { performManualSave } from './prompt/manualSave';

export const usePromptGeneration = (
  user: any,
  subscription: any,
  canUseFeature: (feature: string) => boolean,
  setShowAuthDialog: (show: boolean) => void,
  loadPromptHistory: () => void,
  formState: PromptGenerationHookParams['formState'],
  setGeneratedPrompt: (prompt: GeneratedPrompt | null) => void,
  setIsLoading: (loading: boolean) => void,
  currentProject: PromptGenerationHookParams['currentProject'],
  updateScenePrompt?: (sceneIndex: number, prompt: GeneratedPrompt) => Promise<any>
) => {
  const { toast } = useToast();

  const handleGenerate = useCallback(async () => {
    console.log('[PROMPT-GENERATION] Starting prompt generation');
    console.log('[PROMPT-GENERATION] Current subscription:', subscription);
    
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
      const generatedPrompt = await generatePrompt(subscription, formState, currentProject);
      setGeneratedPrompt(generatedPrompt);

      // Check if user can save to history
      const canSaveToHistory = canUseFeature('promptHistory');
      
      // Handle saving based on whether we're in a multi-scene project or not
      if (currentProject && updateScenePrompt) {
        console.log('[PROMPT-GENERATION] Updating multi-scene project with new prompt');
        await updateScenePrompt(currentProject.currentSceneIndex, generatedPrompt);
        
        if (canSaveToHistory) {
          // Reload prompt history to show the new prompt
          loadPromptHistory();
        }
      } else if (canSaveToHistory) {
        // For single-scene prompts, automatically create a project and save to history (only for creator/studio)
        console.log('[PROMPT-GENERATION] Auto-saving single-scene prompt to history');
        try {
          await createSingleSceneProject(user, formState, generatedPrompt);
          console.log('[PROMPT-GENERATION] Single-scene prompt automatically saved to history');
          
          // Reload prompt history to show the new prompt
          loadPromptHistory();
          
          toast({
            title: "Prompt Generated!",
            description: "Your cinematic prompt has been created and saved to your history.",
          });
        } catch (saveError) {
          console.error('[PROMPT-GENERATION] Error auto-saving to history:', saveError);
          // Don't fail the entire generation if history save fails
          toast({
            title: "Prompt Generated",
            description: "Your prompt was generated but couldn't be saved to history. You can manually save it using the save button.",
            variant: "destructive"
          });
        }
      } else {
        // For starter tier users, just show success without saving
        toast({
          title: "Prompt Generated!",
          description: "Your cinematic prompt has been created. Upgrade to Creator or Studio to save prompts to your history.",
        });
      }

    } catch (error: any) {
      console.error('[PROMPT-GENERATION] Generation failed:', error);
      
      // Handle specific error cases
      let errorTitle = "Generation Failed";
      let errorMessage = error.message || "Failed to generate cinematic prompt. Please try again.";
      
      if (error.message?.includes('USAGE_LIMIT_EXCEEDED')) {
        errorTitle = "Usage Limit Reached";
        errorMessage = error.message;
      } else if (error.message?.includes('AUTHENTICATION_ERROR')) {
        errorTitle = "Authentication Error";
        errorMessage = "Please sign in again to continue.";
      }
      
      toast({
        title: errorTitle,
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [
    user,
    subscription,
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
    const success = await performManualSave(user, currentProject, formState, canUseFeature);
    
    if (!user) {
      setShowAuthDialog(true);
      return false;
    }

    if (!canUseFeature('promptHistory')) {
      toast({
        title: "Upgrade Required",
        description: "Upgrade to Creator or Studio to save prompts to your history.",
        variant: "destructive"
      });
      return false;
    }

    if (!success) {
      toast({
        title: "Save Failed",
        description: "Failed to save prompt to history. Please try again.",
        variant: "destructive"
      });
      return false;
    }

    toast({
      title: "Saved to History!",
      description: "Your prompt has been saved to your history.",
    });
    
    // Reload history to show the new entry
    loadPromptHistory();
    return true;
  }, [user, currentProject, formState, setShowAuthDialog, loadPromptHistory, canUseFeature, toast]);

  return {
    handleGenerate,
    manualSaveToHistory,
    savingToHistory: false
  };
};
