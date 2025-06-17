
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
      const hasPrompt = currentScene.generatedPrompt;
      setCurrentStep(hasPrompt ? totalSteps : 1);
      
      // Scroll to appropriate location after loading
      setTimeout(() => {
        if (hasPrompt) {
          console.log('useProjectLoading: Scrolling to generated prompt display after project load');
          scrollToElementById('generated-prompt-display', 'smooth', 100);
        } else {
          console.log('useProjectLoading: Scrolling to cinematic form container after project load');
          scrollToElementById('cinematic-form-container', 'smooth', 100);
        }
      }, 200);
    }
    return loadedProject;
  };

  return {
    handleLoadProject
  };
};
