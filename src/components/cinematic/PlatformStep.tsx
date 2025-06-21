
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Lock } from 'lucide-react';
import { platforms } from './constants';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();

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

  const emotions = ['Dramatic', 'Mysterious', 'Uplifting', 'Melancholic', 'Intense', 'Serene', 'Suspenseful', 'Romantic', 'Epic', 'Intimate'];

  return (
    <motion.div 
      className="space-y-4 sm:space-y-6"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center space-y-2 sm:space-y-3 px-2">
        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white leading-tight">
          Choose Your AI Video Platform
        </h3>
        <p className="text-gray-300 text-sm sm:text-base max-w-md mx-auto">
          Select which AI video generation platform you'll be using
        </p>
      </div>
      
      <div className="space-y-3 px-2 sm:px-0">
        {platforms.map((platform) => {
          const isAvailable = availablePlatforms.includes(platform.id);
          return (
            <motion.div
              key={platform.id}
              whileHover={isAvailable ? { scale: isMobile ? 1 : 1.02 } : {}}
              whileTap={isAvailable ? { scale: 0.98 } : {}}
              className={`
                relative rounded-xl border-2 cursor-pointer transition-all duration-200
                ${isMobile ? 'p-4 min-h-[80px]' : 'p-4 sm:p-5'}
                ${!isAvailable
                  ? 'border-slate-700 bg-slate-800/20 opacity-60'
                  : selectedPlatform === platform.id
                  ? 'border-purple-400 bg-purple-900/30 shadow-lg'
                  : 'border-slate-600 bg-slate-800/40 hover:border-purple-400/50'
                }
              `}
              onClick={() => handlePlatformSelect(platform.id)}
            >
              {!isAvailable && (
                <div className="absolute top-3 right-3">
                  <Lock className="w-4 h-4 text-gray-500" />
                </div>
              )}
              <div className="flex items-start space-x-3 sm:space-x-4">
                <span className={`flex-shrink-0 ${isMobile ? 'text-2xl' : 'text-2xl sm:text-3xl'}`}>
                  {platform.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <h4 className={`font-semibold ${isMobile ? 'text-base' : 'text-base sm:text-lg'} ${isAvailable ? 'text-white' : 'text-gray-500'}`}>
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

      <div className="space-y-3 sm:space-y-4 px-2 sm:px-0">
        <h4 className="text-base sm:text-lg font-semibold text-white">Select Emotion/Mood</h4>
        <div className={`grid gap-2 ${isMobile ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5'}`}>
          {emotions.map((emotion) => {
            const isAvailable = availableEmotions.includes(emotion);
            return (
              <Button
                key={emotion}
                variant={selectedEmotion === emotion ? "default" : "outline"}
                size={isMobile ? "default" : "sm"}
                onClick={() => handleEmotionSelect(emotion)}
                disabled={!isAvailable}
                className={`
                  transition-all duration-200
                  ${isMobile ? 'h-10 text-sm px-3' : 'text-xs sm:text-sm'}
                  ${!isAvailable
                    ? "border-slate-700 text-gray-500 cursor-not-allowed opacity-50"
                    : selectedEmotion === emotion 
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700" 
                    : "border-slate-600 text-white hover:bg-slate-700 bg-slate-800/40"
                  }
                `}
              >
                {emotion}
                {!isAvailable && <Lock className="w-3 h-3 ml-1" />}
              </Button>
            );
          })}
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between gap-3 px-2 sm:px-0 pt-2">
        <Button
          onClick={onPrevious}
          variant="outline"
          size={isMobile ? "lg" : "sm"}
          className={`
            border-slate-600 text-white hover:bg-slate-700 bg-slate-800/40 
            transition-all duration-200
            ${isMobile ? 'h-12 order-2' : 'order-1'}
          `}
        >
          <ChevronLeft className="w-4 h-4 mr-2" /> Previous
        </Button>
        <Button
          onClick={onNext}
          disabled={!selectedPlatform || !selectedEmotion}
          size={isMobile ? "lg" : "sm"}
          className={`
            bg-gradient-to-r from-purple-600 to-pink-600 
            hover:from-purple-700 hover:to-pink-700 text-white
            transition-all duration-200
            ${isMobile ? 'h-12 order-1' : 'order-2'}
          `}
        >
          Next Step <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </motion.div>
  );
};

export default PlatformStep;
