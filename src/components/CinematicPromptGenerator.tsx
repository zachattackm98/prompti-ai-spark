
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { fadeInVariants, viewportOptions } from '@/utils/animations';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { usePromptUsage } from '@/hooks/usePromptUsage';
import AuthDialog from './AuthDialog';

// Import refactored components
import CinematicForm from './cinematic/CinematicForm';
import BackgroundAnimation from './cinematic/BackgroundAnimation';

const CinematicPromptGenerator = () => {
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { subscription } = useSubscription();
  const { refetchUsage } = usePromptUsage();

  const handleUpgrade = () => {
    // This would typically redirect to a payment/upgrade page
    toast({
      title: "Upgrade Coming Soon!",
      description: "Subscription management will be available soon.",
    });
  };

  React.useEffect(() => {
    if (user) {
      refetchUsage();
    }
  }, [user, refetchUsage]);

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
