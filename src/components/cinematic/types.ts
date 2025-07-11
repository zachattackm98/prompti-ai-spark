
export interface PromptHistory {
  id: string;
  scene_idea: string;
  platform: string;
  style: string;
  emotion: string;
  generated_prompt: string;
  created_at: string;
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
  sceneNumber?: number;
  totalScenes?: number;
}

export interface Platform {
  id: string;
  name: string;
  icon: string;
  style: string;
  description: string;
}
