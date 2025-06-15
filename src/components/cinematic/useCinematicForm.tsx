
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { GeneratedPrompt } from './types';

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

export const useCinematicForm = (
  user: any,
  subscription: any,
  canUseFeature: (feature: string) => boolean,
  setShowAuthDialog: (show: boolean) => void,
  loadPromptHistory: () => void
) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [sceneIdea, setSceneIdea] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [selectedEmotion, setSelectedEmotion] = useState('');
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
  const { toast } = useToast();

  // Calculate total steps based on subscription tier
  const getTotalSteps = () => {
    let steps = 3; // Base steps: Scene, Platform, Style
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

  const handleGenerate = async () => {
    if (!user) {
      setShowAuthDialog(true);
      return;
    }

    if (!sceneIdea.trim() || !selectedPlatform || !selectedEmotion) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields before generating.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const requestBody = { 
        sceneIdea,
        platform: selectedPlatform,
        emotion: selectedEmotion,
        styleReference: styleReference || '',
        cameraSettings: canUseFeature('cameraControls') ? cameraSettings : undefined,
        lightingSettings: canUseFeature('lightingOptions') ? lightingSettings : undefined,
        tier: subscription.tier,
        enhancedPrompts: canUseFeature('enhancedPrompts')
      };

      const { data, error } = await supabase.functions.invoke('cinematic-prompt-generator', {
        body: requestBody,
      });

      if (error) throw error;

      setGeneratedPrompt(data.prompt);
      
      toast({
        title: "Prompt Generated!",
        description: "Your cinematic video prompt is ready.",
      });

      loadPromptHistory();
    } catch (error: any) {
      console.error('Error generating prompt:', error);
      toast({
        title: "Error",
        description: "Failed to generate prompt. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateNew = () => {
    setGeneratedPrompt(null);
    setCurrentStep(1);
    setSceneIdea('');
    setSelectedPlatform('');
    setSelectedEmotion('');
    setCameraSettings({ angle: '', movement: '', shot: '' });
    setLightingSettings({ mood: '', style: '', timeOfDay: '' });
    setStyleReference('');
  };

  return {
    // State
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
    
    // Setters
    setSceneIdea,
    setSelectedPlatform,
    setSelectedEmotion,
    setCameraSettings,
    setLightingSettings,
    setStyleReference,
    
    // Handlers
    handleNext,
    handlePrevious,
    handleGenerate,
    handleGenerateNew
  };
};
