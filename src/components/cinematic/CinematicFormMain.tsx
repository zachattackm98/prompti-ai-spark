
import React from 'react';
import { motion } from 'framer-motion';
import FormStep1SceneIdea from './steps/FormStep1SceneIdea';
import FormStep2Platform from './steps/FormStep2Platform';
import FormStep3Emotion from './steps/FormStep3Emotion';
import FormStep4Settings from './steps/FormStep4Settings';
import FormStep5Generation from './steps/FormStep5Generation';
import EnhancedUsageDisplay from './EnhancedUsageDisplay';
import { useSubscription } from '@/hooks/useSubscription';

interface CinematicFormMainProps {
  user: any;
  subscription: any;
  features: any;
  canUseFeature: (feature: string) => boolean;
  setShowAuthDialog: (show: boolean) => void;
  loadPromptHistory: () => void;
  currentStep: number;
  totalSteps: number;
  sceneIdea: string;
  selectedPlatform: string;
  selectedEmotion: string;
  dialogSettings: any;
  soundSettings: any;
  cameraSettings: any;
  lightingSettings: any;
  styleReference: string;
  generatedPrompt: any;
  isLoading: boolean;
  isMultiScene: boolean;
  currentProject: any;
  setSceneIdea: (idea: string) => void;
  setSelectedPlatform: (platform: string) => void;
  setSelectedEmotion: (emotion: string) => void;
  setDialogSettings: (settings: any) => void;
  setSoundSettings: (settings: any) => void;
  setCameraSettings: (settings: any) => void;
  setLightingSettings: (settings: any) => void;
  setStyleReference: (reference: string) => void;
  setGeneratedPrompt: (prompt: any) => void;
  setIsLoading: (loading: boolean) => void;
  handleNext: () => void;
  handlePrevious: () => void;
  handleGenerateNew: () => void;
  handleContinueScene: () => void;
  updateScenePrompt: (sceneIndex: number, prompt: any) => Promise<any>;
}

const CinematicFormMain: React.FC<CinematicFormMainProps> = (props) => {
  const { forceRefresh } = useSubscription();

  const handleUpgrade = () => {
    const pricingSection = document.getElementById('pricing');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.div
      id="cinematic-form"
      className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-3xl border border-white/20 p-8 backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {/* Enhanced Usage Display */}
      <EnhancedUsageDisplay onUpgrade={handleUpgrade} />

      {/* Step Content */}
      {props.currentStep === 1 && (
        <FormStep1SceneIdea
          sceneIdea={props.sceneIdea}
          setSceneIdea={props.setSceneIdea}
          onNext={props.handleNext}
          isMultiScene={props.isMultiScene}
          currentProject={props.currentProject}
        />
      )}

      {props.currentStep === 2 && (
        <FormStep2Platform
          selectedPlatform={props.selectedPlatform}
          setSelectedPlatform={props.setSelectedPlatform}
          subscription={props.subscription}
          onNext={props.handleNext}
          onPrevious={props.handlePrevious}
        />
      )}

      {props.currentStep === 3 && (
        <FormStep3Emotion
          selectedEmotion={props.selectedEmotion}
          setSelectedEmotion={props.setSelectedEmotion}
          subscription={props.subscription}
          onNext={props.handleNext}
          onPrevious={props.handlePrevious}
        />
      )}

      {props.currentStep === 4 && (
        <FormStep4Settings
          dialogSettings={props.dialogSettings}
          setDialogSettings={props.setDialogSettings}
          soundSettings={props.soundSettings}
          setSoundSettings={props.setSoundSettings}
          cameraSettings={props.cameraSettings}
          setCameraSettings={props.setCameraSettings}
          lightingSettings={props.lightingSettings}
          setLightingSettings={props.setLightingSettings}
          styleReference={props.styleReference}
          setStyleReference={props.setStyleReference}
          canUseFeature={props.canUseFeature}
          subscription={props.subscription}
          onNext={props.handleNext}
          onPrevious={props.handlePrevious}
        />
      )}

      {props.currentStep === 5 && (
        <FormStep5Generation
          user={props.user}
          subscription={props.subscription}
          canUseFeature={props.canUseFeature}
          setShowAuthDialog={props.setShowAuthDialog}
          loadPromptHistory={props.loadPromptHistory}
          sceneIdea={props.sceneIdea}
          selectedPlatform={props.selectedPlatform}
          selectedEmotion={props.selectedEmotion}
          dialogSettings={props.dialogSettings}
          soundSettings={props.soundSettings}
          cameraSettings={props.cameraSettings}
          lightingSettings={props.lightingSettings}
          styleReference={props.styleReference}
          generatedPrompt={props.generatedPrompt}
          isLoading={props.isLoading}
          isMultiScene={props.isMultiScene}
          currentProject={props.currentProject}
          setGeneratedPrompt={props.setGeneratedPrompt}
          setIsLoading={props.setIsLoading}
          handleGenerateNew={props.handleGenerateNew}
          handleContinueScene={props.handleContinueScene}
          updateScenePrompt={props.updateScenePrompt}
          onPrevious={props.handlePrevious}
        />
      )}
    </motion.div>
  );
};

export default CinematicFormMain;
