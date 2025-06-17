
import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Download, Sparkles } from 'lucide-react';
import { GeneratedPrompt } from './hooks/types';

interface GeneratedPromptDisplayProps {
  generatedPrompt: GeneratedPrompt;
  onCopyAllPrompts: (prompt: GeneratedPrompt) => void;
  onDownloadPrompt: () => void;
  onGenerateNew: () => void;
}

const GeneratedPromptDisplay: React.FC<GeneratedPromptDisplayProps> = ({
  generatedPrompt,
  onCopyAllPrompts,
  onDownloadPrompt,
  onGenerateNew
}) => {
  return (
    <motion.div
      id="generated-prompt-display"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <motion.h3 
          className="text-2xl font-bold text-white mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          🎬 Your Cinematic Prompt is Ready!
        </motion.h3>
        {generatedPrompt.sceneNumber && generatedPrompt.totalScenes && (
          <p className="text-purple-300 text-sm">
            Scene {generatedPrompt.sceneNumber} of {generatedPrompt.totalScenes}
          </p>
        )}
      </div>

      <Card className="bg-gradient-to-br from-purple-900/40 to-slate-900/60 border border-purple-400/30 p-6">
        <div className="space-y-4">
          <div>
            <h4 className="text-lg font-semibold text-purple-300 mb-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Main Prompt for {generatedPrompt.platform}
            </h4>
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600/30">
              <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">
                {generatedPrompt.mainPrompt}
              </p>
            </div>
          </div>

          {generatedPrompt.styleNotes && (
            <div>
              <h4 className="text-lg font-semibold text-purple-300 mb-2">Style Notes</h4>
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600/30">
                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                  {generatedPrompt.styleNotes}
                </p>
              </div>
            </div>
          )}

          {generatedPrompt.technicalSpecs && (
            <div>
              <h4 className="text-lg font-semibold text-purple-300 mb-2">Technical Specifications</h4>
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600/30">
                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                  {generatedPrompt.technicalSpecs}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-3 mt-6 justify-center">
          <Button
            onClick={() => onCopyAllPrompts(generatedPrompt)}
            variant="outline"
            size="sm"
            className="bg-purple-600/20 border-purple-400/30 text-purple-300 hover:bg-purple-600/30"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy All Prompts
          </Button>
          
          <Button
            onClick={onDownloadPrompt}
            variant="outline"
            size="sm"
            className="bg-blue-600/20 border-blue-400/30 text-blue-300 hover:bg-blue-600/30"
          >
            <Download className="w-4 h-4 mr-2" />
            Download All
          </Button>
          
          <Button
            onClick={onGenerateNew}
            variant="default"
            size="sm"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Generate New
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default GeneratedPromptDisplay;
