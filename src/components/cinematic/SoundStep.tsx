
import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Volume2, ArrowLeft, ArrowRight } from 'lucide-react';
import { SoundSettings } from './hooks/types';

interface SoundStepProps {
  soundSettings: SoundSettings;
  setSoundSettings: (settings: SoundSettings) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const SoundStep: React.FC<SoundStepProps> = ({
  soundSettings,
  setSoundSettings,
  onNext,
  onPrevious
}) => {
  const musicGenres = [
    { value: 'cinematic', label: 'Cinematic' },
    { value: 'ambient', label: 'Ambient' },
    { value: 'electronic', label: 'Electronic' },
    { value: 'orchestral', label: 'Orchestral' },
    { value: 'rock', label: 'Rock' },
    { value: 'jazz', label: 'Jazz' },
    { value: 'folk', label: 'Folk' },
    { value: 'minimal', label: 'Minimal' }
  ];

  const soundEffect = [
    { value: 'subtle', label: 'Subtle' },
    { value: 'realistic', label: 'Realistic' },
    { value: 'enhanced', label: 'Enhanced' },
    { value: 'dramatic', label: 'Dramatic' },
    { value: 'minimal', label: 'Minimal' },
    { value: 'immersive', label: 'Immersive' }
  ];

  const ambienceTypes = [
    { value: 'urban', label: 'Urban' },
    { value: 'nature', label: 'Nature' },
    { value: 'indoor', label: 'Indoor' },
    { value: 'outdoor', label: 'Outdoor' },
    { value: 'industrial', label: 'Industrial' },
    { value: 'peaceful', label: 'Peaceful' },
    { value: 'busy', label: 'Busy' },
    { value: 'quiet', label: 'Quiet' }
  ];

  const handleToggleSound = (enabled: boolean) => {
    setSoundSettings({
      ...soundSettings,
      hasSound: enabled,
      musicGenre: enabled && !soundSettings.musicGenre ? 'cinematic' : soundSettings.musicGenre,
      soundEffects: enabled && !soundSettings.soundEffects ? 'realistic' : soundSettings.soundEffects,
      ambience: enabled && !soundSettings.ambience ? 'nature' : soundSettings.ambience
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-gradient-to-br from-slate-800/50 to-purple-900/30 border-purple-500/30 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Volume2 className="w-6 h-6 text-purple-400" />
          <h3 className="text-xl font-semibold text-white">Sound Options</h3>
          <span className="text-sm text-purple-300 bg-purple-900/30 px-2 py-1 rounded-full">
            Optional - All Tiers
          </span>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="sound-toggle" className="text-white font-medium">
                Include Sound Design
              </Label>
              <p className="text-sm text-gray-400 mt-1">
                Add music, sound effects, and ambience to your video
              </p>
            </div>
            <Switch
              id="sound-toggle"
              checked={soundSettings.hasSound}
              onCheckedChange={handleToggleSound}
            />
          </div>

          {soundSettings.hasSound && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-4"
            >
              <div>
                <Label className="text-white font-medium mb-2 block">Music Genre</Label>
                <Select
                  value={soundSettings.musicGenre}
                  onValueChange={(value) => setSoundSettings({ ...soundSettings, musicGenre: value })}
                >
                  <SelectTrigger className="bg-slate-800/60 border-purple-500/30 text-white">
                    <SelectValue placeholder="Select music genre" />
                  </SelectTrigger>
                  <SelectContent>
                    {musicGenres.map((genre) => (
                      <SelectItem key={genre.value} value={genre.value}>
                        {genre.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-white font-medium mb-2 block">Sound Effects</Label>
                <Select
                  value={soundSettings.soundEffects}
                  onValueChange={(value) => setSoundSettings({ ...soundSettings, soundEffects: value })}
                >
                  <SelectTrigger className="bg-slate-800/60 border-purple-500/30 text-white">
                    <SelectValue placeholder="Select sound effects style" />
                  </SelectTrigger>
                  <SelectContent>
                    {soundEffect.map((effect) => (
                      <SelectItem key={effect.value} value={effect.value}>
                        {effect.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-white font-medium mb-2 block">Ambience</Label>
                <Select
                  value={soundSettings.ambience}
                  onValueChange={(value) => setSoundSettings({ ...soundSettings, ambience: value })}
                >
                  <SelectTrigger className="bg-slate-800/60 border-purple-500/30 text-white">
                    <SelectValue placeholder="Select ambience type" />
                  </SelectTrigger>
                  <SelectContent>
                    {ambienceTypes.map((amb) => (
                      <SelectItem key={amb.value} value={amb.value}>
                        {amb.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </motion.div>
          )}
        </div>

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={onPrevious}
            className="border-purple-500/30 text-purple-300 hover:bg-purple-900/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          <Button
            onClick={onNext}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            Continue
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default SoundStep;
