
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

  const createSingleSceneProject = useCallback(async (generatedPrompt: GeneratedPrompt) => {
    if (!user) return null;

    try {
      console.log('[PROMPT-GENERATION] Creating single-scene project for automatic save');
      
      // Create a project for the single scene
      const projectId = crypto.randomUUID();
      const projectTitle = `Generated Scene - ${new Date().toLocaleDateString()}`;
      
      // First, save the project
      const { data: projectData, error: projectError } = await supabase
        .from('cinematic_projects')
        .insert({
          id: projectId,
          user_id: user.id,
          title: projectTitle,
          current_scene_index: 0
        })
        .select()
        .single();

      if (projectError) {
        console.error('[PROMPT-GENERATION] Error creating project:', projectError);
        throw new Error(projectError.message);
      }

      console.log('[PROMPT-GENERATION] Project created:', projectData.id);

      // Create scene data from current form state
      const sceneData = {
        id: crypto.randomUUID(),
        project_id: projectId,
        scene_number: 1,
        scene_idea: formState.sceneIdea,
        selected_platform: formState.selectedPlatform,
        selected_emotion: formState.selectedEmotion,
        dialog_settings: formState.dialogSettings,
        sound_settings: formState.soundSettings,
        camera_settings: formState.cameraSettings,
        lighting_settings: formState.lightingSettings,
        style_reference: formState.styleReference,
        generated_prompt: generatedPrompt as any // Cast to Json type for database
      };

      // Save the scene with the generated prompt
      const { data: sceneData_response, error: sceneError } = await supabase
        .from('cinematic_scenes')
        .insert(sceneData)
        .select()
        .single();

      if (sceneError) {
        console.error('[PROMPT-GENERATION] Error creating scene:', sceneError);
        throw new Error(sceneError.message);
      }

      console.log('[PROMPT-GENERATION] Scene created and saved to history:', sceneData_response.id);
      return { project: projectData, scene: sceneData_response };
    } catch (error) {
      console.error('[PROMPT-GENERATION] Error in createSingleSceneProject:', error);
      throw error;
    }
  }, [user, formState]);

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
      
      const generatedPrompt: GeneratedPrompt = {
        mainPrompt: data.prompt.mainPrompt,
        technicalSpecs: data.prompt.technicalSpecs,
        styleNotes: data.prompt.styleNotes,
        platform: formState.selectedPlatform,
        sceneNumber: requestBody.sceneNumber,
        totalScenes: requestBody.totalScenes
      };

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
          await createSingleSceneProject(generatedPrompt);
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
    createSingleSceneProject,
    toast
  ]);

  const manualSaveToHistory = useCallback(async () => {
    console.log('[PROMPT-GENERATION] Starting manual save to history');
    
    if (!user) {
      console.log('[PROMPT-GENERATION] User not authenticated for manual save');
      setShowAuthDialog(true);
      return false;
    }

    // Check if user can save to history
    if (!canUseFeature('promptHistory')) {
      toast({
        title: "Upgrade Required",
        description: "Upgrade to Creator or Studio to save prompts to your history.",
        variant: "destructive"
      });
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
  }, [user, currentProject, formState, setShowAuthDialog, loadPromptHistory, canUseFeature, toast]);

  return {
    handleGenerate,
    manualSaveToHistory,
    savingToHistory: false
  };
};
