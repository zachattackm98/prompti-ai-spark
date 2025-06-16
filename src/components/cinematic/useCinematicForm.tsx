
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { usePromptUsage } from '@/hooks/usePromptUsage';

export interface CameraSettings {
  angle: string;
  movement: string;
  shot: string;
}

export interface LightingSettings {
  mood: string;
  style: string;
  timeOfDay: string;
}

export interface GeneratedPrompt {
  mainPrompt: string;
  technicalSpecs: string;
  styleNotes: string;
  platform: string;
}

export const useCinematicForm = (
  user: any,
  subscription: any,
  canUseFeature: (feature: string) => boolean,
  setShowAuthDialog: (show: boolean) => void,
  loadPromptHistory: () => void
) => {
  const { toast } = useToast();
  const { hasReachedLimit, refetchUsage } = usePromptUsage();
  
  // Form state
  const [currentStep, setCurrentStep] = useState(1);
  const [sceneIdea, setSceneIdea] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('veo3');
  const [selectedEmotion, setSelectedEmotion] = useState('cinematic');
  const [cameraSettings, setCameraSettings] = useState<CameraSettings>({
    angle: '',
    movement: '',
    shot: ''
  });
  const [lightingSettings, setLightingSettings] = useState<LightingSettings>({
    mood: '',
    style: '',
    timeOfDay: ''
  });
  const [styleReference, setStyleReference] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState<GeneratedPrompt | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Calculate total steps based on available features
  const getTotalSteps = () => {
    let steps = 3; // Scene, Platform, Style (base steps)
    if (canUseFeature('cameraControls')) steps++;
    if (canUseFeature('lightingOptions')) steps++;
    return steps;
  };

  const totalSteps = getTotalSteps();

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

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

    if (!sceneIdea.trim()) {
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
          sceneIdea,
          platform: selectedPlatform,
          emotion: selectedEmotion,
          styleReference,
          cameraSettings: canUseFeature('cameraControls') ? cameraSettings : undefined,
          lightingSettings: canUseFeature('lightingOptions') ? lightingSettings : undefined,
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
    user, sceneIdea, selectedPlatform, selectedEmotion, styleReference,
    cameraSettings, lightingSettings, subscription.tier, canUseFeature,
    setShowAuthDialog, loadPromptHistory, toast, hasReachedLimit, refetchUsage
  ]);

  const handleGenerateNew = () => {
    setGeneratedPrompt(null);
    setCurrentStep(1);
    setSceneIdea('');
    setSelectedPlatform('veo3');
    setSelectedEmotion('cinematic');
    setCameraSettings({ angle: '', movement: '', shot: '' });
    setLightingSettings({ mood: '', style: '', timeOfDay: '' });
    setStyleReference('');
  };

  return {
    currentStep,
    totalSteps,
    sceneIdea,
    selectedPlatform,
    selectedEmotion,
    cameraSettings,
    lightingSettings,
    styleReference,
    generatedPrompt,
    isLoading,
    setSceneIdea,
    setSelectedPlatform,
    setSelectedEmotion,
    setCameraSettings,
    setLightingSettings,
    setStyleReference,
    handleNext,
    handlePrevious,
    handleGenerate,
    handleGenerateNew
  };
};
