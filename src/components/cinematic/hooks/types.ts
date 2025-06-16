
export interface CameraSettings {
  angle: string;
  movement: string;
  shot: string;
}

export interface LightingSettings {
  mood: string;
  style: string;
  timeOfDay: string;
}

export interface GeneratedPrompt {
  mainPrompt: string;
  technicalSpecs: string;
  styleNotes: string;
  platform: string;
}

export interface FormState {
  currentStep: number;
  sceneIdea: string;
  selectedPlatform: string;
  selectedEmotion: string;
  cameraSettings: CameraSettings;
  lightingSettings: LightingSettings;
  styleReference: string;
  generatedPrompt: GeneratedPrompt | null;
  isLoading: boolean;
}
