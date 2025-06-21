
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Camera, Film, Sparkles, LogOut, History } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useUserProfile } from '@/hooks/useUserProfile';

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
  const isMobile = useIsMobile();
  const { firstName } = useUserProfile(user);

  return (
    <div className="flex flex-col gap-4 mb-6">
      {/* Title Section */}
      <div className="text-center">
        <motion.div
          className="flex items-center justify-center gap-2 mb-3"
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="relative">
            <Camera className="w-6 h-6 sm:w-7 sm:h-7 text-purple-400" />
            <motion.div
              className="absolute inset-0"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <Film className="w-6 h-6 sm:w-7 sm:h-7 text-purple-400/30" />
            </motion.div>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            Cinematic Prompt Generator
          </h2>
          <div className="relative">
            <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-pink-400" />
            <motion.div
              className="absolute inset-0"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-pink-400/50" />
            </motion.div>
          </div>
        </motion.div>

        {/* Personalized greeting or generic subtitle */}
        <motion.div 
          className="text-gray-300 text-sm sm:text-base px-4"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {user && firstName ? (
            <div className="space-y-1">
              <p className="text-purple-300 font-medium">
                Welcome back, {firstName}!
              </p>
              <p className="text-sm text-gray-400">
                You're on the <span className="text-purple-300 capitalize font-medium">{subscription.tier}</span> plan
              </p>
            </div>
          ) : (
            <p>Transform your ideas into production-quality video prompts</p>
          )}
        </motion.div>
      </div>
      
      {/* Action Buttons - Only show when user is logged in */}
      {user && (
        <div className="flex gap-2 px-4">
          <Button
            onClick={() => setShowHistory(!showHistory)}
            variant={showHistory ? "default" : "outline"}
            size={isMobile ? "default" : "sm"}
            className={`flex-1 border-white/20 hover:bg-white/10 bg-slate-800/40 text-sm min-h-[44px] ${
              showHistory ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'text-white'
            }`}
          >
            <History className="w-4 h-4 mr-2" />
            {showHistory ? 'Hide History' : 'Show History'}
          </Button>

          <Button
            onClick={onSignOut}
            variant="outline"
            size={isMobile ? "default" : "sm"}
            className="flex-1 border-white/20 text-white hover:bg-white/10 bg-slate-800/40 text-sm min-h-[44px]"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      )}
    </div>
  );
};

export default CinematicHeader;
