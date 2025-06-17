
import { scrollToGeneratedPrompt, scrollToStepContent } from '@/utils/scrollUtils';
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
    const hasPrompt = selectedScene.generatedPrompt;
    setCurrentStep(hasPrompt ? totalSteps : 1);
    
    // Scroll to appropriate location after scene selection
    setTimeout(() => {
      if (hasPrompt) {
        console.log('useSceneManagement: Scene has prompt, scrolling to generated prompt');
        scrollToGeneratedPrompt('smooth');
      } else {
        console.log('useSceneManagement: No prompt, scrolling to step 1');
        scrollToStepContent(1, 'smooth');
      }
    }, 300);
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
