
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Import existing components
import { PromptHistory, GeneratedPrompt } from './types';
import StepIndicator from './StepIndicator';
import SceneStep from './SceneStep';
import PlatformStep from './PlatformStep';
import CameraControlsStep, { CameraSettings } from './CameraControlsStep';
import LightingStep, { LightingSettings } from './LightingStep';
import StyleStep from './StyleStep';
import GeneratedPromptDisplay from './GeneratedPromptDisplay';

interface CinematicFormProps {
  user: any;
  subscription: any;
  features: any;
  canUseFeature: (feature: string) => boolean;
  setShowAuthDialog: (show: boolean) => void;
  loadPromptHistory: () => void;
}

const CinematicForm: React.FC<CinematicFormProps> = ({
  user,
  subscription,
  features,
  canUseFeature,
  setShowAuthDialog,
  loadPromptHistory
}) => {
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Prompt copied to clipboard.",
    });
  };

  const downloadPrompt = () => {
    if (!generatedPrompt) return;
    
    const content = `CINEMATIC VIDEO PROMPT
Generated: ${new Date().toLocaleDateString()}
Platform: ${generatedPrompt.platform}
Subscription: ${subscription.tier.toUpperCase()}

MAIN PROMPT:
${generatedPrompt.mainPrompt}

TECHNICAL SPECIFICATIONS:
${generatedPrompt.technicalSpecs}

STYLE NOTES:
${generatedPrompt.styleNotes}`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cinematic-prompt.txt';
    a.click();
    URL.revokeObjectURL(url);
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

  const renderStepContent = () => {
    let stepCounter = 1;
    
    if (currentStep === stepCounter) {
      return (
        <SceneStep
          sceneIdea={sceneIdea}
          setSceneIdea={setSceneIdea}
          onNext={handleNext}
        />
      );
    }
    stepCounter++;

    if (currentStep === stepCounter) {
      return (
        <PlatformStep
          selectedPlatform={selectedPlatform}
          setSelectedPlatform={setSelectedPlatform}
          selectedEmotion={selectedEmotion}
          setSelectedEmotion={setSelectedEmotion}
          onNext={handleNext}
          onPrevious={handlePrevious}
          availablePlatforms={features.platforms}
          availableEmotions={features.emotions}
        />
      );
    }
    stepCounter++;

    // Camera Controls Step (Creator+ only)
    if (canUseFeature('cameraControls')) {
      if (currentStep === stepCounter) {
        return (
          <CameraControlsStep
            cameraSettings={cameraSettings}
            setCameraSettings={setCameraSettings}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      }
      stepCounter++;
    }

    // Lighting Step (Creator+ only)
    if (canUseFeature('lightingOptions')) {
      if (currentStep === stepCounter) {
        return (
          <LightingStep
            lightingSettings={lightingSettings}
            setLightingSettings={setLightingSettings}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      }
      stepCounter++;
    }

    // Style Step (final step)
    if (currentStep === stepCounter) {
      return (
        <StyleStep
          styleReference={styleReference}
          setStyleReference={setStyleReference}
          onPrevious={handlePrevious}
          onGenerate={handleGenerate}
          isLoading={isLoading}
        />
      );
    }

    return null;
  };

  return (
    <>
      <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <Card className="bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-purple-900/20 border border-purple-500/20 shadow-2xl shadow-purple-500/10 p-8 backdrop-blur-sm">
          {!generatedPrompt ? (
            renderStepContent()
          ) : (
            <GeneratedPromptDisplay
              generatedPrompt={generatedPrompt}
              onCopyToClipboard={copyToClipboard}
              onDownloadPrompt={downloadPrompt}
              onGenerateNew={handleGenerateNew}
            />
          )}

          {!user && !generatedPrompt && (
            <motion.div 
              className="text-center mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <p className="text-purple-300 text-sm font-medium bg-purple-900/20 border border-purple-400/20 rounded-lg py-2 px-4 inline-block">
                🎬 Ready to generate? Create your free account to get started!
              </p>
            </motion.div>
          )}
        </Card>
      </motion.div>
    </>
  );
};

export default CinematicForm;
