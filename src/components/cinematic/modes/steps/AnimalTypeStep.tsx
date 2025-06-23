
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Camera, ChevronRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

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
    >
      <Card className="relative overflow-hidden bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-green-900/20 border border-green-500/30 backdrop-blur-sm p-8">
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

        <div className="relative z-10 space-y-8">
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
                <Camera className="w-6 h-6" />
              </motion.div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-green-300 via-emerald-300 to-teal-300 bg-clip-text text-transparent">
                Animal Vlog Mode
              </h2>
              <Sparkles className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-slate-300 text-base font-medium">
              Step 1: Choose your adorable star
            </p>
            <p className="text-slate-400 text-sm max-w-md mx-auto">
              Tell us about the animal that will be the main character in your vlog
            </p>
          </motion.div>

          {/* Input Section */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div className="space-y-4">
              <label className="block text-base font-semibold text-white">
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
                    h-14 text-lg bg-slate-800/50 border-2 text-white placeholder-slate-400
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
              <p className="text-sm font-medium text-slate-300">Popular choices:</p>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {animalSuggestions.map((animal, index) => (
                  <motion.button
                    key={animal.name}
                    onClick={() => setAnimalType(animal.name.toLowerCase())}
                    className={`
                      p-3 rounded-lg border transition-all duration-200
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
                    <div className="text-2xl mb-1">{animal.emoji}</div>
                    <div className="text-xs font-medium">{animal.name}</div>
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
                w-full h-14 text-lg font-semibold transition-all duration-300
                ${animalType.trim()
                  ? 'bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 shadow-lg shadow-green-500/20'
                  : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                }
              `}
            >
              <motion.div 
                className="flex items-center gap-3"
                whileHover={animalType.trim() ? { x: 5 } : {}}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              >
                Next: Scene Description
                <ChevronRight className="w-5 h-5" />
              </motion.div>
            </Button>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
};

export default AnimalTypeStep;
