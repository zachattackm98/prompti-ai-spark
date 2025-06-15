
import React from 'react';
import { motion } from 'framer-motion';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Zap, Sparkles } from 'lucide-react';

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
      className="space-y-6"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center space-y-3">
        <h3 className="text-2xl font-bold text-white">Style Reference (Optional)</h3>
        <p className="text-gray-300">Add any specific visual style or reference you'd like to include</p>
      </div>
      
      <Textarea
        value={styleReference}
        onChange={(e) => setStyleReference(e.target.value)}
        placeholder="e.g., Shot like a Christopher Nolan film, warm color grading, shallow depth of field..."
        className="bg-slate-800/60 border-purple-400/30 text-white placeholder:text-gray-400 min-h-[100px] focus:border-purple-400/60 focus:ring-purple-400/20"
      />
      
      <div className="flex justify-between">
        <Button
          onClick={onPrevious}
          variant="outline"
          className="border-slate-600 text-white hover:bg-slate-700 bg-slate-800/40"
        >
          <ChevronLeft className="w-4 h-4 mr-2" /> Previous
        </Button>
        <Button
          onClick={onGenerate}
          disabled={isLoading}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8"
        >
          {isLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-5 h-5" />
            </motion.div>
          ) : (
            <>
              <Zap className="w-5 h-5 mr-2" />
              Generate Prompt
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
};

export default StyleStep;
