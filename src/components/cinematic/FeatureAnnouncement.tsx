
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
      className={`bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-400/30 rounded-lg p-4 backdrop-blur-sm w-full ${className}`}
    >
      <div className="space-y-3">
        {/* Header - Mobile optimized */}
        <div className="flex items-center justify-center gap-2 text-green-300">
          <CheckCircle className="w-4 h-4" />
          <span className="text-sm font-medium">All Features Unlocked</span>
        </div>
        
        {/* Features - Mobile stacked layout */}
        <div className={`flex text-sm text-gray-300 ${
          isMobile ? 'flex-col space-y-2' : 'flex-wrap justify-center gap-4'
        }`}>
          <div className="flex items-center justify-center gap-1">
            <Sparkles className="w-3 h-3 text-purple-400 flex-shrink-0" />
            <span>Full Creative Control</span>
          </div>
          <div className="flex items-center justify-center gap-1">
            <History className="w-3 h-3 text-blue-400 flex-shrink-0" />
            <span>Coming: History</span>
          </div>
          <div className="flex items-center justify-center gap-1">
            <Film className="w-3 h-3 text-purple-400 flex-shrink-0" />
            <span>Coming: Multi-Scene</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FeatureAnnouncement;
