
import React from 'react';
import { motion } from 'framer-motion';
import Navigation from './Navigation';
import AuthControls from './AuthControls';

interface MobileMenuProps {
  isOpen: boolean;
  onAuthClick: () => void;
  onSignOut: () => void;
  onClose: () => void;
}

const MobileMenu = ({ isOpen, onAuthClick, onSignOut, onClose }: MobileMenuProps) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="md:hidden mt-4 pb-4 border-t border-white/10"
    >
      <div className="flex flex-col space-y-4 pt-4">
        <a 
          href="#features" 
          className="text-gray-300 hover:text-white transition-colors duration-300 py-2"
          onClick={onClose}
        >
          Features
        </a>
        <a 
          href="#pricing" 
          className="text-gray-300 hover:text-white transition-colors duration-300 py-2"
          onClick={onClose}
        >
          Pricing
        </a>
        <a 
          href="#faq" 
          className="text-gray-300 hover:text-white transition-colors duration-300 py-2"
          onClick={onClose}
        >
          FAQ
        </a>
        
        <div className="border-t border-white/10 pt-4">
          <AuthControls 
            onAuthClick={onAuthClick}
            onSignOut={onSignOut}
            isMobile={true}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default MobileMenu;
