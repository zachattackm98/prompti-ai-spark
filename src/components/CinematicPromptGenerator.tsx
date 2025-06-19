
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
import BackgroundAnimation from './cinematic/BackgroundAnimation';

const CinematicPromptGenerator = () => {
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [promptHistory, setPromptHistory] = useState<PromptHistory[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const { subscription, features, canUseFeature } = useSubscription();

  const loadPromptHistory = async () => {
    if (!user) {
      console.log('[PROMPT-HISTORY] No user found, cannot load prompt history');
      return;
    }

    // Check if user can access history
    if (!canUseFeature('promptHistory')) {
      console.log('[PROMPT-HISTORY] User cannot access prompt history - starter tier');
      setPromptHistory([]);
      return;
    }

    console.log('[PROMPT-HISTORY] Starting to load prompt history for user:', user.id);
    setHistoryLoading(true);
    
    try {
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
        .limit(50);

      if (error) {
        console.error('[PROMPT-HISTORY] Database error loading prompt history:', error);
        toast({
          title: "Error Loading History",
          description: "Failed to load prompt history. Please try refreshing the page.",
          variant: "destructive"
        });
        return;
      }

      console.log(`[PROMPT-HISTORY] Raw scenes data loaded: ${scenes?.length || 0} records`);

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

      console.log(`[PROMPT-HISTORY] Transformed history: ${transformedHistory.length} prompts`);
      setPromptHistory(transformedHistory);

      if (transformedHistory.length > 0) {
        toast({
          title: "History Loaded",
          description: `Found ${transformedHistory.length} generated prompts in your history.`,
        });
      }
    } catch (error) {
      console.error('[PROMPT-HISTORY] Unexpected error loading prompt history:', error);
      toast({
        title: "Loading Error",
        description: "An unexpected error occurred while loading your prompt history.",
        variant: "destructive"
      });
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setPromptHistory([]);
      console.log('[AUTH] User signed out successfully');
    } catch (error) {
      console.error('[AUTH] Error signing out:', error);
      toast({
        title: "Sign Out Error",
        description: "There was an issue signing you out. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleUpgrade = () => {
    // Navigate to pricing section
    const pricingSection = document.getElementById('pricing');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      toast({
        title: "Upgrade Coming Soon!",
        description: "Subscription management will be available soon.",
      });
    }
  };

  // Always load history when user is authenticated
  React.useEffect(() => {
    if (user) {
      console.log('[PROMPT-HISTORY] User authenticated, loading history...');
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
          <CinematicHeader
            user={user}
            subscription={subscription}
            onSignOut={handleSignOut}
            onUpgrade={handleUpgrade}
          />

          <CinematicForm
            user={user}
            subscription={subscription}
            features={features}
            canUseFeature={canUseFeature}
            setShowAuthDialog={setShowAuthDialog}
            loadPromptHistory={loadPromptHistory}
            promptHistory={promptHistory}
            historyLoading={historyLoading}
          />

          <CinematicUpgradeSection
            user={user}
            generatedPrompt={null}
            canUseFeature={canUseFeature}
            subscription={subscription}
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
