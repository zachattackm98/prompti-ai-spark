
import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import StepRenderer from './StepRenderer';
import GeneratedPromptDisplay from './GeneratedPromptDisplay';
import ContinueScenePrompt from './ContinueScenePrompt';
import { CameraSettings, LightingSettings, DialogSettings, SoundSettings, GeneratedPrompt } from './hooks/types';
import { usePromptActions } from './promptActions';

interface CinematicFormContentProps {
  subscription: any;
  features: any;
  canUseFeature: (feature: string) => boolean;
  
  // Form state
  currentStep: number;
  sceneIdea: string;
  selectedPlatform: string;
  selectedEmotion: string;
  dialogSettings: DialogSettings;
  soundSettings: SoundSettings;
  cameraSettings: CameraSettings;
  lightingSettings: LightingSettings;
  styleReference: string;
  generatedPrompt: GeneratedPrompt | null;
  isLoading: boolean;
  isMultiScene: boolean;
  
  // Setters
  setSceneIdea: (value: string) => void;
  setSelectedPlatform: (platform: string) => void;
  setSelectedEmotion: (emotion: string) => void;
  setDialogSettings: (settings: DialogSettings) => void;
  setSoundSettings: (settings: SoundSettings) => void;
  setCameraSettings: (settings: CameraSettings) => void;
  setLightingSettings: (settings: LightingSettings) => void;
  setStyleReference: (value: string) => void;
  
  // Handlers
  handleNext: () => void;
  handlePrevious: () => void;
  handleGenerate: () => void;
  handleGenerateNew: () => void;
  handleContinueScene: (projectTitle: string, nextSceneIdea: string) => void;
}

const CinematicFormContent: React.FC<CinematicFormContentProps> = ({
  subscription,
  features,
  canUseFeature,
  currentStep,
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
  isMultiScene,
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
  handleContinueScene
}) => {
  const { copyToClipboard, downloadPrompt } = usePromptActions(subscription);

  return (
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
      </Card>
    </motion.div>
  );
};

export default CinematicFormContent;
