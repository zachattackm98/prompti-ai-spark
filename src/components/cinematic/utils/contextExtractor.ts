// Enhanced context extraction for multi-scene continuity
import { SceneData, GeneratedPrompt } from '../hooks/types';

export interface ExtractedContext {
  characters: string[];
  locations: string[];
  visualStyle: string;
  mood: string;
  timeOfDay: string;
  cinematography: string;
  colorPalette: string;
  clothing: string[];
  props: string[];
  summary: string;
}

// Keywords for different context categories
const CONTEXT_PATTERNS = {
  characters: [
    'character', 'person', 'protagonist', 'woman', 'man', 'child', 'figure',
    'actor', 'individual', 'subject', 'hero', 'villain', 'wearing', 'dressed'
  ],
  locations: [
    'room', 'house', 'street', 'city', 'forest', 'beach', 'office', 'car',
    'building', 'rooftop', 'park', 'restaurant', 'store', 'outdoor', 'indoor',
    'alley', 'corridor', 'bedroom', 'kitchen', 'living room'
  ],
  clothing: [
    'wearing', 'dressed in', 'suit', 'dress', 'shirt', 'jacket', 'coat',
    'jeans', 'uniform', 'costume', 'hat', 'shoes', 'boots', 'gloves'
  ],
  props: [
    'holding', 'carrying', 'with a', 'briefcase', 'phone', 'bag', 'weapon',
    'tool', 'book', 'cup', 'glass', 'keys', 'document', 'laptop'
  ],
  timeOfDay: [
    'morning', 'afternoon', 'evening', 'night', 'dawn', 'dusk', 'sunset',
    'sunrise', 'midday', 'golden hour', 'blue hour'
  ],
  visualStyle: [
    'cinematic', 'dramatic', 'noir', 'bright', 'dark', 'colorful', 'muted',
    'vibrant', 'atmospheric', 'moody', 'realistic', 'stylized'
  ],
  cinematography: [
    'close-up', 'wide shot', 'medium shot', 'overhead', 'low angle', 'high angle',
    'tracking', 'dolly', 'pan', 'tilt', 'zoom', 'static', 'handheld'
  ],
  colorPalette: [
    'warm tones', 'cool tones', 'blue', 'red', 'green', 'orange', 'purple',
    'monochrome', 'sepia', 'saturated', 'desaturated', 'high contrast'
  ]
};

export function extractContextFromScene(scene: SceneData): ExtractedContext {
  const fullText = `${scene.sceneIdea} ${scene.generatedPrompt?.mainPrompt || ''}`.toLowerCase();
  
  const extracted: ExtractedContext = {
    characters: [],
    locations: [],
    visualStyle: '',
    mood: scene.selectedEmotion || '',
    timeOfDay: '',
    cinematography: '',
    colorPalette: '',
    clothing: [],
    props: [],
    summary: scene.sceneIdea
  };

  // Extract different elements using pattern matching
  Object.entries(CONTEXT_PATTERNS).forEach(([category, patterns]) => {
    patterns.forEach(pattern => {
      if (fullText.includes(pattern)) {
        const contextValue = extractContextualPhrase(fullText, pattern);
        if (contextValue) {
          if (category === 'characters' || category === 'locations' || 
              category === 'clothing' || category === 'props') {
            (extracted[category as keyof Pick<ExtractedContext, 'characters' | 'locations' | 'clothing' | 'props'>] as string[]).push(contextValue);
          } else {
            extracted[category as keyof Omit<ExtractedContext, 'characters' | 'locations' | 'clothing' | 'props' | 'summary'>] = contextValue;
          }
        }
      }
    });
  });

  // Remove duplicates and clean up arrays
  extracted.characters = [...new Set(extracted.characters)];
  extracted.locations = [...new Set(extracted.locations)];
  extracted.clothing = [...new Set(extracted.clothing)];
  extracted.props = [...new Set(extracted.props)];

  return extracted;
}

function extractContextualPhrase(text: string, keyword: string): string {
  const index = text.indexOf(keyword);
  if (index === -1) return '';
  
  // Extract surrounding context (10 words before and after)
  const words = text.split(' ');
  const keywordIndex = words.findIndex(word => word.includes(keyword));
  
  if (keywordIndex === -1) return keyword;
  
  const start = Math.max(0, keywordIndex - 3);
  const end = Math.min(words.length, keywordIndex + 4);
  
  return words.slice(start, end).join(' ').trim();
}

export function buildEnhancedSceneContext(scenes: SceneData[]): string {
  if (scenes.length === 0) return '';

  const contexts = scenes.map(extractContextFromScene);
  const latestContext = contexts[contexts.length - 1];

  // Build rich context description
  let contextBuilder = `STORY CONTEXT:\n`;
  
  // Character consistency
  if (latestContext.characters.length > 0) {
    contextBuilder += `Characters: ${latestContext.characters.join(', ')}\n`;
  }
  
  // Location continuity
  if (latestContext.locations.length > 0) {
    contextBuilder += `Locations established: ${latestContext.locations.join(', ')}\n`;
  }
  
  // Visual style consistency
  if (latestContext.visualStyle) {
    contextBuilder += `Visual style: ${latestContext.visualStyle}\n`;
  }
  
  // Clothing consistency
  if (latestContext.clothing.length > 0) {
    contextBuilder += `Character clothing: ${latestContext.clothing.join(', ')}\n`;
  }
  
  // Props consistency
  if (latestContext.props.length > 0) {
    contextBuilder += `Important props: ${latestContext.props.join(', ')}\n`;
  }
  
  // Time and mood
  if (latestContext.timeOfDay) {
    contextBuilder += `Time context: ${latestContext.timeOfDay}\n`;
  }
  
  contextBuilder += `\nSCENE PROGRESSION:\n`;
  scenes.forEach((scene, index) => {
    contextBuilder += `Scene ${index + 1}: ${scene.sceneIdea}\n`;
    if (scene.generatedPrompt?.mainPrompt) {
      // Extract key visual elements from generated prompt
      const keyElements = extractKeyVisualElements(scene.generatedPrompt.mainPrompt);
      if (keyElements) {
        contextBuilder += `Key visuals: ${keyElements}\n`;
      }
    }
  });

  return contextBuilder;
}

function extractKeyVisualElements(prompt: string): string {
  // Extract the most important visual descriptors (first 50 words)
  const words = prompt.split(' ').slice(0, 50);
  return words.join(' ') + (words.length >= 50 ? '...' : '');
}

export function generateSceneSuggestions(contexts: ExtractedContext[]): string[] {
  if (contexts.length === 0) return getGenericSuggestions();

  const latestContext = contexts[contexts.length - 1];
  const suggestions: string[] = [];

  // Character-specific suggestions
  if (latestContext.characters.length > 0) {
    const character = latestContext.characters[0];
    suggestions.push(`Follow ${character} as they react to what just happened`);
    suggestions.push(`Show ${character} making a crucial decision`);
    suggestions.push(`${character} encounters an unexpected obstacle`);
  }

  // Location-specific suggestions
  if (latestContext.locations.length > 0) {
    const location = latestContext.locations[0];
    suggestions.push(`Pan to reveal more of the ${location}`);
    suggestions.push(`Someone new enters the ${location}`);
    suggestions.push(`The action moves from the ${location} to somewhere urgent`);
  }

  // Prop-driven suggestions
  if (latestContext.props.length > 0) {
    const prop = latestContext.props[0];
    suggestions.push(`The ${prop} becomes crucial to the story`);
    suggestions.push(`A close-up reveals something important about the ${prop}`);
  }

  // Mood-driven narrative suggestions
  const narrativeTwists = {
    'dramatic': [
      'The tension escalates with an unexpected reveal',
      'Stakes are raised as time runs out',
      'A shocking truth changes everything'
    ],
    'mysterious': [
      'A clue leads to more questions than answers',
      'Someone is watching from the shadows',
      'The mystery deepens with a new discovery'
    ],
    'romantic': [
      'A tender moment brings them closer',
      'Misunderstanding creates romantic tension',
      'A gesture reveals true feelings'
    ],
    'uplifting': [
      'Hope emerges from an unexpected source',
      'A breakthrough moment lifts spirits',
      'Unity forms in the face of challenge'
    ],
    'intense': [
      'The chase intensifies with higher stakes',
      'Split-second decisions determine fate',
      'Adrenaline peaks as time runs out'
    ],
    'suspenseful': [
      'Something moves in the shadows',
      'The calm before the storm',
      'An ominous discovery raises alarms'
    ],
    'serene': [
      'A peaceful moment of reflection',
      'Beauty is found in the quiet details',
      'Harmony emerges from chaos'
    ]
  };

  const moodSuggestions = narrativeTwists[latestContext.mood as keyof typeof narrativeTwists];
  if (moodSuggestions) {
    suggestions.push(...moodSuggestions);
  }

  // Time-specific suggestions
  if (latestContext.timeOfDay) {
    const timeSpecific = getTimeBasedSuggestions(latestContext.timeOfDay);
    suggestions.push(...timeSpecific);
  }

  // Ensure we have enough suggestions and they're unique
  const uniqueSuggestions = [...new Set(suggestions)];
  return uniqueSuggestions.slice(0, 4); // Return top 4 unique suggestions
}

function getGenericSuggestions(): string[] {
  return [
    'The perspective shifts to reveal new information',
    'A new character enters and changes the dynamic',
    'The focus moves to an important detail',
    'Time jumps forward to show the consequences'
  ];
}

function getTimeBasedSuggestions(timeOfDay: string): string[] {
  const timeMap: Record<string, string[]> = {
    'morning': ['The day takes an unexpected turn', 'Morning light reveals something hidden'],
    'afternoon': ['The midday heat intensifies the situation', 'Lunch hour brings an interruption'],
    'evening': ['As evening approaches, urgency grows', 'Golden hour light creates magic'],
    'night': ['Under cover of darkness, secrets emerge', 'The night brings danger'],
    'dawn': ['A new day brings new possibilities', 'First light reveals the truth'],
    'dusk': ['As day turns to night, everything changes', 'Twilight shadows hide mysteries']
  };

  return timeMap[timeOfDay.toLowerCase()] || [];
}