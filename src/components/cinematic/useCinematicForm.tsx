
import { useFormState } from './hooks/useFormState';
import { useStepNavigation } from './hooks/useStepNavigation';
import { usePromptGeneration } from './hooks/usePromptGeneration';

// Re-export types for backward compatibility
export type { CameraSettings, LightingSettings, GeneratedPrompt } from './hooks/types';

export const useCinematicForm = (
  user: any,
  subscription: any,
  canUseFeature: (feature: string) => boolean,
  setShowAuthDialog: (show: boolean) => void,
  loadPromptHistory: () => void
) => {
  const {
    currentStep,
    setCurrentStep,
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
    generatedPrompt,
    setGeneratedPrompt,
    isLoading,
    setIsLoading,
    resetForm
  } = useFormState();

  const { totalSteps, handleNext, handlePrevious } = useStepNavigation(
    currentStep,
    setCurrentStep,
    canUseFeature
  );

  const formState = {
    currentStep,
    sceneIdea,
    selectedPlatform,
    selectedEmotion,
    cameraSettings,
    lightingSettings,
    styleReference,
    generatedPrompt,
    isLoading
  };

  const { handleGenerate } = usePromptGeneration(
    user,
    subscription,
    canUseFeature,
    setShowAuthDialog,
    loadPromptHistory,
    formState,
    setGeneratedPrompt,
    setIsLoading
  );

  const handleGenerateNew = () => {
    resetForm();
  };

  return {
    currentStep,
    totalSteps,
    sceneIdea,
    selectedPlatform,
    selectedEmotion,
    cameraSettings,
    lightingSettings,
    styleReference,
    generatedPrompt,
    isLoading,
    setSceneIdea,
    setSelectedPlatform,
    setSelectedEmotion,
    setCameraSettings,
    setLightingSettings,
    setStyleReference,
    handleNext,
    handlePrevious,
    handleGenerate,
    handleGenerateNew
  };
};
