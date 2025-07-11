import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
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
  const musicGenres = [{
    value: 'cinematic',
    label: 'Cinematic'
  }, {
    value: 'ambient',
    label: 'Ambient'
  }, {
    value: 'electronic',
    label: 'Electronic'
  }, {
    value: 'orchestral',
    label: 'Orchestral'
  }, {
    value: 'rock',
    label: 'Rock'
  }, {
    value: 'jazz',
    label: 'Jazz'
  }, {
    value: 'folk',
    label: 'Folk'
  }, {
    value: 'minimal',
    label: 'Minimal'
  }];
  const soundEffect = [{
    value: 'subtle',
    label: 'Subtle'
  }, {
    value: 'realistic',
    label: 'Realistic'
  }, {
    value: 'enhanced',
    label: 'Enhanced'
  }, {
    value: 'dramatic',
    label: 'Dramatic'
  }, {
    value: 'minimal',
    label: 'Minimal'
  }, {
    value: 'immersive',
    label: 'Immersive'
  }];
  const ambienceTypes = [{
    value: 'urban',
    label: 'Urban'
  }, {
    value: 'nature',
    label: 'Nature'
  }, {
    value: 'indoor',
    label: 'Indoor'
  }, {
    value: 'outdoor',
    label: 'Outdoor'
  }, {
    value: 'industrial',
    label: 'Industrial'
  }, {
    value: 'peaceful',
    label: 'Peaceful'
  }, {
    value: 'busy',
    label: 'Busy'
  }, {
    value: 'quiet',
    label: 'Quiet'
  }];
  const handleToggleSound = (enabled: boolean) => {
    setSoundSettings({
      ...soundSettings,
      hasSound: enabled
    });
  };
  return <motion.div initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} exit={{
    opacity: 0,
    y: -20
  }} transition={{
    duration: 0.5
  }}>
      <Card className="bg-slate-800 border-slate-600 p-4 sm:p-6">
        {/* Header - Mobile optimized */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <Volume2 className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400 flex-shrink-0" />
            <h3 className="text-lg sm:text-xl font-semibold text-white">Sound Options</h3>
          </div>
          <span className="text-xs sm:text-sm text-purple-300 bg-purple-900/30 px-2 py-1 rounded-full self-start sm:self-center">
            Optional - All Tiers
          </span>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {/* Toggle Switch - Mobile optimized */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 p-3 sm:p-0">
            <div className="flex-1">
              <Label htmlFor="sound-toggle" className="text-white font-medium text-sm sm:text-base">
                Include Sound Design
              </Label>
              <p className="text-xs sm:text-sm mt-1 text-gray-950">
                Add music, sound effects, and ambience to your video
              </p>
            </div>
            <div className="flex justify-end sm:justify-center">
              <Switch id="sound-toggle" checked={soundSettings.hasSound} onCheckedChange={handleToggleSound} className="scale-110 sm:scale-100" />
            </div>
          </div>

          {soundSettings.hasSound && <motion.div initial={{
          opacity: 0,
          height: 0
        }} animate={{
          opacity: 1,
          height: 'auto'
        }} className="space-y-4 sm:space-y-4">
              {/* Sound Description */}
              <div>
                <Label className="text-white font-medium mb-2 block text-sm sm:text-base">Sound Description</Label>
                <Textarea placeholder="Describe the specific sounds, music, or audio atmosphere you want..." value={soundSettings.soundDescription || ''} onChange={e => setSoundSettings({
              ...soundSettings,
              soundDescription: e.target.value
            })} className="bg-slate-800/60 border-purple-500/30 text-white min-h-[100px] sm:min-h-[100px] placeholder:text-gray-400 text-sm sm:text-base" />
                <p className="text-xs text-gray-400 mt-1">
                  Be specific about the audio elements you want in your video
                </p>
              </div>

              {/* Music Genre */}
              <div>
                <Label className="text-white font-medium mb-2 block text-sm sm:text-base">Music Genre (Optional)</Label>
                <Select value={soundSettings.musicGenre || ''} onValueChange={value => setSoundSettings({
              ...soundSettings,
              musicGenre: value || undefined
            })}>
                  <SelectTrigger className="bg-slate-800/60 border-purple-500/30 text-white h-10 sm:h-10 text-sm sm:text-base">
                    <SelectValue placeholder="Select music genre (optional)" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-purple-500/30 z-50">
                    {musicGenres.map(genre => <SelectItem key={genre.value} value={genre.value} className="text-white hover:bg-slate-700 focus:bg-slate-700">
                        {genre.label}
                      </SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              {/* Sound Effects */}
              <div>
                <Label className="text-white font-medium mb-2 block text-sm sm:text-base">Sound Effects (Optional)</Label>
                <Select value={soundSettings.soundEffects || ''} onValueChange={value => setSoundSettings({
              ...soundSettings,
              soundEffects: value || undefined
            })}>
                  <SelectTrigger className="bg-slate-800/60 border-purple-500/30 text-white h-10 sm:h-10 text-sm sm:text-base">
                    <SelectValue placeholder="Select sound effects style (optional)" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-purple-500/30 z-50">
                    {soundEffect.map(effect => <SelectItem key={effect.value} value={effect.value} className="text-white hover:bg-slate-700 focus:bg-slate-700">
                        {effect.label}
                      </SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              {/* Ambience */}
              <div>
                <Label className="text-white font-medium mb-2 block text-sm sm:text-base">Ambience (Optional)</Label>
                <Select value={soundSettings.ambience || ''} onValueChange={value => setSoundSettings({
              ...soundSettings,
              ambience: value || undefined
            })}>
                  <SelectTrigger className="bg-slate-800/60 border-purple-500/30 text-white h-10 sm:h-10 text-sm sm:text-base">
                    <SelectValue placeholder="Select ambience type (optional)" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-purple-500/30 z-50">
                    {ambienceTypes.map(amb => <SelectItem key={amb.value} value={amb.value} className="text-white hover:bg-slate-700 focus:bg-slate-700">
                        {amb.label}
                      </SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </motion.div>}
        </div>

        {/* Navigation Buttons - Mobile optimized */}
        <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 mt-6 sm:mt-8">
          <Button variant="outline" onClick={onPrevious} className="border-purple-500/30 text-purple-300 hover:bg-purple-900/20 w-full sm:w-auto h-11 sm:h-10 text-sm sm:text-sm order-2 sm:order-1">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          <Button onClick={onNext} className="bg-purple-600 hover:bg-purple-700 text-white w-full sm:w-auto h-11 sm:h-10 text-sm sm:text-sm order-1 sm:order-2">
            Continue
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </Card>
    </motion.div>;
};
export default SoundStep;