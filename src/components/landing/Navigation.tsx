
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { isAdminUser } from '@/utils/adminUtils';
import { Clapperboard } from 'lucide-react';

interface NavigationProps {
  className?: string;
}

const Navigation = ({ className }: NavigationProps) => {
  const { user } = useAuth();
  const location = useLocation();
  const showTestingLink = isAdminUser(user?.email);
  
  // Check if we're on the Generate page to determine link behavior
  const isGeneratePage = location.pathname === '/generate';

  return (
    <nav className={`hidden md:flex ${className || ''}`}>
      <div className="flex items-center space-x-6 lg:space-x-8">
        {/* Show different navigation based on auth status */}
        {user ? (
          <>
            {/* Authenticated user navigation */}
            <Link 
              to="/" 
              className={`
                text-sm lg:text-base font-medium transition-colors duration-300
                ${location.pathname === '/' 
                  ? 'text-white' 
                  : 'text-gray-300 hover:text-white'
                }
              `}
            >
              Home
            </Link>
            <Link 
              to="/generate" 
              state={{ scrollToGenerator: location.pathname === '/' }}
              className={`
                group flex items-center space-x-2 px-3 py-2 rounded-lg text-sm lg:text-base font-medium
                transition-all duration-300 ease-out
                ${isGeneratePage 
                  ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border border-purple-500/30' 
                  : 'text-gray-300 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/20'
                }
              `}
            >
              <Clapperboard className="w-4 h-4" />
              <span>Generate</span>
            </Link>
            {/* Landing page sections for authenticated users */}
            {location.pathname === '/' && (
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
          </>
        ) : (
          <>
            {/* Unauthenticated user navigation */}
            {isGeneratePage ? (
              <>
                <Link to="/#features" className="text-gray-300 hover:text-white transition-colors duration-300 text-sm lg:text-base">
                  Features
                </Link>
                <Link to="/#process" className="text-gray-300 hover:text-white transition-colors duration-300 text-sm lg:text-base">
                  How it Works
                </Link>
                <Link to="/#pricing" className="text-gray-300 hover:text-white transition-colors duration-300 text-sm lg:text-base">
                  Pricing
                </Link>
              </>
            ) : (
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
