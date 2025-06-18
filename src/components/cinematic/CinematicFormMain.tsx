
import React from 'react';
import StepIndicator from './StepIndicator';
import CinematicFormContent from './CinematicFormContent';
import { usePromptGeneration } from './hooks/usePromptGeneration';
import { CameraSettings, LightingSettings, DialogSettings, SoundSettings, GeneratedPrompt } from './hooks/types';

interface CinematicFormMainProps {
  user: any;
  subscription: any;
  features: any;
  canUseFeature: (feature: string) => boolean;
  setShowAuthDialog: (show: boolean) => void;
  loadPromptHistory: () => void;
  currentStep: number;
  totalSteps: number;
  sceneIdea: string;
  selectedPlatform: string;
  selectedEmotion: string;
  dialogSettings: DialogSettings;
  soundSettings: SoundSettings;
  cameraSettings: CameraSettings;
  lightingSettings: LightingSettings;
  styleReference: string;
  generatedPrompt: GeneratedPrompt | null;
  isLoading: boolean;
  isMultiScene: boolean;
  currentProject: any;
  setSceneIdea: (value: string) => void;
  setSelectedPlatform: (platform: string) => void;
  setSelectedEmotion: (emotion: string) => void;
  setDialogSettings: (settings: DialogSettings) => void;
  setSoundSettings: (settings: SoundSettings) => void;
  setCameraSettings: (settings: CameraSettings) => void;
  setLightingSettings: (settings: LightingSettings) => void;
  setStyleReference: (value: string) => void;
  setGeneratedPrompt: (prompt: GeneratedPrompt | null) => void;
  setIsLoading: (loading: boolean) => void;
  handleNext: () => void;
  handlePrevious: () => void;
  handleGenerateNew: () => void;
  handleContinueScene: (projectTitle: string, nextSceneIdea: string) => void;
  updateScenePrompt: (sceneIndex: number, prompt: GeneratedPrompt) => Promise<any>;
}

const CinematicFormMain: React.FC<CinematicFormMainProps> = ({
  user,
  subscription,
  features,
  canUseFeature,
  setShowAuthDialog,
  loadPromptHistory,
  currentStep,
  totalSteps,
  sceneIdea,
  selectedPlatform,
  selectedEmotion,
  dialogSettings,
  soundSettings,
  cameraSettings,
  lightingSettings,
  styleReference,
  generatedPrompt,
  isLoading,
  isMultiScene,
  currentProject,
  setSceneIdea,
  setSelectedPlatform,
  setSelectedEmotion,
  setDialogSettings,
  setSoundSettings,
  setCameraSettings,
  setLightingSettings,
  setStyleReference,
  setGeneratedPrompt,
  setIsLoading,
  handleNext,
  handlePrevious,
  handleGenerateNew,
  handleContinueScene,
  updateScenePrompt
}) => {
  // Create form state object for the prompt generation hook
  const formState = {
    sceneIdea,
    selectedPlatform,
    selectedEmotion,
    dialogSettings,
    soundSettings,
    cameraSettings,
    lightingSettings,
    styleReference,
    currentProject,
    isMultiScene
  };

  // Use the enhanced prompt generation hook with improved error handling and logging
  const { handleGenerate, manualSaveToHistory, savingToHistory } = usePromptGeneration(
    user,
    subscription,
    canUseFeature,
    setShowAuthDialog,
    loadPromptHistory,
    formState,
    setGeneratedPrompt,
    setIsLoading,
    currentProject,
    updateScenePrompt
  );

  return (
    <>
      <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />

      <CinematicFormContent
        subscription={subscription}
        features={features}
        canUseFeature={canUseFeature}
        currentStep={currentStep}
        sceneIdea={sceneIdea}
        selectedPlatform={selectedPlatform}
        selectedEmotion={selectedEmotion}
        dialogSettings={dialogSettings}
        soundSettings={soundSettings}
        cameraSettings={cameraSettings}
        lightingSettings={lightingSettings}
        styleReference={styleReference}
        generatedPrompt={generatedPrompt}
        isLoading={isLoading}
        isMultiScene={isMultiScene}
        setSceneIdea={setSceneIdea}
        setSelectedPlatform={setSelectedPlatform}
        setSelectedEmotion={setSelectedEmotion}
        setDialogSettings={setDialogSettings}
        setSoundSettings={setSoundSettings}
        setCameraSettings={setCameraSettings}
        setLightingSettings={setLightingSettings}
        setStyleReference={setStyleReference}
        handleNext={handleNext}
        handlePrevious={handlePrevious}
        handleGenerate={handleGenerate}
        handleGenerateNew={handleGenerateNew}
        handleContinueScene={handleContinueScene}
        onManualSave={manualSaveToHistory}
        savingToHistory={savingToHistory}
      />
    </>
  );
};

export default CinematicFormMain;
