
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Camera, ChevronRight, Heart, Sparkles, Star, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

interface VibeSelectionStepProps {
  selectedVibe: string;
  setSelectedVibe: (value: string) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const VibeSelectionStep: React.FC<VibeSelectionStepProps> = ({
  selectedVibe,
  setSelectedVibe,
  onNext,
  onPrevious
}) => {
  const isMobile = useIsMobile();

  const vibeOptions = [
    { 
      id: 'playful', 
      name: 'Playful & Fun', 
      icon: <Sparkles className="w-5 h-5" />,
      description: 'Energetic and joyful content',
      gradient: 'from-yellow-500/20 to-orange-500/20',
      borderColor: 'border-yellow-400/40'
    },
    { 
      id: 'cute', 
      name: 'Cute & Adorable', 
      icon: <Heart className="w-5 h-5" />,
      description: 'Heartwarming and sweet moments',
      gradient: 'from-pink-500/20 to-rose-500/20',
      borderColor: 'border-pink-400/40'
    },
    { 
      id: 'majestic', 
      name: 'Majestic & Noble', 
      icon: <Star className="w-5 h-5" />,
      description: 'Elegant and dignified presence',
      gradient: 'from-purple-500/20 to-indigo-500/20',
      borderColor: 'border-purple-400/40'
    },
    { 
      id: 'peaceful', 
      name: 'Peaceful & Calm', 
      icon: <Sun className="w-5 h-5" />,
      description: 'Serene and tranquil atmosphere',
      gradient: 'from-blue-500/20 to-teal-500/20',
      borderColor: 'border-blue-400/40'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-none"
    >
      <Card className={`
        relative overflow-hidden bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-green-900/20 
        border border-green-500/30 backdrop-blur-sm
        ${isMobile ? 'p-4' : 'p-6 sm:p-8'}
      `}>
        {/* Background Animation */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-10 -right-10 w-32 h-32 bg-green-500/10 rounded-full blur-xl"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
        </div>

        <div className="relative z-10 space-y-6">
          {/* Header */}
          <motion.div 
            className="text-center space-y-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-3 text-green-300">
              <Camera className="w-5 h-5 sm:w-6 sm:h-6" />
              <h2 className={`font-bold bg-gradient-to-r from-green-300 via-emerald-300 to-teal-300 bg-clip-text text-transparent ${
                isMobile ? 'text-xl' : 'text-2xl'
              }`}>
                Animal Vlog Mode
              </h2>
            </div>
            <p className={`text-slate-300 font-medium ${isMobile ? 'text-sm' : 'text-base'}`}>
              Step 2: Choose the vibe
            </p>
            <p className={`text-slate-400 max-w-md mx-auto ${isMobile ? 'text-xs' : 'text-sm'}`}>
              What kind of mood should your animal vlog have?
            </p>
          </motion.div>

          {/* Vibe Options */}
          <motion.div 
            className={`grid gap-3 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {vibeOptions.map((vibe, index) => (
              <motion.button
                key={vibe.id}
                onClick={() => setSelectedVibe(vibe.id)}
                className={`
                  relative p-4 rounded-xl border-2 transition-all duration-300 text-left
                  backdrop-blur-sm hover:backdrop-blur-md group
                  ${selectedVibe === vibe.id 
                    ? `bg-gradient-to-br ${vibe.gradient} ${vibe.borderColor} shadow-lg shadow-green-500/20`
                    : 'bg-gradient-to-br from-slate-800/30 to-slate-700/30 border-slate-600 hover:border-green-400/40'
                  }
                `}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
              >
                <div className="flex items-start gap-3">
                  <div className={`
                    flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300
                    ${selectedVibe === vibe.id ? 'bg-white/10' : 'bg-white/5 group-hover:bg-white/10'}
                  `}>
                    <div className={`
                      transition-colors duration-300
                      ${selectedVibe === vibe.id ? 'text-green-300' : 'text-slate-400 group-hover:text-green-400'}
                    `}>
                      {vibe.icon}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className={`
                      font-semibold transition-colors duration-300
                      ${selectedVibe === vibe.id ? 'text-white' : 'text-slate-300 group-hover:text-white'}
                      ${isMobile ? 'text-sm' : 'text-base'}
                    `}>
                      {vibe.name}
                    </h4>
                    <p className={`
                      transition-colors duration-300 mt-1
                      ${selectedVibe === vibe.id ? 'text-slate-300' : 'text-slate-400 group-hover:text-slate-300'}
                      ${isMobile ? 'text-xs' : 'text-sm'}
                    `}>
                      {vibe.description}
                    </p>
                  </div>
                </div>

                {selectedVibe === vibe.id && (
                  <motion.div
                    className="absolute top-2 right-2 w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </motion.div>

          {/* Navigation Buttons */}
          <motion.div
            className={`flex gap-3 ${isMobile ? 'flex-col' : 'flex-row'}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <Button
              onClick={onPrevious}
              variant="outline"
              className={`
                border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white
                ${isMobile ? 'h-12' : 'flex-1 h-14'}
              `}
            >
              Back
            </Button>
            <Button
              onClick={onNext}
              disabled={!selectedVibe}
              className={`
                transition-all duration-300
                ${selectedVibe
                  ? 'bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 shadow-lg shadow-green-500/20'
                  : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                }
                ${isMobile ? 'h-12' : 'flex-1 h-14'}
              `}
            >
              <motion.div 
                className="flex items-center gap-2"
                whileHover={selectedVibe ? { x: 5 } : {}}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              >
                Next: Add Dialogue
                <ChevronRight className="w-4 h-4" />
              </motion.div>
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default VibeSelectionStep;
