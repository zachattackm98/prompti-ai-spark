
import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { useCinematicForm } from './useCinematicForm';
import { usePromptActions } from './promptActions';
import StepIndicator from './StepIndicator';
import StepRenderer from './StepRenderer';
import GeneratedPromptDisplay from './GeneratedPromptDisplay';
import ContinueScenePrompt from './ContinueScenePrompt';
import SceneSelector from './SceneSelector';
import UsageDisplay from './UsageDisplay';
import { scrollToStepContent } from '@/utils/scrollUtils';

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
    handleGenerate,
    handleGenerateNew,
    // Multi-scene functionality
    currentProject,
    isMultiScene,
    handleContinueScene,
    handleSceneSelect,
    handleAddScene,
    canAddMoreScenes
  } = useCinematicForm(user, subscription, canUseFeature, setShowAuthDialog, loadPromptHistory);

  const { copyToClipboard, downloadPrompt } = usePromptActions(subscription);

  const handleUpgrade = () => {
    // Navigate to pricing section
    const pricingSection = document.getElementById('pricing');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {user && (
        <UsageDisplay onUpgrade={handleUpgrade} />
      )}

      {currentProject && (
        <SceneSelector
          project={currentProject}
          onSceneSelect={handleSceneSelect}
          onAddScene={handleAddScene}
          canAddScene={canAddMoreScenes}
        />
      )}

      <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />

      <motion.div
        id="cinematic-form-container"
        initial={{ y: 30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <Card className="bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-purple-900/20 border border-purple-500/20 shadow-2xl shadow-purple-500/10 p-8 backdrop-blur-sm">
          {!generatedPrompt ? (
            <StepRenderer
              currentStep={currentStep}
              canUseFeature={canUseFeature}
              features={features}
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
            />
          ) : (
            <>
              <GeneratedPromptDisplay
                generatedPrompt={generatedPrompt}
                onCopyToClipboard={copyToClipboard}
                onDownloadPrompt={() => downloadPrompt(generatedPrompt)}
                onGenerateNew={handleGenerateNew}
              />
              
              {!isMultiScene && (
                <ContinueScenePrompt
                  generatedPrompt={generatedPrompt}
                  onContinueScene={handleContinueScene}
                  onStartOver={handleGenerateNew}
                  isLoading={isLoading}
                />
              )}
            </>
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
