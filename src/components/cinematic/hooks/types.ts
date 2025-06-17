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

export interface GeneratedPrompt {
  mainPrompt: string;
  technicalSpecs: string;
  styleNotes: string;
  platform: string;
  sceneNumber?: number;
  totalScenes?: number;
}

export interface SceneData {
  id?: string; // Add optional id field for database
  sceneNumber: number;
  sceneIdea: string;
  selectedPlatform: string;
  selectedEmotion: string;
  dialogSettings: DialogSettings;
  soundSettings: SoundSettings;
  cameraSettings: CameraSettings;
  lightingSettings: LightingSettings;
  styleReference: string;
  generatedPrompt: GeneratedPrompt | null;
}

export interface MultiSceneProject {
  id: string;
  title: string;
  scenes: SceneData[];
  currentSceneIndex: number;
  createdAt: string;
  updatedAt: string;
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
  // Multi-scene properties
  currentProject: MultiSceneProject | null;
  isMultiScene: boolean;
}
