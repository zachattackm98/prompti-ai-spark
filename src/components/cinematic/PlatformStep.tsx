
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { platforms, emotions } from './constants';

interface PlatformStepProps {
  selectedPlatform: string;
  setSelectedPlatform: (platform: string) => void;
  selectedEmotion: string;
  setSelectedEmotion: (emotion: string) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const PlatformStep: React.FC<PlatformStepProps> = ({
  selectedPlatform,
  setSelectedPlatform,
  selectedEmotion,
  setSelectedEmotion,
  onNext,
  onPrevious
}) => {
  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center space-y-3">
        <h3 className="text-2xl font-bold text-white">Choose Your AI Video Platform</h3>
        <p className="text-gray-300">Select which AI video generation platform you'll be using</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {platforms.map((platform) => (
          <motion.div
            key={platform.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${
              selectedPlatform === platform.id
                ? 'border-purple-400 bg-purple-900/30'
                : 'border-slate-600 bg-slate-800/40 hover:border-purple-400/50'
            }`}
            onClick={() => setSelectedPlatform(platform.id)}
          >
            <div className="flex items-start space-x-4">
              <span className="text-3xl">{platform.icon}</span>
              <div className="flex-1">
                <h4 className="font-semibold text-white text-lg">{platform.name}</h4>
                <p className="text-purple-300 font-medium text-sm mb-2">{platform.style}</p>
                <p className="text-sm text-gray-400 leading-relaxed">{platform.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-white">Select Emotion/Mood</h4>
        <div className="flex flex-wrap gap-2">
          {emotions.map((emotion) => (
            <Button
              key={emotion}
              variant={selectedEmotion === emotion ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedEmotion(emotion)}
              className={selectedEmotion === emotion 
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700" 
                : "border-slate-600 text-white hover:bg-slate-700 bg-slate-800/40"
              }
            >
              {emotion}
            </Button>
          ))}
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
          disabled={!selectedPlatform || !selectedEmotion}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
        >
          Next Step <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </motion.div>
  );
};

export default PlatformStep;
