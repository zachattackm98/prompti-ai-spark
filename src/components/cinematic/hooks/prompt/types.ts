
import { GeneratedPrompt, MultiSceneProject } from '../types';

export interface FormState {
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

export interface PromptGenerationHookParams {
  user: any;
  subscription: any;
  canUseFeature: (feature: string) => boolean;
  setShowAuthDialog: (show: boolean) => void;
  loadPromptHistory: () => void;
  formState: FormState;
  setGeneratedPrompt: (prompt: GeneratedPrompt | null) => void;
  setIsLoading: (loading: boolean) => void;
  currentProject: MultiSceneProject | null;
  updateScenePrompt?: (sceneIndex: number, prompt: GeneratedPrompt) => Promise<MultiSceneProject | null>;
}
