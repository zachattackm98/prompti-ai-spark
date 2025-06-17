
import { scrollToStepContent, scrollToElementById } from '@/utils/scrollUtils';
import { SceneData, MultiSceneProject } from './types';

export const useSceneManagement = (
  currentProject: MultiSceneProject | null,
  createSceneDataFromCurrentState: () => Omit<SceneData, 'sceneNumber'>,
  updateCurrentScene: (data: Omit<SceneData, 'sceneNumber'>) => void,
  setCurrentSceneIndex: (index: number) => void,
  loadSceneDataToCurrentState: (sceneData: SceneData) => void,
  addNewScene: (sceneData: Omit<SceneData, 'sceneNumber'>) => void,
  setCurrentStep: (step: number) => void,
  totalSteps: number
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
      console.log('useSceneManagement: Scrolling to cinematic form container after scene select');
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
