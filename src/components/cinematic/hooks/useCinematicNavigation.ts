
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
    
    console.log(`useCinematicNavigation: Switching to scene ${sceneIndex + 1}`);
    
    // Save current scene data
    const currentSceneData = createSceneDataFromCurrentState();
    updateCurrentScene(currentSceneData);
    
    // Switch to selected scene
    setCurrentSceneIndex(sceneIndex);
    const selectedScene = currentProject.scenes[sceneIndex];
    loadSceneDataToCurrentState(selectedScene);
    
    // Set appropriate step based on scene state
    if (selectedScene.generatedPrompt) {
      // Scene has a generated prompt - show it by going to step 1 but user can navigate through steps
      console.log(`useCinematicNavigation: Scene ${sceneIndex + 1} has generated prompt, showing step 1`);
      setCurrentStep(1);
    } else {
      // Scene needs to be developed - start at step 1
      console.log(`useCinematicNavigation: Scene ${sceneIndex + 1} needs development, starting at step 1`);
      setCurrentStep(1);
    }
    
    // Scroll to the cinematic form
    setTimeout(() => {
      console.log('useCinematicNavigation: Scrolling to step 1 after scene select');
      scrollToStepContent(1);
    }, 200);
  };

  const handleAddScene = () => {
    if (!currentProject) return;
    
    console.log('useCinematicNavigation: Adding new scene to project');
    
    // Save current scene data
    const currentSceneData = createSceneDataFromCurrentState();
    updateCurrentScene(currentSceneData);
    
    // Create new scene with inherited settings but reset scene idea and prompt
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
      console.log('useCinematicNavigation: Scrolling to step 1 for new scene');
      scrollToStepContent(1);
    }, 200);
  };

  return {
    handleSceneSelect,
    handleAddScene
  };
};
