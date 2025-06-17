
import { useFormState } from './hooks/useFormState';
import { useStepNavigation } from './hooks/useStepNavigation';
import { usePromptGeneration } from './hooks/usePromptGeneration';
import { useFormActions } from './hooks/useFormActions';
import { useSceneManagement } from './hooks/useSceneManagement';
import { useProjectLoading } from './hooks/useProjectLoading';
import { useSubscriptionLimits } from './hooks/useSubscriptionLimits';

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
    createSceneDataFromCurrentState,
    loadSceneDataToCurrentState,
    // Multi-scene state
    currentProject,
    isMultiScene,
    getCurrentScene,
    startNewProject,
    addNewScene,
    updateCurrentScene,
    setCurrentSceneIndex,
    updateScenePrompt,
    resetProject,
    loadProjectById
  } = useFormState();

  const { totalSteps, handleNext, handlePrevious, scrollToForm } = useStepNavigation(
    currentStep,
    setCurrentStep,
    canUseFeature
  );

  const formState = {
    currentStep,
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
    currentProject,
    isMultiScene
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
    currentProject,
    updateScenePrompt
  );

  const { handleGenerateNew, handleContinueScene } = useFormActions(
    resetForm,
    setCurrentStep,
    createSceneDataFromCurrentState,
    startNewProject,
    addNewScene,
    loadSceneDataToCurrentState,
    totalSteps
  );

  const { handleSceneSelect, handleAddScene } = useSceneManagement(
    currentProject,
    createSceneDataFromCurrentState,
    updateCurrentScene,
    setCurrentSceneIndex,
    loadSceneDataToCurrentState,
    addNewScene,
    setCurrentStep,
    totalSteps
  );

  const { handleLoadProject } = useProjectLoading(
    loadProjectById,
    loadSceneDataToCurrentState,
    setCurrentStep,
    totalSteps
  );

  const { canAddMoreScenes } = useSubscriptionLimits(subscription, currentProject);

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
    setGeneratedPrompt,
    setIsLoading,
    handleNext,
    handlePrevious,
    handleGenerate,
    handleGenerateNew,
    // Multi-scene functionality
    currentProject,
    isMultiScene,
    handleContinueScene,
    handleSceneSelect,
    handleAddScene,
    handleLoadProject,
    canAddMoreScenes,
    updateScenePrompt
  };
};
