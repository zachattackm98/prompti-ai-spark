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
  dialogContent?: string;
}

export interface SoundSettings {
  hasSound: boolean;
  musicGenre?: string;
  soundEffects?: string;
  ambience?: string;
  soundDescription?: string;
}

export interface SceneMetadata {
  characters: string[];
  location: string;
  timeOfDay: string;
  mood: string;
  visualStyle: string;
  keyProps: string[];
  colorPalette: string[];
  cameraWork: string;
  lighting: string;
  storyElements: string[];
}

export interface GeneratedPrompt {
  mainPrompt: string;
  technicalSpecs: string;
  styleNotes: string;
  platform: string;
  metadata: SceneMetadata;
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
