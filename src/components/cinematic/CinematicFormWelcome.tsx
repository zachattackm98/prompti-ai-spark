
import React from 'react';
import { motion } from 'framer-motion';

interface CinematicFormWelcomeProps {
  user: any;
  generatedPrompt: any;
}

const CinematicFormWelcome: React.FC<CinematicFormWelcomeProps> = ({
  user,
  generatedPrompt
}) => {
  if (user || generatedPrompt) return null;

  return (
    <motion.div 
      className="text-center mt-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.7 }}
    >
      <p className="text-purple-300 text-sm font-medium bg-purple-900/20 border border-purple-400/20 rounded-lg py-2 px-4 inline-block">
        🎬 Ready to generate? Create your free account to get started!
      </p>
    </motion.div>
  );
};

export default CinematicFormWelcome;
