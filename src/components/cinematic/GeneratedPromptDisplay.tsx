
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Copy, Download, Star, RotateCcw, Film } from 'lucide-react';
import { GeneratedPrompt } from './types';
import { platforms } from './constants';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

interface GeneratedPromptDisplayProps {
  generatedPrompt: GeneratedPrompt;
  onCopyToClipboard: (text: string) => void;
  onDownloadPrompt: () => void;
  onGenerateNew: () => void;
}

const GeneratedPromptDisplay: React.FC<GeneratedPromptDisplayProps> = ({
  generatedPrompt,
  onCopyToClipboard,
  onDownloadPrompt,
  onGenerateNew
}) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const isMultiScene = generatedPrompt.sceneNumber && generatedPrompt.totalScenes && generatedPrompt.totalScenes > 1;

  const handleCopyAll = () => {
    const fullPrompt = `${generatedPrompt.mainPrompt}\n\n${generatedPrompt.technicalSpecs}\n\n${generatedPrompt.styleNotes}`;
    onCopyToClipboard(fullPrompt);
    toast({
      title: "Success!",
      description: "Complete prompt copied to clipboard.",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`space-y-4 sm:space-y-6 ${isMobile ? 'px-2' : ''}`}
    >
      <div className="text-center space-y-2 sm:space-y-3">
        <h3 className={`font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent leading-tight ${
          isMobile ? 'text-lg' : 'text-xl sm:text-2xl'
        }`}>
          {isMultiScene ? `Scene ${generatedPrompt.sceneNumber} Complete!` : 'Your Cinematic Prompt is Ready!'}
        </h3>
        <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-purple-300 flex-wrap">
          <Star className="w-3 h-3 sm:w-4 sm:h-4" />
          <span>Optimized for {platforms.find(p => p.id === generatedPrompt.platform)?.name}</span>
          {isMultiScene && (
            <>
              <Film className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>{generatedPrompt.sceneNumber}/{generatedPrompt.totalScenes} Scenes</span>
            </>
          )}
          <Star className="w-3 h-3 sm:w-4 sm:h-4" />
        </div>
      </div>

      <div className="space-y-3 sm:space-y-4">
        <div className="bg-slate-800/60 rounded-xl border border-purple-400/20 overflow-hidden">
          <div className={`${isMobile ? 'p-4' : 'p-4 sm:p-6'}`}>
            <h4 className={`font-semibold text-purple-300 mb-2 sm:mb-3 ${
              isMobile ? 'text-base' : 'text-base sm:text-lg'
            }`}>
              Main Prompt{isMultiScene ? ` - Scene ${generatedPrompt.sceneNumber}` : ''}
            </h4>
            <p className={`text-gray-200 leading-relaxed mb-3 ${
              isMobile ? 'text-sm' : 'text-sm sm:text-base'
            }`}>
              {generatedPrompt.mainPrompt}
            </p>
            <Button
              onClick={() => onCopyToClipboard(generatedPrompt.mainPrompt)}
              size={isMobile ? "default" : "sm"}
              variant="outline"
              className={`
                border-purple-400/30 text-purple-300 hover:bg-purple-900/30 bg-slate-800/40
                transition-all duration-200
                ${isMobile ? 'w-full h-10' : 'w-full sm:w-auto text-xs sm:text-sm'}
              `}
            >
              <Copy className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              Copy Main Prompt
            </Button>
          </div>
        </div>

        <div className="bg-slate-800/60 rounded-xl border border-blue-400/20 overflow-hidden">
          <div className={`${isMobile ? 'p-4' : 'p-4 sm:p-6'}`}>
            <h4 className={`font-semibold text-blue-300 mb-2 sm:mb-3 ${
              isMobile ? 'text-base' : 'text-base sm:text-lg'
            }`}>
              Technical Specifications
            </h4>
            <p className={`text-gray-200 leading-relaxed ${
              isMobile ? 'text-sm' : 'text-sm sm:text-base'
            }`}>
              {generatedPrompt.technicalSpecs}
            </p>
          </div>
        </div>

        <div className="bg-slate-800/60 rounded-xl border border-pink-400/20 overflow-hidden">
          <div className={`${isMobile ? 'p-4' : 'p-4 sm:p-6'}`}>
            <h4 className={`font-semibold text-pink-300 mb-2 sm:mb-3 ${
              isMobile ? 'text-base' : 'text-base sm:text-lg'
            }`}>
              Style Notes
            </h4>
            <p className={`text-gray-200 leading-relaxed ${
              isMobile ? 'text-sm' : 'text-sm sm:text-base'
            }`}>
              {generatedPrompt.styleNotes}
            </p>
          </div>
        </div>
      </div>

      <div className={`pt-2 sm:pt-4 ${
        isMobile 
          ? 'flex flex-col gap-3' 
          : 'flex flex-col sm:flex-row justify-center gap-2 sm:gap-4'
      }`}>
        <Button
          onClick={handleCopyAll}
          size={isMobile ? "lg" : "default"}
          className={`
            bg-gradient-to-r from-purple-600 to-pink-600 
            hover:from-purple-700 hover:to-pink-700 text-white
            transition-all duration-200
            ${isMobile ? 'h-12 order-1 text-base font-medium' : 'text-xs sm:text-sm w-full sm:w-auto order-1'}
          `}
        >
          <Copy className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
          Copy All
        </Button>
        <Button
          onClick={onDownloadPrompt}
          variant="outline"
          size={isMobile ? "lg" : "default"}
          className={`
            border-slate-600 text-white hover:bg-slate-700 bg-slate-800/40
            transition-all duration-200
            ${isMobile ? 'h-12 order-2 text-base' : 'text-xs sm:text-sm w-full sm:w-auto order-2'}
          `}
        >
          <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
          Download
        </Button>
        <Button
          onClick={onGenerateNew}
          variant="outline"
          size={isMobile ? "lg" : "default"}
          className={`
            border-slate-600 text-white hover:bg-slate-700 bg-slate-800/40
            transition-all duration-200
            ${isMobile ? 'h-12 order-3 text-base' : 'text-xs sm:text-sm w-full sm:w-auto order-3'}
          `}
        >
          <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
          {isMultiScene ? 'New Project' : 'Generate New'}
        </Button>
      </div>
    </motion.div>
  );
};

export default GeneratedPromptDisplay;
