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

  // Enhanced character-driven suggestions with emotion-specific actions
  if (latestContext.characters.length > 0) {
    const character = latestContext.characters[0].split(' ')[0]; // Use first name
    const emotionActions = getEmotionSpecificActions(latestContext.mood, character);
    suggestions.push(...emotionActions);
  }

  // Smart location-based progression
  if (latestContext.locations.length > 0) {
    const location = latestContext.locations[0];
    const locationProgression = getLocationProgressions(location, latestContext.mood);
    suggestions.push(...locationProgression);
  }

  // Cinematic technique suggestions
  const cinematicSuggestions = getCinematographySuggestions(latestContext);
  suggestions.push(...cinematicSuggestions);

  // Narrative structure suggestions based on story beats
  const narrativeBeats = getStoryBeatSuggestions(latestContext);
  suggestions.push(...narrativeBeats);

  // Prop and detail-driven micro-stories
  if (latestContext.props.length > 0) {
    const propSuggestions = getPropDrivenSuggestions(latestContext.props, latestContext.mood);
    suggestions.push(...propSuggestions);
  }

  // Time-sensitive progressions
  if (latestContext.timeOfDay) {
    const timeProgression = getTimeProgressions(latestContext.timeOfDay, latestContext.mood);
    suggestions.push(...timeProgression);
  }

  // Filter, rank, and ensure diversity
  const scoredSuggestions = rankSuggestionsByRelevance(suggestions, latestContext);
  const diverseSuggestions = ensureSuggestionDiversity(scoredSuggestions);
  
  return diverseSuggestions.slice(0, 5); // Return top 5 diverse suggestions
}

function getEmotionSpecificActions(mood: string, character: string): string[] {
  const actionMap: Record<string, string[]> = {
    'dramatic': [
      `${character} discovers a hidden truth that changes everything`,
      `${character} faces an impossible choice with no good options`,
      `${character} confronts their deepest fear head-on`
    ],
    'mysterious': [
      `${character} notices subtle clues others have missed`,
      `${character} follows a mysterious figure into the unknown`,
      `${character} uncovers a secret that raises new questions`
    ],
    'romantic': [
      `${character} has a vulnerable moment revealing their true feelings`,
      `${character} creates a surprise that shows their thoughtfulness`,
      `${character} stands up for someone they care about`
    ],
    'uplifting': [
      `${character} inspires others through an act of kindness`,
      `${character} achieves a breakthrough after perseverance`,
      `${character} brings people together despite differences`
    ],
    'intense': [
      `${character} races against time to prevent disaster`,
      `${character} makes a split-second decision under pressure`,
      `${character} pushes their limits beyond what seems possible`
    ],
    'suspenseful': [
      `${character} realizes they're being watched or followed`,
      `${character} discovers something is terribly wrong`,
      `${character} must stay quiet while danger passes nearby`
    ],
    'serene': [
      `${character} finds peace in a moment of quiet reflection`,
      `${character} appreciates the beauty in simple details`,
      `${character} shares a gentle, meaningful connection`
    ]
  };

  return actionMap[mood] || [`${character} takes action that moves the story forward`];
}

function getLocationProgressions(location: string, mood: string): string[] {
  const baseProgression = [
    `The camera reveals a hidden aspect of the ${location}`,
    `The atmosphere in the ${location} shifts dramatically`,
    `A new arrival transforms the energy of the ${location}`
  ];

  const moodSpecific: Record<string, string[]> = {
    'mysterious': [`Shadows in the ${location} hide important secrets`],
    'dramatic': [`The ${location} becomes the center of conflict`],
    'intense': [`Escape from the ${location} becomes urgent`],
    'romantic': [`The ${location} becomes intimate and meaningful`],
    'suspenseful': [`Something ominous approaches the ${location}`]
  };

  return [...baseProgression.slice(0, 1), ...(moodSpecific[mood] || [])];
}

function getCinematographySuggestions(context: ExtractedContext): string[] {
  const techniques = [
    "A close-up reveals crucial emotional details",
    "The perspective shifts to show a different angle",
    "A wide shot establishes new spatial relationships",
    "Slow motion emphasizes a pivotal moment"
  ];

  // Add mood-specific cinematography
  if (context.mood === 'dramatic') {
    techniques.push("Dynamic camera movement builds tension");
  } else if (context.mood === 'serene') {
    techniques.push("Gentle camera movement creates tranquility");
  } else if (context.mood === 'intense') {
    techniques.push("Rapid cuts escalate the pace");
  }

  return techniques.slice(0, 2);
}

function getStoryBeatSuggestions(context: ExtractedContext): string[] {
  const universalBeats = [
    "An unexpected complication changes the plan",
    "A moment of discovery that reframes everything",
    "The stakes are raised with new information",
    "A character's motivation is revealed through action"
  ];

  return universalBeats.slice(0, 2);
}

function getPropDrivenSuggestions(props: string[], mood: string): string[] {
  if (props.length === 0) return [];
  
  const prop = props[0];
  const suggestions = [
    `The ${prop} reveals its true importance to the story`,
    `A detail about the ${prop} triggers a memory or realization`
  ];

  if (mood === 'mysterious') {
    suggestions.push(`The ${prop} holds a secret nobody expected`);
  } else if (mood === 'dramatic') {
    suggestions.push(`The ${prop} becomes a catalyst for conflict`);
  }

  return suggestions.slice(0, 1);
}

function getTimeProgressions(timeOfDay: string, mood: string): string[] {
  const timeMap: Record<string, string[]> = {
    'morning': ['The fresh start of day brings new energy and possibility'],
    'afternoon': ['The intensity of midday creates urgency'],
    'evening': ['As day fades, the mood becomes more intimate'],
    'night': ['Darkness conceals intentions and heightens mystery'],
    'dawn': ['First light reveals what darkness has hidden'],
    'dusk': ['The transition between day and night mirrors inner change']
  };

  const base = timeMap[timeOfDay.toLowerCase()] || [];
  return base.slice(0, 1);
}

function rankSuggestionsByRelevance(suggestions: string[], context: ExtractedContext): string[] {
  // Score suggestions based on context richness
  return suggestions.map(suggestion => {
    let score = 0;
    
    // Higher score for character-specific suggestions
    if (context.characters.length > 0 && suggestion.includes(context.characters[0])) {
      score += 3;
    }
    
    // Higher score for location-specific suggestions
    if (context.locations.length > 0 && suggestion.includes(context.locations[0])) {
      score += 2;
    }
    
    // Higher score for mood alignment
    if (suggestion.toLowerCase().includes(context.mood.toLowerCase())) {
      score += 2;
    }
    
    // Prefer action-oriented suggestions
    if (suggestion.includes('discovers') || suggestion.includes('realizes') || 
        suggestion.includes('faces') || suggestion.includes('creates')) {
      score += 1;
    }
    
    return { suggestion, score };
  })
  .sort((a, b) => b.score - a.score)
  .map(item => item.suggestion);
}

function ensureSuggestionDiversity(suggestions: string[]): string[] {
  const diverse: string[] = [];
  const categories = new Set<string>();
  
  for (const suggestion of suggestions) {
    let category = 'general';
    
    if (suggestion.includes('discovers') || suggestion.includes('realizes')) {
      category = 'discovery';
    } else if (suggestion.includes('faces') || suggestion.includes('confronts')) {
      category = 'conflict';
    } else if (suggestion.includes('reveals') || suggestion.includes('close-up')) {
      category = 'revelation';
    } else if (suggestion.includes('camera') || suggestion.includes('perspective')) {
      category = 'cinematic';
    }
    
    if (!categories.has(category) || diverse.length < 3) {
      diverse.push(suggestion);
      categories.add(category);
    }
    
    if (diverse.length >= 5) break;
  }
  
  return diverse;
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