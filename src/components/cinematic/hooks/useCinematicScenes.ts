
import { scrollToStepContent } from '@/utils/scrollUtils';

export const useCinematicScenes = (
  subscription: any,
  currentProject: any,
  createSceneDataFromCurrentState: () => any,
  startNewProject: (title: string, sceneData: any) => any,
  addNewScene: (data: any) => void,
  loadSceneDataToCurrentState: (data: any) => void,
  setCurrentStep: (step: number) => void
) => {
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
    handleContinueScene,
    canAddMoreScenes: canAddMoreScenes()
  };
};
