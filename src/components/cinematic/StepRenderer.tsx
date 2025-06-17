
import React from 'react';
import SceneStep from './SceneStep';
import PlatformStep from './PlatformStep';
import DialogStep from './DialogStep';
import SoundStep from './SoundStep';
import CameraControlsStep from './CameraControlsStep';
import LightingStep from './LightingStep';
import StyleStep from './StyleStep';
import { CameraSettings, LightingSettings, DialogSettings, SoundSettings } from './useCinematicForm';

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
  handleNext,
  handlePrevious,
  handleGenerate,
  isLoading
}) => {
  let stepCounter = 1;
  
  if (currentStep === stepCounter) {
    return (
      <div id={`step-content-${stepCounter}`}>
        <SceneStep
          sceneIdea={sceneIdea}
          setSceneIdea={setSceneIdea}
          onNext={handleNext}
        />
      </div>
    );
  }
  stepCounter++;

  if (currentStep === stepCounter) {
    return (
      <div id={`step-content-${stepCounter}`}>
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
      </div>
    );
  }
  stepCounter++;

  // Dialog Step (All Tiers)
  if (currentStep === stepCounter) {
    return (
      <div id={`step-content-${stepCounter}`}>
        <DialogStep
          dialogSettings={dialogSettings}
          setDialogSettings={setDialogSettings}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
      </div>
    );
  }
  stepCounter++;

  // Sound Step (All Tiers)
  if (currentStep === stepCounter) {
    return (
      <div id={`step-content-${stepCounter}`}>
        <SoundStep
          soundSettings={soundSettings}
          setSoundSettings={setSoundSettings}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
      </div>
    );
  }
  stepCounter++;

  // Camera Controls Step (Creator+ only)
  if (canUseFeature('cameraControls')) {
    if (currentStep === stepCounter) {
      return (
        <div id={`step-content-${stepCounter}`}>
          <CameraControlsStep
            cameraSettings={cameraSettings}
            setCameraSettings={setCameraSettings}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        </div>
      );
    }
    stepCounter++;
  }

  // Lighting Step (Creator+ only)
  if (canUseFeature('lightingOptions')) {
    if (currentStep === stepCounter) {
      return (
        <div id={`step-content-${stepCounter}`}>
          <LightingStep
            lightingSettings={lightingSettings}
            setLightingSettings={setLightingSettings}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        </div>
      );
    }
    stepCounter++;
  }

  // Style Step (final step)
  if (currentStep === stepCounter) {
    return (
      <div id={`step-content-${stepCounter}`}>
        <StyleStep
          styleReference={styleReference}
          setStyleReference={setStyleReference}
          onPrevious={handlePrevious}
          onGenerate={handleGenerate}
          isLoading={isLoading}
        />
      </div>
    );
  }

  return null;
};

export default StepRenderer;
