
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { GeneratedPrompt, MultiSceneProject } from './types';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
  const [savingToHistory, setSavingToHistory] = useState(false);

  const buildPreviousScenePrompts = (): PreviousScenePrompt[] => {
    if (!currentProject || currentProject.currentSceneIndex === 0) {
      return [];
    }

    const previousScenes = currentProject.scenes.slice(0, currentProject.currentSceneIndex);
    
    return previousScenes
      .filter(scene => scene.generatedPrompt)
      .map(scene => ({
        sceneNumber: scene.sceneNumber,
        sceneIdea: scene.sceneIdea,
        mainPrompt: scene.generatedPrompt!.mainPrompt,
        technicalSpecs: scene.generatedPrompt!.technicalSpecs,
        styleNotes: scene.generatedPrompt!.styleNotes
      }));
  };

  const savePromptToHistory = async (prompt: GeneratedPrompt, retryCount = 0): Promise<boolean> => {
    const maxRetries = 3;
    console.log(`[PROMPT-HISTORY] Attempting to save prompt to history (attempt ${retryCount + 1}/${maxRetries + 1})`);
    
    try {
      // First, try to save to cinematic_projects and cinematic_scenes tables
      let projectId = currentProject?.id;
      
      if (!projectId) {
        console.log('[PROMPT-HISTORY] No current project, creating new project for history');
        const { data: newProject, error: projectError } = await supabase
          .from('cinematic_projects')
          .insert({
            title: `Project: ${formState.sceneIdea.substring(0, 30)}...`,
            user_id: user.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();

        if (projectError) {
          console.error('[PROMPT-HISTORY] Error creating project:', projectError);
          throw projectError;
        }

        projectId = newProject.id;
        console.log('[PROMPT-HISTORY] Created new project:', projectId);
      }

      // Save the scene with the generated prompt
      const { data: scene, error: sceneError } = await supabase
        .from('cinematic_scenes')
        .insert({
          project_id: projectId,
          scene_idea: formState.sceneIdea,
          selected_platform: formState.selectedPlatform,
          selected_emotion: formState.selectedEmotion,
          style_reference: formState.styleReference || '',
          generated_prompt: prompt,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (sceneError) {
        console.error('[PROMPT-HISTORY] Error saving scene:', sceneError);
        throw sceneError;
      }

      console.log('[PROMPT-HISTORY] Successfully saved scene to database:', scene.id);
      return true;
    } catch (error) {
      console.error(`[PROMPT-HISTORY] Save attempt ${retryCount + 1} failed:`, error);
      
      if (retryCount < maxRetries) {
        console.log(`[PROMPT-HISTORY] Retrying in ${(retryCount + 1) * 1000}ms...`);
        await new Promise(resolve => setTimeout(resolve, (retryCount + 1) * 1000));
        return savePromptToHistory(prompt, retryCount + 1);
      }
      
      return false;
    }
  };

  const manualSaveToHistory = async (prompt: GeneratedPrompt) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to save prompts to history.",
        variant: "destructive"
      });
      return;
    }

    setSavingToHistory(true);
    
    try {
      const success = await savePromptToHistory(prompt);
      
      if (success) {
        toast({
          title: "Saved to History",
          description: "Prompt has been saved to your history successfully.",
        });
        loadPromptHistory();
      } else {
        toast({
          title: "Save Failed",
          description: "Failed to save prompt to history after multiple attempts. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('[PROMPT-HISTORY] Manual save failed:', error);
      toast({
        title: "Save Error",
        description: "An error occurred while saving to history.",
        variant: "destructive"
      });
    } finally {
      setSavingToHistory(false);
    }
  };

  const handleGenerate = async () => {
    if (!user) {
      setShowAuthDialog(true);
      return;
    }

    if (!formState.sceneIdea.trim()) {
      toast({
        title: "Scene Required",
        description: "Please enter a scene idea before generating.",
        variant: "destructive"
      });
      return;
    }

    console.log('[PROMPT-GENERATION] Starting prompt generation process');
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
        previousScenePrompts = buildPreviousScenePrompts();
        
        console.log('[PROMPT-GENERATION] Multi-scene context:', {
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
        previousScenePrompts,
        sceneNumber,
        totalScenes,
        isMultiScene
      };

      console.log('[PROMPT-GENERATION] Calling cinematic-prompt-generator function');

      const { data, error } = await supabase.functions.invoke('cinematic-prompt-generator', {
        body: requestData
      });

      if (error) {
        console.error('[PROMPT-GENERATION] Function error:', error);
        
        if (error.message?.includes('limit exceeded') || error.message?.includes('usage limit')) {
          toast({
            title: "Usage Limit Reached",
            description: "You've reached your monthly prompt limit. Please upgrade your plan or wait until next month.",
            variant: "destructive"
          });
          return;
        }
        
        throw error;
      }

      if (data?.prompt) {
        console.log('[PROMPT-GENERATION] Prompt generated successfully');
        
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
        
        // Attempt to save to history with better error handling
        console.log('[PROMPT-GENERATION] Attempting to save to history');
        const historySuccess = await savePromptToHistory(generatedPrompt);
        
        if (historySuccess) {
          console.log('[PROMPT-GENERATION] Successfully saved to history');
          toast({
            title: "Prompt Generated",
            description: "Your cinematic prompt has been generated and saved to history!",
          });
          loadPromptHistory();
        } else {
          console.warn('[PROMPT-GENERATION] Failed to save to history, but prompt was generated');
          toast({
            title: "Prompt Generated",
            description: "Your prompt was generated successfully, but couldn't be saved to history. Use the manual save button below.",
            variant: "destructive"
          });
        }
      } else {
        throw new Error('No prompt data received from the function');
      }
    } catch (error) {
      console.error('[PROMPT-GENERATION] Generation failed:', error);
      
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate prompt. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { 
    handleGenerate, 
    manualSaveToHistory,
    savingToHistory
  };
};
