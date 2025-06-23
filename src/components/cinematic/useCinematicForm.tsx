import { useFormState } from './hooks/useFormState';
import { useStepNavigation } from './hooks/useStepNavigation';
import { usePromptGeneration } from './hooks/usePromptGeneration';
import { useCinematicActions } from './hooks/useCinematicActions';
import { useCinematicNavigation } from './hooks/useCinematicNavigation';
import { useCinematicScenes } from './hooks/useCinematicScenes';

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
    // Mode state
    selectedMode,
    setSelectedMode,
    resetModeSpecificState,
    
    // Mode-specific state
    animalType,
    setAnimalType,
    selectedVibe,
    setSelectedVibe,
    hasDialogue,
    setHasDialogue,
    dialogueContent,
    setDialogueContent,
    detectedPlatform,
    setDetectedPlatform,
    
    // Existing state
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
    resetProject
  } = useFormState();

  // Determine totalSteps based on mode
  const getTotalSteps = () => {
    switch (selectedMode) {
      case 'instant':
        return 1;
      case 'animal-vlog':
        return 3;
      case 'creative':
        return 7;
      default:
        return 7;
    }
  };

  const totalSteps = getTotalSteps();

  const { handleNext, handlePrevious, scrollToForm } = useStepNavigation(
    currentStep,
    setCurrentStep,
    canUseFeature,
    totalSteps // Pass the dynamic totalSteps
  );

  const { handleGenerateNew } = useCinematicActions(
    setCurrentStep,
    resetForm,
    totalSteps
  );

  const { handleSceneSelect, handleAddScene } = useCinematicNavigation(
    currentStep,
    setCurrentStep,
    totalSteps,
    currentProject,
    createSceneDataFromCurrentState,
    updateCurrentScene,
    setCurrentSceneIndex,
    loadSceneDataToCurrentState,
    addNewScene
  );

  const { handleContinueScene, canAddMoreScenes } = useCinematicScenes(
    subscription,
    currentProject,
    createSceneDataFromCurrentState,
    startNewProject,
    addNewScene,
    loadSceneDataToCurrentState,
    setCurrentStep
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
    isMultiScene,
    selectedMode
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

  return {
    // Mode state
    selectedMode,
    setSelectedMode,
    resetModeSpecificState,
    
    // Mode-specific state
    animalType,
    setAnimalType,
    selectedVibe,
    setSelectedVibe,
    hasDialogue,
    setHasDialogue,
    dialogueContent,
    setDialogueContent,
    detectedPlatform,
    setDetectedPlatform,
    
    // Existing state
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
    // Multi-scene functionality (disabled for instant and animal-vlog modes)
    currentProject: selectedMode === 'creative' ? currentProject : null,
    isMultiScene: selectedMode === 'creative' ? isMultiScene : false,
    handleContinueScene,
    handleSceneSelect,
    handleAddScene,
    canAddMoreScenes,
    // Expose multi-scene state functions for history integration
    startNewProject,
    loadSceneDataToCurrentState,
    setCurrentStep
  };
};
