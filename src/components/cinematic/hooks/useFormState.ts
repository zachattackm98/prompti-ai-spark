
import { useState } from 'react';
import { FormState, CameraSettings, LightingSettings, DialogSettings, SoundSettings, GeneratedPrompt } from './types';

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

  const resetForm = () => {
    console.log('useFormState: Performing complete form reset');
    
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
  };

  const loadPromptDataToCurrentState = (promptData: {
    sceneIdea: string;
    selectedPlatform: string;
    selectedEmotion: string;
    dialogSettings: DialogSettings;
    soundSettings: SoundSettings;
    cameraSettings: CameraSettings;
    lightingSettings: LightingSettings;
    styleReference: string;
    generatedPrompt: GeneratedPrompt | null;
  }, autoAdvanceToResults: boolean = true) => {
    console.log('useFormState: Loading prompt data to current state');
    setSceneIdea(promptData.sceneIdea);
    setSelectedPlatform(promptData.selectedPlatform);
    setSelectedEmotion(promptData.selectedEmotion);
    setDialogSettings(promptData.dialogSettings);
    setSoundSettings(promptData.soundSettings);
    setCameraSettings(promptData.cameraSettings);
    setLightingSettings(promptData.lightingSettings);
    setStyleReference(promptData.styleReference);
    setGeneratedPrompt(promptData.generatedPrompt);
    
    // Auto-advance to step 7 if there's a generated prompt and autoAdvance is enabled
    if (autoAdvanceToResults && promptData.generatedPrompt) {
      console.log('useFormState: Auto-advancing to step 7 due to existing generated prompt');
      setCurrentStep(7);
    }
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
    loadPromptDataToCurrentState
  };
};
