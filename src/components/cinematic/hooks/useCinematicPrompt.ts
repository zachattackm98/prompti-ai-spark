
import { usePromptGeneration } from './usePromptGeneration';
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

export const useCinematicPrompt = (
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
  const { handleGenerate } = usePromptGeneration(
    user,
    subscription,
    canUseFeature,
    setShowAuthDialog,
    loadPromptHistory,
    formState,
    setGeneratedPrompt,
    setIsLoading,
    currentProject,
    updateScenePrompt,
    // Pass mode-specific state
    animalType,
    selectedVibe,
    hasDialogue,
    dialogueContent
  );

  return {
    handleGenerate
  };
};
