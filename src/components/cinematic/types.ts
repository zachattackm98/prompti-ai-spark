
export interface PromptHistory {
  id: string;
  scene_idea: string;
  platform: string;
  style: string;
  emotion: string;
  generated_prompt: string;
  created_at: string;
}

export interface GeneratedPrompt {
  mainPrompt: string;
  technicalSpecs: string;
  styleNotes: string;
  platform: string;
}

export interface Platform {
  id: string;
  name: string;
  icon: string;
  style: string;
  description: string;
}
