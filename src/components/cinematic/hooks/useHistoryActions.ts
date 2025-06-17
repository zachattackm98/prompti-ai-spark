
import { useCallback } from 'react';
import { PromptHistory } from '../types';
import { CameraSettings, LightingSettings, DialogSettings, SoundSettings, SceneData } from './types';
import { useToast } from '@/hooks/use-toast';

export const useHistoryActions = (
  startNewProject: (title: string, initialSceneData: Omit<SceneData, 'sceneNumber'>) => Promise<any>,
  loadSceneDataToCurrentState: (sceneData: SceneData) => void,
  setCurrentStep: (step: number) => void
) => {
  const { toast } = useToast();

  const handleStartProjectFromHistory = useCallback(async (promptHistory: PromptHistory) => {
    try {
      console.log('[HISTORY-ACTIONS] Starting project from history:', promptHistory.id);

      // Parse the generated prompt
      let parsedPrompt;
      try {
        parsedPrompt = JSON.parse(promptHistory.generated_prompt);
      } catch (error) {
        console.error('[HISTORY-ACTIONS] Error parsing generated prompt:', error);
        toast({
          title: "Parse Error",
          description: "Unable to parse the historical prompt data.",
          variant: "destructive"
        });
        return;
      }

      // Create scene data from the historical prompt
      const sceneData: Omit<SceneData, 'sceneNumber'> = {
        sceneIdea: promptHistory.scene_idea,
        selectedPlatform: promptHistory.platform,
        selectedEmotion: promptHistory.emotion,
        styleReference: promptHistory.style || '',
        generatedPrompt: {
          mainPrompt: parsedPrompt.mainPrompt || '',
          technicalSpecs: parsedPrompt.technicalSpecs || '',
          styleNotes: parsedPrompt.styleNotes || '',
          platform: promptHistory.platform,
          sceneNumber: 1,
          totalScenes: 1
        },
        // Default settings (we'll enhance this if we store more details in history)
        dialogSettings: {
          hasDialog: false,
          dialogType: '',
          dialogStyle: '',
          language: 'English'
        } as DialogSettings,
        soundSettings: {
          hasSound: false
        } as SoundSettings,
        cameraSettings: {
          angle: '',
          movement: '',
          shot: ''
        } as CameraSettings,
        lightingSettings: {
          mood: '',
          style: '',
          timeOfDay: ''
        } as LightingSettings
      };

      // Create a new project with this scene as Scene 1
      const projectTitle = `Project: ${promptHistory.scene_idea.substring(0, 30)}...`;
      const project = await startNewProject(projectTitle, sceneData);

      if (project) {
        // Load the scene data into the current state
        loadSceneDataToCurrentState({
          ...sceneData,
          sceneNumber: 1
        });

        // Navigate to the prompt display (we already have a generated prompt)
        // Since we're showing the generated prompt, we don't need to go to step 1
        
        toast({
          title: "Project Started",
          description: `New multi-scene project created from your historical prompt. You can now add Scene 2!`,
        });

        console.log('[HISTORY-ACTIONS] Project successfully created from history');
      } else {
        throw new Error('Failed to create project');
      }
    } catch (error) {
      console.error('[HISTORY-ACTIONS] Error starting project from history:', error);
      toast({
        title: "Error",
        description: "Failed to start project from history. Please try again.",
        variant: "destructive"
      });
    }
  }, [startNewProject, loadSceneDataToCurrentState, setCurrentStep, toast]);

  return {
    handleStartProjectFromHistory
  };
};
