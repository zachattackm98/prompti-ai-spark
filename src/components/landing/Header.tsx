
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const Header = () => {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/20"
    >
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <motion.div 
          className="flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
        >
          <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg"></div>
          <span className="text-xl font-bold text-white">Prompti.ai</span>
        </motion.div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
          <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
          <a href="#faq" className="text-gray-300 hover:text-white transition-colors">FAQ</a>
        </nav>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" className="text-white hover:bg-white/10">
            Sign In
          </Button>
          <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
            Try Prompti.ai
          </Button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
