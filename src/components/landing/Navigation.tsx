
import React from 'react';
import { scrollToTop } from '@/utils/scrollUtils';

const Navigation = () => {
  const handleLinkClick = (href: string) => {
    scrollToTop('smooth');
    // Small delay to ensure smooth scroll completes before jumping to section
    setTimeout(() => {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <nav className="hidden md:flex items-center space-x-8">
      <a 
        href="#features" 
        className="text-gray-300 hover:text-white transition-colors duration-300"
        onClick={(e) => {
          e.preventDefault();
          handleLinkClick('#features');
        }}
      >
        Features
      </a>
      <a 
        href="#pricing" 
        className="text-gray-300 hover:text-white transition-colors duration-300"
        onClick={(e) => {
          e.preventDefault();
          handleLinkClick('#pricing');
        }}
      >
        Pricing
      </a>
      <a 
        href="#faq" 
        className="text-gray-300 hover:text-white transition-colors duration-300"
        onClick={(e) => {
          e.preventDefault();
          handleLinkClick('#faq');
        }}
      >
        FAQ
      </a>
    </nav>
  );
};

export default Navigation;
