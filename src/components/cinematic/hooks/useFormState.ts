import { useState } from 'react';
import { FormState, CameraSettings, LightingSettings, DialogSettings, SoundSettings, GeneratedPrompt, SceneData } from './types';
import { useMultiSceneState } from './useMultiSceneState';
import { CinematicMode } from '../constants/modes';

export const useFormState = () => {
  // Mode state
  const [selectedMode, setSelectedMode] = useState<CinematicMode>('creative');
  
  // Existing state
  const [currentStep, setCurrentStep] = useState(1);
  const [sceneIdea, setSceneIdea] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('veo3');
  const [selectedEmotion, setSelectedEmotion] = useState('cinematic');
  const [dialogSettings, setDialogSettings] = useState<DialogSettings>({
    hasDialog: false,
    dialogType: '',
    dialogStyle: '',
    language: '',
    dialogContent: ''
  });
  const [soundSettings, setSoundSettings] = useState<SoundSettings>({
    hasSound: false,
    musicGenre: undefined,
    soundEffects: undefined,
    ambience: undefined,
    soundDescription: ''
  });
  const [cameraSettings, setCameraSettings] = useState<CameraSettings>({
    angle: '',
    movement: '',
    shot: ''
  });
  const [lightingSettings, setLightingSettings] = useState<LightingSettings>({
    mood: '',
    style: '',
    timeOfDay: ''
  });
  const [styleReference, setStyleReference] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState<GeneratedPrompt | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mode-specific state
  // Animal Vlog Mode
  const [animalType, setAnimalType] = useState('');
  const [selectedVibe, setSelectedVibe] = useState('');
  const [hasDialogue, setHasDialogue] = useState(false);
  const [dialogueContent, setDialogueContent] = useState('');
  
  // Instant Mode
  const [detectedPlatform, setDetectedPlatform] = useState('');

  const multiSceneState = useMultiSceneState();

  const resetForm = () => {
    console.log('useFormState: Performing complete form reset including multi-scene project');
    
    // Reset all form state
    setGeneratedPrompt(null);
    setCurrentStep(1);
    setSceneIdea('');
    setSelectedPlatform('veo3');
    setSelectedEmotion('cinematic');
    setDialogSettings({ hasDialog: false, dialogType: '', dialogStyle: '', language: '', dialogContent: '' });
    setSoundSettings({ hasSound: false, musicGenre: undefined, soundEffects: undefined, ambience: undefined, soundDescription: '' });
    setCameraSettings({ angle: '', movement: '', shot: '' });
    setLightingSettings({ mood: '', style: '', timeOfDay: '' });
    setStyleReference('');
    
    // Reset mode-specific state
    setAnimalType('');
    setSelectedVibe('');
    setHasDialogue(false);
    setDialogueContent('');
    setDetectedPlatform('');
    
    // Reset multi-scene project completely
    multiSceneState.resetProject();
  };

  const resetModeSpecificState = () => {
    console.log('useFormState: Resetting mode-specific state');
    
    // Reset mode-specific fields but keep core form fields
    setAnimalType('');
    setSelectedVibe('');
    setHasDialogue(false);
    setDialogueContent('');
    setDetectedPlatform('');
    setCurrentStep(1);
    setGeneratedPrompt(null);
  };

  const createSceneDataFromCurrentState = (): Omit<SceneData, 'sceneNumber'> => ({
    sceneIdea,
    selectedPlatform,
    selectedEmotion,
    dialogSettings,
    soundSettings,
    cameraSettings,
    lightingSettings,
    styleReference,
    generatedPrompt
  });

  const loadSceneDataToCurrentState = (sceneData: SceneData) => {
    console.log('useFormState: Loading scene data to current state:', sceneData.sceneNumber);
    setSceneIdea(sceneData.sceneIdea);
    setSelectedPlatform(sceneData.selectedPlatform);
    setSelectedEmotion(sceneData.selectedEmotion);
    setDialogSettings(sceneData.dialogSettings);
    setSoundSettings(sceneData.soundSettings);
    setCameraSettings(sceneData.cameraSettings);
    setLightingSettings(sceneData.lightingSettings);
    setStyleReference(sceneData.styleReference);
    setGeneratedPrompt(sceneData.generatedPrompt);
  };

  return {
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
    
    // Existing state
    currentStep,
    setCurrentStep,
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
    generatedPrompt,
    setGeneratedPrompt,
    isLoading,
    setIsLoading,
    resetForm,
    createSceneDataFromCurrentState,
    loadSceneDataToCurrentState,
    ...multiSceneState
  };
};
