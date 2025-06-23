
import React, { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import StepIndicator from './StepIndicator';
import StepRenderer from './StepRenderer';
import SceneSelector from './SceneSelector';
import ModeSelector from './ModeSelector';
import InstantModeRenderer from './modes/InstantModeRenderer';
import AnimalVlogModeRenderer from './modes/AnimalVlogModeRenderer';
import { useIsMobile } from '@/hooks/use-mobile';
import { CameraSettings, LightingSettings, DialogSettings, SoundSettings } from './useCinematicForm';
import { CinematicMode, INSTANT_MODE_PLATFORM_MAPPING } from './constants/modes';

interface CinematicFormContentProps {
  // Mode state
  selectedMode: CinematicMode;
  setSelectedMode: (mode: CinematicMode) => void;
  resetModeSpecificState: () => void;
  
  // Mode-specific state
  animalType: string;
  setAnimalType: (value: string) => void;
  selectedVibe: string;
  setSelectedVibe: (value: string) => void;
  hasDialogue: boolean;
  setHasDialogue: (value: boolean) => void;
  dialogueContent: string;
  setDialogueContent: (value: string) => void;
  detectedPlatform: string;
  setDetectedPlatform: (value: string) => void;
  
  // Multi-scene props
  isMultiScene: boolean;
  currentProject: any;
  handleSceneSelect: (sceneIndex: number) => void;
  handleAddScene: () => void;
  canAddMoreScenes: boolean;
  
  // Step props
  currentStep: number;
  totalSteps: number;
  canUseFeature: (feature: string) => boolean;
  features: any;
  
  // Form state props
  sceneIdea: string;
  setSceneIdea: (value: string) => void;
  selectedPlatform: string;
  setSelectedPlatform: (platform: string) => void;
  selectedEmotion: string;
  setSelectedEmotion: (emotion: string) => void;
  dialogSettings: DialogSettings;
  setDialogSettings: (settings: DialogSettings) => void;
  soundSettings: SoundSettings;
  setSoundSettings: (settings: SoundSettings) => void;
  cameraSettings: CameraSettings;
  setCameraSettings: (settings: CameraSettings) => void;
  lightingSettings: LightingSettings;
  setLightingSettings: (settings: LightingSettings) => void;
  styleReference: string;
  setStyleReference: (value: string) => void;
  
  // Action props
  handleNext: () => void;
  handlePrevious: () => void;
  handleGenerate: () => void;
  isLoading: boolean;
  setShowAuthDialog?: (show: boolean) => void;
}

const CinematicFormContent: React.FC<CinematicFormContentProps> = ({
  selectedMode,
  setSelectedMode,
  resetModeSpecificState,
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
  isMultiScene,
  currentProject,
  handleSceneSelect,
  handleAddScene,
  canAddMoreScenes,
  currentStep,
  totalSteps,
  canUseFeature,
  features,
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
  handleNext,
  handlePrevious,
  handleGenerate,
  isLoading,
  setShowAuthDialog
}) => {
  const isMobile = useIsMobile();

  // Handle mode change and reset state
  const handleModeChange = (mode: CinematicMode) => {
    if (mode !== selectedMode) {
      console.log('CinematicFormContent: Mode changed from', selectedMode, 'to', mode);
      setSelectedMode(mode);
      resetModeSpecificState();
    }
  };

  // Auto-detect platform for Instant mode
  useEffect(() => {
    if (selectedMode === 'instant' && sceneIdea.trim()) {
      const lowerSceneIdea = sceneIdea.toLowerCase();
      let detectedPlatform = 'veo3'; // default
      
      // Check for keyword matches
      for (const [keyword, platform] of Object.entries(INSTANT_MODE_PLATFORM_MAPPING)) {
        if (lowerSceneIdea.includes(keyword)) {
          detectedPlatform = platform;
          break;
        }
      }
      
      setDetectedPlatform(detectedPlatform);
      setSelectedPlatform(detectedPlatform);
    }
  }, [selectedMode, sceneIdea, setDetectedPlatform, setSelectedPlatform]);

  // Render mode-specific content
  const renderModeContent = () => {
    switch (selectedMode) {
      case 'instant':
        return (
          <InstantModeRenderer
            sceneIdea={sceneIdea}
            setSceneIdea={setSceneIdea}
            handleGenerate={handleGenerate}
            isLoading={isLoading}
            detectedPlatform={detectedPlatform}
          />
        );
        
      case 'animal-vlog':
        return (
          <AnimalVlogModeRenderer
            animalType={animalType}
            setAnimalType={setAnimalType}
            sceneIdea={sceneIdea}
            setSceneIdea={setSceneIdea}
            selectedVibe={selectedVibe}
            setSelectedVibe={setSelectedVibe}
            hasDialogue={hasDialogue}
            setHasDialogue={setHasDialogue}
            dialogueContent={dialogueContent}
            setDialogueContent={setDialogueContent}
            currentStep={currentStep}
            onNext={handleNext}
            onPrevious={handlePrevious}
            handleGenerate={handleGenerate}
            isLoading={isLoading}
          />
        );
        
      case 'creative':
        return (
          <Card className={`
            bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-purple-900/20 
            border border-purple-500/20 backdrop-blur-sm overflow-hidden
          `}>
            <div className={`space-y-6 ${isMobile ? 'p-4' : 'p-6'}`}>
              {/* Multi-scene project controls - only for creative mode */}
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
              <div className="min-h-[400px] flex flex-col justify-center">
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
                  setShowAuthDialog={setShowAuthDialog}
                />
              </div>
            </div>
          </Card>
        );
        
      default:
        return null;
    }
  };

  return (
    <div id="cinematic-form" className="w-full">
      {/* Mode Selector */}
      <ModeSelector
        selectedMode={selectedMode}
        onModeChange={handleModeChange}
      />
      
      {/* Mode-specific Content */}
      <div className="min-h-[500px]">
        {renderModeContent()}
      </div>
    </div>
  );
};

export default CinematicFormContent;
