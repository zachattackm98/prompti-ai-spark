
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { usePromptUsage } from '@/hooks/usePromptUsage';
import { FormState, GeneratedPrompt } from './types';

export const usePromptGeneration = (
  user: any,
  subscription: any,
  canUseFeature: (feature: string) => boolean,
  setShowAuthDialog: (show: boolean) => void,
  loadPromptHistory: () => void,
  formState: FormState,
  setGeneratedPrompt: (prompt: GeneratedPrompt | null) => void,
  setIsLoading: (loading: boolean) => void
) => {
  const { toast } = useToast();
  const { hasReachedLimit, refetchUsage } = usePromptUsage();

  const handleGenerate = useCallback(async () => {
    if (!user) {
      setShowAuthDialog(true);
      return;
    }

    // Check usage limits for all tiers
    if (hasReachedLimit) {
      const tierNames = { starter: 'Starter', creator: 'Creator', studio: 'Studio' };
      const limits = { starter: 5, creator: 500, studio: 1000 };
      
      let upgradeMessage = '';
      if (subscription.tier === 'starter') {
        upgradeMessage = 'Upgrade to Creator (500 prompts/month) or Studio (1000 prompts/month) for more prompts.';
      } else if (subscription.tier === 'creator') {
        upgradeMessage = 'Upgrade to Studio plan for 1000 prompts per month.';
      } else {
        upgradeMessage = 'Your usage will reset next month.';
      }

      toast({
        title: "Usage Limit Reached",
        description: `You've reached your monthly limit of ${limits[subscription.tier]} prompts on the ${tierNames[subscription.tier]} plan. ${upgradeMessage}`,
        variant: "destructive",
      });
      return;
    }

    if (!formState.sceneIdea.trim()) {
      toast({
        title: "Scene idea required",
        description: "Please provide a scene idea to generate your prompt.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('cinematic-prompt-generator', {
        body: {
          sceneIdea: formState.sceneIdea,
          platform: formState.selectedPlatform,
          emotion: formState.selectedEmotion,
          styleReference: formState.styleReference,
          dialogSettings: formState.dialogSettings,
          soundSettings: formState.soundSettings,
          cameraSettings: canUseFeature('cameraControls') ? formState.cameraSettings : undefined,
          lightingSettings: canUseFeature('lightingOptions') ? formState.lightingSettings : undefined,
          tier: subscription.tier,
          enhancedPrompts: subscription.tier !== 'starter'
        }
      });

      if (error) {
        // Handle specific error cases
        if (error.message === 'USAGE_LIMIT_EXCEEDED') {
          toast({
            title: "Usage Limit Exceeded",
            description: "You've reached your monthly prompt limit. Please upgrade for more prompts!",
            variant: "destructive",
          });
          // Refresh usage data
          await refetchUsage();
          return;
        }
        throw error;
      }

      if (data?.error) {
        if (data.error === 'USAGE_LIMIT_EXCEEDED') {
          toast({
            title: "Usage Limit Exceeded",
            description: data.message || "You've reached your monthly prompt limit.",
            variant: "destructive",
          });
          // Refresh usage data
          await refetchUsage();
          return;
        }
        throw new Error(data.error);
      }

      setGeneratedPrompt(data.prompt);
      
      // Refresh usage data after successful generation
      await refetchUsage();
      
      // Load updated history
      loadPromptHistory();

      toast({
        title: "Prompt Generated!",
        description: "Your cinematic prompt has been generated successfully.",
      });
    } catch (error: any) {
      console.error('Error generating prompt:', error);
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate prompt. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [
    user, formState.sceneIdea, formState.selectedPlatform, formState.selectedEmotion, 
    formState.styleReference, formState.dialogSettings, formState.soundSettings,
    formState.cameraSettings, formState.lightingSettings, 
    subscription.tier, canUseFeature, setShowAuthDialog, loadPromptHistory, toast, 
    hasReachedLimit, refetchUsage, setGeneratedPrompt, setIsLoading
  ]);

  return { handleGenerate };
};
