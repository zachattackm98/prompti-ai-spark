
import React from 'react';
import { motion } from 'framer-motion';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, Settings, Camera, Lightbulb, Palette, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';

interface SceneStepProps {
  sceneIdea: string;
  setSceneIdea: (value: string) => void;
  onNext: () => void;
  setShowAuthDialog?: (show: boolean) => void;
  isContinuingScene?: boolean;
  clearContinuationMode?: () => void;
  onCancel?: () => void;
  selectedPlatform?: string;
  selectedEmotion?: string;
  cameraSettings?: { angle: string; movement: string; shot: string };
  lightingSettings?: { mood: string; style: string; timeOfDay: string };
  styleReference?: string;
}

const SceneStep: React.FC<SceneStepProps> = ({ 
  sceneIdea, 
  setSceneIdea, 
  onNext, 
  setShowAuthDialog,
  isContinuingScene = false,
  clearContinuationMode,
  onCancel,
  selectedPlatform,
  selectedEmotion,
  cameraSettings,
  lightingSettings,
  styleReference
}) => {
  const { user } = useAuth();
  const isMobile = useIsMobile();

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSceneIdea(e.target.value);
  };

  const handleNextClick = () => {
    if (!user && setShowAuthDialog) {
      setShowAuthDialog(true);
    } else {
      onNext();
    }
  };

  // Helper function to format settings for display
  const formatSettings = () => {
    const settings = [];
    if (selectedPlatform && selectedPlatform !== 'veo3') {
      settings.push(`Platform: ${selectedPlatform.toUpperCase()}`);
    }
    if (selectedEmotion && selectedEmotion !== 'cinematic') {
      settings.push(`Emotion: ${selectedEmotion}`);
    }
    if (cameraSettings && (cameraSettings.angle || cameraSettings.movement || cameraSettings.shot)) {
      const cameraSet = [cameraSettings.angle, cameraSettings.movement, cameraSettings.shot].filter(Boolean);
      if (cameraSet.length > 0) {
        settings.push(`Camera: ${cameraSet.join(', ')}`);
      }
    }
    if (lightingSettings && (lightingSettings.mood || lightingSettings.style || lightingSettings.timeOfDay)) {
      const lightingSet = [lightingSettings.mood, lightingSettings.style, lightingSettings.timeOfDay].filter(Boolean);
      if (lightingSet.length > 0) {
        settings.push(`Lighting: ${lightingSet.join(', ')}`);
      }
    }
    if (styleReference && styleReference.trim()) {
      settings.push(`Style: Custom reference`);
    }
    return settings;
  };

  const preservedSettings = formatSettings();

  return (
    <motion.div 
      className="space-y-4 sm:space-y-6"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Continuation Mode Header */}
      {isContinuingScene && (
        <motion.div 
          className="bg-gradient-to-r from-green-900/30 to-blue-900/30 border border-green-400/20 rounded-lg p-4 mx-2 sm:mx-0"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Settings className="w-4 h-4 text-green-400" />
            <Badge variant="secondary" className="bg-green-900/50 text-green-300 border-green-400/30">
              Continuing Scene
            </Badge>
          </div>
          
          <p className="text-green-200 text-sm mb-3">
            Your previous settings have been preserved. Describe your next scene and we'll maintain continuity.
          </p>
          
          {preservedSettings.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-green-300/80 font-medium">Preserved Settings:</p>
              <div className="flex flex-wrap gap-2">
                {preservedSettings.map((setting, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="text-xs bg-slate-800/50 border-green-400/20 text-green-300"
                  >
                    {setting}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      <div className="text-center space-y-2 sm:space-y-3 px-2">
        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white leading-tight">
          {isContinuingScene ? 'Describe Your Next Scene' : 'Describe Your Scene'}
        </h3>
        <p className="text-gray-300 text-sm sm:text-base max-w-md mx-auto">
          {isContinuingScene 
            ? 'Build on your story with the next cinematic moment'
            : 'Tell us about the cinematic moment you want to create'
          }
        </p>
      </div>
      
      <div className="w-full max-w-full overflow-hidden px-2 sm:px-0">
        <Textarea
          value={sceneIdea}
          onChange={handleTextChange}
          placeholder={isContinuingScene 
            ? "e.g., The camera pulls back to reveal the astronaut's ship approaching a massive space station..."
            : "e.g., A lone astronaut floating in space, Earth visible in the background, golden hour lighting..."
          }
          className={`
            bg-slate-800/60 border-purple-400/30 text-white placeholder:text-gray-400 
            focus:border-purple-400/60 focus:ring-purple-400/20 
            w-full max-w-full resize-none transition-all duration-200
            ${isContinuingScene ? 'border-green-400/30 focus:border-green-400/60' : ''}
            ${isMobile 
              ? 'min-h-[120px] text-base px-4 py-3 rounded-lg' 
              : 'min-h-[100px] sm:min-h-[120px] text-sm sm:text-base'
            }
          `}
          style={{ 
            fontSize: isMobile ? '16px' : undefined,
            WebkitAppearance: 'none',
            WebkitBorderRadius: isMobile ? '8px' : undefined
          }}
        />
        <div className="mt-2 text-xs text-gray-400 px-1">
          {sceneIdea.length}/500 characters
        </div>
      </div>
      
      <div className="flex justify-center px-2 sm:px-0 pt-2">
        {isContinuingScene ? (
          <div className={`flex gap-3 ${isMobile ? 'w-full' : 'w-full sm:w-auto'}`}>
            <Button
              onClick={onCancel}
              variant="outline"
              size={isMobile ? "lg" : "sm"}
              className={`
                border-slate-500 text-white hover:bg-slate-600 hover:text-white
                transition-all duration-200
                ${isMobile ? 'flex-1 h-12 text-base' : 'px-6'}
              `}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleNextClick}
              disabled={!sceneIdea.trim()}
              size={isMobile ? "lg" : "sm"}
              className={`
                bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700
                text-white transition-all duration-200
                ${isMobile ? 'flex-1 h-12 text-base font-medium' : 'px-6'}
              `}
            >
              Continue Story <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        ) : (
          <Button
            onClick={handleNextClick}
            disabled={!sceneIdea.trim()}
            size={isMobile ? "lg" : "sm"}
            className={`
              bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700
              text-white transition-all duration-200
              ${isMobile 
                ? 'w-full h-12 text-base font-medium' 
                : 'w-full sm:w-auto'
              }
            `}
          >
            Next Step <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default SceneStep;
