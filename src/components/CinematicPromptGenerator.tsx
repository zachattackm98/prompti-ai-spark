
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import CinematicForm from './cinematic/CinematicForm';
import AuthDialog from './AuthDialog';

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
  const subscription = useSubscription();
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  const handleUpgrade = async () => {
    if (!user) {
      setShowAuthDialog(true);
      return;
    }
    const upgradeDetails = subscription.getUpgradeDetails();
    if (!upgradeDetails) return;
    
    try {
      await subscription.createCheckout(upgradeDetails.targetTier as 'creator' | 'studio');
    } catch (error) {
      console.error('Upgrade error:', error);
    }
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
    </>
  );
};

export default CinematicPromptGenerator;
