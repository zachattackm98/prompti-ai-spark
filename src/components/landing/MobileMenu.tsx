
import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import AuthControls from './AuthControls';
import { useAuth } from '@/hooks/useAuth';
import { isAdminUser } from '@/utils/adminUtils';
import { scrollToTop, scrollToElementById } from '@/utils/scrollUtils';

interface MobileMenuProps {
  isOpen: boolean;
  onAuthClick: () => void;
  onSignOut: () => void;
  onClose: () => void;
}

const MobileMenu = ({ isOpen, onAuthClick, onSignOut, onClose }: MobileMenuProps) => {
  const { user } = useAuth();
  const location = useLocation();
  const showTestingLink = isAdminUser(user?.email);
  
  // Check if we're on the Generate page to determine link behavior
  const isGeneratePage = location.pathname === '/generate';

  if (!isOpen) return null;

  const handleLinkClick = (href: string) => {
    onClose();
    scrollToTop('smooth');
    // Small delay to ensure smooth scroll completes before jumping to section
    setTimeout(() => {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleCrossPageNavigation = (href: string) => {
    onClose();
    // Let React Router handle the navigation to landing page with hash
  };

  const handleGenerateClick = (e: React.MouseEvent) => {
    if (isGeneratePage) {
      e.preventDefault();
      onClose();
      // Scroll to the generator form if already on the generate page
      scrollToElementById('generator-start', 'smooth', 120);
    } else {
      onClose();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="md:hidden mt-3 sm:mt-4 pb-4 border-t border-white/10"
    >
      <div className="flex flex-col space-y-3 pt-4">
        {/* Navigation Links */}
        {user && (
          <Link 
            to="/generate" 
            className="text-gray-300 hover:text-white transition-colors duration-300 py-2 text-base no-underline"
            onClick={handleGenerateClick}
          >
            Generate
          </Link>
        )}
        
        {/* Features Link */}
        {isGeneratePage ? (
          <Link 
            to="/#features" 
            className="text-gray-300 hover:text-white transition-colors duration-300 py-2 text-base no-underline"
            onClick={() => handleCrossPageNavigation('#features')}
          >
            Features
          </Link>
        ) : (
          <a 
            href="#features" 
            className="text-gray-300 hover:text-white transition-colors duration-300 py-2 text-base"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('#features');
            }}
          >
            Features
          </a>
        )}
        
        {/* How it Works Link */}
        {isGeneratePage ? (
          <Link 
            to="/#process" 
            className="text-gray-300 hover:text-white transition-colors duration-300 py-2 text-base no-underline"
            onClick={() => handleCrossPageNavigation('#process')}
          >
            How it Works
          </Link>
        ) : (
          <a 
            href="#process" 
            className="text-gray-300 hover:text-white transition-colors duration-300 py-2 text-base"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('#process');
            }}
          >
            How it Works
          </a>
        )}
        
        {/* Pricing Link */}
        {isGeneratePage ? (
          <Link 
            to="/#pricing" 
            className="text-gray-300 hover:text-white transition-colors duration-300 py-2 text-base no-underline"
            onClick={() => handleCrossPageNavigation('#pricing')}
          >
            Pricing
          </Link>
        ) : (
          <a 
            href="#pricing" 
            className="text-gray-300 hover:text-white transition-colors duration-300 py-2 text-base"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('#pricing');
            }}
          >
            Pricing
          </a>
        )}
        
        {showTestingLink && (
          <Link 
            to="/testing" 
            className="text-gray-300 hover:text-white transition-colors duration-300 py-2 text-base no-underline"
            onClick={onClose}
          >
            Testing
          </Link>
        )}
        
        {/* Auth Controls */}
        <div className="border-t border-white/10 pt-4 mt-2">
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
