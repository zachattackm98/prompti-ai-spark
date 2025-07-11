
import React from 'react';
import GeneratedPromptDisplay from './GeneratedPromptDisplay';
import CinematicUpgradeSection from './CinematicUpgradeSection';
import { GeneratedPrompt } from './types';

interface CinematicFormActionsProps {
  generatedPrompt: GeneratedPrompt | null;
  handleGenerateNew: () => void;
  handleContinueScene: (projectTitle: string, nextSceneIdea: string) => void;
  onCopyToClipboard: (text: string) => void;
  onDownloadPrompt: () => void;
  user: any;
  canUseFeature: (feature: string) => boolean;
  subscription: any;
  onUpgrade: () => void;
}

const CinematicFormActions: React.FC<CinematicFormActionsProps> = ({
  generatedPrompt,
  handleGenerateNew,
  handleContinueScene,
  onCopyToClipboard,
  onDownloadPrompt,
  user,
  canUseFeature,
  subscription,
  onUpgrade
}) => {
  if (!generatedPrompt) return null;

  return (
    <>
      {/* Simplified GeneratedPromptDisplay with 4 action buttons */}
      <GeneratedPromptDisplay
        generatedPrompt={generatedPrompt}
        onCopyToClipboard={onCopyToClipboard}
        onDownloadPrompt={onDownloadPrompt}
        onGenerateNew={handleGenerateNew}
        onContinueScene={handleContinueScene}
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
