
import React from 'react';
import PromptHistoryComponent from './PromptHistory';
import UpgradePrompt from './UpgradePrompt';
import { PromptHistory } from './types';
import { useSubscription } from '@/hooks/useSubscription';

interface CinematicFormHistoryProps {
  promptHistory: PromptHistory[];
  historyLoading: boolean;
  onStartProjectFromHistory: (promptHistory: PromptHistory) => void;
}

const CinematicFormHistory: React.FC<CinematicFormHistoryProps> = ({
  promptHistory,
  historyLoading,
  onStartProjectFromHistory
}) => {
  const { subscription, canUseFeature } = useSubscription();
  const canAccessHistory = canUseFeature('promptHistory');

  // Always render the history section
  return (
    <div className="mt-8">
      {canAccessHistory ? (
        <PromptHistoryComponent 
          promptHistory={promptHistory} 
          showHistory={true}
          historyLoading={historyLoading}
          onStartProjectFromHistory={onStartProjectFromHistory}
        />
      ) : (
        <UpgradePrompt
          feature="Prompt History"
          requiredTier="creator"
          currentTier={subscription.tier}
        />
      )}
    </div>
  );
};

export default CinematicFormHistory;
