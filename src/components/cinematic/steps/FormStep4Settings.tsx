
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft } from 'lucide-react';

interface FormStep4SettingsProps {
  dialogSettings: any;
  setDialogSettings: (settings: any) => void;
  soundSettings: any;
  setSoundSettings: (settings: any) => void;
  cameraSettings: any;
  setCameraSettings: (settings: any) => void;
  lightingSettings: any;
  setLightingSettings: (settings: any) => void;
  styleReference: string;
  setStyleReference: (reference: string) => void;
  canUseFeature: (feature: string) => boolean;
  subscription: any;
  onNext: () => void;
  onPrevious: () => void;
}

const FormStep4Settings: React.FC<FormStep4SettingsProps> = ({
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
  canUseFeature,
  subscription,
  onNext,
  onPrevious
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Fine-tune Settings</h2>
        <p className="text-gray-400">Customize your scene's technical aspects</p>
      </div>

      <div className="space-y-4">
        {/* Basic settings always available */}
        <div className="p-4 bg-slate-800/50 rounded-lg">
          <h3 className="text-white font-medium mb-2">Basic Settings</h3>
          <p className="text-gray-400 text-sm">All tiers have access to basic scene customization</p>
        </div>

        {/* Camera controls - Creator+ */}
        {canUseFeature('cameraControls') ? (
          <div className="p-4 bg-slate-800/50 rounded-lg">
            <h3 className="text-white font-medium mb-2">Camera Controls</h3>
            <p className="text-gray-400 text-sm">Advanced camera movements and angles</p>
          </div>
        ) : (
          <div className="p-4 bg-gray-800/50 rounded-lg opacity-50">
            <h3 className="text-gray-400 font-medium mb-2">Camera Controls (Premium)</h3>
            <p className="text-gray-500 text-sm">Upgrade to access advanced camera controls</p>
          </div>
        )}

        {/* Lighting - Studio only */}
        {canUseFeature('lightingOptions') ? (
          <div className="p-4 bg-slate-800/50 rounded-lg">
            <h3 className="text-white font-medium mb-2">Lighting Options</h3>
            <p className="text-gray-400 text-sm">Professional lighting controls</p>
          </div>
        ) : (
          <div className="p-4 bg-gray-800/50 rounded-lg opacity-50">
            <h3 className="text-gray-400 font-medium mb-2">Lighting Options (Studio)</h3>
            <p className="text-gray-500 text-sm">Upgrade to Studio for lighting controls</p>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <Button onClick={onPrevious} variant="outline" className="flex-1">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        <Button onClick={onNext} className="flex-1 bg-purple-600 hover:bg-purple-700">
          Continue
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default FormStep4Settings;
