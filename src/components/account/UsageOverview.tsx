
import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Video, 
  Palette, 
  Camera,
  Lightbulb,
  Infinity
} from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';

const UsageOverview = () => {
  const { subscription, features } = useSubscription();

  // Mock usage data - in a real app, this would come from your API
  const usageData = {
    promptsGenerated: subscription.tier === 'starter' ? 3 : 47,
    platformsUsed: ['Veo3', 'Sora', subscription.tier !== 'starter' ? 'Runway' : null].filter(Boolean),
    cameraControlsUsed: subscription.tier !== 'starter' ? 12 : 0,
    lightingEffectsUsed: subscription.tier !== 'starter' ? 8 : 0,
    stylesApplied: subscription.tier !== 'starter' ? 15 : 0,
  };

  const usageItems = [
    {
      icon: FileText,
      label: 'Prompts Generated',
      value: usageData.promptsGenerated,
      limit: features.maxPrompts,
      color: 'text-blue-400'
    },
    {
      icon: Video,
      label: 'AI Platforms',
      value: usageData.platformsUsed.length,
      limit: features.platforms.length,
      color: 'text-purple-400',
      showList: true,
      list: usageData.platformsUsed
    },
    {
      icon: Camera,
      label: 'Camera Controls',
      value: usageData.cameraControlsUsed,
      limit: null,
      color: 'text-green-400',
      disabled: !features.cameraControls
    },
    {
      icon: Lightbulb,
      label: 'Lighting Effects',
      value: usageData.lightingEffectsUsed,
      limit: null,
      color: 'text-yellow-400',
      disabled: !features.lightingOptions
    },
    {
      icon: Palette,
      label: 'Visual Styles',
      value: usageData.stylesApplied,
      limit: null,
      color: 'text-pink-400',
      disabled: !features.visualStyles
    }
  ];

  return (
    <Card className="bg-slate-900/40 border border-white/10 p-6">
      <h3 className="text-lg font-semibold text-white mb-6">Usage Overview</h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        {usageItems.map((item, index) => {
          const Icon = item.icon;
          const isUnlimited = item.limit === -1;
          const progressValue = item.limit && item.limit > 0 ? (item.value / item.limit) * 100 : 0;
          
          return (
            <div key={index} className={`space-y-3 ${item.disabled ? 'opacity-50' : ''}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${item.color}`} />
                  <span className="text-sm text-gray-300">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {item.disabled ? (
                    <Badge variant="outline" className="border-gray-600 text-gray-400 text-xs">
                      Locked
                    </Badge>
                  ) : isUnlimited ? (
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium text-white">{item.value}</span>
                      <Infinity className="w-3 h-3 text-green-400" />
                    </div>
                  ) : (
                    <span className="text-sm font-medium text-white">
                      {item.value}{item.limit ? `/${item.limit}` : ''}
                    </span>
                  )}
                </div>
              </div>
              
              {item.limit && item.limit > 0 && !item.disabled && (
                <Progress value={progressValue} className="h-2" />
              )}
              
              {item.showList && item.list && !item.disabled && (
                <div className="flex flex-wrap gap-1">
                  {item.list.map((platform, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {platform}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default UsageOverview;
