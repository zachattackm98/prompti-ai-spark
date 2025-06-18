
import React from 'react';
import PromptHistoryComponent from './PromptHistory';
import { PromptHistory } from './types';

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
  if (!showHistory) return null;

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
