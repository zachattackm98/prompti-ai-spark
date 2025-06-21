
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { isAdminUser } from '@/utils/adminUtils';

interface NavigationProps {
  className?: string;
}

const Navigation = ({ className }: NavigationProps) => {
  const { user } = useAuth();
  const location = useLocation();
  const showTestingLink = isAdminUser(user?.email);
  
  // Hide landing page links when on the Generate page
  const isGeneratePage = location.pathname === '/generate';

  return (
    <nav className={`hidden md:flex ${className || ''}`}>
      <div className="flex items-center space-x-6 lg:space-x-8">
        {user && (
          <Link to="/generate" className="text-gray-300 hover:text-white transition-colors duration-300 text-sm lg:text-base">
            Generate
          </Link>
        )}
        {!isGeneratePage && (
          <>
            <a href="#features" className="text-gray-300 hover:text-white transition-colors duration-300 text-sm lg:text-base">
              Features
            </a>
            <a href="#process" className="text-gray-300 hover:text-white transition-colors duration-300 text-sm lg:text-base">
              How it Works
            </a>
            <a href="#pricing" className="text-gray-300 hover:text-white transition-colors duration-300 text-sm lg:text-base">
              Pricing
            </a>
          </>
        )}
        {showTestingLink && (
          <Link to="/testing" className="text-gray-300 hover:text-white transition-colors duration-300 text-sm lg:text-base">
            Testing
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
