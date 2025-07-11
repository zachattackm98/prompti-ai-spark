
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import CinematicForm from './cinematic/CinematicForm';
import AuthDialog from './AuthDialog';
import ComingSoonDialog from './ComingSoonDialog';

interface CinematicPromptGeneratorProps {
  showHistory?: boolean;
  setShowHistory?: (show: boolean) => void;
  onSignOut?: () => void;
}

const CinematicPromptGenerator: React.FC<CinematicPromptGeneratorProps> = ({ 
  showHistory = false,
  setShowHistory,
  onSignOut
}) => {
  const { user } = useAuth();
  const { subscription } = useSubscription();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);

  const handleUpgrade = () => {
    setShowUpgradeDialog(true);
  };

  return (
    <>
      <CinematicForm 
        setShowAuthDialog={setShowAuthDialog}
        onUpgrade={handleUpgrade}
        showHistory={showHistory}
        setShowHistory={setShowHistory}
        onSignOut={onSignOut}
      />
      
      <AuthDialog 
        open={showAuthDialog} 
        onOpenChange={setShowAuthDialog}
      />
      
      <ComingSoonDialog 
        open={showUpgradeDialog} 
        onOpenChange={setShowUpgradeDialog}
      />
    </>
  );
};

export default CinematicPromptGenerator;
