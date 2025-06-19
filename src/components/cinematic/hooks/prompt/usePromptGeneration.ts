
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { GeneratedPrompt } from '../types';
import { FormState, PromptGenerationHookParams } from './types';
import { generatePrompt } from './promptGeneration';
import { createSingleSceneProject } from './projectCreation';

export const usePromptGeneration = (
  user: any,
  subscription: any,
  canUseFeature: (feature: string) => boolean,
  setShowAuthDialog: (show: boolean) => void,
  loadPromptHistory: () => void,
  formState: FormState,
  setGeneratedPrompt: (prompt: GeneratedPrompt | null) => void,
  setIsLoading: (loading: boolean) => void,
  currentProject: any,
  updateScenePrompt?: (sceneIndex: number, prompt: GeneratedPrompt) => Promise<any>
) => {
  const { toast } = useToast();

  const validateGenerationRequest = useCallback(() => {
    if (!user) {
      setShowAuthDialog(true);
      return false;
    }

    if (!canUseFeature('cinematic_prompts')) {
      toast({
        title: "Upgrade Required",
        description: "Please upgrade your plan to generate cinematic prompts.",
        variant: "destructive"
      });
      return false;
    }

    if (!formState.sceneIdea.trim()) {
      toast({
        title: "Scene Required",
        description: "Please describe your scene idea before generating.",
        variant: "destructive"
      });
      return false;
    }

    return true;
  }, [user, canUseFeature, formState.sceneIdea, setShowAuthDialog, toast]);

  const handleGenerationSuccess = useCallback(async (generatedPrompt: GeneratedPrompt) => {
    setGeneratedPrompt(generatedPrompt);
    const canSaveToHistory = canUseFeature('promptHistory');
    
    // Handle saving based on whether we're in a multi-scene project or not
    if (currentProject && updateScenePrompt) {
      console.log('[PROMPT-GENERATION] Updating multi-scene project with new prompt');
      await updateScenePrompt(currentProject.currentSceneIndex, generatedPrompt);
      
      if (canSaveToHistory) {
        loadPromptHistory();
      }
    } else if (canSaveToHistory) {
      // For single-scene prompts, automatically create a project and save to history
      console.log('[PROMPT-GENERATION] Auto-saving single-scene prompt to history');
      try {
        await createSingleSceneProject(user, formState, generatedPrompt);
        loadPromptHistory();
        
        toast({
          title: "Prompt Generated!",
          description: "Your cinematic prompt has been created and saved to your history.",
        });
      } catch (saveError) {
        console.error('[PROMPT-GENERATION] Error auto-saving to history:', saveError);
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
  }, [setGeneratedPrompt, canUseFeature, currentProject, updateScenePrompt, loadPromptHistory, user, formState, toast]);

  const handleGenerationError = useCallback((error: any) => {
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
  }, [toast]);

  const handleGenerate = useCallback(async () => {
    console.log('[PROMPT-GENERATION] Starting prompt generation');
    
    if (!validateGenerationRequest()) {
      return;
    }

    setIsLoading(true);

    try {
      const generatedPrompt = await generatePrompt(subscription, formState, currentProject);
      await handleGenerationSuccess(generatedPrompt);
    } catch (error: any) {
      handleGenerationError(error);
    } finally {
      setIsLoading(false);
    }
  }, [validateGenerationRequest, setIsLoading, subscription, formState, currentProject, handleGenerationSuccess, handleGenerationError]);

  return {
    handleGenerate,
    validateGenerationRequest,
    handleGenerationSuccess,
    handleGenerationError
  };
};
