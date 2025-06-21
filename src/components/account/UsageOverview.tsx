
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
  CheckCircle
} from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { usePromptUsage } from '@/hooks/usePromptUsage';

const UsageOverview = () => {
  const { subscription, features } = useSubscription();
  const { usage, promptLimit } = usePromptUsage();

  // Mock usage data - in a real app, this would come from your API
  const usageData = {
    promptsGenerated: usage?.prompt_count || 0,
    platformsUsed: ['Veo3', 'Sora', 'Runway', 'Pika'],
    cameraControlsUsed: 15,
    lightingEffectsUsed: 12,
    stylesApplied: 18,
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
      limit: 4,
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
      disabled: false
    },
    {
      icon: Lightbulb,
      label: 'Lighting Effects',
      value: usageData.lightingEffectsUsed,
      limit: null,
      color: 'text-yellow-400',
      disabled: false
    },
    {
      icon: Palette,
      label: 'Visual Styles',
      value: usageData.stylesApplied,
      limit: null,
      color: 'text-pink-400',
      disabled: false
    }
  ];

  return (
    <Card className="bg-slate-900/50 border border-white/10 p-4 sm:p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h3 className="text-lg font-semibold text-white">Usage Overview</h3>
        {subscription.tier === 'starter' && (
          <Badge className="bg-green-500/20 text-green-400 border-green-400/30">
            <CheckCircle className="w-3 h-3 mr-1" />
            All Features Unlocked
          </Badge>
        )}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {usageItems.map((item, index) => {
          const Icon = item.icon;
          const progressValue = item.limit && item.limit > 0 ? (item.value / item.limit) * 100 : 0;
          
          return (
            <div key={index} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <Icon className={`w-4 h-4 ${item.color} flex-shrink-0`} />
                  <span className="text-sm text-gray-300 truncate">{item.label}</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-sm font-medium text-white">
                    {item.value}{item.limit ? `/${item.limit}` : ''}
                  </span>
                  {!item.limit && (
                    <CheckCircle className="w-3 h-3 text-green-400" />
                  )}
                </div>
              </div>
              
              {item.limit && item.limit > 0 && (
                <Progress value={progressValue} className="h-2" />
              )}
              
              {item.showList && item.list && (
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

      {subscription.tier === 'starter' && (
        <div className="mt-6 p-4 bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-400/30 rounded-lg">
          <p className="text-sm text-purple-300 text-center">
            ✨ You have access to all features! Upgrade to get more prompts per month and priority support.
          </p>
        </div>
      )}
    </Card>
  );
};

export default UsageOverview;
