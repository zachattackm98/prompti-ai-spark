
import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Video, 
  Palette, 
  Camera,
  Lightbulb
} from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { usePromptUsage } from '@/hooks/usePromptUsage';

const UsageOverview = () => {
  const { subscription, features } = useSubscription();
  const { usage, promptLimit } = usePromptUsage();

  // Mock usage data - in a real app, this would come from your API
  const usageData = {
    promptsGenerated: usage?.prompt_count || 0,
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
      limit: promptLimit,
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
    <Card className="bg-slate-900/50 border border-white/10 p-4 sm:p-6 backdrop-blur-sm">
      <h3 className="text-lg font-semibold text-white mb-4 sm:mb-6">Usage Overview</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {usageItems.map((item, index) => {
          const Icon = item.icon;
          const progressValue = item.limit && item.limit > 0 ? (item.value / item.limit) * 100 : 0;
          
          return (
            <div key={index} className={`space-y-3 ${item.disabled ? 'opacity-50' : ''}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <Icon className={`w-4 h-4 ${item.color} flex-shrink-0`} />
                  <span className="text-sm text-gray-300 truncate">{item.label}</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {item.disabled ? (
                    <Badge variant="outline" className="border-gray-600 text-gray-400 text-xs">
                      Locked
                    </Badge>
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
                    <Badge key={i} variant="secondary" className="text-xs bg-slate-700 hover:bg-slate-600">
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
