
import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, History, Film, Sparkles } from 'lucide-react';

interface ComingSoonFeatureCardProps {
  features: string[];
  userTier: string;
  className?: string;
}

const ComingSoonFeatureCard = ({ features, userTier, className = '' }: ComingSoonFeatureCardProps) => {
  if (features.length === 0) return null;

  const getFeatureIcon = (feature: string) => {
    if (feature.toLowerCase().includes('history')) {
      return <History className="w-4 h-4 text-blue-400" />;
    }
    if (feature.toLowerCase().includes('scene')) {
      return <Film className="w-4 h-4 text-purple-400" />;
    }
    return <Sparkles className="w-4 h-4 text-yellow-400" />;
  };

  const getTierColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'creator':
        return 'from-purple-500 to-pink-500';
      case 'studio':
        return 'from-yellow-500 to-orange-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      <Card className="bg-gradient-to-br from-slate-900/80 to-blue-900/20 border border-blue-500/30 p-4 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${getTierColor(userTier)} flex items-center justify-center flex-shrink-0`}>
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-white font-semibold text-sm">New Features Coming Soon!</h3>
            <Badge variant="outline" className="border-blue-400/50 text-blue-300 text-xs mt-1">
              {userTier.charAt(0).toUpperCase() + userTier.slice(1)} Plan
            </Badge>
          </div>
          <div className="flex items-center gap-1 text-yellow-400">
            <Clock className="w-3 h-3" />
            <span className="text-xs font-medium">Soon</span>
          </div>
        </div>
        
        <div className="space-y-2">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2 text-sm text-gray-300">
              {getFeatureIcon(feature)}
              <span>{feature}</span>
            </div>
          ))}
        </div>
        
        <div className="mt-3 pt-3 border-t border-white/10">
          <p className="text-xs text-gray-400 text-center">
            🚀 These features will be available in your next update
          </p>
        </div>
      </Card>
    </motion.div>
  );
};

export default ComingSoonFeatureCard;
