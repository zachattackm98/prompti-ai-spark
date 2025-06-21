
import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { createSubscriptionHelpers } from '@/hooks/subscription/subscriptionHelpers';
import { useCinematicForm } from './useCinematicForm';

// Component imports
import CinematicFormContent from './CinematicFormContent';
import CinematicFormActions from './CinematicFormActions';
import BackgroundAnimation from './BackgroundAnimation';

interface CinematicFormProps {
  setShowAuthDialog: (show: boolean) => void;
  onUpgrade: () => void;
}

const CinematicForm: React.FC<CinematicFormProps> = ({ setShowAuthDialog, onUpgrade }) => {
  const { user } = useAuth();
  const { subscription } = useSubscription();
  const subscriptionHelpers = createSubscriptionHelpers(subscription);

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
    () => {} // No history refresh needed
  );

  return (
    <>
      <motion.section 
        id="cinematic-generator"
        className="py-16 px-6 relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <BackgroundAnimation />

        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="max-w-4xl mx-auto p-6 space-y-8">
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
        </div>
      </motion.section>
    </>
  );
};

export default CinematicForm;
