
import React from 'react';
import { Card } from '@/components/ui/card';
import StepIndicator from './StepIndicator';
import StepRenderer from './StepRenderer';
import { useIsMobile } from '@/hooks/use-mobile';
import { CameraSettings, LightingSettings, DialogSettings, SoundSettings, GeneratedPrompt } from './useCinematicForm';

interface CinematicFormContentProps {
  currentStep: number;
  totalSteps: number;
  canUseFeature: (feature: string) => boolean;
  features: any;
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
  handleNext: () => void;
  handlePrevious: () => void;
  handleGenerate: () => void;
  handleGenerateNew: () => void;
  handleContinueScene: () => void;
  onCopyToClipboard: (text: string) => void;
  onDownloadPrompt: () => void;
  isLoading: boolean;
  isContinuingScene: boolean;
  clearContinuationMode: () => void;
  setShowAuthDialog?: (show: boolean) => void;
}

const CinematicFormContent: React.FC<CinematicFormContentProps> = ({
  currentStep,
  totalSteps,
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
  handleContinueScene,
  onCopyToClipboard,
  onDownloadPrompt,
  isLoading,
  isContinuingScene,
  clearContinuationMode,
  setShowAuthDialog
}) => {
  const isMobile = useIsMobile();

  return (
    <div id="cinematic-form" className="w-full">
      <Card className={`
        bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-purple-900/20 
        border border-purple-500/20 backdrop-blur-sm overflow-hidden
        ${isMobile ? 'mx-2' : ''}
      `}>
        <div id="form-content" className={`space-y-6 ${isMobile ? 'p-4' : 'p-6'}`}>
          {/* Step Indicator */}
          <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />

          {/* Step Content */}
          <div className="min-h-[400px] flex flex-col justify-center">
            <StepRenderer
              currentStep={currentStep}
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
              generatedPrompt={generatedPrompt}
              handleNext={handleNext}
              handlePrevious={handlePrevious}
              handleGenerate={handleGenerate}
              handleGenerateNew={handleGenerateNew}
              handleContinueScene={handleContinueScene}
              onCopyToClipboard={onCopyToClipboard}
              onDownloadPrompt={onDownloadPrompt}
              isLoading={isLoading}
              isContinuingScene={isContinuingScene}
              clearContinuationMode={clearContinuationMode}
              setShowAuthDialog={setShowAuthDialog}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CinematicFormContent;
