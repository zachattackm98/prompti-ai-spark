
import React from 'react';
import CinematicHeader from './CinematicHeader';
import FeatureAnnouncement from './FeatureAnnouncement';
import UsageDisplay from './UsageDisplay';
import { useIsMobile } from '@/hooks/use-mobile';

interface CinematicFormHeaderProps {
  user: any;
  subscription: any;
  onSignOut: () => void;
  showHistory: boolean;
  setShowHistory: (show: boolean) => void;
}

const CinematicFormHeader: React.FC<CinematicFormHeaderProps> = ({
  user,
  subscription,
  onSignOut,
  showHistory,
  setShowHistory
}) => {
  const isMobile = useIsMobile();

  return (
    <div className="space-y-4">
      <CinematicHeader 
        user={user}
        subscription={subscription}
        onSignOut={onSignOut}
        showHistory={showHistory}
        setShowHistory={setShowHistory}
      />
      
      {user && (
        <div className={`flex gap-4 ${isMobile ? 'flex-col' : 'flex-col sm:flex-row'}`}>
          <FeatureAnnouncement 
            userTier={subscription.tier} 
            className={isMobile ? 'w-full' : 'flex-1'}
          />
          <div className={isMobile ? 'w-full' : 'w-full sm:w-80'}>
            <UsageDisplay />
          </div>
        </div>
      )}
    </div>
  );
};

export default CinematicFormHeader;
