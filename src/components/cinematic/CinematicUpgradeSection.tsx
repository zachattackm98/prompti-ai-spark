
import React from 'react';
import UpgradePrompt from './UpgradePrompt';

interface CinematicUpgradeSectionProps {
  user: any;
  generatedPrompt: any;
  canUseFeature: (feature: string) => boolean;
  subscription: any;
}

const CinematicUpgradeSection: React.FC<CinematicUpgradeSectionProps> = ({
  user,
  generatedPrompt,
  canUseFeature,
  subscription
}) => {
  if (!user || generatedPrompt) return null;

  return (
    <div className="mt-6 space-y-4">
      {!canUseFeature('cameraControls') && (
        <UpgradePrompt
          feature="Professional Camera Controls"
          requiredTier="creator"
          currentTier={subscription.tier}
        />
      )}
      {!canUseFeature('lightingOptions') && (
        <UpgradePrompt
          feature="Advanced Lighting & Visual Styles"
          requiredTier="studio"
          currentTier={subscription.tier}
        />
      )}
    </div>
  );
};

export default CinematicUpgradeSection;
