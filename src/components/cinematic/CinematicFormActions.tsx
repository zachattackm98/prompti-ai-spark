
import React from 'react';
import GeneratedPromptDisplay from './GeneratedPromptDisplay';
import CinematicUpgradeSection from './CinematicUpgradeSection';
import StreamlinedContinuation from './StreamlinedContinuation';
import { GeneratedPrompt } from './useCinematicForm';

interface CinematicFormActionsProps {
  generatedPrompt: GeneratedPrompt | null;
  isMultiScene: boolean;
  handleGenerateNew: () => void;
  handleContinueScene: (projectTitle: string, nextSceneIdea: string, mode?: 'fresh' | 'continue') => void;
  user: any;
  canUseFeature: (feature: string) => boolean;
  subscription: any;
  onUpgrade: () => void;
  currentProject?: any; // Add currentProject prop
}

const CinematicFormActions: React.FC<CinematicFormActionsProps> = ({
  generatedPrompt,
  isMultiScene,
  handleGenerateNew,
  handleContinueScene,
  user,
  canUseFeature,
  subscription,
  onUpgrade,
  currentProject
}) => {
  if (!generatedPrompt) return null;

  return (
    <>
      {/* Streamlined Continuation for Both Single and Multi-Scene */}
      <StreamlinedContinuation
        generatedPrompt={generatedPrompt}
        onContinueScene={handleContinueScene}
        onStartOver={handleGenerateNew}
        currentScenes={currentProject?.scenes || []}
      />

      {/* Upgrade Section for Starter Users */}
      <CinematicUpgradeSection
        user={user}
        generatedPrompt={generatedPrompt}
        canUseFeature={canUseFeature}
        subscription={subscription}
        onUpgrade={onUpgrade}
      />
    </>
  );
};

export default CinematicFormActions;
