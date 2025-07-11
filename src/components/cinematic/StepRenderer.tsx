
import React from 'react';
import SceneStep from './SceneStep';
import PlatformStep from './PlatformStep';
import DialogStep from './DialogStep';
import SoundStep from './SoundStep';
import CameraControlsStep from './CameraControlsStep';
import LightingStep from './LightingStep';
import StyleStep from './StyleStep';
import GeneratedPromptDisplay from './GeneratedPromptDisplay';
import { CameraSettings, LightingSettings, DialogSettings, SoundSettings, GeneratedPrompt } from './useCinematicForm';

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
  generatedPrompt: GeneratedPrompt | null;
  
  // Handlers
  handleNext: () => void;
  handlePrevious: () => void;
  handleGenerate: () => void;
  handleGenerateNew: () => void;
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
  generatedPrompt,
  handleNext,
  handlePrevious,
  handleGenerate,
  handleGenerateNew,
  isLoading,
  setShowAuthDialog
}) => {
  const renderCurrentStep = () => {
    // Step 1: Scene
    if (currentStep === 1) {
      return (
        <div id="step-content-1">
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
        <div id="step-content-2">
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
        <div id="step-content-3">
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
        <div id="step-content-4">
          <SoundStep
            soundSettings={soundSettings}
            setSoundSettings={setSoundSettings}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        </div>
      );
    }

    // Step 5: Camera Controls (now fully available to all users)
    if (currentStep === 5) {
      return (
        <div id="step-content-5">
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

    // Step 6: Lighting (now fully available to all users)
    if (currentStep === 6) {
      return (
        <div id="step-content-6">
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

    // Step 7: Style (now fully available to all users)
    if (currentStep === 7) {
      return (
        <div id="step-content-7">
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

  return (
    <div className="space-y-6">
      {/* Show generated prompt at the top if it exists */}
      {generatedPrompt && (
        <GeneratedPromptDisplay
          generatedPrompt={generatedPrompt}
          onCopyToClipboard={(text) => {
            navigator.clipboard.writeText(text);
          }}
          onDownloadPrompt={() => {
            const blob = new Blob([`${generatedPrompt.mainPrompt}\n\n${generatedPrompt.technicalSpecs}\n\n${generatedPrompt.styleNotes}`], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'cinematic-prompt.txt';
            a.click();
            URL.revokeObjectURL(url);
          }}
          onGenerateNew={handleGenerateNew}
        />
      )}
      
      {/* Always show the current form step */}
      {renderCurrentStep()}
    </div>
  );
};

export default StepRenderer;
