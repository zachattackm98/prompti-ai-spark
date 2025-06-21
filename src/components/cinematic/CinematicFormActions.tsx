
import React from 'react';
import GeneratedPromptDisplay from './GeneratedPromptDisplay';
import CinematicUpgradeSection from './CinematicUpgradeSection';
import ContinueScenePrompt from './ContinueScenePrompt';
import { GeneratedPrompt } from './useCinematicForm';

interface CinematicFormActionsProps {
  generatedPrompt: GeneratedPrompt | null;
  isMultiScene: boolean;
  handleGenerateNew: () => void;
  handleContinueScene: (projectTitle: string, nextSceneIdea: string) => void;
  user: any;
  canUseFeature: (feature: string) => boolean;
  subscription: any;
  onUpgrade: () => void;
}

const CinematicFormActions: React.FC<CinematicFormActionsProps> = ({
  generatedPrompt,
  isMultiScene,
  handleGenerateNew,
  handleContinueScene,
  user,
  canUseFeature,
  subscription,
  onUpgrade
}) => {
  if (!generatedPrompt) return null;

  return (
    <>
      {/* Generated Prompt Display */}
      <GeneratedPromptDisplay
        generatedPrompt={generatedPrompt}
        onCopyToClipboard={(text) => {
          navigator.clipboard.writeText(text);
        }}
        onDownloadPrompt={() => {
          const blob = new Blob([`${generatedPrompt.mainPrompt}\n\n${generatedPrompt.technicalSpecs}\n\n${generatedPrompt.styleNotes}`], { type: 'text/plain' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'cinematic-prompt.txt';
          a.click();
          URL.revokeObjectURL(url);
        }}
        onGenerateNew={handleGenerateNew}
      />

      {/* Continue Scene Prompt for Multi-Scene */}
      {!isMultiScene && (
        <ContinueScenePrompt
          generatedPrompt={generatedPrompt}
          onContinueScene={handleContinueScene}
          onStartOver={handleGenerateNew}
        />
      )}

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
