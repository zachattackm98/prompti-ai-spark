
import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Film, Sparkles } from 'lucide-react';

const CinematicFormHeader: React.FC = () => {
  return (
    <div className="text-center">
      <motion.div
        className="flex items-center justify-center gap-2 mb-3"
        initial={{ scale: 0.9, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="relative">
          <Camera className="w-6 h-6 sm:w-7 sm:h-7 text-purple-400" />
          <motion.div
            className="absolute inset-0"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <Film className="w-6 h-6 sm:w-7 sm:h-7 text-purple-400/30" />
          </motion.div>
        </div>
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
          Cinematic Prompt Generator
        </h2>
        <div className="relative">
          <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-pink-400" />
          <motion.div
            className="absolute inset-0"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-pink-400/50" />
          </motion.div>
        </div>
      </motion.div>

      <motion.div 
        className="text-gray-300 text-sm sm:text-base px-4"
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <p>Transform your ideas into production-quality video prompts</p>
      </motion.div>
    </div>
  );
};

export default CinematicFormHeader;
