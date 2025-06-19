
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, History, Film } from 'lucide-react';

interface FeatureAnnouncementProps {
  userTier: string;
  className?: string;
}

const FeatureAnnouncement = ({ userTier, className = '' }: FeatureAnnouncementProps) => {
  if (userTier !== 'creator' && userTier !== 'studio') return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-400/30 rounded-lg p-4 backdrop-blur-sm ${className}`}
    >
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-purple-300">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-medium">Coming Soon</span>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-300">
          <div className="flex items-center gap-1">
            <History className="w-3 h-3 text-blue-400" />
            <span>Prompt History</span>
          </div>
          <div className="flex items-center gap-1">
            <Film className="w-3 h-3 text-purple-400" />
            <span>Multi-Scene Projects</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FeatureAnnouncement;
