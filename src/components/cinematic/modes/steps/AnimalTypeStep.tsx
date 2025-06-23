
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Camera, ChevronRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileOptimizedCard from './MobileOptimizedCard';
import ResponsiveContainer from './ResponsiveContainer';

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
  const [isFocused, setIsFocused] = useState(false);
  const isMobile = useIsMobile();

  const animalSuggestions = [
    { name: 'Cat', emoji: '🐱' },
    { name: 'Dog', emoji: '🐕' },
    { name: 'Bird', emoji: '🐦' },
    { name: 'Hamster', emoji: '🐹' },
    { name: 'Rabbit', emoji: '🐰' },
    { name: 'Fish', emoji: '🐠' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-none"
    >
      <MobileOptimizedCard
        gradientFrom="from-slate-900/90"
        gradientTo="to-green-900/20"
        borderColor="border-green-500/30"
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-10 -right-10 w-32 h-32 bg-green-500/10 rounded-full blur-xl"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-xl"
            animate={{ 
              scale: [1.2, 1, 1.2],
              opacity: [0.4, 0.2, 0.4]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </div>

        <ResponsiveContainer spacing="normal">
          {/* Header */}
          <motion.div 
            className="text-center space-y-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-3 text-green-300">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <Camera className={isMobile ? "w-5 h-5" : "w-6 h-6"} />
              </motion.div>
              <h2 className={`font-bold bg-gradient-to-r from-green-300 via-emerald-300 to-teal-300 bg-clip-text text-transparent ${
                isMobile ? 'text-xl' : 'text-2xl'
              }`}>
                Animal Vlog Mode
              </h2>
              <Sparkles className={`text-green-400 ${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} />
            </div>
            <p className={`text-slate-300 font-medium ${isMobile ? 'text-sm' : 'text-base'}`}>
              Step 1: Choose your adorable star
            </p>
            <p className={`text-slate-400 max-w-md mx-auto ${isMobile ? 'text-xs' : 'text-sm'}`}>
              Tell us about the animal that will be the main character in your vlog
            </p>
          </motion.div>

          {/* Input Section */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div className="space-y-3">
              <label className={`block font-semibold text-white ${isMobile ? 'text-sm' : 'text-base'}`}>
                What kind of animal is your star?
              </label>
              
              <div className="relative">
                <Input
                  value={animalType}
                  onChange={(e) => setAnimalType(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder="Enter animal type (e.g., cat, dog, bird, hamster...)"
                  className={`
                    ${isMobile ? 'h-12 text-base' : 'h-14 text-lg'} 
                    bg-slate-800/50 border-2 text-white placeholder-slate-400
                    transition-all duration-300 focus:ring-2 focus:ring-green-400/20
                    ${isFocused ? 'border-green-400/60 shadow-lg shadow-green-400/20' : 'border-slate-600'}
                  `}
                />
                
                {/* Focus glow effect */}
                {isFocused && (
                  <motion.div
                    className="absolute inset-0 border-2 border-green-400/30 rounded-md pointer-events-none"
                    initial={{ opacity: 0, scale: 1 }}
                    animate={{ opacity: 1, scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </div>
            </div>

            {/* Animal Suggestions */}
            <motion.div 
              className="space-y-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <p className={`font-medium text-slate-300 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                Popular choices:
              </p>
              <div className={`grid gap-2 ${isMobile ? 'grid-cols-3' : 'grid-cols-3 sm:grid-cols-6'}`}>
                {animalSuggestions.map((animal, index) => (
                  <motion.button
                    key={animal.name}
                    onClick={() => setAnimalType(animal.name.toLowerCase())}
                    className={`
                      ${isMobile ? 'p-2' : 'p-3'} rounded-lg border transition-all duration-200
                      hover:border-green-400/60 hover:bg-green-500/10
                      ${animalType.toLowerCase() === animal.name.toLowerCase()
                        ? 'border-green-400/60 bg-green-500/20 text-green-300'
                        : 'border-slate-600 bg-slate-800/30 text-slate-300 hover:text-green-300'
                      }
                    `}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + index * 0.05, duration: 0.3 }}
                  >
                    <div className={isMobile ? 'text-xl mb-1' : 'text-2xl mb-1'}>
                      {animal.emoji}
                    </div>
                    <div className={`font-medium ${isMobile ? 'text-xs' : 'text-xs'}`}>
                      {animal.name}
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Next Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <Button
              onClick={onNext}
              disabled={!animalType.trim()}
              className={`
                w-full ${isMobile ? 'h-12 text-base' : 'h-14 text-lg'} font-semibold transition-all duration-300
                ${animalType.trim()
                  ? 'bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 shadow-lg shadow-green-500/20'
                  : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                }
              `}
            >
              <motion.div 
                className="flex items-center gap-2"
                whileHover={animalType.trim() ? { x: 5 } : {}}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              >
                Next: Scene Description
                <ChevronRight className="w-4 h-4" />
              </motion.div>
            </Button>
          </motion.div>
        </ResponsiveContainer>
      </MobileOptimizedCard>
    </motion.div>
  );
};

export default AnimalTypeStep;
