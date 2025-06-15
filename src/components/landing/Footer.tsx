
import React from 'react';
import { motion } from 'framer-motion';

const Footer = () => {
  const footerLinks = {
    Product: [
      { name: 'Features', href: '#features' },
      { name: 'Pricing', href: '#pricing' },
      { name: 'API', href: '#' },
      { name: 'Changelog', href: '#' }
    ],
    Resources: [
      { name: 'Documentation', href: '#' },
      { name: 'Tutorials', href: '#' },
      { name: 'Blog', href: '#' },
      { name: 'Community', href: '#' }
    ],
    Company: [
      { name: 'About', href: '#' },
      { name: 'Careers', href: '#' },
      { name: 'Press', href: '#' },
      { name: 'Contact', href: '#' }
    ],
    Legal: [
      { name: 'Privacy', href: '#' },
      { name: 'Terms', href: '#' },
      { name: 'Security', href: '#' },
      { name: 'Status', href: '#' }
    ]
  };

  return (
    <footer className="py-12 sm:py-16 px-4 sm:px-6 border-t border-white/10">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 sm:gap-8 mb-8 sm:mb-12">
          <div className="col-span-2 md:col-span-1">
            <motion.div 
              className="flex items-center space-x-2 mb-4 sm:mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg"></div>
              <span className="text-lg sm:text-xl font-bold text-white">AiPromptMachine</span>
            </motion.div>
            <p className="text-gray-400 leading-relaxed text-sm sm:text-base">
              Transform your creative vision into cinematic video prompts with the power of AI.
            </p>
          </div>
          
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">{category}</h3>
              <ul className="space-y-2 sm:space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <a 
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="border-t border-white/10 pt-6 sm:pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-gray-400 text-xs sm:text-sm text-center md:text-left">
            © 2024 AiPromptMachine. All rights reserved.
          </p>
          
          <div className="flex space-x-4 sm:space-x-6">
            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
              Twitter
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
              Discord
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
