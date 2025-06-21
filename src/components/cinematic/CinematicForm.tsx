
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { createSubscriptionHelpers } from '@/hooks/subscription/subscriptionHelpers';
import { useCinematicForm } from './useCinematicForm';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { History, X } from 'lucide-react';

// Component imports
import CinematicHeader from './CinematicHeader';
import FeatureAnnouncement from './FeatureAnnouncement';
import StepIndicator from './StepIndicator';
import StepRenderer from './StepRenderer';
import GeneratedPromptDisplay from './GeneratedPromptDisplay';
import CinematicUpgradeSection from './CinematicUpgradeSection';
import ContinueScenePrompt from './ContinueScenePrompt';
import SceneSelector from './SceneSelector';
import PromptHistory from './PromptHistory';
import UsageDisplay from './UsageDisplay';

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

  const scrollToForm = () => {
    document.getElementById('cinematic-form')?.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
  };

  const handleSignOut = async () => {
    // This would be handled by the parent component
    // For now, just a placeholder
  };

  return (
    <>
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <CinematicHeader 
          user={user}
          subscription={subscription}
          showHistory={showHistory}
          setShowHistory={setShowHistory}
          onSignOut={handleSignOut}
        />
        
        {user && (
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <FeatureAnnouncement 
              userTier={subscription.tier} 
              className="flex-1"
            />
            <div className="flex gap-2">
              <UsageDisplay />
              <Button
                onClick={() => setShowHistory(!showHistory)}
                variant="outline"
                size="sm"
                className="border-purple-400/30 text-purple-300 hover:bg-purple-500/10"
              >
                <History className="w-4 h-4 mr-2" />
                {showHistory ? 'Hide History' : 'Show History'}
              </Button>
            </div>
          </div>
        )}

        {showHistory && <PromptHistory showHistory={showHistory} />}

        <div id="cinematic-form">
          <Card className="bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-purple-900/20 border border-purple-500/20 backdrop-blur-sm">
            <div className="p-6 space-y-6">
              {/* Multi-scene project controls */}
              {isMultiScene && currentProject && (
                <div className="space-y-4">
                  <SceneSelector
                    currentProject={currentProject}
                    onSceneSelect={handleSceneSelect}
                    onAddScene={handleAddScene}
                    canAddMoreScenes={canAddMoreScenes}
                  />
                </div>
              )}

              {/* Step Indicator */}
              <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />

              {/* Step Content */}
              <StepRenderer
                currentStep={currentStep}
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
            </div>
          </Card>
        </div>

        {/* Generated Prompt Display */}
        {generatedPrompt && (
          <GeneratedPromptDisplay
            generatedPrompt={generatedPrompt}
            onCopyToClipboard={(text) => {
              navigator.clipboard.writeText(text);
            }}
            onDownloadPrompt={() => {
              const blob = new Blob([`${generatedPrompt.mainPrompt}\n\n${generatedPrompt.technicalSpecs}\n\n${generatedPrompt.styleNotes}`], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'cinematic-prompt.txt';
              a.click();
              URL.revokeObjectURL(url);
            }}
            onGenerateNew={handleGenerateNew}
          />
        )}

        {/* Continue Scene Prompt for Multi-Scene */}
        {generatedPrompt && !isMultiScene && (
          <ContinueScenePrompt
            generatedPrompt={generatedPrompt}
            onContinueScene={handleContinueScene}
            onStartOver={handleGenerateNew}
          />
        )}

        {/* Upgrade Section for Starter Users */}
        <CinematicUpgradeSection
          user={user}
          generatedPrompt={generatedPrompt}
          canUseFeature={subscriptionHelpers.canUseFeature}
          subscription={subscription}
          onUpgrade={onUpgrade}
        />
      </div>
    </>
  );
};

export default CinematicForm;
