
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
  onContinueScene: () => void;
}

const GeneratedPromptDisplay: React.FC<GeneratedPromptDisplayProps> = ({
  generatedPrompt,
  onCopyToClipboard,
  onDownloadPrompt,
  onGenerateNew,
  onContinueScene
}) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const handleCopyAll = () => {
    const fullPrompt = `MAIN PROMPT:\n${generatedPrompt.mainPrompt}\n\nTECHNICAL SPECS:\n${generatedPrompt.technicalSpecs}\n\nSTYLE NOTES:\n${generatedPrompt.styleNotes}`;
    onCopyToClipboard(fullPrompt);
    toast({
      title: "Success!",
      description: "Prompt sections copied to clipboard (excluding metadata).",
    });
  };

  const handleCopyTechnicalSpecs = () => {
    onCopyToClipboard(generatedPrompt.technicalSpecs);
    toast({
      title: "Success!",
      description: "Technical specifications copied to clipboard.",
    });
  };

  const handleCopyStyleNotes = () => {
    onCopyToClipboard(generatedPrompt.styleNotes);
    toast({
      title: "Success!",
      description: "Style notes copied to clipboard.",
    });
  };

  const handleCopyMetadata = () => {
    const metadataText = JSON.stringify(generatedPrompt.metadata, null, 2);
    onCopyToClipboard(metadataText);
    toast({
      title: "Success!",
      description: "Metadata copied to clipboard.",
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
          Your Cinematic Prompt is Ready!
        </h3>
        <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-purple-300 flex-wrap">
          <Star className="w-3 h-3 sm:w-4 sm:h-4" />
          <span>Optimized for {platforms.find(p => p.id === generatedPrompt.platform)?.name}</span>
          <Star className="w-3 h-3 sm:w-4 sm:h-4" />
        </div>
      </div>

      <div className="space-y-3 sm:space-y-4">
        <div className="bg-slate-800/60 rounded-xl border border-purple-400/20 overflow-hidden">
          <div className={`${isMobile ? 'p-4' : 'p-4 sm:p-6'}`}>
            <h4 className={`font-semibold text-purple-300 mb-2 sm:mb-3 ${
              isMobile ? 'text-base' : 'text-base sm:text-lg'
            }`}>
              Main Prompt
            </h4>
            <p className={`text-gray-200 leading-relaxed mb-3 ${
              isMobile ? 'text-sm' : 'text-sm sm:text-base'
            }`}>
              {generatedPrompt.mainPrompt}
            </p>
            <Button
              onClick={() => onCopyToClipboard(generatedPrompt.mainPrompt)}
              variant="outline"
              className="
                w-full sm:w-auto min-h-[44px] sm:min-h-[40px] px-4 sm:px-6 py-2
                text-sm sm:text-base font-medium whitespace-normal leading-snug
                border-purple-400/30 text-purple-300 hover:bg-purple-900/30 bg-slate-800/40
                transition-all duration-200 flex items-center justify-center
              "
            >
              <Copy className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="text-center">Copy Main Prompt</span>
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
            <p className={`text-gray-200 leading-relaxed mb-3 ${
              isMobile ? 'text-sm' : 'text-sm sm:text-base'
            }`}>
              {generatedPrompt.technicalSpecs}
            </p>
            <Button
              onClick={handleCopyTechnicalSpecs}
              variant="outline"
              className="
                w-full sm:w-auto min-h-[44px] sm:min-h-[40px] px-4 sm:px-6 py-2
                text-sm sm:text-base font-medium whitespace-normal leading-snug
                border-blue-400/30 text-blue-300 hover:bg-blue-900/30 bg-slate-800/40
                transition-all duration-200 flex items-center justify-center
              "
            >
              <Copy className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="text-center">Copy Specs</span>
            </Button>
          </div>
        </div>

        <div className="bg-slate-800/60 rounded-xl border border-pink-400/20 overflow-hidden">
          <div className={`${isMobile ? 'p-4' : 'p-4 sm:p-6'}`}>
            <h4 className={`font-semibold text-pink-300 mb-2 sm:mb-3 ${
              isMobile ? 'text-base' : 'text-base sm:text-lg'
            }`}>
              Style Notes
            </h4>
            <p className={`text-gray-200 leading-relaxed mb-3 ${
              isMobile ? 'text-sm' : 'text-sm sm:text-base'
            }`}>
              {generatedPrompt.styleNotes}
            </p>
            <Button
              onClick={handleCopyStyleNotes}
              variant="outline"
              className="
                w-full sm:w-auto min-h-[44px] sm:min-h-[40px] px-4 sm:px-6 py-2
                text-sm sm:text-base font-medium whitespace-normal leading-snug
                border-pink-400/30 text-pink-300 hover:bg-pink-900/30 bg-slate-800/40
                transition-all duration-200 flex items-center justify-center
              "
            >
              <Copy className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="text-center">Copy Style</span>
            </Button>
          </div>
        </div>

        <div className="bg-slate-800/60 rounded-xl border border-emerald-400/20 overflow-hidden">
          <div className={`${isMobile ? 'p-4' : 'p-4 sm:p-6'}`}>
            <h4 className={`font-semibold text-emerald-300 mb-2 sm:mb-3 ${
              isMobile ? 'text-base' : 'text-base sm:text-lg'
            }`}>
              Metadata
            </h4>
            <div className={`space-y-2 mb-3 ${
              isMobile ? 'text-xs' : 'text-xs sm:text-sm'
            }`}>
              <div className="grid grid-cols-2 gap-2 text-gray-200">
                <div><span className="text-emerald-300">Location:</span> {generatedPrompt.metadata?.location || 'N/A'}</div>
                <div><span className="text-emerald-300">Time:</span> {generatedPrompt.metadata?.timeOfDay || 'N/A'}</div>
                <div><span className="text-emerald-300">Mood:</span> {generatedPrompt.metadata?.mood || 'N/A'}</div>
                <div><span className="text-emerald-300">Style:</span> {generatedPrompt.metadata?.visualStyle || 'N/A'}</div>
              </div>
              {generatedPrompt.metadata?.characters && generatedPrompt.metadata.characters.length > 0 && (
                <div className="text-gray-200">
                  <span className="text-emerald-300">Characters:</span> {generatedPrompt.metadata.characters.join(', ')}
                </div>
              )}
              {generatedPrompt.metadata?.colorPalette && generatedPrompt.metadata.colorPalette.length > 0 && (
                <div className="text-gray-200">
                  <span className="text-emerald-300">Colors:</span> {generatedPrompt.metadata.colorPalette.join(', ')}
                </div>
              )}
            </div>
            <Button
              onClick={handleCopyMetadata}
              variant="outline"
              className="
                w-full sm:w-auto min-h-[44px] sm:min-h-[40px] px-4 sm:px-6 py-2
                text-sm sm:text-base font-medium whitespace-normal leading-snug
                border-emerald-400/30 text-emerald-300 hover:bg-emerald-900/30 bg-slate-800/40
                transition-all duration-200 flex items-center justify-center
              "
            >
              <Copy className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="text-center">Copy Metadata</span>
            </Button>
          </div>
        </div>
      </div>

      <div className={`pt-2 sm:pt-4 ${
        isMobile 
          ? 'flex flex-col gap-3' 
          : 'flex flex-wrap gap-2 sm:gap-4 justify-center'
      }`}>
        <Button
          onClick={handleCopyAll}
          className="
            min-h-[44px] sm:min-h-[40px] px-4 sm:px-6 py-2 flex-1 sm:flex-initial
            text-sm sm:text-base font-medium whitespace-normal leading-snug
            bg-gradient-to-r from-purple-600 to-pink-600 
            hover:from-purple-700 hover:to-pink-700 text-white
            transition-all duration-200 flex items-center justify-center
          "
        >
          <Copy className="w-4 h-4 mr-2 flex-shrink-0" />
          <span className="text-center">Copy Complete</span>
        </Button>
        <Button
          onClick={onDownloadPrompt}
          variant="outline"
          className="
            min-h-[44px] sm:min-h-[40px] px-4 sm:px-6 py-2 flex-1 sm:flex-initial
            text-sm sm:text-base font-medium whitespace-normal leading-snug
            border-slate-600 text-white hover:bg-slate-700 bg-slate-800/40
            transition-all duration-200 flex items-center justify-center
          "
        >
          <Download className="w-4 h-4 mr-2 flex-shrink-0" />
          <span className="text-center">Download</span>
        </Button>
        <Button
          onClick={onGenerateNew}
          variant="outline"
          className="
            min-h-[44px] sm:min-h-[40px] px-4 sm:px-6 py-2 flex-1 sm:flex-initial
            text-sm sm:text-base font-medium whitespace-normal leading-snug
            border-slate-600 text-white hover:bg-slate-700 bg-slate-800/40
            transition-all duration-200 flex items-center justify-center
          "
        >
          <RotateCcw className="w-4 h-4 mr-2 flex-shrink-0" />
          <span className="text-center">Generate New</span>
        </Button>
        <Button
          onClick={onContinueScene}
          variant="outline"
          className="
            min-h-[44px] sm:min-h-[40px] px-4 sm:px-6 py-2 flex-1 sm:flex-initial
            text-sm sm:text-base font-medium whitespace-normal leading-snug
            border-purple-400/50 text-purple-300 hover:bg-purple-900/30 hover:text-white bg-slate-800/40
            transition-all duration-200 flex items-center justify-center
          "
        >
          <Film className="w-4 h-4 mr-2 flex-shrink-0" />
          <span className="text-center">Continue Scene</span>
        </Button>
      </div>
    </motion.div>
  );
};

export default GeneratedPromptDisplay;
