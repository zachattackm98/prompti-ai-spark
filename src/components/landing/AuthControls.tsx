
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface AuthControlsProps {
  onAuthClick: () => void;
  onSignOut: () => void;
  isMobile?: boolean;
}

const AuthControls = ({ onAuthClick, onSignOut, isMobile = false }: AuthControlsProps) => {
  const { user } = useAuth();

  if (isMobile) {
    return (
      <div className="space-y-3">
        {user ? (
          <>
            <Link 
              to="/account"
              className="block text-gray-300 hover:text-white transition-colors duration-300 py-2 text-base no-underline"
            >
              Account
            </Link>
            <div className="text-gray-300 text-sm py-2">
              Welcome, {user.email}
            </div>
            <Button 
              onClick={onSignOut}
              variant="outline" 
              size="sm"
              className="w-full border-white/20 text-white hover:bg-white/10 bg-slate-800/40 h-11"
            >
              Sign Out
            </Button>
          </>
        ) : (
          <>
            <Button 
              onClick={onAuthClick}
              variant="outline" 
              size="sm"
              className="w-full border-white/20 text-white hover:bg-white/10 bg-slate-800/40 h-11"
            >
              Sign In
            </Button>
            <Button 
              onClick={onAuthClick}
              size="sm"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 h-11"
            >
              Try AiPromptMachine
            </Button>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2 lg:space-x-3">
      {user ? (
        <>
          <Link 
            to="/account"
            className="text-gray-300 hover:text-white transition-colors duration-300 text-sm hidden lg:block no-underline"
          >
            Account
          </Link>
          <div className="text-gray-300 text-xs lg:text-sm hidden lg:block max-w-[120px] xl:max-w-none truncate">
            Welcome, {user.email.length > 15 ? user.email.substring(0, 15) + '...' : user.email}
          </div>
          <Button 
            onClick={onSignOut}
            variant="outline" 
            size="sm"
            className="border-white/20 text-white hover:bg-white/10 bg-slate-800/40 transition-all duration-300 px-2 lg:px-3 text-xs lg:text-sm h-8 lg:h-9"
          >
            Sign Out
          </Button>
        </>
      ) : (
        <>
          <Button 
            onClick={onAuthClick}
            variant="outline" 
            size="sm"
            className="border-white/20 text-white hover:bg-white/10 bg-slate-800/40 transition-all duration-300 px-2 lg:px-3 text-xs lg:text-sm h-8 lg:h-9"
          >
            Sign In
          </Button>
          <Button 
            onClick={onAuthClick}
            size="sm"
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 px-2 lg:px-3 text-xs lg:text-sm h-8 lg:h-9"
          >
            Try Now
          </Button>
        </>
      )}
    </div>
  );
};

export default AuthControls;
