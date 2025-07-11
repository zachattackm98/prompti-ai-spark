
import { useFormState } from './hooks/useFormState';
import { useStepNavigation } from './hooks/useStepNavigation';
import { usePromptGeneration } from './hooks/usePromptGeneration';
import { useCinematicActions } from './hooks/useCinematicActions';
import { scrollToElementById } from '@/utils/scrollUtils';

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
    previousSceneContext,
    setPreviousSceneContext,
    resetForm,
    loadPromptDataToCurrentState,
    extractMetadataFromPrompt
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
    styleReference,
    previousSceneContext,
    isContinuingScene
  };

  // Clear continuation state when user starts typing or navigates
  const clearContinuationMode = () => {
    setIsContinuingScene(false);
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
    setCurrentStep,
    clearContinuationMode
  );

  // Continue scene logic - preserve settings and mark as continuation
  const handleContinueScene = () => {
    // Extract metadata from current generated prompt for context
    if (generatedPrompt) {
      const metadata = extractMetadataFromPrompt(generatedPrompt);
      setPreviousSceneContext(metadata);
    }
    
    // Clear the scene idea for the new scene
    setSceneIdea('');
    
    // Mark as continuing scene to show special UI
    setIsContinuingScene(true);
    
    // Reset camera settings to default values when continuing a scene
    // This allows users to use fresh camera work for the new scene
    // while preserving other continuity settings (platform, emotion, lighting, style)
    setCameraSettings({ angle: '', movement: '', shot: '' });
    
    // All other settings (platform, emotion, lighting, style) are preserved
    // This maintains visual continuity between scenes
    
    // Reset to step 1 to allow user to enter new scene idea
    setCurrentStep(1);
    
    // Reset generated prompt since we're creating a new scene
    setGeneratedPrompt(null);
    
    // Smooth scroll to generator form for better UX
    setTimeout(() => {
      scrollToElementById('generator-start', 'smooth', 120);
    }, 100);
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
    previousSceneContext,
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
