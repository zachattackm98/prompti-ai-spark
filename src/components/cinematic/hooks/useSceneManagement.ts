
import { scrollToStepContent, scrollToElementById } from '@/utils/scrollUtils';
import { SceneData, MultiSceneProject } from './types';

export const useSceneManagement = (
  currentProject: MultiSceneProject | null,
  createSceneDataFromCurrentState: () => Omit<SceneData, 'sceneNumber'>,
  updateCurrentScene: (data: Omit<SceneData, 'sceneNumber'>) => Promise<MultiSceneProject | null>,
  setCurrentSceneIndex: (index: number) => Promise<void>,
  loadSceneDataToCurrentState: (sceneData: SceneData) => void,
  addNewScene: (sceneData: Omit<SceneData, 'sceneNumber'>) => Promise<MultiSceneProject | null>,
  setCurrentStep: (step: number) => void,
  totalSteps: number
) => {
  const handleSceneSelect = async (sceneIndex: number) => {
    if (!currentProject) return;
    
    // Save current scene data
    const currentSceneData = createSceneDataFromCurrentState();
    await updateCurrentScene(currentSceneData);
    
    // Switch to selected scene
    await setCurrentSceneIndex(sceneIndex);
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

  const handleAddScene = async () => {
    if (!currentProject) return;
    
    // Save current scene data
    const currentSceneData = createSceneDataFromCurrentState();
    await updateCurrentScene(currentSceneData);
    
    // Create new scene with inherited settings but reset prompt
    const newSceneData = {
      ...currentSceneData,
      sceneIdea: '',
      generatedPrompt: null
    };
    
    await addNewScene(newSceneData);
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
