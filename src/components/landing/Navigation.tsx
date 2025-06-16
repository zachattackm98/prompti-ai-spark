
import React from 'react';

const Navigation = () => {
  return (
    <nav className="hidden lg:flex items-center space-x-8">
      <a 
        href="#features" 
        className="text-gray-300 hover:text-white transition-colors duration-300"
      >
        Features
      </a>
      <a 
        href="#pricing" 
        className="text-gray-300 hover:text-white transition-colors duration-300"
      >
        Pricing
      </a>
      <a 
        href="#faq" 
        className="text-gray-300 hover:text-white transition-colors duration-300"
      >
        FAQ
      </a>
    </nav>
  );
};

export default Navigation;
