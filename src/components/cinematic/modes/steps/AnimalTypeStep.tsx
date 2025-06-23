
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Camera, ChevronRight } from 'lucide-react';

interface AnimalTypeStepProps {
  animalType: string;
  setAnimalType: (value: string) => void;
  onNext: () => void;
}

const AnimalTypeStep: React.FC<AnimalTypeStepProps> = ({
  animalType,
  setAnimalType,
  onNext
}) => {
  return (
    <Card className="bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-purple-900/20 border border-purple-500/20 backdrop-blur-sm p-6">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-purple-300">
            <Camera className="w-5 h-5" />
            <h2 className="text-xl font-semibold">Animal Vlog Mode</h2>
          </div>
          <p className="text-slate-400 text-sm">Step 1: Choose your animal star</p>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-white">Animal Type</label>
          <Input
            value={animalType}
            onChange={(e) => setAnimalType(e.target.value)}
            placeholder="Enter animal type (e.g., cat, dog, bird, hamster...)"
            className="bg-slate-800/50 border-slate-600 text-white placeholder-slate-400"
          />
        </div>

        <Button
          onClick={onNext}
          disabled={!animalType.trim()}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          <div className="flex items-center gap-2">
            Next: Scene Description
            <ChevronRight className="w-4 h-4" />
          </div>
        </Button>
      </div>
    </Card>
  );
};

export default AnimalTypeStep;
