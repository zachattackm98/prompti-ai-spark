
import { useToast } from '@/hooks/use-toast';
import { scrollToStepContent } from '@/utils/scrollUtils';
import { PromptHistoryItem } from '@/hooks/usePromptHistory';

export const useHistoryScenes = (
  startNewProject: (title: string, sceneData: any) => any,
  loadSceneDataToCurrentState: (data: any) => void,
  setCurrentStep: (step: number) => void
) => {
  const { toast } = useToast();

  const createScenesFromHistory = async (historyItem: PromptHistoryItem) => {
    try {
      // Parse the generated prompt data
      const promptData = JSON.parse(historyItem.generated_prompt);
      
      // Create scene data from history item
      const sceneData = {
        sceneIdea: historyItem.scene_idea,
        selectedPlatform: historyItem.platform,
        selectedEmotion: historyItem.emotion,
        dialogSettings: {
          hasDialog: false,
          dialogType: '',
          dialogStyle: '',
          language: '',
          dialogContent: ''
        },
        soundSettings: {
          hasSound: false,
          musicGenre: undefined,
          soundEffects: undefined,
          ambience: undefined,
          soundDescription: ''
        },
        cameraSettings: {
          angle: '',
          movement: '',
          shot: ''
        },
        lightingSettings: {
          mood: '',
          style: '',
          timeOfDay: ''
        },
        styleReference: historyItem.style || '',
        generatedPrompt: {
          mainPrompt: promptData.mainPrompt,
          technicalSpecs: promptData.technicalSpecs,
          styleNotes: promptData.styleNotes,
          platform: historyItem.platform,
          sceneNumber: 1,
          totalScenes: 2
        }
      };

      // Create project title based on scene idea
      const projectTitle = historyItem.scene_idea.length > 30 
        ? `${historyItem.scene_idea.substring(0, 30)}... Project`
        : `${historyItem.scene_idea} Project`;

      // Start new project with the first scene
      const project = await startNewProject(projectTitle, sceneData);
      
      if (project) {
        // Load the first scene data to current state
        loadSceneDataToCurrentState({
          ...sceneData,
          sceneNumber: 1
        });

        // Set current step to the results view (step 8 for generated prompt display)
        setCurrentStep(8);

        // Scroll to form
        setTimeout(() => {
          scrollToStepContent(8);
        }, 200);

        toast({
          title: "Multi-Scene Project Created!",
          description: "Scene 1 is ready. You can now continue to Scene 2.",
        });
      }
    } catch (error) {
      console.error('Error creating scenes from history:', error);
      toast({
        title: "Error",
        description: "Failed to create scenes from history item.",
        variant: "destructive"
      });
    }
  };

  return {
    createScenesFromHistory
  };
};
