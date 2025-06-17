
import { useFormState } from './hooks/useFormState';
import { useStepNavigation } from './hooks/useStepNavigation';
import { usePromptGeneration } from './hooks/usePromptGeneration';
import { scrollToStepContent } from '@/utils/scrollUtils';

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
    resetProject
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
    setIsLoading,
    currentProject,
    updateScenePrompt
  );

  const handleGenerateNew = () => {
    resetForm();
    // Scroll to the first step after reset with a delay to allow state update
    setTimeout(() => {
      console.log('useCinematicForm: Scrolling to step 1 after reset');
      scrollToStepContent(1);
    }, 200);
  };

  const handleContinueScene = (projectTitle: string, nextSceneIdea: string) => {
    const currentSceneData = createSceneDataFromCurrentState();
    const project = startNewProject(projectTitle, currentSceneData);
    
    // Add the next scene
    const nextSceneData = {
      ...currentSceneData,
      sceneIdea: nextSceneIdea,
      generatedPrompt: null
    };
    
    addNewScene(nextSceneData);
    
    // Load the next scene data to current state
    loadSceneDataToCurrentState({
      ...nextSceneData,
      sceneNumber: 2
    });
    
    // Reset to step 1 for the new scene
    setCurrentStep(1);
    
    setTimeout(() => {
      scrollToStepContent(1);
    }, 200);
  };

  const handleSceneSelect = (sceneIndex: number) => {
    if (!currentProject) return;
    
    // Save current scene data
    const currentSceneData = createSceneDataFromCurrentState();
    updateCurrentScene(currentSceneData);
    
    // Switch to selected scene
    setCurrentSceneIndex(sceneIndex);
    const selectedScene = currentProject.scenes[sceneIndex];
    loadSceneDataToCurrentState(selectedScene);
    
    // Reset to step 1 if no prompt exists, otherwise go to final step
    setCurrentStep(selectedScene.generatedPrompt ? totalSteps : 1);
    
    setTimeout(() => {
      scrollToStepContent(selectedScene.generatedPrompt ? totalSteps : 1);
    }, 200);
  };

  const handleAddScene = () => {
    if (!currentProject) return;
    
    // Save current scene data
    const currentSceneData = createSceneDataFromCurrentState();
    updateCurrentScene(currentSceneData);
    
    // Create new scene with inherited settings but reset prompt
    const newSceneData = {
      ...currentSceneData,
      sceneIdea: '',
      generatedPrompt: null
    };
    
    addNewScene(newSceneData);
    loadSceneDataToCurrentState({
      ...newSceneData,
      sceneNumber: currentProject.scenes.length + 1
    });
    
    setCurrentStep(1);
    
    setTimeout(() => {
      scrollToStepContent(1);
    }, 200);
  };

  const canAddMoreScenes = () => {
    // Basic tier: max 2 scenes
    if (subscription.tier === 'starter') {
      return !currentProject || currentProject.scenes.length < 2;
    }
    // Creator tier: max 5 scenes
    if (subscription.tier === 'creator') {
      return !currentProject || currentProject.scenes.length < 5;
    }
    // Studio tier: max 10 scenes
    return !currentProject || currentProject.scenes.length < 10;
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
    // Multi-scene functionality
    currentProject,
    isMultiScene,
    handleContinueScene,
    handleSceneSelect,
    handleAddScene,
    canAddMoreScenes: canAddMoreScenes()
  };
};
