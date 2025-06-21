
import React from 'react';
import { Button } from '@/components/ui/button';
import { History } from 'lucide-react';
import CinematicHeader from './CinematicHeader';
import FeatureAnnouncement from './FeatureAnnouncement';
import UsageDisplay from './UsageDisplay';

interface CinematicFormHeaderProps {
  user: any;
  subscription: any;
  showHistory: boolean;
  setShowHistory: (show: boolean) => void;
  onSignOut: () => void;
}

const CinematicFormHeader: React.FC<CinematicFormHeaderProps> = ({
  user,
  subscription,
  showHistory,
  setShowHistory,
  onSignOut
}) => {
  return (
    <>
      <CinematicHeader 
        user={user}
        subscription={subscription}
        showHistory={showHistory}
        setShowHistory={setShowHistory}
        onSignOut={onSignOut}
      />
      
      {user && (
        <div className="flex flex-col sm:flex-row gap-4 items-start">
          <FeatureAnnouncement 
            userTier={subscription.tier} 
            className="flex-1"
          />
          <div className="flex gap-2">
            <UsageDisplay />
            <Button
              onClick={() => setShowHistory(!showHistory)}
              variant="outline"
              size="sm"
              className="border-purple-400/30 text-purple-300 hover:bg-purple-500/10"
            >
              <History className="w-4 h-4 mr-2" />
              {showHistory ? 'Hide History' : 'Show History'}
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default CinematicFormHeader;
