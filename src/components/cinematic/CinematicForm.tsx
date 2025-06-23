
import React from 'react';
import CinematicFormContainer from './CinematicFormContainer';

interface CinematicFormProps {
  setShowAuthDialog: (show: boolean) => void;
  onUpgrade: () => void;
  showHistory?: boolean;
}

const CinematicForm: React.FC<CinematicFormProps> = ({ 
  setShowAuthDialog, 
  onUpgrade,
  showHistory = false
}) => {
  return (
    <CinematicFormContainer
      setShowAuthDialog={setShowAuthDialog}
      onUpgrade={onUpgrade}
      showHistory={showHistory}
    />
  );
};

export default CinematicForm;
