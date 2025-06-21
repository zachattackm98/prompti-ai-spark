
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { fadeInVariants, viewportOptions } from '@/utils/animations';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { usePromptUsage } from '@/hooks/usePromptUsage';
import AuthDialog from './AuthDialog';

// Import refactored components
import { PromptHistory } from './cinematic/types';
import CinematicHeader from './cinematic/CinematicHeader';
import CinematicForm from './cinematic/CinematicForm';
import CinematicUpgradeSection from './cinematic/CinematicUpgradeSection';
import BackgroundAnimation from './cinematic/BackgroundAnimation';

const CinematicPromptGenerator = () => {
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [promptHistory, setPromptHistory] = useState<PromptHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const { subscription, features, canUseFeature } = useSubscription();
  const { refetchUsage } = usePromptUsage();

  const loadPromptHistory = async () => {
    if (!user) return;

    try {
      setPromptHistory([]);
      // Refetch usage data after loading prompt history
      await refetchUsage();
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setPromptHistory([]);
    setShowHistory(false);
  };

  const handleUpgrade = () => {
    // This would typically redirect to a payment/upgrade page
    toast({
      title: "Upgrade Coming Soon!",
      description: "Subscription management will be available soon.",
    });
  };

  React.useEffect(() => {
    if (user) {
      loadPromptHistory();
    }
  }, [user]);

  return (
    <>
      <motion.section 
        id="cinematic-generator"
        className="py-16 px-6 relative overflow-hidden"
        variants={fadeInVariants}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOptions}
      >
        <BackgroundAnimation />

        <div className="container mx-auto max-w-4xl relative z-10">
          <CinematicForm
            setShowAuthDialog={setShowAuthDialog}
            onUpgrade={handleUpgrade}
          />
        </div>
      </motion.section>

      <AuthDialog 
        open={showAuthDialog} 
        onOpenChange={setShowAuthDialog}
      />
    </>
  );
};

export default CinematicPromptGenerator;
