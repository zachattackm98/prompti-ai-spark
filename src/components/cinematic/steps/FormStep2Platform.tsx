
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft } from 'lucide-react';

interface FormStep2PlatformProps {
  selectedPlatform: string;
  setSelectedPlatform: (platform: string) => void;
  subscription: any;
  onNext: () => void;
  onPrevious: () => void;
}

const FormStep2Platform: React.FC<FormStep2PlatformProps> = ({
  selectedPlatform,
  setSelectedPlatform,
  subscription,
  onNext,
  onPrevious
}) => {
  const platforms = [
    { id: 'veo3', name: 'Google Veo 3', description: 'High-quality video generation' },
    { id: 'sora', name: 'OpenAI Sora', description: 'Creative video synthesis' },
    { id: 'runway', name: 'Runway ML', description: 'Professional video tools', premium: true },
    { id: 'pika', name: 'Pika Labs', description: 'AI video creation', premium: true }
  ];

  const canUsePlatform = (platform: any) => {
    if (!platform.premium) return true;
    return subscription.tier !== 'starter' && subscription.isActive;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Choose Platform</h2>
        <p className="text-gray-400">Select your preferred AI video platform</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {platforms.map((platform) => (
          <button
            key={platform.id}
            onClick={() => canUsePlatform(platform) && setSelectedPlatform(platform.id)}
            className={`p-4 rounded-lg border text-left transition-all ${
              selectedPlatform === platform.id
                ? 'border-purple-500 bg-purple-500/20'
                : canUsePlatform(platform)
                ? 'border-white/20 bg-slate-800/50 hover:border-purple-400'
                : 'border-gray-600 bg-gray-800/50 opacity-50 cursor-not-allowed'
            }`}
            disabled={!canUsePlatform(platform)}
          >
            <h3 className="text-white font-medium">{platform.name}</h3>
            <p className="text-gray-400 text-sm">{platform.description}</p>
            {platform.premium && !canUsePlatform(platform) && (
              <span className="inline-block mt-2 px-2 py-1 bg-yellow-600 text-yellow-100 text-xs rounded">
                Premium
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        <Button onClick={onPrevious} variant="outline" className="flex-1">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        <Button
          onClick={onNext}
          disabled={!selectedPlatform}
          className="flex-1 bg-purple-600 hover:bg-purple-700"
        >
          Continue
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default FormStep2Platform;
