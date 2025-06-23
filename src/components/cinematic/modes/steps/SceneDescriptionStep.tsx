
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Camera, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
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
  const [isFocused, setIsFocused] = useState(false);

  const sceneExamples = [
    `My ${animalType} exploring a cardboard box`,
    `${animalType} playing in the park`,
    `Feeding time with my ${animalType}`,
    `${animalType} learning a new trick`,
    `Cozy nap time with my ${animalType}`,
    `${animalType} meeting a new friend`
  ];

  const vibeColors = {
    playful: 'from-orange-500/20 to-yellow-500/20 border-orange-400/40',
    calm: 'from-blue-500/20 to-cyan-500/20 border-blue-400/40',
    energetic: 'from-red-500/20 to-pink-500/20 border-red-400/40',
    cute: 'from-pink-500/20 to-rose-500/20 border-pink-400/40',
    funny: 'from-green-500/20 to-lime-500/20 border-green-400/40',
    heartwarming: 'from-purple-500/20 to-indigo-500/20 border-purple-400/40'
  };

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
              <Camera className="w-6 h-6" />
              <h2 className="text-2xl font-bold bg-gradient-to-r from-green-300 via-emerald-300 to-teal-300 bg-clip-text text-transparent">
                Animal Vlog Mode
              </h2>
              <Sparkles className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-slate-300 text-base font-medium">
              Step 2: Describe the scene with your {animalType}
            </p>
          </motion.div>

          {/* Form Content */}
          <div className="space-y-8">
            {/* Scene Description */}
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <label className="block text-base font-semibold text-white">
                What's happening in your scene?
              </label>
              
              <div className="relative">
                <Textarea
                  value={sceneIdea}
                  onChange={(e) => setSceneIdea(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder={`Describe what your ${animalType} is doing...`}
                  className={`
                    min-h-[120px] text-base bg-slate-800/50 border-2 text-white placeholder-slate-400
                    transition-all duration-300 focus:ring-2 focus:ring-green-400/20 resize-none
                    ${isFocused ? 'border-green-400/60 shadow-lg shadow-green-400/20' : 'border-slate-600'}
                  `}
                />
                
                {/* Character count */}
                <div className="absolute bottom-3 right-3 text-xs text-slate-400">
                  {sceneIdea.length} characters
                </div>
              </div>

              {/* Scene Examples */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-slate-300">Need inspiration? Try these:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {sceneExamples.slice(0, 4).map((example, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setSceneIdea(example)}
                      className="text-left p-3 rounded-lg border border-slate-600 bg-slate-800/30 text-slate-300 hover:border-green-400/60 hover:bg-green-500/10 hover:text-green-300 transition-all duration-200 text-sm"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.05, duration: 0.3 }}
                    >
                      "{example}"
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Vibe Selection */}
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <label className="block text-base font-semibold text-white">
                What's the vibe?
              </label>
              
              <Select value={selectedVibe} onValueChange={setSelectedVibe}>
                <SelectTrigger className="h-12 text-base bg-slate-800/50 border-slate-600 text-white hover:border-green-400/60 transition-all duration-200">
                  <SelectValue placeholder="Select the mood/vibe" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600 backdrop-blur-md">
                  {ANIMAL_VLOG_VIBES.map((vibe) => (
                    <SelectItem 
                      key={vibe} 
                      value={vibe.toLowerCase()} 
                      className="text-white hover:bg-slate-700 focus:bg-slate-700 cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${vibeColors[vibe.toLowerCase()] || 'from-purple-500/50 to-pink-500/50'}`} />
                        {vibe}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>
          </div>

          {/* Action Buttons */}
          <motion.div 
            className="flex gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <Button
              onClick={onPrevious}
              variant="outline"
              className="flex-1 h-12 border-slate-600 text-slate-300 hover:bg-slate-700 hover:border-slate-500"
            >
              <div className="flex items-center gap-2">
                <ChevronLeft className="w-4 h-4" />
                Back
              </div>
            </Button>
            
            <Button
              onClick={onNext}
              disabled={!sceneIdea.trim() || !selectedVibe}
              className={`
                flex-1 h-12 text-base font-semibold transition-all duration-300
                ${sceneIdea.trim() && selectedVibe
                  ? 'bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 shadow-lg shadow-green-500/20'
                  : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                }
              `}
            >
              <motion.div 
                className="flex items-center gap-2"
                whileHover={sceneIdea.trim() && selectedVibe ? { x: 5 } : {}}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              >
                Next: Dialogue
                <ChevronRight className="w-4 h-4" />
              </motion.div>
            </Button>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
};

export default SceneDescriptionStep;
