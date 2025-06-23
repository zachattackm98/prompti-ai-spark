
import React from 'react';
import InstantModeRenderer from './modes/InstantModeRenderer';
import AnimalVlogModeRenderer from './modes/AnimalVlogModeRenderer';
import CreativeModeContent from './CreativeModeContent';
import { CinematicMode } from './constants/modes';
import { CameraSettings, LightingSettings, DialogSettings, SoundSettings } from './useCinematicForm';

interface ModeContentRendererProps {
  selectedMode: CinematicMode;
  
  // Mode-specific props
  animalType: string;
  setAnimalType: (value: string) => void;
  selectedVibe: string;
  setSelectedVibe: (value: string) => void;
  hasDialogue: boolean;
  setHasDialogue: (value: boolean) => void;
  dialogueContent: string;
  setDialogueContent: (value: string) => void;
  detectedPlatform: string;
  
  // Multi-scene props
  isMultiScene: boolean;
  currentProject: any;
  handleSceneSelect: (sceneIndex: number) => void;
  handleAddScene: () => void;
  canAddMoreScenes: boolean;
  
  // Step props
  currentStep: number;
  totalSteps: number;
  canUseFeature: (feature: string) => boolean;
  features: any;
  
  // Form state props
  sceneIdea: string;
  setSceneIdea: (value: string) => void;
  selectedPlatform: string;
  setSelectedPlatform: (platform: string) => void;
  selectedEmotion: string;
  setSelectedEmotion: (emotion: string) => void;
  dialogSettings: DialogSettings;
  setDialogSettings: (settings: DialogSettings) => void;
  soundSettings: SoundSettings;
  setSoundSettings: (settings: SoundSettings) => void;
  cameraSettings: CameraSettings;
  setCameraSettings: (settings: CameraSettings) => void;
  lightingSettings: LightingSettings;
  setLightingSettings: (settings: LightingSettings) => void;
  styleReference: string;
  setStyleReference: (value: string) => void;
  
  // Action props
  handleNext: () => void;
  handlePrevious: () => void;
  handleGenerate: () => void;
  isLoading: boolean;
  setShowAuthDialog?: (show: boolean) => void;
}

const ModeContentRenderer: React.FC<ModeContentRendererProps> = ({
  selectedMode,
  animalType,
  setAnimalType,
  selectedVibe,
  setSelectedVibe,
  hasDialogue,
  setHasDialogue,
  dialogueContent,
  setDialogueContent,
  detectedPlatform,
  sceneIdea,
  setSceneIdea,
  handleGenerate,
  isLoading,
  currentStep,
  handleNext,
  handlePrevious,
  // Creative mode props
  isMultiScene,
  currentProject,
  handleSceneSelect,
  handleAddScene,
  canAddMoreScenes,
  totalSteps,
  canUseFeature,
  features,
  selectedPlatform,
  setSelectedPlatform,
  selectedEmotion,
  setSelectedEmotion,
  dialogSettings,
  setDialogSettings,
  soundSettings,
  setSoundSettings,
  cameraSettings,
  setCameraSettings,
  lightingSettings,
  setLightingSettings,
  styleReference,
  setStyleReference,
  setShowAuthDialog
}) => {
  switch (selectedMode) {
    case 'instant':
      return (
        <InstantModeRenderer
          sceneIdea={sceneIdea}
          setSceneIdea={setSceneIdea}
          handleGenerate={handleGenerate}
          isLoading={isLoading}
          detectedPlatform={detectedPlatform}
        />
      );
      
    case 'animal-vlog':
      return (
        <AnimalVlogModeRenderer
          animalType={animalType}
          setAnimalType={setAnimalType}
          sceneIdea={sceneIdea}
          setSceneIdea={setSceneIdea}
          selectedVibe={selectedVibe}
          setSelectedVibe={setSelectedVibe}
          hasDialogue={hasDialogue}
          setHasDialogue={setHasDialogue}
          dialogueContent={dialogueContent}
          setDialogueContent={setDialogueContent}
          currentStep={currentStep}
          onNext={handleNext}
          onPrevious={handlePrevious}
          handleGenerate={handleGenerate}
          isLoading={isLoading}
        />
      );
      
    case 'creative':
      return (
        <CreativeModeContent
          isMultiScene={isMultiScene}
          currentProject={currentProject}
          handleSceneSelect={handleSceneSelect}
          handleAddScene={handleAddScene}
          canAddMoreScenes={canAddMoreScenes}
          currentStep={currentStep}
          totalSteps={totalSteps}
          canUseFeature={canUseFeature}
          features={features}
          sceneIdea={sceneIdea}
          setSceneIdea={setSceneIdea}
          selectedPlatform={selectedPlatform}
          setSelectedPlatform={setSelectedPlatform}
          selectedEmotion={selectedEmotion}
          setSelectedEmotion={setSelectedEmotion}
          dialogSettings={dialogSettings}
          setDialogSettings={setDialogSettings}
          soundSettings={soundSettings}
          setSoundSettings={setSoundSettings}
          cameraSettings={cameraSettings}
          setCameraSettings={setCameraSettings}
          lightingSettings={lightingSettings}
          setLightingSettings={setLightingSettings}
          styleReference={styleReference}
          setStyleReference={setStyleReference}
          handleNext={handleNext}
          handlePrevious={handlePrevious}
          handleGenerate={handleGenerate}
          isLoading={isLoading}
          setShowAuthDialog={setShowAuthDialog}
        />
      );
      
    default:
      return null;
  }
};

export default ModeContentRenderer;
