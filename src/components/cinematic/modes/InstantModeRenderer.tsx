
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Zap, Sparkles, Wand2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface InstantModeRendererProps {
  sceneIdea: string;
  setSceneIdea: (value: string) => void;
  handleGenerate: () => void;
  isLoading: boolean;
  detectedPlatform?: string;
}

const InstantModeRenderer: React.FC<InstantModeRendererProps> = ({
  sceneIdea,
  setSceneIdea,
  handleGenerate,
  isLoading,
  detectedPlatform
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const examplePrompts = [
    "A cinematic shot of a sunset over mountains",
    "Quick social media clip of a dog playing",
    "Dramatic scene of rain falling on a window",
    "Uplifting moment of children laughing in a park"
  ];

  const platformInfo = {
    veo3: { name: 'Veo3', color: 'from-blue-500 to-cyan-500', description: 'Cinematic realism' },
    sora: { name: 'Sora', color: 'from-green-500 to-emerald-500', description: 'Photorealistic' },
    runway: { name: 'Runway', color: 'from-purple-500 to-pink-500', description: 'Artistic style' },
    pika: { name: 'Pika', color: 'from-orange-500 to-red-500', description: 'Dynamic loops' }
  };

  const currentPlatform = detectedPlatform ? platformInfo[detectedPlatform] : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="relative overflow-hidden bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-yellow-900/20 border border-yellow-500/30 backdrop-blur-sm p-8">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-500/10 rounded-full blur-xl"
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.7, 0.3]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-10 -left-10 w-32 h-32 bg-orange-500/10 rounded-full blur-xl"
            animate={{ 
              scale: [1.2, 1, 1.2],
              opacity: [0.4, 0.2, 0.4]
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
        </div>

        <div className="relative z-10 space-y-8">
          {/* Header */}
          <motion.div 
            className="text-center space-y-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-3 text-yellow-300">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Zap className="w-7 h-7" />
              </motion.div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300 bg-clip-text text-transparent">
                Instant Mode
              </h2>
              <Sparkles className="w-6 h-6 text-yellow-400" />
            </div>
            
            <p className="text-slate-300 text-lg font-medium max-w-2xl mx-auto">
              Describe your scene and we'll instantly optimize it for the perfect platform
            </p>
            
            <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
              <Wand2 className="w-4 h-4" />
              <span>AI-powered platform detection and optimization</span>
            </div>
          </motion.div>

          {/* Scene Description */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div className="space-y-4">
              <label className="block text-lg font-semibold text-white">
                Describe Your Vision
              </label>
              
              <div className="relative">
                <Textarea
                  value={sceneIdea}
                  onChange={(e) => setSceneIdea(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder="Describe your scene in detail... The more specific you are, the better we can optimize it!"
                  className={`
                    min-h-[140px] text-lg bg-slate-800/50 border-2 text-white placeholder-slate-400
                    transition-all duration-300 focus:ring-2 focus:ring-yellow-400/20 resize-none
                    ${isFocused ? 'border-yellow-400/60 shadow-lg shadow-yellow-400/20' : 'border-slate-600'}
                  `}
                  disabled={isLoading}
                />
                
                {/* Character count and tips */}
                <div className="absolute bottom-3 right-3 flex items-center gap-2 text-xs text-slate-400">
                  <span>{sceneIdea.length} characters</span>
                  {sceneIdea.length > 50 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-2 h-2 bg-green-400 rounded-full"
                    />
                  )}
                </div>
                
                {/* Focus glow effect */}
                {isFocused && (
                  <motion.div
                    className="absolute inset-0 border-2 border-yellow-400/30 rounded-md pointer-events-none"
                    initial={{ opacity: 0, scale: 1 }}
                    animate={{ opacity: 1, scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </div>
            </div>

            {/* Example Prompts */}
            <motion.div 
              className="space-y-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <p className="text-sm font-medium text-slate-300">Try these examples:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {examplePrompts.map((example, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setSceneIdea(example)}
                    className="text-left p-4 rounded-lg border border-slate-600 bg-slate-800/30 text-slate-300 hover:border-yellow-400/60 hover:bg-yellow-500/10 hover:text-yellow-300 transition-all duration-200 text-sm"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + index * 0.05, duration: 0.3 }}
                    disabled={isLoading}
                  >
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0" />
                      <span>"{example}"</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Platform Detection Display */}
          {currentPlatform && sceneIdea.trim() && (
            <motion.div 
              className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 border border-purple-500/30 rounded-xl p-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <div className="flex items-center gap-3">
                <motion.div
                  className="w-3 h-3 rounded-full bg-gradient-to-r from-green-400 to-emerald-400"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <div className="flex-1">
                  <span className="text-sm font-medium text-white">
                    AI detected optimal platform: 
                  </span>
                  <span className={`ml-2 font-bold bg-gradient-to-r ${currentPlatform.color} bg-clip-text text-transparent`}>
                    {currentPlatform.name}
                  </span>
                  <span className="ml-2 text-xs text-slate-400">
                    ({currentPlatform.description})
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Generate Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <Button
              onClick={handleGenerate}
              disabled={!sceneIdea.trim() || isLoading}
              className={`
                w-full h-16 text-lg font-bold transition-all duration-300
                ${sceneIdea.trim() && !isLoading
                  ? 'bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 hover:from-yellow-700 hover:via-orange-700 hover:to-red-700 shadow-xl shadow-yellow-500/25'
                  : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                }
              `}
            >
              {isLoading ? (
                <motion.div 
                  className="flex items-center gap-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <motion.div
                    className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <span>Generating your perfect prompt...</span>
                </motion.div>
              ) : (
                <motion.div 
                  className="flex items-center gap-3"
                  whileHover={sceneIdea.trim() ? { scale: 1.02 } : {}}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                >
                  <Zap className="w-5 h-5" />
                  <span>Generate Instant Prompt</span>
                  <Sparkles className="w-5 h-5" />
                </motion.div>
              )}
            </Button>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
};

export default InstantModeRenderer;
