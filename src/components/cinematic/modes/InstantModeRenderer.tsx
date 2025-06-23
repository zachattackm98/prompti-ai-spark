
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Zap } from 'lucide-react';

interface InstantModeRendererProps {
  sceneIdea: string;
  setSceneIdea: (value: string) => void;
  handleGenerate: () => void;
  isLoading: boolean;
  detectedPlatform?: string;
}

const InstantModeRenderer: React.FC<InstantModeRendererProps> = ({
  sceneIdea,
  setSceneIdea,
  handleGenerate,
  isLoading,
  detectedPlatform
}) => {
  return (
    <Card className="bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-purple-900/20 border border-purple-500/20 backdrop-blur-sm p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-purple-300">
            <Zap className="w-5 h-5" />
            <h2 className="text-xl font-semibold">Instant Mode</h2>
          </div>
          <p className="text-slate-400 text-sm">
            Describe your scene and we'll auto-select the best platform and settings
          </p>
        </div>

        {/* Scene Description */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-white">
            Scene Description
          </label>
          <Textarea
            value={sceneIdea}
            onChange={(e) => setSceneIdea(e.target.value)}
            placeholder="Describe your scene... (e.g., 'A cinematic shot of a sunset over mountains' or 'Quick social media clip of a dog playing')"
            className="min-h-[120px] bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 resize-none"
            disabled={isLoading}
          />
        </div>

        {/* Platform Detection Display */}
        {detectedPlatform && sceneIdea.trim() && (
          <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-3">
            <div className="flex items-center gap-2 text-purple-300">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span className="text-sm font-medium">
                Auto-detected platform: {detectedPlatform.charAt(0).toUpperCase() + detectedPlatform.slice(1)}
              </span>
            </div>
          </div>
        )}

        {/* Generate Button */}
        <Button
          onClick={handleGenerate}
          disabled={!sceneIdea.trim() || isLoading}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-3"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              Generating...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Generate Instant Prompt
            </div>
          )}
        </Button>
      </div>
    </Card>
  );
};

export default InstantModeRenderer;
