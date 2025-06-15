
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Camera, Film, Sparkles, History, LogOut } from 'lucide-react';

interface CinematicHeaderProps {
  user: any;
  subscription: any;
  showHistory: boolean;
  setShowHistory: (show: boolean) => void;
  onSignOut: () => void;
}

const CinematicHeader: React.FC<CinematicHeaderProps> = ({
  user,
  subscription,
  showHistory,
  setShowHistory,
  onSignOut
}) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <div className="text-center flex-1">
        <motion.div
          className="flex items-center justify-center gap-3 mb-4"
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="relative">
            <Camera className="w-8 h-8 text-purple-400" />
            <motion.div
              className="absolute inset-0"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <Film className="w-8 h-8 text-purple-400/30" />
            </motion.div>
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            Cinematic Prompt Generator
          </h2>
          <div className="relative">
            <Sparkles className="w-8 h-8 text-pink-400" />
            <motion.div
              className="absolute inset-0"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-8 h-8 text-pink-400/50" />
            </motion.div>
          </div>
        </motion.div>
        <motion.p 
          className="text-gray-300 text-lg"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Transform your ideas into production-quality video prompts
        </motion.p>
      </div>
      
      <div className="flex items-center gap-4">
        {user && (
          <>
            <Button
              onClick={() => setShowHistory(!showHistory)}
              variant="outline"
              size="sm"
              className="border-white/20 text-white hover:bg-white/10 bg-slate-800/40"
            >
              <History className="w-4 h-4 mr-2" />
              History
            </Button>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-gray-300 text-sm">Welcome, {user.email}</p>
                <p className="text-xs text-purple-300 capitalize">{subscription.tier} Plan</p>
              </div>
              <Button
                onClick={onSignOut}
                variant="outline"
                size="sm"
                className="border-white/20 text-white hover:bg-white/10 bg-slate-800/40"
              >
                <LogOut className="w-4 h-4 mr-2" />
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
