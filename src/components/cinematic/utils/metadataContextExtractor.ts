import type { SceneData, SceneMetadata } from '../hooks/types';

export interface EnhancedSceneContext {
  characters: {
    primary: string[];
    descriptions: string[];
  };
  locations: {
    current: string;
    previous: string[];
  };
  timeFlow: {
    currentTimeOfDay: string;
    progression: string[];
  };
  visualConsistency: {
    style: string;
    colorPalettes: string[];
    lightingSetups: string[];
    cameraWork: string[];
  };
  storyProgression: {
    currentMood: string;
    keyElements: string[];
    narrative: string[];
  };
  props: {
    recurring: string[];
    sceneSpecific: string[];
  };
}

export function extractEnhancedContext(scenes: SceneData[]): EnhancedSceneContext {
  if (scenes.length === 0) {
    return getDefaultContext();
  }

  const allMetadata = scenes
    .map(scene => scene.generatedPrompt?.metadata)
    .filter(Boolean) as SceneMetadata[];

  if (allMetadata.length === 0) {
    return getDefaultContext();
  }

  // Extract characters with consistency tracking
  const allCharacters = allMetadata.flatMap(m => m.characters);
  const characterCounts = allCharacters.reduce((acc, char) => {
    acc[char] = (acc[char] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const primaryCharacters = Object.entries(characterCounts)
    .filter(([_, count]) => count > 1 || allMetadata.length === 1)
    .map(([char]) => char)
    .slice(0, 3);

  // Extract locations
  const allLocations = allMetadata.map(m => m.location);
  const currentLocation = allLocations[allLocations.length - 1];
  const previousLocations = [...new Set(allLocations.slice(0, -1))];

  // Time progression
  const timeProgression = allMetadata.map(m => m.timeOfDay);
  const currentTimeOfDay = timeProgression[timeProgression.length - 1];

  // Visual consistency elements
  const allColorPalettes = allMetadata.flatMap(m => m.colorPalette);
  const uniqueColorPalettes = [...new Set(allColorPalettes)];
  
  const allLightingSetups = allMetadata.map(m => m.lighting);
  const uniqueLightingSetups = [...new Set(allLightingSetups)];
  
  const allCameraWork = allMetadata.map(m => m.cameraWork);
  
  const visualStyles = allMetadata.map(m => m.visualStyle);
  const dominantStyle = getMostFrequent(visualStyles);

  // Story elements
  const allStoryElements = allMetadata.flatMap(m => m.storyElements);
  const uniqueStoryElements = [...new Set(allStoryElements)];
  
  const allMoods = allMetadata.map(m => m.mood);
  const currentMood = allMoods[allMoods.length - 1];

  // Props analysis
  const allProps = allMetadata.flatMap(m => m.keyProps);
  const propCounts = allProps.reduce((acc, prop) => {
    acc[prop] = (acc[prop] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const recurringProps = Object.entries(propCounts)
    .filter(([_, count]) => count > 1)
    .map(([prop]) => prop);
    
  const latestMetadata = allMetadata[allMetadata.length - 1];
  const sceneSpecificProps = latestMetadata.keyProps.filter(
    prop => !recurringProps.includes(prop)
  );

  return {
    characters: {
      primary: primaryCharacters,
      descriptions: allCharacters.slice(0, 5)
    },
    locations: {
      current: currentLocation,
      previous: previousLocations
    },
    timeFlow: {
      currentTimeOfDay,
      progression: timeProgression
    },
    visualConsistency: {
      style: dominantStyle,
      colorPalettes: uniqueColorPalettes.slice(0, 5),
      lightingSetups: uniqueLightingSetups.slice(0, 3),
      cameraWork: allCameraWork.slice(-2) // Last two camera setups
    },
    storyProgression: {
      currentMood,
      keyElements: uniqueStoryElements.slice(0, 6),
      narrative: allStoryElements.slice(-3) // Last 3 story elements
    },
    props: {
      recurring: recurringProps,
      sceneSpecific: sceneSpecificProps
    }
  };
}

export function buildStructuredSceneContext(context: EnhancedSceneContext): string {
  let contextDescription = "";

  // Character continuity
  if (context.characters.primary.length > 0) {
    contextDescription += `CHARACTERS TO MAINTAIN:\n`;
    context.characters.primary.forEach(char => {
      contextDescription += `- ${char}: Keep EXACT appearance, clothing, and mannerisms\n`;
    });
    contextDescription += "\n";
  }

  // Location context
  contextDescription += `LOCATION CONTEXT:\n`;
  contextDescription += `- Current setting: ${context.locations.current}\n`;
  if (context.locations.previous.length > 0) {
    contextDescription += `- Previous locations: ${context.locations.previous.join(', ')}\n`;
  }
  contextDescription += "\n";

  // Time and visual consistency
  contextDescription += `VISUAL CONSISTENCY:\n`;
  contextDescription += `- Time of day: ${context.timeFlow.currentTimeOfDay}\n`;
  contextDescription += `- Visual style: ${context.visualConsistency.style}\n`;
  
  if (context.visualConsistency.colorPalettes.length > 0) {
    contextDescription += `- Color palette: ${context.visualConsistency.colorPalettes.join(', ')}\n`;
  }
  
  if (context.visualConsistency.lightingSetups.length > 0) {
    contextDescription += `- Lighting approach: ${context.visualConsistency.lightingSetups.join(' transitioning to ')}\n`;
  }
  
  if (context.visualConsistency.cameraWork.length > 0) {
    contextDescription += `- Camera style: ${context.visualConsistency.cameraWork.join(' progressing to ')}\n`;
  }
  contextDescription += "\n";

  // Story progression
  contextDescription += `STORY CONTEXT:\n`;
  contextDescription += `- Current mood: ${context.storyProgression.currentMood}\n`;
  
  if (context.storyProgression.narrative.length > 0) {
    contextDescription += `- Recent story beats: ${context.storyProgression.narrative.join(' → ')}\n`;
  }
  
  if (context.storyProgression.keyElements.length > 0) {
    contextDescription += `- Key story elements: ${context.storyProgression.keyElements.join(', ')}\n`;
  }
  contextDescription += "\n";

  // Props continuity
  if (context.props.recurring.length > 0) {
    contextDescription += `PROPS TO MAINTAIN:\n`;
    context.props.recurring.forEach(prop => {
      contextDescription += `- ${prop}: Keep consistent appearance and placement\n`;
    });
    contextDescription += "\n";
  }

  return contextDescription;
}

export function generateMetadataBasedSuggestions(context: EnhancedSceneContext): string[] {
  const suggestions: string[] = [];

  // Character-driven suggestions
  if (context.characters.primary.length > 0) {
    const mainChar = context.characters.primary[0];
    suggestions.push(
      `${mainChar} reacts to the previous scene's events`,
      `Close-up of ${mainChar} showing emotional response`,
      `${mainChar} moves to a new area within ${context.locations.current}`
    );
  }

  // Location-based suggestions
  suggestions.push(
    `Wide establishing shot of ${context.locations.current}`,
    `${context.locations.current} from a different angle revealing new details`,
    `Transition within ${context.locations.current} to show passage of time`
  );

  // Mood and story progression
  const moodActions = {
    dramatic: ['tension escalates', 'conflict emerges', 'revelation unfolds'],
    romantic: ['intimate moment develops', 'connection deepens', 'tender exchange'],
    suspenseful: ['mystery deepens', 'danger approaches', 'clues are discovered'],
    epic: ['scale expands', 'stakes rise', 'heroic moment emerges'],
    serene: ['peaceful reflection', 'calm contemplation', 'gentle transition']
  };

  const currentMoodActions = moodActions[context.storyProgression.currentMood as keyof typeof moodActions] || ['story continues', 'scene develops', 'narrative progresses'];
  
  currentMoodActions.forEach(action => {
    suggestions.push(`The ${action} while maintaining ${context.visualConsistency.style} visual style`);
  });

  // Props-based suggestions
  if (context.props.recurring.length > 0) {
    const mainProp = context.props.recurring[0];
    suggestions.push(
      `${mainProp} becomes central to the scene's action`,
      `Camera focuses on ${mainProp} revealing its importance`
    );
  }

  return suggestions.slice(0, 8); // Return top 8 suggestions
}

function getMostFrequent<T>(items: T[]): T {
  const counts = items.reduce((acc, item) => {
    acc[String(item)] = (acc[String(item)] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const mostFrequent = Object.entries(counts).reduce((a, b) => 
    counts[a[0]] > counts[b[0]] ? a : b
  );
  
  return items.find(item => String(item) === mostFrequent[0]) || items[0];
}

function getDefaultContext(): EnhancedSceneContext {
  return {
    characters: {
      primary: [],
      descriptions: []
    },
    locations: {
      current: "Unknown location",
      previous: []
    },
    timeFlow: {
      currentTimeOfDay: "day",
      progression: []
    },
    visualConsistency: {
      style: "cinematic",
      colorPalettes: [],
      lightingSetups: [],
      cameraWork: []
    },
    storyProgression: {
      currentMood: "neutral",
      keyElements: [],
      narrative: []
    },
    props: {
      recurring: [],
      sceneSpecific: []
    }
  };
}