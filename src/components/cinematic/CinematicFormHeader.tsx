
import React from 'react';
import UsageDisplay from './UsageDisplay';

interface CinematicFormHeaderProps {
  user: any;
  onUpgrade: () => void;
}

const CinematicFormHeader: React.FC<CinematicFormHeaderProps> = ({
  user,
  onUpgrade
}) => {
  if (!user) return null;

  return <UsageDisplay onUpgrade={onUpgrade} />;
};

export default CinematicFormHeader;
