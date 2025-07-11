
import React, { useState } from 'react';
import GeneratedPromptDisplay from './GeneratedPromptDisplay';
import CinematicUpgradeSection from './CinematicUpgradeSection';
import ContinueSceneDialog from './ContinueSceneDialog';
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
  // Additional props for continuity
  currentSceneIdea: string;
  currentPlatform: string;
  currentEmotion: string;
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
  onUpgrade,
  currentSceneIdea,
  currentPlatform,
  currentEmotion
}) => {
  const [showContinueDialog, setShowContinueDialog] = useState(false);

  if (!generatedPrompt) return null;

  const handleOpenContinueDialog = () => {
    setShowContinueDialog(true);
  };

  return (
    <>
      {/* GeneratedPromptDisplay with continue dialog trigger */}
      <GeneratedPromptDisplay
        generatedPrompt={generatedPrompt}
        onCopyToClipboard={onCopyToClipboard}
        onDownloadPrompt={onDownloadPrompt}
        onGenerateNew={handleGenerateNew}
        onContinueScene={handleOpenContinueDialog}
      />

      {/* Continue Scene Dialog */}
      <ContinueSceneDialog
        open={showContinueDialog}
        onOpenChange={setShowContinueDialog}
        onConfirm={handleContinueScene}
        currentPrompt={generatedPrompt}
        currentSceneIdea={currentSceneIdea}
        currentPlatform={currentPlatform}
        currentEmotion={currentEmotion}
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
