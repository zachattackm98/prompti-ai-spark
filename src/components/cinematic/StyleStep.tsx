
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ChevronLeft, Sparkles, Wand2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface StyleStepProps {
  styleReference: string;
  setStyleReference: (value: string) => void;
  onPrevious: () => void;
  onGenerate: () => void;
  isLoading: boolean;
  showUpgrade?: boolean;
}

const StyleStep: React.FC<StyleStepProps> = ({
  styleReference,
  setStyleReference,
  onPrevious,
  onGenerate,
  isLoading,
  showUpgrade = false
}) => {
  const isMobile = useIsMobile();

  return (
    <motion.div 
      className="space-y-4 sm:space-y-6"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center space-y-2 sm:space-y-3 px-2">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white leading-tight">
            Style Reference
          </h3>
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
        </div>
        <p className="text-gray-300 text-sm sm:text-base max-w-md mx-auto">
          Add style references to enhance your cinematic vision (optional)
        </p>
      </div>
      
      <div className="space-y-3 sm:space-y-4 px-2 sm:px-0">
        <Textarea
          placeholder="Describe the visual style, mood, or reference films/directors that inspire your vision..."
          value={styleReference}
          onChange={(e) => setStyleReference(e.target.value)}
          className={`
            bg-slate-800/60 border-slate-600 text-white placeholder-gray-400 
            resize-none transition-all duration-200
            ${isMobile 
              ? 'min-h-[140px] text-base px-4 py-3 rounded-lg' 
              : 'min-h-[100px] sm:min-h-[120px] text-sm sm:text-base'
            }
          `}
          style={{ 
            fontSize: isMobile ? '16px' : undefined,
            WebkitAppearance: 'none',
            WebkitBorderRadius: isMobile ? '8px' : undefined
          }}
        />
        <div className="space-y-2">
          <p className="text-xs sm:text-sm text-gray-400 px-1">
            Examples: "Cinematic like Blade Runner 2049", "Warm golden hour lighting", "Film noir aesthetic"
          </p>
          <div className="text-xs text-gray-500 px-1">
            {styleReference.length}/300 characters (optional)
          </div>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 px-2 sm:px-0 pt-2">
        <Button
          onClick={onPrevious}
          variant="outline"
          size={isMobile ? "lg" : "sm"}
          className={`
            border-slate-600 text-white hover:bg-slate-700 bg-slate-800/40
            transition-all duration-200
            ${isMobile ? 'h-12 order-2' : 'order-1 w-full sm:w-auto'}
          `}
        >
          <ChevronLeft className="w-4 h-4 mr-2" /> Previous
        </Button>
        <Button
          onClick={onGenerate}
          disabled={isLoading}
          size={isMobile ? "lg" : "sm"}
          className={`
            bg-gradient-to-r from-purple-600 to-pink-600 
            hover:from-purple-700 hover:to-pink-700 text-white 
            disabled:opacity-50 transition-all duration-200
            ${isMobile 
              ? 'h-12 order-1 min-w-[160px]' 
              : 'order-2 w-full sm:w-auto min-w-[140px]'
            }
          `}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              <span className={isMobile ? 'text-base' : ''}>Generating...</span>
            </div>
          ) : (
            <>
              <Wand2 className="w-4 h-4 mr-2" />
              <span className={isMobile ? 'text-base font-medium' : ''}>Generate Now</span>
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
};

export default StyleStep;
