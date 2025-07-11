
import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { createSubscriptionHelpers } from '@/hooks/subscription/subscriptionHelpers';
import { useCinematicForm } from './useCinematicForm';
import { usePromptHistory } from '@/hooks/usePromptHistory';
import { useIsMobile } from '@/hooks/use-mobile';

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
    handleContinueScene,
    loadPromptDataToCurrentState,
    setCurrentStep
  } = useCinematicForm(
    user,
    subscription,
    subscriptionHelpers.canUseFeature,
    setShowAuthDialog,
    loadPromptHistory
  );

  // Handle loading prompt data from history
  const handleCreateFromHistory = (historyItem: any) => {
    const promptData = {
      sceneIdea: historyItem.scene_idea,
      selectedPlatform: historyItem.platform,
      selectedEmotion: historyItem.emotion,
      dialogSettings: { hasDialog: false, dialogType: '', dialogStyle: '', language: '', dialogContent: '' },
      soundSettings: { hasSound: false, musicGenre: undefined, soundEffects: undefined, ambience: undefined, soundDescription: '' },
      cameraSettings: { angle: '', movement: '', shot: '' },
      lightingSettings: { mood: '', style: '', timeOfDay: '' },
      styleReference: historyItem.style || '',
      generatedPrompt: JSON.parse(historyItem.generated_prompt)
    };
    
    loadPromptDataToCurrentState(promptData, true);
  };

  return (
    <>
      <motion.section 
        id="cinematic-generator"
        className={`relative overflow-hidden ${
          isMobile 
            ? 'py-4 px-0 min-h-screen' 
            : 'py-8 sm:py-16 px-6'
        }`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <BackgroundAnimation />

        <div className={`relative z-10 ${
          isMobile 
            ? 'w-full max-w-full' 
            : 'container mx-auto max-w-4xl'
        }`}>
          <div className={`mx-auto space-y-6 sm:space-y-8 ${
            isMobile 
              ? 'max-w-full px-0' 
              : 'max-w-4xl p-6'
          }`}>
            {/* Simplified header without user controls */}
            <CinematicFormHeader />

            <CinematicFormContent
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
              generatedPrompt={generatedPrompt}
              handleNext={handleNext}
              handlePrevious={handlePrevious}
              handleGenerate={handleGenerate}
              handleGenerateNew={handleGenerateNew}
              isLoading={isLoading}
              setShowAuthDialog={setShowAuthDialog}
            />

            <CinematicFormActions
              generatedPrompt={generatedPrompt}
              handleGenerateNew={handleGenerateNew}
              handleContinueScene={handleContinueScene}
              onCopyToClipboard={(text: string) => {
                navigator.clipboard.writeText(text);
              }}
              onDownloadPrompt={() => {
                if (generatedPrompt) {
                  const content = `${generatedPrompt.mainPrompt}\n\n${generatedPrompt.technicalSpecs}\n\n${generatedPrompt.styleNotes}`;
                  const blob = new Blob([content], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'cinematic-prompt.txt';
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                }
              }}
              user={user}
              canUseFeature={subscriptionHelpers.canUseFeature}
              subscription={subscription}
              onUpgrade={onUpgrade}
              currentSceneIdea={sceneIdea}
              currentPlatform={selectedPlatform}
              currentEmotion={selectedEmotion}
            />

            {/* Simplified History */}
            {showHistory && (
              <div className={isMobile ? 'px-2' : ''}>
                <PromptHistory 
                  showHistory={showHistory} 
                  onCreateScenesFromHistory={handleCreateFromHistory}
                />
              </div>
            )}
          </div>
        </div>
      </motion.section>
    </>
  );
};

export default CinematicForm;
