
import { scrollToStepContent, scrollToGeneratedPrompt } from '@/utils/scrollUtils';
import { SceneData, MultiSceneProject, GeneratedPrompt } from './types';

export const useCinematicFormActions = (
  resetForm: () => void,
  setCurrentStep: (step: number) => void,
  createSceneDataFromCurrentState: () => Omit<SceneData, 'sceneNumber'>,
  loadSceneDataToCurrentState: (sceneData: SceneData) => void,
  startNewProject: (title: string, initialSceneData: Omit<SceneData, 'sceneNumber'>) => Promise<MultiSceneProject | null>,
  addNewScene: (sceneData: Omit<SceneData, 'sceneNumber'>) => Promise<MultiSceneProject | null>,
  updateCurrentScene: (data: Omit<SceneData, 'sceneNumber'>) => Promise<MultiSceneProject | null>,
  setCurrentSceneIndex: (index: number) => Promise<void>,
  currentProject: MultiSceneProject | null,
  totalSteps: number
) => {
  
  const handleGenerateNew = () => {
    resetForm();
    setTimeout(() => {
      console.log('[CINEMATIC-FORM-ACTIONS] Scrolling to step 1 after reset');
      scrollToStepContent(1);
    }, 200);
  };

  const handleContinueScene = async (projectTitle: string, nextSceneIdea: string) => {
    const currentSceneData = createSceneDataFromCurrentState();
    const project = await startNewProject(projectTitle, currentSceneData);
    
    if (!project) {
      console.error('[CINEMATIC-FORM-ACTIONS] Failed to create project');
      return;
    }
    
    const nextSceneData = {
      ...currentSceneData,
      sceneIdea: nextSceneIdea,
      generatedPrompt: null
    };
    
    await addNewScene(nextSceneData);
    
    loadSceneDataToCurrentState({
      ...nextSceneData,
      sceneNumber: 2
    });
    
    setCurrentStep(1);
    
    setTimeout(() => {
      scrollToStepContent(1);
    }, 200);
  };

  const handleSceneSelect = async (sceneIndex: number) => {
    if (!currentProject) {
      console.error('[CINEMATIC-FORM-ACTIONS] No current project for scene selection');
      return;
    }
    
    console.log('[CINEMATIC-FORM-ACTIONS] Switching to scene index:', sceneIndex);
    
    const currentSceneData = createSceneDataFromCurrentState();
    console.log('[CINEMATIC-FORM-ACTIONS] Saving current scene data before switch');
    await updateCurrentScene(currentSceneData);
    
    await setCurrentSceneIndex(sceneIndex);
    const selectedScene = currentProject.scenes[sceneIndex];
    
    if (!selectedScene) {
      console.error('[CINEMATIC-FORM-ACTIONS] Selected scene not found at index:', sceneIndex);
      return;
    }
    
    console.log('[CINEMATIC-FORM-ACTIONS] Loading selected scene data:', {
      sceneNumber: selectedScene.sceneNumber,
      hasPrompt: !!selectedScene.generatedPrompt
    });
    
    loadSceneDataToCurrentState(selectedScene);
    
    const hasPrompt = selectedScene.generatedPrompt;
    setCurrentStep(hasPrompt ? totalSteps : 1);
    
    setTimeout(() => {
      if (hasPrompt) {
        console.log('[CINEMATIC-FORM-ACTIONS] Scene has prompt, scrolling to generated prompt');
        scrollToGeneratedPrompt('smooth');
      } else {
        console.log('[CINEMATIC-FORM-ACTIONS] No prompt, scrolling to step 1');
        scrollToStepContent(1, 'smooth');
      }
    }, 300);
  };

  const handleAddScene = async () => {
    if (!currentProject) {
      console.error('[CINEMATIC-FORM-ACTIONS] No current project for adding scene');
      return;
    }
    
    console.log('[CINEMATIC-FORM-ACTIONS] Adding new scene to project');
    
    const currentSceneData = createSceneDataFromCurrentState();
    console.log('[CINEMATIC-FORM-ACTIONS] Saving current scene before adding new scene');
    await updateCurrentScene(currentSceneData);
    
    const newSceneData = {
      ...currentSceneData,
      sceneIdea: '',
      generatedPrompt: null
    };
    
    console.log('[CINEMATIC-FORM-ACTIONS] Creating new scene with inherited settings');
    const updatedProject = await addNewScene(newSceneData);
    
    if (updatedProject) {
      const newScene = updatedProject.scenes[updatedProject.scenes.length - 1];
      loadSceneDataToCurrentState(newScene);
      
      setCurrentStep(1);
      
      setTimeout(() => {
        console.log('[CINEMATIC-FORM-ACTIONS] New scene added, scrolling to step 1');
        scrollToStepContent(1);
      }, 200);
    }
  };

  const handleStartProjectFromHistory = async (title: string, sceneData: Omit<SceneData, 'sceneNumber'>) => {
    const project = await startNewProject(title, sceneData);
    
    if (!project) {
      console.error('[CINEMATIC-FORM-ACTIONS] Failed to create project from history');
      return;
    }
    
    loadSceneDataToCurrentState({
      ...sceneData,
      sceneNumber: 1
    });

    console.log('[CINEMATIC-FORM-ACTIONS] Project started from history:', project);
  };

  return {
    handleGenerateNew,
    handleContinueScene,
    handleSceneSelect,
    handleAddScene,
    handleStartProjectFromHistory
  };
};
