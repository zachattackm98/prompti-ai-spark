
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Lock } from 'lucide-react';
import { platforms } from './constants';

interface PlatformStepProps {
  selectedPlatform: string;
  setSelectedPlatform: (platform: string) => void;
  selectedEmotion: string;
  setSelectedEmotion: (emotion: string) => void;
  onNext: () => void;
  onPrevious: () => void;
  availablePlatforms: string[];
  availableEmotions: string[];
}

const PlatformStep: React.FC<PlatformStepProps> = ({
  selectedPlatform,
  setSelectedPlatform,
  selectedEmotion,
  setSelectedEmotion,
  onNext,
  onPrevious,
  availablePlatforms,
  availableEmotions
}) => {
  const handlePlatformSelect = (platformId: string) => {
    if (availablePlatforms.includes(platformId)) {
      setSelectedPlatform(platformId);
    }
  };

  const handleEmotionSelect = (emotion: string) => {
    if (availableEmotions.includes(emotion)) {
      setSelectedEmotion(emotion);
    }
  };

  return (
    <motion.div 
      className="space-y-4 sm:space-y-6"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center space-y-2 sm:space-y-3">
        <h3 className="text-xl sm:text-2xl font-bold text-white">Choose Your AI Video Platform</h3>
        <p className="text-gray-300 text-sm sm:text-base">Select which AI video generation platform you'll be using</p>
      </div>
      
      <div className="grid grid-cols-1 gap-3 sm:gap-4">
        {platforms.map((platform) => {
          const isAvailable = availablePlatforms.includes(platform.id);
          return (
            <motion.div
              key={platform.id}
              whileHover={isAvailable ? { scale: 1.02 } : {}}
              whileTap={isAvailable ? { scale: 0.98 } : {}}
              className={`p-4 sm:p-5 rounded-xl border-2 cursor-pointer transition-all relative ${
                !isAvailable
                  ? 'border-slate-700 bg-slate-800/20 opacity-60'
                  : selectedPlatform === platform.id
                  ? 'border-purple-400 bg-purple-900/30'
                  : 'border-slate-600 bg-slate-800/40 hover:border-purple-400/50'
              }`}
              onClick={() => handlePlatformSelect(platform.id)}
            >
              {!isAvailable && (
                <div className="absolute top-2 right-2">
                  <Lock className="w-4 h-4 text-gray-500" />
                </div>
              )}
              <div className="flex items-start space-x-3 sm:space-x-4">
                <span className="text-2xl sm:text-3xl flex-shrink-0">{platform.icon}</span>
                <div className="flex-1 min-w-0">
                  <h4 className={`font-semibold text-base sm:text-lg ${isAvailable ? 'text-white' : 'text-gray-500'}`}>
                    {platform.name}
                  </h4>
                  <p className={`font-medium text-xs sm:text-sm mb-1 sm:mb-2 ${isAvailable ? 'text-purple-300' : 'text-gray-600'}`}>
                    {platform.style}
                  </p>
                  <p className={`text-xs sm:text-sm leading-relaxed ${isAvailable ? 'text-gray-400' : 'text-gray-600'}`}>
                    {platform.description}
                  </p>
                  {!isAvailable && (
                    <p className="text-xs text-orange-400 mt-2 font-medium">
                      Upgrade to access this platform
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="space-y-3 sm:space-y-4">
        <h4 className="text-base sm:text-lg font-semibold text-white">Select Emotion/Mood</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {['Dramatic', 'Mysterious', 'Uplifting', 'Melancholic', 'Intense', 'Serene', 'Suspenseful', 'Romantic', 'Epic', 'Intimate'].map((emotion) => {
            const isAvailable = availableEmotions.includes(emotion);
            return (
              <Button
                key={emotion}
                variant={selectedEmotion === emotion ? "default" : "outline"}
                size="sm"
                onClick={() => handleEmotionSelect(emotion)}
                disabled={!isAvailable}
                className={`text-xs sm:text-sm ${
                  !isAvailable
                    ? "border-slate-700 text-gray-500 cursor-not-allowed opacity-50"
                    : selectedEmotion === emotion 
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700" 
                    : "border-slate-600 text-white hover:bg-slate-700 bg-slate-800/40"
                }`}
              >
                {emotion}
                {!isAvailable && <Lock className="w-3 h-3 ml-1" />}
              </Button>
            );
          })}
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
          disabled={!selectedPlatform || !selectedEmotion}
          size="sm"
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
        >
          Next Step <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </motion.div>
  );
};

export default PlatformStep;
