
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

export interface DialogSettings {
  hasDialog: boolean;
  dialogType: string;
  dialogStyle: string;
  language: string;
}

export interface SoundSettings {
  hasSound: boolean;
  musicGenre: string;
  soundEffects: string;
  ambience: string;
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
  dialogSettings: DialogSettings;
  soundSettings: SoundSettings;
  cameraSettings: CameraSettings;
  lightingSettings: LightingSettings;
  styleReference: string;
  generatedPrompt: GeneratedPrompt | null;
  isLoading: boolean;
}
