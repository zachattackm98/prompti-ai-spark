
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { User, Mail } from 'lucide-react';

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
              className="group flex items-center space-x-2 px-4 py-3 rounded-lg bg-slate-800/60 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 text-white no-underline"
            >
              <User className="w-4 h-4" />
              <span className="font-medium">Account</span>
            </Link>
            <div className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-gradient-to-r from-slate-800/40 to-slate-700/40 border border-white/10">
              <Mail className="w-4 h-4 text-gray-400" />
              <div className="flex flex-col">
                <span className="text-xs text-gray-400 font-medium">Welcome back</span>
                <span className="text-white text-sm font-medium truncate max-w-[180px]">
                  {user.email}
                </span>
              </div>
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
            className="group flex items-center space-x-2 px-3 py-2 rounded-lg bg-slate-800/60 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 text-white no-underline text-sm hidden lg:flex"
          >
            <User className="w-4 h-4" />
            <span className="font-medium">Account</span>
          </Link>
          <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gradient-to-r from-slate-800/40 to-slate-700/40 border border-white/10 hidden lg:flex">
            <Mail className="w-3 h-3 text-gray-400" />
            <div className="flex flex-col">
              <span className="text-xs text-gray-400 font-medium leading-none">Welcome</span>
              <span className="text-white text-xs font-medium truncate max-w-[100px] xl:max-w-[140px] leading-none mt-0.5">
                {user.email}
              </span>
            </div>
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
