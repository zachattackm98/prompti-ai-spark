
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft } from 'lucide-react';

interface FormStep3EmotionProps {
  selectedEmotion: string;
  setSelectedEmotion: (emotion: string) => void;
  subscription: any;
  onNext: () => void;
  onPrevious: () => void;
}

const FormStep3Emotion: React.FC<FormStep3EmotionProps> = ({
  selectedEmotion,
  setSelectedEmotion,
  subscription,
  onNext,
  onPrevious
}) => {
  const emotions = [
    'Dramatic', 'Mysterious', 'Uplifting', 'Melancholic', 
    'Intense', 'Serene', 'Suspenseful', 'Romantic', 
    'Epic', 'Intimate'
  ];

  const availableEmotions = subscription.tier === 'starter' 
    ? emotions.slice(0, 4) 
    : emotions;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Set the Mood</h2>
        <p className="text-gray-400">What emotional tone should your scene have?</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {availableEmotions.map((emotion) => (
          <button
            key={emotion}
            onClick={() => setSelectedEmotion(emotion)}
            className={`p-3 rounded-lg border text-center transition-all ${
              selectedEmotion === emotion
                ? 'border-purple-500 bg-purple-500/20 text-white'
                : 'border-white/20 bg-slate-800/50 hover:border-purple-400 text-gray-300'
            }`}
          >
            {emotion}
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        <Button onClick={onPrevious} variant="outline" className="flex-1">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        <Button
          onClick={onNext}
          disabled={!selectedEmotion}
          className="flex-1 bg-purple-600 hover:bg-purple-700"
        >
          Continue
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default FormStep3Emotion;
