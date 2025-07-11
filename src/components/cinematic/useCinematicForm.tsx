
import { useFormState } from './hooks/useFormState';
import { useStepNavigation } from './hooks/useStepNavigation';
import { usePromptGeneration } from './hooks/usePromptGeneration';
import { useCinematicActions } from './hooks/useCinematicActions';

// Re-export types for backward compatibility
export type { CameraSettings, LightingSettings, DialogSettings, SoundSettings, GeneratedPrompt } from './hooks/types';

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
    setGeneratedPrompt,
    isLoading,
    setIsLoading,
    isContinuingScene,
    setIsContinuingScene,
    resetForm,
    loadPromptDataToCurrentState
  } = useFormState();

  const { totalSteps, handleNext, handlePrevious, scrollToForm } = useStepNavigation(
    currentStep,
    setCurrentStep,
    canUseFeature
  );

  const { handleGenerateNew } = useCinematicActions(
    setCurrentStep,
    resetForm,
    totalSteps
  );

  const formState = {
    sceneIdea,
    selectedPlatform,
    selectedEmotion,
    dialogSettings,
    soundSettings,
    cameraSettings,
    lightingSettings,
    styleReference
  };

  const { handleGenerate } = usePromptGeneration(
    user,
    subscription,
    canUseFeature,
    setShowAuthDialog,
    loadPromptHistory,
    formState,
    setGeneratedPrompt,
    setIsLoading,
    setCurrentStep
  );

  // Continue scene logic - preserve settings and mark as continuation
  const handleContinueScene = () => {
    // Clear the scene idea for the new scene
    setSceneIdea('');
    
    // Mark as continuing scene to show special UI
    setIsContinuingScene(true);
    
    // All other settings (platform, emotion, camera, lighting, style) are preserved
    // This maintains continuity between scenes
    
    // Reset to step 1 to allow user to enter new scene idea
    setCurrentStep(1);
    
    // Reset generated prompt since we're creating a new scene
    setGeneratedPrompt(null);
  };

  // Clear continuation state when user starts typing or navigates
  const clearContinuationMode = () => {
    setIsContinuingScene(false);
  };

  return {
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
    isContinuingScene,
    setSceneIdea,
    setSelectedPlatform,
    setSelectedEmotion,
    setDialogSettings,
    setSoundSettings,
    setCameraSettings,
    setLightingSettings,
    setStyleReference,
    handleNext,
    handlePrevious,
    handleGenerate,
    handleGenerateNew,
    handleContinueScene,
    clearContinuationMode,
    loadPromptDataToCurrentState,
    setCurrentStep
  };
};
