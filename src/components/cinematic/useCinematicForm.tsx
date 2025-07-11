
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
    setIsLoading
  );

  // Enhanced continue scene logic with proper metadata transfer
  const handleContinueScene = (projectTitle: string, nextSceneIdea: string) => {
    console.log('Continuing scene with metadata transfer:', {
      projectTitle,
      nextSceneIdea,
      currentSettings: {
        platform: selectedPlatform,
        emotion: selectedEmotion,
        camera: cameraSettings,
        lighting: lightingSettings,
        style: styleReference
      }
    });
    
    // Update scene idea for the new scene
    setSceneIdea(nextSceneIdea);
    
    // All other settings (platform, emotion, camera, lighting, style) are preserved
    // This maintains continuity between scenes
    
    // Reset to step 1 to allow user to review and modify settings if needed
    setCurrentStep(1);
    
    // Reset generated prompt since we're creating a new scene
    setGeneratedPrompt(null);
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
    loadPromptDataToCurrentState,
    setCurrentStep
  };
};
