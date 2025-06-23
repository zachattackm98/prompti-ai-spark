
import React from 'react';
import { Card } from '@/components/ui/card';
import StepIndicator from './StepIndicator';
import StepRenderer from './StepRenderer';
import SceneSelector from './SceneSelector';
import { useIsMobile } from '@/hooks/use-mobile';
import { CameraSettings, LightingSettings, DialogSettings, SoundSettings } from './useCinematicForm';

interface CreativeModeContentProps {
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

const CreativeModeContent: React.FC<CreativeModeContentProps> = ({
  isMultiScene,
  currentProject,
  handleSceneSelect,
  handleAddScene,
  canAddMoreScenes,
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
  handleNext,
  handlePrevious,
  handleGenerate,
  isLoading,
  setShowAuthDialog
}) => {
  const isMobile = useIsMobile();

  return (
    <div className="w-full max-w-none overflow-hidden">
      <Card className={`
        bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-purple-900/20 
        border border-purple-500/20 backdrop-blur-sm overflow-hidden
      `}>
        <div className={`space-y-6 w-full ${isMobile ? 'p-4' : 'p-6'}`}>
          {/* Multi-scene project controls - only for creative mode */}
          {isMultiScene && currentProject && (
            <div className="space-y-4 w-full">
              <SceneSelector
                currentProject={currentProject}
                onSceneSelect={handleSceneSelect}
                onAddScene={handleAddScene}
                canAddMoreScenes={canAddMoreScenes}
              />
            </div>
          )}

          {/* Step Indicator */}
          <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />

          {/* Step Content */}
          <div className="min-h-[400px] flex flex-col justify-center w-full overflow-hidden">
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
              handleNext={handleNext}
              handlePrevious={handlePrevious}
              handleGenerate={handleGenerate}
              isLoading={isLoading}
              setShowAuthDialog={setShowAuthDialog}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CreativeModeContent;
