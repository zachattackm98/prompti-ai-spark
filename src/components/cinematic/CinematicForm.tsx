
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { createSubscriptionHelpers } from '@/hooks/subscription/subscriptionHelpers';
import { useCinematicForm } from './useCinematicForm';

// Component imports
import CinematicFormHeader from './CinematicFormHeader';
import CinematicFormContent from './CinematicFormContent';
import CinematicFormActions from './CinematicFormActions';
import PromptHistory from './PromptHistory';

interface CinematicFormProps {
  setShowAuthDialog: (show: boolean) => void;
  onUpgrade: () => void;
}

const CinematicForm: React.FC<CinematicFormProps> = ({ setShowAuthDialog, onUpgrade }) => {
  const { user } = useAuth();
  const { subscription } = useSubscription();
  const subscriptionHelpers = createSubscriptionHelpers(subscription);
  const [showHistory, setShowHistory] = useState(false);

  const {
    currentStep,
    totalSteps,
    sceneIdea,
    selectedPlatform,
    selectedEmotion,
    dialogSettings,
    soundSettings,
    cameraSettings,
    lightingSettings,
    styleReference,
    generatedPrompt,
    isLoading,
    setSceneIdea,
    setSelectedPlatform,
    setSelectedEmotion,
    setDialogSettings,
    setSoundSettings,
    setCameraSettings,
    setLightingSettings,
    setStyleReference,
    handleNext,
    handlePrevious,
    handleGenerate,
    handleGenerateNew,
    currentProject,
    isMultiScene,
    handleContinueScene,
    handleSceneSelect,
    handleAddScene,
    canAddMoreScenes
  } = useCinematicForm(
    user,
    subscription,
    subscriptionHelpers.canUseFeature,
    setShowAuthDialog,
    () => {} // We'll handle history refresh in the component itself
  );

  const handleSignOut = async () => {
    // This would be handled by the parent component
    // For now, just a placeholder
  };

  return (
    <>
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <CinematicFormHeader
          user={user}
          subscription={subscription}
          showHistory={showHistory}
          setShowHistory={setShowHistory}
          onSignOut={handleSignOut}
        />

        {showHistory && <PromptHistory showHistory={showHistory} />}

        <CinematicFormContent
          isMultiScene={isMultiScene}
          currentProject={currentProject}
          handleSceneSelect={handleSceneSelect}
          handleAddScene={handleAddScene}
          canAddMoreScenes={canAddMoreScenes}
          currentStep={currentStep}
          totalSteps={totalSteps}
          canUseFeature={subscriptionHelpers.canUseFeature}
          features={subscriptionHelpers.features}
          sceneIdea={sceneIdea}
          setSceneIdea={setSceneIdea}
          selectedPlatform={selectedPlatform}
          setSelectedPlatform={setSelectedPlatform}
          selectedEmotion={selectedEmotion}
          setSelectedEmotion={setSelectedEmotion}
          dialogSettings={dialogSettings}
          setDialogSettings={setDialogSettings}
          soundSettings={soundSettings}
          setSoundSettings={setSoundSettings}
          cameraSettings={cameraSettings}
          setCameraSettings={setCameraSettings}
          lightingSettings={lightingSettings}
          setLightingSettings={setLightingSettings}
          styleReference={styleReference}
          setStyleReference={setStyleReference}
          handleNext={handleNext}
          handlePrevious={handlePrevious}
          handleGenerate={handleGenerate}
          isLoading={isLoading}
          setShowAuthDialog={setShowAuthDialog}
        />

        <CinematicFormActions
          generatedPrompt={generatedPrompt}
          isMultiScene={isMultiScene}
          handleGenerateNew={handleGenerateNew}
          handleContinueScene={handleContinueScene}
          user={user}
          canUseFeature={subscriptionHelpers.canUseFeature}
          subscription={subscription}
          onUpgrade={onUpgrade}
        />
      </div>
    </>
  );
};

export default CinematicForm;
