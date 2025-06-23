import { useFormState } from './hooks/useFormState';
import { useCinematicModes } from './hooks/useCinematicModes';
import { useCinematicSteps } from './hooks/useCinematicSteps';
import { useCinematicPrompt } from './hooks/useCinematicPrompt';
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

  const {
    // Mode state
    selectedMode,
    setSelectedMode,
    resetModeSpecificState,
    getTotalSteps,
    
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
    setDetectedPlatform
  } = useCinematicModes();

  const totalSteps = getTotalSteps();

  const {
    handleNext,
    handlePrevious,
    scrollToForm,
    handleGenerateNew
  } = useCinematicSteps(
    currentStep,
    setCurrentStep,
    canUseFeature,
    totalSteps,
    resetForm
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

  const { handleGenerate } = useCinematicPrompt(
    user,
    subscription,
    canUseFeature,
    setShowAuthDialog,
    loadPromptHistory,
    formState,
    setGeneratedPrompt,
    setIsLoading,
    currentProject,
    updateScenePrompt,
    // Pass mode-specific state
    animalType,
    selectedVibe,
    hasDialogue,
    dialogueContent
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
