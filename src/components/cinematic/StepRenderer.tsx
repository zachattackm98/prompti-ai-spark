
import React from 'react';
import SceneStep from './SceneStep';
import PlatformStep from './PlatformStep';
import CameraControlsStep from './CameraControlsStep';
import LightingStep from './LightingStep';
import StyleStep from './StyleStep';
import { CameraSettings, LightingSettings } from './useCinematicForm';

interface StepRendererProps {
  currentStep: number;
  canUseFeature: (feature: string) => boolean;
  features: any;
  
  // Form state
  sceneIdea: string;
  setSceneIdea: (value: string) => void;
  selectedPlatform: string;
  setSelectedPlatform: (platform: string) => void;
  selectedEmotion: string;
  setSelectedEmotion: (emotion: string) => void;
  cameraSettings: CameraSettings;
  setCameraSettings: (settings: CameraSettings) => void;
  lightingSettings: LightingSettings;
  setLightingSettings: (settings: LightingSettings) => void;
  styleReference: string;
  setStyleReference: (value: string) => void;
  
  // Handlers
  handleNext: () => void;
  handlePrevious: () => void;
  handleGenerate: () => void;
  isLoading: boolean;
}

const StepRenderer: React.FC<StepRendererProps> = ({
  currentStep,
  canUseFeature,
  features,
  sceneIdea,
  setSceneIdea,
  selectedPlatform,
  setSelectedPlatform,
  selectedEmotion,
  setSelectedEmotion,
  cameraSettings,
  setCameraSettings,
  lightingSettings,
  setLightingSettings,
  styleReference,
  setStyleReference,
  handleNext,
  handlePrevious,
  handleGenerate,
  isLoading
}) => {
  let stepCounter = 1;
  
  if (currentStep === stepCounter) {
    return (
      <SceneStep
        sceneIdea={sceneIdea}
        setSceneIdea={setSceneIdea}
        onNext={handleNext}
      />
    );
  }
  stepCounter++;

  if (currentStep === stepCounter) {
    return (
      <PlatformStep
        selectedPlatform={selectedPlatform}
        setSelectedPlatform={setSelectedPlatform}
        selectedEmotion={selectedEmotion}
        setSelectedEmotion={setSelectedEmotion}
        onNext={handleNext}
        onPrevious={handlePrevious}
        availablePlatforms={features.platforms}
        availableEmotions={features.emotions}
      />
    );
  }
  stepCounter++;

  // Camera Controls Step (Creator+ only)
  if (canUseFeature('cameraControls')) {
    if (currentStep === stepCounter) {
      return (
        <CameraControlsStep
          cameraSettings={cameraSettings}
          setCameraSettings={setCameraSettings}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
      );
    }
    stepCounter++;
  }

  // Lighting Step (Creator+ only)
  if (canUseFeature('lightingOptions')) {
    if (currentStep === stepCounter) {
      return (
        <LightingStep
          lightingSettings={lightingSettings}
          setLightingSettings={setLightingSettings}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
      );
    }
    stepCounter++;
  }

  // Style Step (final step)
  if (currentStep === stepCounter) {
    return (
      <StyleStep
        styleReference={styleReference}
        setStyleReference={setStyleReference}
        onPrevious={handlePrevious}
        onGenerate={handleGenerate}
        isLoading={isLoading}
      />
    );
  }

  return null;
};

export default StepRenderer;
