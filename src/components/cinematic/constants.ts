
import { Platform } from './types';

export const platforms: Platform[] = [
  { 
    id: 'veo3', 
    name: 'Veo3', 
    icon: '🎬', 
    style: 'Cinematic Realism',
    description: 'Generate cinematic, realistic AI videos with professional quality' 
  },
  { 
    id: 'sora', 
    name: 'Sora', 
    icon: '📸', 
    style: 'Photorealism',
    description: 'Create photorealistic AI videos with stunning detail and accuracy' 
  },
  { 
    id: 'runway', 
    name: 'Runway', 
    icon: '🎨', 
    style: 'Painterly Style',
    description: 'Produce artistic, painterly AI videos with creative visual flair' 
  },
  { 
    id: 'pika', 
    name: 'Pika', 
    icon: '⚡', 
    style: 'Quick Loops / Stylized',
    description: 'Generate quick, stylized AI video loops perfect for social media' 
  }
];

export const emotions = [
  'Dramatic', 'Mysterious', 'Uplifting', 'Melancholic', 'Intense', 'Serene', 
  'Suspenseful', 'Romantic', 'Epic', 'Intimate'
];
