
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
  setShowAuthDialog?: (show: boolean) => void;
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
  isLoading,
  setShowAuthDialog
}) => {
  // Step 1: Scene
  if (currentStep === 1) {
    return (
      <div id="step-content-1" className="w-full max-w-full overflow-hidden">
        <SceneStep
          sceneIdea={sceneIdea}
          setSceneIdea={setSceneIdea}
          onNext={handleNext}
          setShowAuthDialog={setShowAuthDialog}
        />
      </div>
    );
  }

  // Step 2: Platform
  if (currentStep === 2) {
    return (
      <div id="step-content-2" className="w-full max-w-full overflow-hidden">
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

  // Step 3: Dialog
  if (currentStep === 3) {
    return (
      <div id="step-content-3" className="w-full max-w-full overflow-hidden">
        <DialogStep
          dialogSettings={dialogSettings}
          setDialogSettings={setDialogSettings}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
      </div>
    );
  }

  // Step 4: Sound
  if (currentStep === 4) {
    return (
      <div id="step-content-4" className="w-full max-w-full overflow-hidden">
        <SoundStep
          soundSettings={soundSettings}
          setSoundSettings={setSoundSettings}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
      </div>
    );
  }

  // Step 5: Camera Controls
  if (currentStep === 5) {
    return (
      <div id="step-content-5" className="w-full max-w-full overflow-hidden">
        <CameraControlsStep
          cameraSettings={cameraSettings}
          setCameraSettings={setCameraSettings}
          onNext={handleNext}
          onPrevious={handlePrevious}
          showUpgrade={false}
        />
      </div>
    );
  }

  // Step 6: Lighting
  if (currentStep === 6) {
    return (
      <div id="step-content-6" className="w-full max-w-full overflow-hidden">
        <LightingStep
          lightingSettings={lightingSettings}
          setLightingSettings={setLightingSettings}
          onNext={handleNext}
          onPrevious={handlePrevious}
          showUpgrade={false}
        />
      </div>
    );
  }

  // Step 7: Style
  if (currentStep === 7) {
    return (
      <div id="step-content-7" className="w-full max-w-full overflow-hidden">
        <StyleStep
          styleReference={styleReference}
          setStyleReference={setStyleReference}
          onPrevious={handlePrevious}
          onGenerate={handleGenerate}
          isLoading={isLoading}
          showUpgrade={false}
        />
      </div>
    );
  }

  return null;
};

export default StepRenderer;
