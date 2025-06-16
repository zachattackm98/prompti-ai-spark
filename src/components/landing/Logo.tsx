
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Logo = () => {
  return (
    <Link to="/" className="no-underline">
      <motion.div 
        className="flex items-center space-x-2 cursor-pointer"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
      >
        <img 
          src="/lovable-uploads/02d61b87-d7e8-4974-888b-0ce4a627c116.png" 
          alt="AiPromptMachine Logo"
          className="w-6 h-6 sm:w-8 sm:h-8"
        />
        <span className="text-lg sm:text-xl font-bold text-white">AiPromptMachine</span>
      </motion.div>
    </Link>
  );
};

export default Logo;
