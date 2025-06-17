
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Download, RotateCcw, Save, Loader2 } from 'lucide-react';
import { GeneratedPrompt } from './hooks/types';

interface GeneratedPromptDisplayProps {
  generatedPrompt: GeneratedPrompt;
  onCopyAllPrompts: (prompt: GeneratedPrompt) => void;
  onDownloadPrompt: () => void;
  onGenerateNew: () => void;
  onManualSave?: (prompt: GeneratedPrompt) => void;
  savingToHistory?: boolean;
}

const GeneratedPromptDisplay: React.FC<GeneratedPromptDisplayProps> = ({
  generatedPrompt,
  onCopyAllPrompts,
  onDownloadPrompt,
  onGenerateNew,
  onManualSave,
  savingToHistory = false
}) => {
  return (
    <div className="space-y-6">
      {/* Scene Info Header */}
      {generatedPrompt.sceneNumber && generatedPrompt.totalScenes && (
        <div className="text-center">
          <span className="bg-purple-900/40 text-purple-300 px-3 py-1 rounded-full text-sm font-medium">
            Scene {generatedPrompt.sceneNumber} of {generatedPrompt.totalScenes}
          </span>
        </div>
      )}

      {/* Main Prompt */}
      <Card className="bg-slate-800/60 border border-slate-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-purple-300">Main Prompt</h3>
          <Button
            onClick={() => navigator.clipboard.writeText(generatedPrompt.mainPrompt)}
            variant="outline"
            size="sm"
            className="bg-purple-600/20 border-purple-400/30 text-purple-300 hover:bg-purple-600/30"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy
          </Button>
        </div>
        <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
          {generatedPrompt.mainPrompt}
        </p>
      </Card>

      {/* Technical Specifications */}
      {generatedPrompt.technicalSpecs && (
        <Card className="bg-slate-800/60 border border-slate-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-blue-300">Technical Specifications</h3>
            <Button
              onClick={() => navigator.clipboard.writeText(generatedPrompt.technicalSpecs)}
              variant="outline"
              size="sm"
              className="bg-blue-600/20 border-blue-400/30 text-blue-300 hover:bg-blue-600/30"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </Button>
          </div>
          <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
            {generatedPrompt.technicalSpecs}
          </p>
        </Card>
      )}

      {/* Style Notes */}
      {generatedPrompt.styleNotes && (
        <Card className="bg-slate-800/60 border border-slate-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-pink-300">Style Notes</h3>
            <Button
              onClick={() => navigator.clipboard.writeText(generatedPrompt.styleNotes)}
              variant="outline"
              size="sm"
              className="bg-pink-600/20 border-pink-400/30 text-pink-300 hover:bg-pink-600/30"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </Button>
          </div>
          <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
            {generatedPrompt.styleNotes}
          </p>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 justify-center">
        <Button
          onClick={() => onCopyAllPrompts(generatedPrompt)}
          variant="outline"
          className="bg-purple-600/20 border-purple-400/30 text-purple-300 hover:bg-purple-600/30"
        >
          <Copy className="w-4 h-4 mr-2" />
          Copy All
        </Button>
        
        <Button
          onClick={onDownloadPrompt}
          variant="outline"
          className="bg-blue-600/20 border-blue-400/30 text-blue-300 hover:bg-blue-600/30"
        >
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>

        {onManualSave && (
          <Button
            onClick={() => onManualSave(generatedPrompt)}
            disabled={savingToHistory}
            variant="outline"
            className="bg-green-600/20 border-green-400/30 text-green-300 hover:bg-green-600/30 disabled:opacity-50"
          >
            {savingToHistory ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {savingToHistory ? 'Saving...' : 'Save to History'}
          </Button>
        )}
        
        <Button
          onClick={onGenerateNew}
          variant="outline"
          className="bg-slate-600/20 border-slate-400/30 text-slate-300 hover:bg-slate-600/30"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Generate New
        </Button>
      </div>
    </div>
  );
};

export default GeneratedPromptDisplay;
