
import { scrollToGeneratedPrompt, scrollToStepContent } from '@/utils/scrollUtils';
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
          console.log('useProjectLoading: Scene has prompt, scrolling to generated prompt');
          scrollToGeneratedPrompt('smooth');
        } else {
          console.log('useProjectLoading: No prompt, scrolling to step 1');
          scrollToStepContent(1, 'smooth');
        }
      }, 300);
    }
    return loadedProject;
  };

  return {
    handleLoadProject
  };
};
