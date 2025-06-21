
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import CinematicForm from './cinematic/CinematicForm';
import AuthDialog from './AuthDialog';
import ComingSoonDialog from './ComingSoonDialog';

interface CinematicPromptGeneratorProps {
  showHistory?: boolean;
}

const CinematicPromptGenerator = ({ showHistory }: CinematicPromptGeneratorProps) => {
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
