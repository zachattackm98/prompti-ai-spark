
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ChevronLeft, Sparkles, Wand2 } from 'lucide-react';

interface StyleStepProps {
  styleReference: string;
  setStyleReference: (value: string) => void;
  onPrevious: () => void;
  onGenerate: () => void;
  isLoading: boolean;
}

const StyleStep: React.FC<StyleStepProps> = ({
  styleReference,
  setStyleReference,
  onPrevious,
  onGenerate,
  isLoading
}) => {
  return (
    <motion.div 
      className="space-y-4 sm:space-y-6"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center space-y-2 sm:space-y-3">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
          <h3 className="text-xl sm:text-2xl font-bold text-white">Style Reference</h3>
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
        </div>
        <p className="text-gray-300 text-sm sm:text-base">Add style references to enhance your cinematic vision (optional)</p>
      </div>
      
      <div className="space-y-3 sm:space-y-4">
        <Textarea
          placeholder="Describe the visual style, mood, or reference films/directors that inspire your vision..."
          value={styleReference}
          onChange={(e) => setStyleReference(e.target.value)}
          className="min-h-[100px] sm:min-h-[120px] bg-slate-800/60 border-slate-600 text-white placeholder-gray-400 resize-none text-sm sm:text-base"
        />
        <p className="text-xs sm:text-sm text-gray-300">
          Examples: "Cinematic like Blade Runner 2049", "Warm golden hour lighting", "Film noir aesthetic"
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-4 pt-2">
        <Button
          onClick={onPrevious}
          variant="outline"
          size="sm"
          className="order-2 sm:order-1 border-slate-600 text-white hover:bg-slate-700 bg-slate-800/40 w-full sm:w-auto"
        >
          <ChevronLeft className="w-4 h-4 mr-2" /> Previous
        </Button>
        <Button
          onClick={onGenerate}
          disabled={isLoading}
          size="sm"
          className="order-1 sm:order-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white disabled:opacity-50 w-full sm:w-auto min-w-[140px]"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Generating...
            </div>
          ) : (
            <>
              <Wand2 className="w-4 h-4 mr-2" />
              Generate Now
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
};

export default StyleStep;
