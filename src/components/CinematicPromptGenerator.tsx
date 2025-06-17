
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { fadeInVariants, viewportOptions } from '@/utils/animations';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { supabase } from '@/integrations/supabase/client';
import AuthDialog from './AuthDialog';

// Import refactored components
import { PromptHistory } from './cinematic/types';
import CinematicHeader from './cinematic/CinematicHeader';
import CinematicForm from './cinematic/CinematicForm';
import CinematicUpgradeSection from './cinematic/CinematicUpgradeSection';
import PromptHistoryComponent from './cinematic/PromptHistory';
import BackgroundAnimation from './cinematic/BackgroundAnimation';

const CinematicPromptGenerator = () => {
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [promptHistory, setPromptHistory] = useState<PromptHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const { subscription, features, canUseFeature } = useSubscription();

  const loadPromptHistory = async () => {
    if (!user) {
      console.log('No user found, cannot load prompt history');
      return;
    }

    setHistoryLoading(true);
    try {
      console.log('Loading prompt history for user:', user.id);
      
      // Query cinematic_scenes table for scenes with generated prompts
      const { data: scenes, error } = await supabase
        .from('cinematic_scenes')
        .select(`
          id,
          scene_idea,
          selected_platform,
          selected_emotion,
          style_reference,
          generated_prompt,
          created_at,
          project_id,
          cinematic_projects!inner(
            id,
            title,
            user_id
          )
        `)
        .eq('cinematic_projects.user_id', user.id)
        .not('generated_prompt', 'is', null)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Error loading prompt history:', error);
        toast({
          title: "Error",
          description: "Failed to load prompt history. Please try again.",
          variant: "destructive"
        });
        return;
      }

      console.log('Raw scenes data:', scenes);

      // Transform the data to match PromptHistory interface
      const transformedHistory: PromptHistory[] = scenes?.map(scene => ({
        id: scene.id,
        scene_idea: scene.scene_idea,
        platform: scene.selected_platform,
        style: scene.style_reference || '',
        emotion: scene.selected_emotion,
        generated_prompt: JSON.stringify(scene.generated_prompt),
        created_at: scene.created_at,
        project_title: scene.cinematic_projects?.title || 'Untitled Project'
      })) || [];

      console.log('Transformed history:', transformedHistory);
      setPromptHistory(transformedHistory);

      toast({
        title: "History Loaded",
        description: `Found ${transformedHistory.length} generated prompts.`,
      });
    } catch (error) {
      console.error('Error loading prompt history:', error);
      toast({
        title: "Error",
        description: "Failed to load prompt history. Please try again.",
        variant: "destructive"
      });
    } finally {
      setHistoryLoading(false);
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
    if (user && showHistory) {
      loadPromptHistory();
    }
  }, [user, showHistory]);

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
          <CinematicHeader
            user={user}
            subscription={subscription}
            showHistory={showHistory}
            setShowHistory={setShowHistory}
            onSignOut={handleSignOut}
          />

          <CinematicForm
            user={user}
            subscription={subscription}
            features={features}
            canUseFeature={canUseFeature}
            setShowAuthDialog={setShowAuthDialog}
            loadPromptHistory={loadPromptHistory}
          />

          <CinematicUpgradeSection
            user={user}
            generatedPrompt={null}
            canUseFeature={canUseFeature}
            subscription={subscription}
            onUpgrade={handleUpgrade}
          />

          <PromptHistoryComponent 
            promptHistory={promptHistory} 
            showHistory={showHistory}
            historyLoading={historyLoading}
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
