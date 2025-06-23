
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Zap, Camera, Palette } from 'lucide-react';
import { motion } from 'framer-motion';
import { CinematicMode, CINEMATIC_MODES } from './constants/modes';

interface ModeSelectorProps {
  selectedMode: CinematicMode;
  onModeChange: (mode: CinematicMode) => void;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({ selectedMode, onModeChange }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'zap':
        return <Zap className="w-5 h-5" />;
      case 'camera':
        return <Camera className="w-5 h-5" />;
      case 'palette':
        return <Palette className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const getModeGradient = (modeId: string, isActive: boolean) => {
    const gradients = {
      instant: isActive 
        ? 'bg-gradient-to-br from-yellow-500/20 via-orange-500/20 to-red-500/20 border-yellow-400/40' 
        : 'bg-gradient-to-br from-yellow-500/5 via-orange-500/5 to-red-500/5 border-yellow-400/20',
      'animal-vlog': isActive 
        ? 'bg-gradient-to-br from-green-500/20 via-emerald-500/20 to-teal-500/20 border-green-400/40' 
        : 'bg-gradient-to-br from-green-500/5 via-emerald-500/5 to-teal-500/5 border-green-400/20',
      creative: isActive 
        ? 'bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-indigo-500/20 border-purple-400/40' 
        : 'bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-indigo-500/5 border-purple-400/20'
    };
    return gradients[modeId] || gradients.creative;
  };

  const getIconColor = (modeId: string, isActive: boolean) => {
    const colors = {
      instant: isActive ? 'text-yellow-300' : 'text-yellow-400/60',
      'animal-vlog': isActive ? 'text-green-300' : 'text-green-400/60',
      creative: isActive ? 'text-purple-300' : 'text-purple-400/60'
    };
    return colors[modeId] || colors.creative;
  };

  return (
    <motion.div 
      className="w-full mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="text-center mb-6">
        <motion.h2 
          className="text-2xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-300 bg-clip-text text-transparent mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Choose Your Creative Mode
        </motion.h2>
        <motion.p 
          className="text-slate-400 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Each mode is optimized for different types of content creation
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {CINEMATIC_MODES.map((mode, index) => {
          const isActive = selectedMode === mode.id;
          return (
            <motion.div
              key={mode.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.5 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <button
                onClick={() => onModeChange(mode.id as CinematicMode)}
                className={`
                  relative w-full p-6 rounded-xl border-2 transition-all duration-300
                  backdrop-blur-sm hover:backdrop-blur-md
                  ${getModeGradient(mode.id, isActive)}
                  ${isActive ? 'shadow-lg shadow-purple-500/20' : 'hover:shadow-md hover:shadow-purple-500/10'}
                  group
                `}
              >
                {/* Animated background glow */}
                <div className={`
                  absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300
                  bg-gradient-to-r from-transparent via-white/5 to-transparent
                  ${isActive ? 'opacity-50' : ''}
                `} />
                
                <div className="relative z-10 text-center space-y-3">
                  <div className={`
                    flex items-center justify-center w-12 h-12 mx-auto rounded-full mb-3
                    ${isActive ? 'bg-white/10' : 'bg-white/5 group-hover:bg-white/10'}
                    transition-all duration-300
                  `}>
                    <div className={`${getIconColor(mode.id, isActive)} transition-colors duration-300`}>
                      {getIcon(mode.icon)}
                    </div>
                  </div>
                  
                  <h3 className={`
                    font-semibold text-lg transition-colors duration-300
                    ${isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'}
                  `}>
                    {mode.name}
                  </h3>
                  
                  <p className={`
                    text-sm leading-relaxed transition-colors duration-300
                    ${isActive ? 'text-slate-300' : 'text-slate-400 group-hover:text-slate-300'}
                  `}>
                    {mode.description}
                  </p>
                </div>

                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    className="absolute top-2 right-2 w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default ModeSelector;
