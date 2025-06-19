
import { useState } from 'react';
import { FormState, CameraSettings, LightingSettings, DialogSettings, SoundSettings, GeneratedPrompt, SceneData } from './types';

export const useCinematicFormState = () => {
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

  const resetForm = () => {
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

  const getFormState = (): FormState => ({
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
    currentProject: null,
    isMultiScene: false
  });

  return {
    // State values
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
    
    // Setters
    setCurrentStep,
    setSceneIdea,
    setSelectedPlatform,
    setSelectedEmotion,
    setDialogSettings,
    setSoundSettings,
    setCameraSettings,
    setLightingSettings,
    setStyleReference,
    setGeneratedPrompt,
    setIsLoading,
    
    // Utility functions
    resetForm,
    createSceneDataFromCurrentState,
    loadSceneDataToCurrentState,
    getFormState
  };
};
