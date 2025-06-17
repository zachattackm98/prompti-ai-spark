
import { MultiSceneProject } from './types';

export const useSubscriptionLimits = (
  subscription: any,
  currentProject: MultiSceneProject | null
) => {
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
    canAddMoreScenes: canAddMoreScenes()
  };
};
