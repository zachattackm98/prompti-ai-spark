
import { useFormState } from './hooks/useFormState';
import { useStepNavigation } from './hooks/useStepNavigation';
import { usePromptGeneration } from './hooks/usePromptGeneration';
import { useCinematicFormActions } from './hooks/useCinematicFormActions';
import { useProjectLoading } from './hooks/useProjectLoading';
import { useSubscriptionLimits } from './hooks/useSubscriptionLimits';
import { useHistoryActions } from './hooks/useHistoryActions';

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
    getFormState,
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

  const formStateForPromptGeneration = {
    ...getFormState(),
    currentProject,
    isMultiScene
  };

  const { handleGenerate } = usePromptGeneration(
    user,
    subscription,
    canUseFeature,
    setShowAuthDialog,
    loadPromptHistory,
    formStateForPromptGeneration,
    setGeneratedPrompt,
    setIsLoading,
    currentProject,
    updateScenePrompt
  );

  const {
    handleGenerateNew,
    handleContinueScene,
    handleSceneSelect,
    handleAddScene
  } = useCinematicFormActions(
    resetForm,
    setCurrentStep,
    createSceneDataFromCurrentState,
    loadSceneDataToCurrentState,
    startNewProject,
    addNewScene,
    updateCurrentScene,
    setCurrentSceneIndex,
    currentProject,
    totalSteps
  );

  const { handleLoadProject } = useProjectLoading(
    loadProjectById,
    loadSceneDataToCurrentState,
    setCurrentStep,
    totalSteps
  );

  const { canAddMoreScenes } = useSubscriptionLimits(subscription, currentProject);

  // Use the proper history actions hook
  const { handleStartProjectFromHistory } = useHistoryActions(
    startNewProject,
    loadSceneDataToCurrentState,
    setCurrentStep
  );

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
    updateScenePrompt,
    // History functionality
    handleStartProjectFromHistory
  };
};
