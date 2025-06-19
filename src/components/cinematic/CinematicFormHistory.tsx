
import React from 'react';
import PromptHistoryComponent from './PromptHistory';
import UpgradePrompt from './UpgradePrompt';
import { PromptHistory } from './types';
import { useSubscription } from '@/hooks/useSubscription';

interface CinematicFormHistoryProps {
  showHistory: boolean;
  promptHistory: PromptHistory[];
  historyLoading: boolean;
  onStartProjectFromHistory: (promptHistory: PromptHistory) => void;
}

const CinematicFormHistory: React.FC<CinematicFormHistoryProps> = ({
  showHistory,
  promptHistory,
  historyLoading,
  onStartProjectFromHistory
}) => {
  const { subscription, canUseFeature } = useSubscription();
  const canAccessHistory = canUseFeature('promptHistory');

  if (!showHistory) return null;

  // Show upgrade prompt for starter tier users
  if (!canAccessHistory) {
    return (
      <div className="mt-8">
        <UpgradePrompt
          feature="Prompt History"
          requiredTier="creator"
          currentTier={subscription.tier}
        />
      </div>
    );
  }

  return (
    <PromptHistoryComponent 
      promptHistory={promptHistory} 
      showHistory={showHistory}
      historyLoading={historyLoading}
      onStartProjectFromHistory={onStartProjectFromHistory}
    />
  );
};

export default CinematicFormHistory;
