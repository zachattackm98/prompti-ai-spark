
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
    if (!currentProject) {
      console.error('[SCENE-MANAGEMENT] No current project for scene selection');
      return;
    }
    
    console.log('[SCENE-MANAGEMENT] Switching to scene index:', sceneIndex);
    
    // Save current scene data before switching
    const currentSceneData = createSceneDataFromCurrentState();
    console.log('[SCENE-MANAGEMENT] Saving current scene data before switch');
    await updateCurrentScene(currentSceneData);
    
    // Switch to selected scene
    await setCurrentSceneIndex(sceneIndex);
    const selectedScene = currentProject.scenes[sceneIndex];
    
    if (!selectedScene) {
      console.error('[SCENE-MANAGEMENT] Selected scene not found at index:', sceneIndex);
      return;
    }
    
    console.log('[SCENE-MANAGEMENT] Loading selected scene data:', {
      sceneNumber: selectedScene.sceneNumber,
      hasPrompt: !!selectedScene.generatedPrompt
    });
    
    loadSceneDataToCurrentState(selectedScene);
    
    // Reset to step 1 if no prompt exists, otherwise go to final step
    const hasPrompt = selectedScene.generatedPrompt;
    setCurrentStep(hasPrompt ? totalSteps : 1);
    
    // Scroll to appropriate location after scene selection
    setTimeout(() => {
      if (hasPrompt) {
        console.log('[SCENE-MANAGEMENT] Scene has prompt, scrolling to generated prompt');
        scrollToGeneratedPrompt('smooth');
      } else {
        console.log('[SCENE-MANAGEMENT] No prompt, scrolling to step 1');
        scrollToStepContent(1, 'smooth');
      }
    }, 300);
  };

  const handleAddScene = async () => {
    if (!currentProject) {
      console.error('[SCENE-MANAGEMENT] No current project for adding scene');
      return;
    }
    
    console.log('[SCENE-MANAGEMENT] Adding new scene to project');
    
    // Save current scene data before adding new one
    const currentSceneData = createSceneDataFromCurrentState();
    console.log('[SCENE-MANAGEMENT] Saving current scene before adding new scene');
    await updateCurrentScene(currentSceneData);
    
    // Create new scene with inherited settings but reset prompt and scene idea
    const newSceneData = {
      ...currentSceneData,
      sceneIdea: '', // Reset for new scene
      generatedPrompt: null // Reset prompt for new scene
    };
    
    console.log('[SCENE-MANAGEMENT] Creating new scene with inherited settings');
    const updatedProject = await addNewScene(newSceneData);
    
    if (updatedProject) {
      // Load the new scene data (should be the last scene in the array)
      const newScene = updatedProject.scenes[updatedProject.scenes.length - 1];
      loadSceneDataToCurrentState(newScene);
      
      // Go to step 1 for the new scene
      setCurrentStep(1);
      
      setTimeout(() => {
        console.log('[SCENE-MANAGEMENT] New scene added, scrolling to step 1');
        scrollToStepContent(1);
      }, 200);
    }
  };

  return {
    handleSceneSelect,
    handleAddScene
  };
};
