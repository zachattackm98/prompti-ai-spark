
import React from 'react';
import { motion } from 'framer-motion';
import { useCinematicForm } from './useCinematicForm';
import { useProjectManagement } from './hooks/useProjectManagement';
import { usePromptGeneration } from './hooks/usePromptGeneration';
import StepIndicator from './StepIndicator';
import CinematicFormContent from './CinematicFormContent';
import ProjectSelectorsSection from './ProjectSelectorsSection';
import UsageDisplay from './UsageDisplay';
import PromptHistoryComponent from './PromptHistory';
import { PromptHistory } from './types';

interface CinematicFormProps {
  user: any;
  subscription: any;
  features: any;
  canUseFeature: (feature: string) => boolean;
  setShowAuthDialog: (show: boolean) => void;
  loadPromptHistory: () => void;
  promptHistory?: PromptHistory[];
  showHistory?: boolean;
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
  showHistory = false,
  historyLoading = false
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

  // Create form state object for the prompt generation hook
  const formState = {
    sceneIdea,
    selectedPlatform,
    selectedEmotion,
    dialogSettings,
    soundSettings,
    cameraSettings,
    lightingSettings,
    styleReference,
    currentProject,
    isMultiScene
  };

  // Use the enhanced prompt generation hook with improved error handling and logging
  const { handleGenerate, manualSaveToHistory, savingToHistory } = usePromptGeneration(
    user,
    subscription,
    canUseFeature,
    setShowAuthDialog,
    loadPromptHistory,
    formState,
    setGeneratedPrompt,
    setIsLoading,
    currentProject,
    updateScenePrompt
  );

  const {
    userProjects,
    projectsLoading,
    loadUserProjectsData,
    handleDeleteProject
  } = useProjectManagement(user);

  const handleLoadProjectFromSelector = async (projectId: string) => {
    try {
      console.log('[CINEMATIC-FORM] Loading project from selector:', projectId);
      const project = await handleLoadProject(projectId);
      if (project) {
        console.log('[CINEMATIC-FORM] Project loaded and activated:', project.title);
      }
    } catch (error) {
      console.error('[CINEMATIC-FORM] Error loading project:', error);
    }
  };

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

      <ProjectSelectorsSection
        user={user}
        currentProject={currentProject}
        userProjects={userProjects}
        projectsLoading={projectsLoading}
        canAddMoreScenes={canAddMoreScenes}
        onLoadProject={handleLoadProjectFromSelector}
        onDeleteProject={handleDeleteProject}
        onRefreshProjects={loadUserProjectsData}
        onSceneSelect={handleSceneSelect}
        onAddScene={handleAddScene}
      />

      <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />

      <CinematicFormContent
        subscription={subscription}
        features={features}
        canUseFeature={canUseFeature}
        currentStep={currentStep}
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
        setSceneIdea={setSceneIdea}
        setSelectedPlatform={setSelectedPlatform}
        setSelectedEmotion={setSelectedEmotion}
        setDialogSettings={setDialogSettings}
        setSoundSettings={setSoundSettings}
        setCameraSettings={setCameraSettings}
        setLightingSettings={setLightingSettings}
        setStyleReference={setStyleReference}
        handleNext={handleNext}
        handlePrevious={handlePrevious}
        handleGenerate={handleGenerate}
        handleGenerateNew={handleGenerateNew}
        handleContinueScene={handleContinueScene}
        onManualSave={manualSaveToHistory}
        savingToHistory={savingToHistory}
      />

      {/* Show history section inline within the form area */}
      {showHistory && (
        <PromptHistoryComponent 
          promptHistory={promptHistory} 
          showHistory={showHistory}
          historyLoading={historyLoading}
          onStartProjectFromHistory={handleStartProjectFromHistory}
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
    </>
  );
};

export default CinematicForm;
