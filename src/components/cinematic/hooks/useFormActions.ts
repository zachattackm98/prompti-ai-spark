
import { scrollToStepContent, scrollToElementById } from '@/utils/scrollUtils';
import { SceneData, MultiSceneProject } from './types';

export const useFormActions = (
  resetForm: () => void,
  setCurrentStep: (step: number) => void,
  createSceneDataFromCurrentState: () => Omit<SceneData, 'sceneNumber'>,
  startNewProject: (title: string, initialSceneData: Omit<SceneData, 'sceneNumber'>) => MultiSceneProject | null,
  addNewScene: (sceneData: Omit<SceneData, 'sceneNumber'>) => void,
  loadSceneDataToCurrentState: (sceneData: SceneData) => void,
  totalSteps: number
) => {
  const handleGenerateNew = () => {
    resetForm();
    setTimeout(() => {
      console.log('useFormActions: Scrolling to step 1 after reset');
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

  return {
    handleGenerateNew,
    handleContinueScene
  };
};
