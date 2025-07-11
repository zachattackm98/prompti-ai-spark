
import { useState } from 'react';
import { FormState, CameraSettings, LightingSettings, DialogSettings, SoundSettings, GeneratedPrompt, SceneData } from './types';
import { useMultiSceneState } from './useMultiSceneState';

export const useFormState = () => {
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
    
    // Reset multi-scene project completely
    multiSceneState.resetProject();
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

  // Create a custom loadProjectById that integrates with form state
  const loadProjectByIdWithState = async (projectId: string) => {
    return await multiSceneState.loadProjectById(projectId, loadSceneDataToCurrentState);
  };

  return {
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
    ...multiSceneState,
    loadProjectById: loadProjectByIdWithState
  };
};
