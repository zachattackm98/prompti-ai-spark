
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Copy, Download, Star } from 'lucide-react';
import { GeneratedPrompt } from './types';
import { platforms } from './constants';

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
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      <div className="text-center space-y-3">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
          Your Cinematic Prompt is Ready!
        </h3>
        <div className="flex items-center justify-center gap-2 text-sm text-purple-300">
          <Star className="w-4 h-4" />
          <span>Optimized for {platforms.find(p => p.id === generatedPrompt.platform)?.name}</span>
          <Star className="w-4 h-4" />
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-slate-800/60 rounded-xl p-6 border border-purple-400/20">
          <h4 className="text-lg font-semibold text-purple-300 mb-3">Main Prompt</h4>
          <p className="text-gray-200 leading-relaxed">{generatedPrompt.mainPrompt}</p>
          <Button
            onClick={() => onCopyToClipboard(generatedPrompt.mainPrompt)}
            size="sm"
            variant="outline"
            className="mt-3 border-purple-400/30 text-purple-300 hover:bg-purple-900/30 bg-slate-800/40"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy Main Prompt
          </Button>
        </div>

        <div className="bg-slate-800/60 rounded-xl p-6 border border-blue-400/20">
          <h4 className="text-lg font-semibold text-blue-300 mb-3">Technical Specifications</h4>
          <p className="text-gray-200 leading-relaxed">{generatedPrompt.technicalSpecs}</p>
        </div>

        <div className="bg-slate-800/60 rounded-xl p-6 border border-pink-400/20">
          <h4 className="text-lg font-semibold text-pink-300 mb-3">Style Notes</h4>
          <p className="text-gray-200 leading-relaxed">{generatedPrompt.styleNotes}</p>
        </div>
      </div>

      <div className="flex justify-center gap-4 pt-4">
        <Button
          onClick={() => onCopyToClipboard(`${generatedPrompt.mainPrompt}\n\n${generatedPrompt.technicalSpecs}\n\n${generatedPrompt.styleNotes}`)}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
        >
          <Copy className="w-4 h-4 mr-2" />
          Copy All
        </Button>
        <Button
          onClick={onDownloadPrompt}
          variant="outline"
          className="border-slate-600 text-white hover:bg-slate-700 bg-slate-800/40"
        >
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
        <Button
          onClick={onGenerateNew}
          variant="outline"
          className="border-slate-600 text-white hover:bg-slate-700 bg-slate-800/40"
        >
          Generate New
        </Button>
      </div>
    </motion.div>
  );
};

export default GeneratedPromptDisplay;
