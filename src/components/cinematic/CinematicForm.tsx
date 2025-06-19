
import React from 'react';
import { useCinematicForm } from './useCinematicForm';
import CinematicFormHeader from './CinematicFormHeader';
import CinematicFormProjectSection from './CinematicFormProjectSection';
import CinematicFormMain from './CinematicFormMain';
import CinematicFormHistory from './CinematicFormHistory';
import CinematicFormWelcome from './CinematicFormWelcome';
import { PromptHistory } from './types';
import { useSubscription } from '@/hooks/useSubscription';

interface CinematicFormProps {
  user: any;
  subscription: any;
  features: any;
  canUseFeature: (feature: string) => boolean;
  setShowAuthDialog: (show: boolean) => void;
  loadPromptHistory: () => void;
  promptHistory?: PromptHistory[];
  historyLoading?: boolean;
}

const CinematicForm: React.FC<CinematicFormProps> = ({
  user,
  subscription,
  features,
  canUseFeature,
  setShowAuthDialog,
  loadPromptHistory,
  promptHistory = [],
  historyLoading = false
}) => {
  const { canUseFeature: canUseSubscriptionFeature } = useSubscription();

  const {
    currentStep,
    totalSteps,
    sceneIdea,
    selectedPlatform,
    selectedEmotion,
    dialogSettings,
    setDialogSettings,
    soundSettings,
    setSoundSettings,
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
    handleGenerateNew,
    setGeneratedPrompt,
    setIsLoading,
    // Multi-scene functionality
    currentProject,
    isMultiScene,
    handleContinueScene,
    handleSceneSelect,
    handleAddScene,
    handleLoadProject,
    canAddMoreScenes,
    updateScenePrompt,
    // History functionality
    handleStartProjectFromHistory
  } = useCinematicForm(user, subscription, canUseFeature, setShowAuthDialog, loadPromptHistory);

  const handleUpgrade = () => {
    // Navigate to pricing section
    const pricingSection = document.getElementById('pricing');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <CinematicFormHeader 
        user={user}
        onUpgrade={handleUpgrade}
      />

      <CinematicFormProjectSection
        user={user}
        currentProject={currentProject}
        canAddMoreScenes={canAddMoreScenes}
        onSceneSelect={handleSceneSelect}
        onAddScene={handleAddScene}
        onLoadProject={handleLoadProject}
      />

      <CinematicFormMain
        user={user}
        subscription={subscription}
        features={features}
        canUseFeature={canUseFeature}
        setShowAuthDialog={setShowAuthDialog}
        loadPromptHistory={loadPromptHistory}
        currentStep={currentStep}
        totalSteps={totalSteps}
        sceneIdea={sceneIdea}
        selectedPlatform={selectedPlatform}
        selectedEmotion={selectedEmotion}
        dialogSettings={dialogSettings}
        soundSettings={soundSettings}
        cameraSettings={cameraSettings}
        lightingSettings={lightingSettings}
        styleReference={styleReference}
        generatedPrompt={generatedPrompt}
        isLoading={isLoading}
        isMultiScene={isMultiScene}
        currentProject={currentProject}
        setSceneIdea={setSceneIdea}
        setSelectedPlatform={setSelectedPlatform}
        setSelectedEmotion={setSelectedEmotion}
        setDialogSettings={setDialogSettings}
        setSoundSettings={setSoundSettings}
        setCameraSettings={setCameraSettings}
        setLightingSettings={setLightingSettings}
        setStyleReference={setStyleReference}
        setGeneratedPrompt={setGeneratedPrompt}
        setIsLoading={setIsLoading}
        handleNext={handleNext}
        handlePrevious={handlePrevious}
        handleGenerateNew={handleGenerateNew}
        handleContinueScene={handleContinueScene}
        updateScenePrompt={updateScenePrompt}
      />

      <CinematicFormHistory
        promptHistory={promptHistory}
        historyLoading={historyLoading}
        onStartProjectFromHistory={handleStartProjectFromHistory}
      />

      <CinematicFormWelcome
        user={user}
        generatedPrompt={generatedPrompt}
      />
    </>
  );
};

export default CinematicForm;
