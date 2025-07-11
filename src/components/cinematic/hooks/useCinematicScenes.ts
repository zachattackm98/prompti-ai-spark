
import { scrollToStepContent } from '@/utils/scrollUtils';

export const useCinematicScenes = (
  subscription: any,
  currentProject: any,
  createSceneDataFromCurrentState: () => any,
  startNewProject: (title: string, sceneData: any) => any,
  addNewScene: (data: any) => void,
  loadSceneDataToCurrentState: (data: any, autoAdvanceToResults?: boolean) => void,
  setCurrentStep: (step: number) => void
) => {
  const handleContinueScene = (projectTitle: string, nextSceneIdea: string, mode: 'fresh' | 'continue' = 'continue') => {
    const currentSceneData = createSceneDataFromCurrentState();
    const project = startNewProject(projectTitle, currentSceneData);
    
    // Create next scene data based on mode
    let nextSceneData;
    
    if (mode === 'fresh') {
      // Fresh Mode: Only carry over basic project metadata
      nextSceneData = {
        sceneIdea: nextSceneIdea,
        selectedPlatform: 'veo3', // Reset to default
        selectedEmotion: 'dramatic', // Reset to default
        dialogSettings: { hasDialog: false, dialogType: '', dialogStyle: '', language: '' },
        soundSettings: { hasSound: false, soundDescription: '' },
        cameraSettings: { angle: '', movement: '', shot: '' },
        lightingSettings: { mood: '', style: '', timeOfDay: '' },
        styleReference: '', // Reset style reference
        generatedPrompt: null
      };
    } else {
      // Continue Mode: Carry over story elements (characters, setting, style, platform)
      nextSceneData = {
        sceneIdea: nextSceneIdea,
        selectedPlatform: currentSceneData.selectedPlatform, // Keep platform
        selectedEmotion: currentSceneData.selectedEmotion, // Keep emotion for mood consistency
        dialogSettings: { hasDialog: false, dialogType: '', dialogStyle: '', language: '' }, // Reset technical
        soundSettings: { hasSound: false, soundDescription: '' }, // Reset technical
        cameraSettings: { angle: '', movement: '', shot: '' }, // Reset technical
        lightingSettings: { mood: '', style: '', timeOfDay: '' }, // Reset technical
        styleReference: currentSceneData.styleReference, // Keep style reference for visual consistency
        generatedPrompt: null
      };
    }
    
    addNewScene(nextSceneData);
    
    // Load the next scene data to current state
    loadSceneDataToCurrentState({
      ...nextSceneData,
      sceneNumber: 2
    }, false); // Don't auto-advance to step 7 since we're creating a new scene
    
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
