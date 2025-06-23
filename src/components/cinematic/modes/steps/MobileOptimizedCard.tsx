
import React from 'react';
import { Card } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileOptimizedCardProps {
  children: React.ReactNode;
  className?: string;
  gradientFrom?: string;
  gradientTo?: string;
  borderColor?: string;
}

const MobileOptimizedCard: React.FC<MobileOptimizedCardProps> = ({
  children,
  className = '',
  gradientFrom = 'from-slate-900/90',
  gradientTo = 'to-purple-900/20',
  borderColor = 'border-purple-500/20'
}) => {
  const isMobile = useIsMobile();

  return (
    <Card className={`
      relative overflow-hidden bg-gradient-to-br ${gradientFrom} via-slate-800/80 ${gradientTo}
      border ${borderColor} backdrop-blur-sm
      ${isMobile ? 'p-4 mx-2' : 'p-6 sm:p-8'}
      ${className}
    `}>
      <div className="relative z-10 w-full max-w-none">
        {children}
      </div>
    </Card>
  );
};

export default MobileOptimizedCard;
