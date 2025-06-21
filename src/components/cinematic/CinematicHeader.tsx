
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Camera, Film, Sparkles, LogOut, User, History } from 'lucide-react';

interface CinematicHeaderProps {
  user: any;
  subscription: any;
  onSignOut: () => void;
  showHistory: boolean;
  setShowHistory: (show: boolean) => void;
}

const CinematicHeader: React.FC<CinematicHeaderProps> = ({
  user,
  subscription,
  onSignOut,
  showHistory,
  setShowHistory
}) => {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-center gap-4 lg:gap-0 mb-6 sm:mb-8">
      {/* Title Section */}
      <div className="text-center flex-1 order-2 lg:order-1">
        <motion.div
          className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4"
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="relative">
            <Camera className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
            <motion.div
              className="absolute inset-0"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <Film className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400/30" />
            </motion.div>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            Cinematic Prompt Generator
          </h2>
          <div className="relative">
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-pink-400" />
            <motion.div
              className="absolute inset-0"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-pink-400/50" />
            </motion.div>
          </div>
        </motion.div>
        <motion.p 
          className="text-gray-300 text-sm sm:text-base lg:text-lg px-4"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Transform your ideas into production-quality video prompts
        </motion.p>
      </div>
      
      {/* User Controls */}
      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 order-1 lg:order-2 w-full sm:w-auto">
        {user && (
          <>
            {/* History Button */}
            <Button
              onClick={() => setShowHistory(!showHistory)}
              variant={showHistory ? "default" : "outline"}
              size="sm"
              className={`border-white/20 hover:bg-white/10 bg-slate-800/40 w-full sm:w-auto text-xs sm:text-sm ${
                showHistory ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'text-white'
              }`}
            >
              <History className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              {showHistory ? 'Hide History' : 'Show History'}
            </Button>

            {/* User Info and Sign Out */}
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 w-full sm:w-auto">
              {/* User Info - Responsive */}
              <div className="flex items-center gap-2 sm:text-right text-center">
                <User className="w-4 h-4 text-gray-400 sm:hidden" />
                <div>
                  <p className="text-gray-300 text-xs sm:text-sm">
                    {user.email.length > 25 ? user.email.substring(0, 25) + '...' : user.email}
                  </p>
                  <p className="text-xs text-purple-300 capitalize">{subscription.tier} Plan</p>
                </div>
              </div>
              
              {/* Sign Out Button */}
              <Button
                onClick={onSignOut}
                variant="outline"
                size="sm"
                className="border-white/20 text-white hover:bg-white/10 bg-slate-800/40 w-full sm:w-auto text-xs sm:text-sm"
              >
                <LogOut className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Sign Out
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CinematicHeader;
