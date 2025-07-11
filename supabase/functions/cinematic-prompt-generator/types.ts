
export interface PromptRequest {
  sceneIdea: string;
  platform: string;
  emotion: string;
  styleReference?: string;
  dialogSettings?: {
    hasDialog: boolean;
    dialogType?: string;
    dialogStyle?: string;
    language?: string;
    dialogContent?: string;
  };
  soundSettings?: {
    hasSound: boolean;
    musicGenre?: string;
    soundEffects?: string;
    ambience?: string;
    soundDescription?: string;
  };
  cameraSettings?: {
    angle?: string;
    movement?: string;
    shot?: string;
  };
  lightingSettings?: {
    mood?: string;
    style?: string;
    timeOfDay?: string;
  };
  tier?: string;
  enhancedPrompts?: boolean;
  // Multi-scene support
  sceneContext?: {
    sceneExcerpt: string;
    characters: string[];
    location: string;
    visualStyle: string;
    mood: string;
    keyElements: string[];
  };
  isMultiScene?: boolean;
  sceneNumber?: number;
  totalScenes?: number;
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

export interface PlatformConfig {
  system: string;
  technical: string;
}

export interface UsageData {
  id: string;
  user_id: string;
  prompt_count: number;
  reset_date: string;
  created_at: string;
  updated_at: string;
}
