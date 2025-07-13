
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
import CinematicUpgradeSection from './CinematicUpgradeSection';
import BackgroundAnimation from './BackgroundAnimation';
import PromptHistory from './PromptHistory';
import HistoryControls from './HistoryControls';

interface CinematicFormProps {
  setShowAuthDialog: (show: boolean) => void;
  onUpgrade: () => void;
  showHistory?: boolean;
  setShowHistory?: (show: boolean) => void;
  onSignOut?: () => void;
}

const CinematicForm: React.FC<CinematicFormProps> = ({ 
  setShowAuthDialog, 
  onUpgrade,
  showHistory = false,
  setShowHistory,
  onSignOut
}) => {
  const { user } = useAuth();
  const { subscription } = useSubscription();
  const subscriptionHelpers = createSubscriptionHelpers(subscription);
  const { loadPromptHistory } = usePromptHistory();
  const isMobile = useIsMobile();
  
  // Check if user can access prompt history
  const canAccessHistory = subscriptionHelpers.canUseFeature('promptHistory');

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
    isContinuingScene,
    previousSceneContext,
    clearContinuationMode,
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
      dialogSettings: historyItem.dialog_settings || { hasDialog: false, dialogType: '', dialogStyle: '', language: '', dialogContent: '' },
      soundSettings: historyItem.sound_settings || { hasSound: false, musicGenre: undefined, soundEffects: undefined, ambience: undefined, soundDescription: '' },
      cameraSettings: historyItem.camera_settings || { angle: '', movement: '', shot: '' },
      lightingSettings: historyItem.lighting_settings || { mood: '', style: '', timeOfDay: '' },
      styleReference: historyItem.style || '',
      generatedPrompt: JSON.parse(historyItem.generated_prompt),
      // Restore continuation context if this was a continuation scene
      ...(historyItem.is_continuation && historyItem.previous_scene_context && {
        sceneContext: historyItem.previous_scene_context
      })
    };
    
    loadPromptDataToCurrentState(promptData, true);
    
    // Scroll to top of form content
    setTimeout(() => {
      const formContent = document.getElementById('form-content');
      if (formContent) {
        formContent.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }
    }, 100);
  };

  return (
    <>
      <motion.section 
        id="cinematic-generator"
        className={`relative overflow-hidden ${
          isMobile 
            ? 'pt-2 pb-4 px-0 min-h-screen' 
            : 'pt-4 pb-8 sm:pt-6 sm:pb-16 px-6'
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
              isLoading={isLoading}
              isContinuingScene={isContinuingScene}
              previousSceneContext={previousSceneContext}
              clearContinuationMode={clearContinuationMode}
              setShowAuthDialog={setShowAuthDialog}
            />

            {/* Upgrade Section for Starter Users */}
            {generatedPrompt && (
              <CinematicUpgradeSection
                user={user}
                generatedPrompt={generatedPrompt}
                canUseFeature={subscriptionHelpers.canUseFeature}
                subscription={subscription}
                onUpgrade={onUpgrade}
              />
            )}

            {/* History Controls - Only show when user is logged in and has access */}
            {user && canAccessHistory && setShowHistory && onSignOut && (
              <HistoryControls
                showHistory={showHistory}
                setShowHistory={setShowHistory}
                onSignOut={onSignOut}
              />
            )}

            {/* Upgrade prompt for Starter users */}
            {user && !canAccessHistory && (
              <motion.div 
                className={`max-w-md mx-auto mb-6 ${isMobile ? 'px-2' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="bg-slate-800/40 border border-white/10 rounded-lg p-6 text-center">
                  <div className="mb-4">
                    <div className="w-12 h-12 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-xl">📚</span>
                    </div>
                    <h3 className="text-white text-lg font-semibold mb-2">
                      Prompt History
                    </h3>
                    <p className="text-slate-300 text-sm mb-4">
                      Save and revisit your favorite prompts with Creator plan
                    </p>
                  </div>
                  <button
                    onClick={onUpgrade}
                    className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-6 py-3 rounded-lg transition-colors w-full"
                  >
                    Upgrade to Creator
                  </button>
                  <p className="text-slate-400 text-xs mt-3">
                    Access unlimited prompt history and more features
                  </p>
                </div>
              </motion.div>
            )}

            {/* History section - Only show if user has access and history is visible */}
            {user && canAccessHistory && showHistory && (
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
