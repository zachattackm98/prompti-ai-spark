import { useState } from 'react';
import { CinematicMode } from '../constants/modes';

export const useCinematicModes = () => {
  // Mode state
  const [selectedMode, setSelectedMode] = useState<CinematicMode>('creative');
  
  // Mode-specific state
  // Animal Vlog Mode
  const [animalType, setAnimalType] = useState('');
  const [selectedVibe, setSelectedVibe] = useState('');
  const [hasDialogue, setHasDialogue] = useState(false);
  const [dialogueContent, setDialogueContent] = useState('');
  
  // Instant Mode
  const [detectedPlatform, setDetectedPlatform] = useState('');

  const resetModeSpecificState = () => {
    console.log('useCinematicModes: Resetting mode-specific state');
    
    // Reset mode-specific fields but keep core form fields
    setAnimalType('');
    setSelectedVibe('');
    setHasDialogue(false);
    setDialogueContent('');
    setDetectedPlatform('');
  };

  // Determine totalSteps based on mode
  const getTotalSteps = () => {
    switch (selectedMode) {
      case 'instant':
        return 1;
      case 'animal-vlog':
        return 3;
      case 'creative':
        return 7;
      default:
        return 7;
    }
  };

  return {
    // Mode state
    selectedMode,
    setSelectedMode,
    resetModeSpecificState,
    getTotalSteps,
    
    // Mode-specific state
    animalType,
    setAnimalType,
    selectedVibe,
    setSelectedVibe,
    hasDialogue,
    setHasDialogue,
    dialogueContent,
    setDialogueContent,
    detectedPlatform,
    setDetectedPlatform
  };
};
