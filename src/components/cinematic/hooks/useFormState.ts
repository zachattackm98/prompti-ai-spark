
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
    resetForm
  };
};
