
import React from 'react';
import { motion } from 'framer-motion';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';

interface SceneStepProps {
  sceneIdea: string;
  setSceneIdea: (value: string) => void;
  onNext: () => void;
  setShowAuthDialog?: (show: boolean) => void;
}

const SceneStep: React.FC<SceneStepProps> = ({ 
  sceneIdea, 
  setSceneIdea, 
  onNext, 
  setShowAuthDialog 
}) => {
  const { user } = useAuth();
  const isMobile = useIsMobile();

  const handleNextClick = () => {
    if (!user && setShowAuthDialog) {
      setShowAuthDialog(true);
    } else {
      onNext();
    }
  };

  return (
    <motion.div 
      className="w-full max-w-full overflow-hidden space-y-4 sm:space-y-6"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center space-y-2 sm:space-y-3 px-2 w-full max-w-full">
        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white leading-tight">
          Describe Your Scene
        </h3>
        <p className="text-gray-300 text-sm sm:text-base max-w-md mx-auto">
          Tell us about the cinematic moment you want to create
        </p>
      </div>
      
      <div className="w-full max-w-full overflow-hidden px-2 sm:px-0">
        <Textarea
          value={sceneIdea}
          onChange={(e) => setSceneIdea(e.target.value)}
          placeholder="e.g., A lone astronaut floating in space, Earth visible in the background, golden hour lighting..."
          className={`
            bg-slate-800/60 border-purple-400/30 text-white placeholder:text-gray-400 
            focus:border-purple-400/60 focus:ring-purple-400/20 
            w-full max-w-full resize-none transition-all duration-200
            ${isMobile 
              ? 'min-h-[120px] text-base px-4 py-3 rounded-lg' 
              : 'min-h-[100px] sm:min-h-[120px] text-sm sm:text-base'
            }
          `}
          style={{ 
            fontSize: isMobile ? '16px' : undefined,
            WebkitAppearance: 'none',
            WebkitBorderRadius: isMobile ? '8px' : undefined,
            maxWidth: '100%',
            boxSizing: 'border-box'
          }}
        />
        <div className="mt-2 text-xs text-gray-400 px-1">
          {sceneIdea.length}/500 characters
        </div>
      </div>
      
      <div className="flex justify-center px-2 sm:px-0 pt-2 w-full max-w-full">
        <Button
          onClick={handleNextClick}
          disabled={!sceneIdea.trim()}
          size={isMobile ? "lg" : "sm"}
          className={`
            bg-gradient-to-r from-purple-600 to-pink-600 
            hover:from-purple-700 hover:to-pink-700 
            text-white transition-all duration-200
            ${isMobile 
              ? 'w-full h-12 text-base font-medium max-w-full' 
              : 'w-full sm:w-auto'
            }
          `}
        >
          Next Step <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </motion.div>
  );
};

export default SceneStep;
