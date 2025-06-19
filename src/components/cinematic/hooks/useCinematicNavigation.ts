
import { scrollToStepContent, scrollToElementById } from '@/utils/scrollUtils';

export const useCinematicNavigation = (
  currentStep: number,
  setCurrentStep: (step: number) => void,
  totalSteps: number,
  currentProject: any,
  createSceneDataFromCurrentState: () => any,
  updateCurrentScene: (data: any) => void,
  setCurrentSceneIndex: (index: number) => void,
  loadSceneDataToCurrentState: (data: any) => void,
  addNewScene: (data: any) => void
) => {
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
    
    // Scroll to the cinematic form container instead of step content
    setTimeout(() => {
      console.log('useCinematicForm: Scrolling to cinematic form container after scene select');
      scrollToElementById('cinematic-form-container', 'smooth', 100);
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

  return {
    handleSceneSelect,
    handleAddScene
  };
};
