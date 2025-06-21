
import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { createSubscriptionHelpers } from '@/hooks/subscription/subscriptionHelpers';
import { useCinematicForm } from './useCinematicForm';
import { usePromptHistory } from '@/hooks/usePromptHistory';
import { useIsMobile } from '@/hooks/use-mobile';
import { useHistoryScenes } from './hooks/useHistoryScenes';

// Component imports
import CinematicFormHeader from './CinematicFormHeader';
import CinematicFormContent from './CinematicFormContent';
import CinematicFormActions from './CinematicFormActions';
import BackgroundAnimation from './BackgroundAnimation';
import PromptHistory from './PromptHistory';

interface CinematicFormProps {
  setShowAuthDialog: (show: boolean) => void;
  onUpgrade: () => void;
  showHistory?: boolean;
}

const CinematicForm: React.FC<CinematicFormProps> = ({ 
  setShowAuthDialog, 
  onUpgrade,
  showHistory = false
}) => {
  const { user } = useAuth();
  const { subscription } = useSubscription();
  const subscriptionHelpers = createSubscriptionHelpers(subscription);
  const { loadPromptHistory } = usePromptHistory();
  const isMobile = useIsMobile();

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
    canAddMoreScenes,
    // Multi-scene state functions
    startNewProject,
    loadSceneDataToCurrentState,
    setCurrentStep
  } = useCinematicForm(
    user,
    subscription,
    subscriptionHelpers.canUseFeature,
    setShowAuthDialog,
    loadPromptHistory
  );

  const { createScenesFromHistory } = useHistoryScenes(
    startNewProject,
    loadSceneDataToCurrentState,
    setCurrentStep
  );

  return (
    <>
      <motion.section 
        id="cinematic-generator"
        className={`py-8 sm:py-16 ${isMobile ? 'px-4' : 'px-6'} relative overflow-hidden`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <BackgroundAnimation />

        <div className="container mx-auto max-w-4xl relative z-10">
          <div className={`max-w-4xl mx-auto ${isMobile ? 'p-4' : 'p-6'} space-y-6 sm:space-y-8`}>
            {/* Simplified header without user controls */}
            <CinematicFormHeader />

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

            {/* History Component with create scenes functionality */}
            <PromptHistory 
              showHistory={showHistory} 
              onCreateScenesFromHistory={createScenesFromHistory}
            />
          </div>
        </div>
      </motion.section>
    </>
  );
};

export default CinematicForm;
