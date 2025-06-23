
import React from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import CinematicFormHeader from './CinematicFormHeader';
import CinematicFormContent from './CinematicFormContent';
import CinematicFormActions from './CinematicFormActions';
import BackgroundAnimation from './BackgroundAnimation';
import PromptHistory from './PromptHistory';
import { useCinematicFormContext } from './CinematicFormProvider';

interface CinematicFormLayoutProps {
  showHistory: boolean;
  onCreateScenesFromHistory: (historyItem: any) => void;
  onUpgrade: () => void;
}

const CinematicFormLayout: React.FC<CinematicFormLayoutProps> = ({
  showHistory,
  onCreateScenesFromHistory,
  onUpgrade
}) => {
  const isMobile = useIsMobile();
  const {
    // Mode state
    selectedMode,
    setSelectedMode,
    resetModeSpecificState,
    
    // Mode-specific state
    animalType,
    setAnimalType,
    selectedVibe,
    setSelectedVibe,
    hasDialogue,
    setHasDialogue,
    dialogueContent,
    setDialogueContent,
    detectedPlatform,
    setDetectedPlatform,
    
    // Multi-scene props
    isMultiScene,
    currentProject,
    handleSceneSelect,
    handleAddScene,
    canAddMoreScenes,
    
    // Step props
    currentStep,
    totalSteps,
    canUseFeature,
    features,
    
    // Form state props
    sceneIdea,
    setSceneIdea,
    selectedPlatform,
    setSelectedPlatform,
    selectedEmotion,
    setSelectedEmotion,
    dialogSettings,
    setDialogSettings,
    soundSettings,
    setSoundSettings,
    cameraSettings,
    setCameraSettings,
    lightingSettings,
    setLightingSettings,
    styleReference,
    setStyleReference,
    
    // Action props
    handleNext,
    handlePrevious,
    handleGenerate,
    isLoading,
    setShowAuthDialog,
    
    // Generated prompt and actions
    generatedPrompt,
    handleGenerateNew,
    handleContinueScene,
    user,
    subscription
  } = useCinematicFormContext();

  return (
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
          {/* Header */}
          <CinematicFormHeader />

          {/* Form Content */}
          <CinematicFormContent
            selectedMode={selectedMode}
            setSelectedMode={setSelectedMode}
            resetModeSpecificState={resetModeSpecificState}
            animalType={animalType}
            setAnimalType={setAnimalType}
            selectedVibe={selectedVibe}
            setSelectedVibe={setSelectedVibe}
            hasDialogue={hasDialogue}
            setHasDialogue={setHasDialogue}
            dialogueContent={dialogueContent}
            setDialogueContent={setDialogueContent}
            detectedPlatform={detectedPlatform}
            setDetectedPlatform={setDetectedPlatform}
            isMultiScene={isMultiScene}
            currentProject={currentProject}
            handleSceneSelect={handleSceneSelect}
            handleAddScene={handleAddScene}
            canAddMoreScenes={canAddMoreScenes}
            currentStep={currentStep}
            totalSteps={totalSteps}
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
            setShowAuthDialog={setShowAuthDialog}
          />

          {/* Form Actions */}
          <CinematicFormActions
            generatedPrompt={generatedPrompt}
            isMultiScene={isMultiScene}
            handleGenerateNew={handleGenerateNew}
            handleContinueScene={handleContinueScene}
            user={user}
            canUseFeature={canUseFeature}
            subscription={subscription}
            onUpgrade={onUpgrade}
          />

          {/* History Component */}
          <div className={isMobile ? 'px-2' : ''}>
            <PromptHistory 
              showHistory={showHistory} 
              onCreateScenesFromHistory={onCreateScenesFromHistory}
            />
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default CinematicFormLayout;
