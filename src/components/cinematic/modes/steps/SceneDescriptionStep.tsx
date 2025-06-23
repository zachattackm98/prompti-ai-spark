
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Camera, ChevronRight } from 'lucide-react';
import { ANIMAL_VLOG_VIBES } from '../../constants/modes';

interface SceneDescriptionStepProps {
  animalType: string;
  sceneIdea: string;
  setSceneIdea: (value: string) => void;
  selectedVibe: string;
  setSelectedVibe: (value: string) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const SceneDescriptionStep: React.FC<SceneDescriptionStepProps> = ({
  animalType,
  sceneIdea,
  setSceneIdea,
  selectedVibe,
  setSelectedVibe,
  onNext,
  onPrevious
}) => {
  return (
    <Card className="bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-purple-900/20 border border-purple-500/20 backdrop-blur-sm p-6">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-purple-300">
            <Camera className="w-5 h-5" />
            <h2 className="text-xl font-semibold">Animal Vlog Mode</h2>
          </div>
          <p className="text-slate-400 text-sm">
            Step 2: Describe the scene with your {animalType}
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-3">
            <label className="block text-sm font-medium text-white">Scene Description</label>
            <Textarea
              value={sceneIdea}
              onChange={(e) => setSceneIdea(e.target.value)}
              placeholder={`Describe what your ${animalType} is doing... (e.g., 'My cat exploring a cardboard box' or 'Dog playing in the park')`}
              className="min-h-[100px] bg-slate-800/50 border-slate-600 text-white placeholder-slate-400"
            />
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-white">Vibe</label>
            <Select value={selectedVibe} onValueChange={setSelectedVibe}>
              <SelectTrigger className="bg-slate-800/50 border-slate-600 text-white">
                <SelectValue placeholder="Select the mood/vibe" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                {ANIMAL_VLOG_VIBES.map((vibe) => (
                  <SelectItem key={vibe} value={vibe.toLowerCase()} className="text-white hover:bg-slate-700">
                    {vibe}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={onPrevious}
            variant="outline"
            className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            Back
          </Button>
          <Button
            onClick={onNext}
            disabled={!sceneIdea.trim() || !selectedVibe}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            <div className="flex items-center gap-2">
              Next: Dialogue
              <ChevronRight className="w-4 h-4" />
            </div>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default SceneDescriptionStep;
