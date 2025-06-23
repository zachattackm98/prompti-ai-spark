
import React, { createContext, useContext } from 'react';
import { CameraSettings, LightingSettings, DialogSettings, SoundSettings } from './useCinematicForm';

interface CinematicFormContextType {
  // Mode state
  selectedMode: string;
  setSelectedMode: (mode: string) => void;
  resetModeSpecificState: () => void;
  
  // Mode-specific state
  animalType: string;
  setAnimalType: (value: string) => void;
  selectedVibe: string;
  setSelectedVibe: (value: string) => void;
  hasDialogue: boolean;
  setHasDialogue: (value: boolean) => void;
  dialogueContent: string;
  setDialogueContent: (value: string) => void;
  detectedPlatform: string;
  setDetectedPlatform: (value: string) => void;
  
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
  
  // Generated prompt and actions
  generatedPrompt: any;
  handleGenerateNew: () => void;
  handleContinueScene: (projectTitle: string, nextSceneIdea: string) => void;
  user: any;
  subscription: any;
}

const CinematicFormContext = createContext<CinematicFormContextType | undefined>(undefined);

export const useCinematicFormContext = () => {
  const context = useContext(CinematicFormContext);
  if (!context) {
    throw new Error('useCinematicFormContext must be used within CinematicFormProvider');
  }
  return context;
};

interface CinematicFormProviderProps {
  children: React.ReactNode;
  value: CinematicFormContextType;
}

export const CinematicFormProvider: React.FC<CinematicFormProviderProps> = ({ children, value }) => {
  return (
    <CinematicFormContext.Provider value={value}>
      {children}
    </CinematicFormContext.Provider>
  );
};
