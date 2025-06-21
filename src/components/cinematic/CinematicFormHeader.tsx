
import React from 'react';
import CinematicHeader from './CinematicHeader';
import FeatureAnnouncement from './FeatureAnnouncement';
import UsageDisplay from './UsageDisplay';

interface CinematicFormHeaderProps {
  user: any;
  subscription: any;
  onSignOut: () => void;
}

const CinematicFormHeader: React.FC<CinematicFormHeaderProps> = ({
  user,
  subscription,
  onSignOut
}) => {
  return (
    <>
      <CinematicHeader 
        user={user}
        subscription={subscription}
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
          </div>
        </div>
      )}
    </>
  );
};

export default CinematicFormHeader;
