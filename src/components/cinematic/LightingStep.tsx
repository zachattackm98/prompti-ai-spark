
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Lightbulb, Crown } from 'lucide-react';

export interface LightingSettings {
  mood: string;
  style: string;
  timeOfDay: string;
}

interface LightingStepProps {
  lightingSettings: LightingSettings;
  setLightingSettings: (settings: LightingSettings) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const lightingMoods = [
  'Natural', 'Dramatic', 'Soft', 'Hard', 'Moody', 'Bright', 'Cinematic', 'Atmospheric'
];

const lightingStyles = [
  'Golden Hour', 'Blue Hour', 'Harsh Sunlight', 'Overcast', 'Neon Lights', 'Candlelight', 'Studio Lighting', 'Practical Lighting'
];

const timesOfDay = [
  'Dawn', 'Morning', 'Midday', 'Afternoon', 'Sunset', 'Dusk', 'Night', 'Midnight'
];

const LightingStep: React.FC<LightingStepProps> = ({
  lightingSettings,
  setLightingSettings,
  onNext,
  onPrevious
}) => {
  const handleSettingChange = (key: keyof LightingSettings, value: string) => {
    setLightingSettings({
      ...lightingSettings,
      [key]: value
    });
  };

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-2">
          <Lightbulb className="w-6 h-6 text-yellow-400" />
          <h3 className="text-2xl font-bold text-white">Lighting & Visual Style</h3>
          <Crown className="w-5 h-5 text-yellow-400" />
        </div>
        <p className="text-gray-300">Set the perfect lighting and visual atmosphere for your scene</p>
      </div>
      
      <div className="space-y-6">
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-yellow-300">Lighting Mood</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {lightingMoods.map((mood) => (
              <Button
                key={mood}
                variant={lightingSettings.mood === mood ? "default" : "outline"}
                size="sm"
                onClick={() => handleSettingChange('mood', mood)}
                className={lightingSettings.mood === mood 
                  ? "bg-gradient-to-r from-yellow-600 to-orange-600 text-white hover:from-yellow-700 hover:to-orange-700" 
                  : "border-slate-600 text-white hover:bg-slate-700 bg-slate-800/40"
                }
              >
                {mood}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-yellow-300">Lighting Style</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {lightingStyles.map((style) => (
              <Button
                key={style}
                variant={lightingSettings.style === style ? "default" : "outline"}
                size="sm"
                onClick={() => handleSettingChange('style', style)}
                className={lightingSettings.style === style 
                  ? "bg-gradient-to-r from-yellow-600 to-orange-600 text-white hover:from-yellow-700 hover:to-orange-700" 
                  : "border-slate-600 text-white hover:bg-slate-700 bg-slate-800/40"
                }
              >
                {style}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-yellow-300">Time of Day</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {timesOfDay.map((time) => (
              <Button
                key={time}
                variant={lightingSettings.timeOfDay === time ? "default" : "outline"}
                size="sm"
                onClick={() => handleSettingChange('timeOfDay', time)}
                className={lightingSettings.timeOfDay === time 
                  ? "bg-gradient-to-r from-yellow-600 to-orange-600 text-white hover:from-yellow-700 hover:to-orange-700" 
                  : "border-slate-600 text-white hover:bg-slate-700 bg-slate-800/40"
                }
              >
                {time}
              </Button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex justify-between">
        <Button
          onClick={onPrevious}
          variant="outline"
          className="border-slate-600 text-white hover:bg-slate-700 bg-slate-800/40"
        >
          <ChevronLeft className="w-4 h-4 mr-2" /> Previous
        </Button>
        <Button
          onClick={onNext}
          className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white"
        >
          Next Step <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </motion.div>
  );
};

export default LightingStep;
