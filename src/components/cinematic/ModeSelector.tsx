
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Zap, Camera, Palette } from 'lucide-react';
import { CinematicMode, CINEMATIC_MODES } from './constants/modes';

interface ModeSelectorProps {
  selectedMode: CinematicMode;
  onModeChange: (mode: CinematicMode) => void;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({ selectedMode, onModeChange }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'zap':
        return <Zap className="w-4 h-4" />;
      case 'camera':
        return <Camera className="w-4 h-4" />;
      case 'palette':
        return <Palette className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full mb-6">
      <Tabs value={selectedMode} onValueChange={(value) => onModeChange(value as CinematicMode)}>
        <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 border border-purple-500/20">
          {CINEMATIC_MODES.map((mode) => (
            <TabsTrigger
              key={mode.id}
              value={mode.id}
              className="flex flex-col items-center gap-1 p-3 data-[state=active]:bg-purple-600/20 data-[state=active]:text-purple-200"
            >
              <div className="flex items-center gap-2">
                {getIcon(mode.icon)}
                <span className="font-medium">{mode.name}</span>
              </div>
              <span className="text-xs text-slate-400 text-center leading-tight">
                {mode.description}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
};

export default ModeSelector;
