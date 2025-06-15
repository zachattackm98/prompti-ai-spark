
import React from 'react';
import { motion } from 'framer-motion';

const BackgroundAnimation: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute top-20 left-10 w-4 h-4 bg-purple-400/20 rounded-full"
        animate={{ 
          y: [0, -20, 0],
          opacity: [0.3, 0.7, 0.3]
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          delay: 0
        }}
      />
      <motion.div
        className="absolute top-32 right-20 w-3 h-3 bg-pink-400/20 rounded-full"
        animate={{ 
          y: [0, -15, 0],
          opacity: [0.2, 0.6, 0.2]
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          delay: 1
        }}
      />
      <motion.div
        className="absolute bottom-32 left-1/4 w-5 h-5 bg-blue-400/20 rounded-full"
        animate={{ 
          y: [0, -25, 0],
          opacity: [0.4, 0.8, 0.4]
        }}
        transition={{ 
          duration: 3.5,
          repeat: Infinity,
          delay: 2
        }}
      />
    </div>
  );
};

export default BackgroundAnimation;
