
import { scrollToElementById } from '@/utils/scrollUtils';
import { MultiSceneProject } from './types';

export const useProjectLoading = (
  loadProjectById: (projectId: string) => Promise<MultiSceneProject | null>,
  loadSceneDataToCurrentState: (sceneData: any) => void,
  setCurrentStep: (step: number) => void,
  totalSteps: number
) => {
  const handleLoadProject = async (projectId: string) => {
    const loadedProject = await loadProjectById(projectId);
    if (loadedProject) {
      // Load the current scene data to the form
      const currentScene = loadedProject.scenes[loadedProject.currentSceneIndex];
      loadSceneDataToCurrentState(currentScene);
      
      // Set appropriate step based on whether the scene has a generated prompt
      setCurrentStep(currentScene.generatedPrompt ? totalSteps : 1);
      
      // Scroll to form after loading
      setTimeout(() => {
        console.log('useProjectLoading: Scrolling to cinematic form container after project load');
        scrollToElementById('cinematic-form-container', 'smooth', 100);
      }, 200);
    }
    return loadedProject;
  };

  return {
    handleLoadProject
  };
};
