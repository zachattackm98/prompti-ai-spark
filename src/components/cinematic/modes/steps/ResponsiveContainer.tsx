
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  spacing?: 'compact' | 'normal' | 'spacious';
}

const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  className = '',
  spacing = 'normal'
}) => {
  const isMobile = useIsMobile();
  
  const getSpacing = () => {
    if (isMobile) {
      switch (spacing) {
        case 'compact': return 'space-y-3';
        case 'normal': return 'space-y-4';
        case 'spacious': return 'space-y-6';
        default: return 'space-y-4';
      }
    } else {
      switch (spacing) {
        case 'compact': return 'space-y-4';
        case 'normal': return 'space-y-6';
        case 'spacious': return 'space-y-8';
        default: return 'space-y-6';
      }
    }
  };

  return (
    <div className={`
      w-full max-w-none overflow-hidden
      ${getSpacing()}
      ${className}
    `}>
      {children}
    </div>
  );
};

export default ResponsiveContainer;
