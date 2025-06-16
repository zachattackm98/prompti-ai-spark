
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const SupportCard = () => {
  return (
    <Card className="bg-slate-900/70 border border-white/20 p-4 sm:p-6 backdrop-blur-sm">
      <h3 className="text-lg font-semibold text-white mb-4">Need Help?</h3>
      <p className="text-gray-400 text-sm mb-4">
        Have questions about your subscription or billing?
      </p>
      <Button
        variant="outline"
        className="w-full border-purple-500/30 text-white hover:bg-purple-500/20 bg-slate-800/80 backdrop-blur-sm"
        onClick={() => window.open('mailto:support@prompti.ai', '_blank')}
      >
        Contact Support
      </Button>
    </Card>
  );
};

export default SupportCard;
