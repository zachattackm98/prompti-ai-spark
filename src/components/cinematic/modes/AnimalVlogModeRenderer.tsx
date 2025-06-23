
import React from 'react';
import AnimalTypeStep from './steps/AnimalTypeStep';
import SceneDescriptionStep from './steps/SceneDescriptionStep';
import DialogueStep from './steps/DialogueStep';

interface AnimalVlogModeRendererProps {
  animalType: string;
  setAnimalType: (value: string) => void;
  sceneIdea: string;
  setSceneIdea: (value: string) => void;
  selectedVibe: string;
  setSelectedVibe: (value: string) => void;
  hasDialogue: boolean;
  setHasDialogue: (value: boolean) => void;
  dialogueContent: string;
  setDialogueContent: (value: string) => void;
  currentStep: number;
  onNext: () => void;
  onPrevious: () => void;
  handleGenerate: () => void;
  isLoading: boolean;
}

const AnimalVlogModeRenderer: React.FC<AnimalVlogModeRendererProps> = ({
  animalType,
  setAnimalType,
  sceneIdea,
  setSceneIdea,
  selectedVibe,
  setSelectedVibe,
  hasDialogue,
  setHasDialogue,
  dialogueContent,
  setDialogueContent,
  currentStep,
  onNext,
  onPrevious,
  handleGenerate,
  isLoading
}) => {
  switch (currentStep) {
    case 1:
      return (
        <AnimalTypeStep
          animalType={animalType}
          setAnimalType={setAnimalType}
          onNext={onNext}
        />
      );
      
    case 2:
      return (
        <SceneDescriptionStep
          animalType={animalType}
          sceneIdea={sceneIdea}
          setSceneIdea={setSceneIdea}
          selectedVibe={selectedVibe}
          setSelectedVibe={setSelectedVibe}
          onNext={onNext}
          onPrevious={onPrevious}
        />
      );
      
    case 3:
      return (
        <DialogueStep
          hasDialogue={hasDialogue}
          setHasDialogue={setHasDialogue}
          dialogueContent={dialogueContent}
          setDialogueContent={setDialogueContent}
          onPrevious={onPrevious}
          handleGenerate={handleGenerate}
          isLoading={isLoading}
        />
      );
      
    default:
      return null;
  }
};

export default AnimalVlogModeRenderer;
