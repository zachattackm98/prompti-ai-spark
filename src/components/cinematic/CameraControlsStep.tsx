
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Camera, Crown } from 'lucide-react';

export interface CameraSettings {
  angle: string;
  movement: string;
  shot: string;
}

interface CameraControlsStepProps {
  cameraSettings: CameraSettings;
  setCameraSettings: (settings: CameraSettings) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const cameraAngles = [
  'Eye Level', 'High Angle', 'Low Angle', 'Bird\'s Eye', 'Worm\'s Eye', 'Dutch Angle'
];

const cameraMovements = [
  'Static', 'Pan Left', 'Pan Right', 'Tilt Up', 'Tilt Down', 'Dolly In', 'Dolly Out', 'Tracking Shot', 'Handheld'
];

const shotTypes = [
  'Extreme Wide Shot', 'Wide Shot', 'Medium Shot', 'Close-up', 'Extreme Close-up', 'Two Shot', 'Over Shoulder'
];

const CameraControlsStep: React.FC<CameraControlsStepProps> = ({
  cameraSettings,
  setCameraSettings,
  onNext,
  onPrevious
}) => {
  const handleSettingChange = (key: keyof CameraSettings, value: string) => {
    setCameraSettings({
      ...cameraSettings,
      [key]: value
    });
  };

  return (
    <motion.div 
      className="space-y-4 sm:space-y-6"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center space-y-2 sm:space-y-3">
        <div className="flex items-center justify-center gap-2">
          <Camera className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
          <h3 className="text-xl sm:text-2xl font-bold text-white">Camera Controls</h3>
          <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
        </div>
        <p className="text-gray-300 text-sm sm:text-base">Fine-tune your cinematic vision with professional camera settings</p>
      </div>
      
      <div className="space-y-4 sm:space-y-6">
        <div className="space-y-3 sm:space-y-4">
          <h4 className="text-base sm:text-lg font-semibold text-purple-300">Camera Angle</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {cameraAngles.map((angle) => (
              <Button
                key={angle}
                variant={cameraSettings.angle === angle ? "default" : "outline"}
                size="sm"
                onClick={() => handleSettingChange('angle', angle)}
                className={`text-xs sm:text-sm ${cameraSettings.angle === angle 
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700" 
                  : "border-slate-600 text-white hover:bg-slate-700 bg-slate-800/40"
                }`}
              >
                {angle}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-3 sm:space-y-4">
          <h4 className="text-base sm:text-lg font-semibold text-purple-300">Camera Movement</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {cameraMovements.map((movement) => (
              <Button
                key={movement}
                variant={cameraSettings.movement === movement ? "default" : "outline"}
                size="sm"
                onClick={() => handleSettingChange('movement', movement)}
                className={`text-xs sm:text-sm ${cameraSettings.movement === movement 
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700" 
                  : "border-slate-600 text-white hover:bg-slate-700 bg-slate-800/40"
                }`}
              >
                {movement}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-3 sm:space-y-4">
          <h4 className="text-base sm:text-lg font-semibold text-purple-300">Shot Type</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {shotTypes.map((shot) => (
              <Button
                key={shot}
                variant={cameraSettings.shot === shot ? "default" : "outline"}
                size="sm"
                onClick={() => handleSettingChange('shot', shot)}
                className={`text-xs sm:text-sm ${cameraSettings.shot === shot 
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700" 
                  : "border-slate-600 text-white hover:bg-slate-700 bg-slate-800/40"
                }`}
              >
                {shot}
              </Button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0">
        <Button
          onClick={onPrevious}
          variant="outline"
          size="sm"
          className="border-slate-600 text-white hover:bg-slate-700 bg-slate-800/40"
        >
          <ChevronLeft className="w-4 h-4 mr-2" /> Previous
        </Button>
        <Button
          onClick={onNext}
          size="sm"
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
        >
          Next Step <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </motion.div>
  );
};

export default CameraControlsStep;
