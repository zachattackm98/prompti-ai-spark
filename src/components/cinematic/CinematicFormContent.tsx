import React, { useEffect } from 'react';
import ModeSelector from './ModeSelector';
import ModeContentRenderer from './ModeContentRenderer';
import { CinematicMode, INSTANT_MODE_PLATFORM_MAPPING } from './constants/modes';
import { CameraSettings, LightingSettings, DialogSettings, SoundSettings } from './useCinematicForm';

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
  sceneIdea,
  setSceneIdea,
  setDetectedPlatform,
  setSelectedPlatform,
  ...otherProps
}) => {
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

  return (
    <div id="cinematic-form" className="w-full max-w-full overflow-hidden">
      {/* Mode Selector */}
      <div className="w-full max-w-full overflow-hidden mb-4 sm:mb-6">
        <ModeSelector
          selectedMode={selectedMode}
          onModeChange={handleModeChange}
        />
      </div>
      
      {/* Mode-specific Content */}
      <div className="w-full max-w-full overflow-hidden">
        <div className="min-h-[400px] max-h-none w-full max-w-full overflow-hidden">
          <ModeContentRenderer
            selectedMode={selectedMode}
            sceneIdea={sceneIdea}
            setSceneIdea={setSceneIdea}
            setSelectedPlatform={setSelectedPlatform}
            {...otherProps}
          />
        </div>
      </div>
    </div>
  );
};

export default CinematicFormContent;
