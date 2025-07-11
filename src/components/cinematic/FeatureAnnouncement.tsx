
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, History, Film, CheckCircle } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface FeatureAnnouncementProps {
  userTier: string;
  className?: string;
}

const FeatureAnnouncement = ({ userTier, className = '' }: FeatureAnnouncementProps) => {
  const isMobile = useIsMobile();

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-400/30 rounded-lg p-3 backdrop-blur-sm w-full ${className}`}
    >
      <div className="space-y-2">
        {/* Header - Mobile optimized */}
        <div className="flex items-center justify-center gap-2 text-green-300">
          <CheckCircle className="w-3 h-3" />
          <span className="text-xs font-medium">All Features Unlocked</span>
        </div>
        
        {/* Features - Mobile stacked layout */}
        <div className={`flex text-xs text-gray-300 ${
          isMobile ? 'flex-col space-y-1' : 'flex-wrap justify-center gap-3'
        }`}>
          <div className="flex items-center justify-center gap-1">
            <Sparkles className="w-2.5 h-2.5 text-purple-400 flex-shrink-0" />
            <span>Full Creative Control</span>
          </div>
          <div className="flex items-center justify-center gap-1">
            <History className="w-2.5 h-2.5 text-blue-400 flex-shrink-0" />
            <span>History</span>
          </div>
          <div className="flex items-center justify-center gap-1">
            <Film className="w-2.5 h-2.5 text-purple-400 flex-shrink-0" />
            <span>Multi-Scene</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FeatureAnnouncement;
