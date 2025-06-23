
export type CinematicMode = 'instant' | 'animal-vlog' | 'creative';

export interface ModeOption {
  id: CinematicMode;
  name: string;
  description: string;
  icon: string;
}

export const CINEMATIC_MODES: ModeOption[] = [
  {
    id: 'instant',
    name: 'Instant',
    description: 'Quick prompts with smart platform selection',
    icon: 'zap'
  },
  {
    id: 'animal-vlog',
    name: 'Animal Vlog',
    description: 'Specialized for animal content and vlogging',
    icon: 'camera'
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Full control with all advanced features',
    icon: 'palette'
  }
];

// Platform auto-selection mapping for Instant mode
export const INSTANT_MODE_PLATFORM_MAPPING: Record<string, string> = {
  // Veo3 keywords - cinematic, professional
  'cinematic': 'veo3',
  'professional': 'veo3',
  'movie': 'veo3',
  'film': 'veo3',
  'dramatic': 'veo3',
  'high-end': 'veo3',
  'commercial': 'veo3',
  
  // Sora keywords - realistic, natural
  'realistic': 'sora',
  'natural': 'sora',
  'photorealistic': 'sora',
  'documentary': 'sora',
  'real': 'sora',
  'authentic': 'sora',
  
  // Runway keywords - artistic, creative
  'artistic': 'runway',
  'creative': 'runway',
  'abstract': 'runway',
  'stylized': 'runway',
  'experimental': 'runway',
  'painterly': 'runway',
  
  // Pika keywords - social, quick, dynamic
  'social': 'pika',
  'tiktok': 'pika',
  'instagram': 'pika',
  'quick': 'pika',
  'loop': 'pika',
  'dynamic': 'pika',
  'viral': 'pika'
};

// Animal types for Animal Vlog mode
export const ANIMAL_TYPES = [
  'Cat', 'Dog', 'Bird', 'Rabbit', 'Hamster', 'Fish', 'Horse', 'Cow', 
  'Sheep', 'Pig', 'Chicken', 'Duck', 'Goose', 'Elephant', 'Lion', 
  'Tiger', 'Bear', 'Wolf', 'Fox', 'Deer', 'Monkey', 'Giraffe', 
  'Zebra', 'Penguin', 'Dolphin', 'Whale', 'Shark', 'Turtle', 'Snake'
];

// Vibes for Animal Vlog mode
export const ANIMAL_VLOG_VIBES = [
  'Playful', 'Cute', 'Funny', 'Adventurous', 'Calm', 'Energetic', 
  'Mischievous', 'Sleepy', 'Curious', 'Happy', 'Dramatic', 'Silly'
];
