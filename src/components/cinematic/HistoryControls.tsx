import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { History, LogOut } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { fadeInVariants } from '@/utils/animations';

interface HistoryControlsProps {
  showHistory: boolean;
  setShowHistory: (show: boolean) => void;
  onSignOut: () => void;
}

const HistoryControls: React.FC<HistoryControlsProps> = ({
  showHistory,
  setShowHistory,
  onSignOut
}) => {
  const isMobile = useIsMobile();

  return (
    <motion.div 
      variants={fadeInVariants}
      initial="hidden"
      animate="visible"
      className={`flex gap-2 max-w-md mx-auto mb-6 ${isMobile ? 'px-2' : ''}`}
    >
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
    </motion.div>
  );
};

export default HistoryControls;