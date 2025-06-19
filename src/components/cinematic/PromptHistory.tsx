
import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Download, Eye, Loader2, Play } from 'lucide-react';
import { PromptHistory as PromptHistoryType } from './types';
import { usePromptActions } from './promptActions';

interface PromptHistoryProps {
  promptHistory: PromptHistoryType[];
  showHistory: boolean;
  historyLoading?: boolean;
  onStartProjectFromHistory?: (prompt: PromptHistoryType) => void;
}

const PromptHistory: React.FC<PromptHistoryProps> = ({ 
  promptHistory, 
  showHistory, 
  historyLoading = false,
  onStartProjectFromHistory
}) => {
  const { copyToClipboard, downloadPrompt } = usePromptActions({});

  if (!showHistory) return null;

  const handleCopyPrompt = (prompt: PromptHistoryType) => {
    try {
      const parsedPrompt = JSON.parse(prompt.generated_prompt);
      let content = parsedPrompt.mainPrompt;
      
      if (parsedPrompt.styleNotes) {
        content += `\n\nStyle Notes:\n${parsedPrompt.styleNotes}`;
      }
      
      if (parsedPrompt.technicalSpecs) {
        content += `\n\nTechnical Specifications:\n${parsedPrompt.technicalSpecs}`;
      }
      
      copyToClipboard(content);
    } catch (error) {
      console.error('Error parsing prompt:', error);
      copyToClipboard(prompt.generated_prompt);
    }
  };

  const handleDownloadPrompt = (prompt: PromptHistoryType) => {
    try {
      const parsedPrompt = JSON.parse(prompt.generated_prompt);
      const promptData = {
        ...parsedPrompt,
        platform: prompt.platform,
        sceneIdea: prompt.scene_idea,
        projectTitle: prompt.project_title
      };
      downloadPrompt(promptData);
    } catch (error) {
      console.error('Error parsing prompt for download:', error);
    }
  };

  const handleStartProject = (prompt: PromptHistoryType) => {
    if (onStartProjectFromHistory) {
      onStartProjectFromHistory(prompt);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-8"
    >
      <Card className="bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-purple-900/20 border border-purple-500/20 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Prompt History</h3>
          {historyLoading && (
            <div className="flex items-center gap-2 text-purple-300">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Loading...</span>
            </div>
          )}
        </div>
        
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {historyLoading ? (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-purple-400" />
              <p className="text-gray-400 mt-2">Loading your prompt history...</p>
            </div>
          ) : promptHistory.length === 0 ? (
            <div className="text-center py-8">
              <Eye className="w-12 h-12 mx-auto text-gray-500 mb-4" />
              <p className="text-gray-400">No prompts generated yet</p>
              <p className="text-gray-500 text-sm mt-2">Your generated prompts will appear here</p>
            </div>
          ) : (
            promptHistory.map((prompt) => {
              let parsedPrompt;
              try {
                parsedPrompt = JSON.parse(prompt.generated_prompt);
              } catch {
                parsedPrompt = { mainPrompt: prompt.generated_prompt };
              }

              return (
                <Card
                  key={prompt.id}
                  className="bg-slate-800/60 border border-slate-700 p-4 hover:bg-slate-800/80 transition-colors"
                >
                  <div className="space-y-3">
                    {/* Header with scene idea and date */}
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-purple-300 text-sm">
                          {truncateText(prompt.scene_idea, 80)}
                        </h4>
                        {prompt.project_title && (
                          <p className="text-xs text-gray-400 mt-1">
                            Project: {prompt.project_title}
                          </p>
                        )}
                      </div>
                      <span className="text-xs text-gray-400 whitespace-nowrap ml-4">
                        {formatDate(prompt.created_at)}
                      </span>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-purple-900/40 text-purple-300 px-2 py-1 rounded text-xs">
                        {prompt.platform}
                      </span>
                      <span className="bg-pink-900/40 text-pink-300 px-2 py-1 rounded text-xs">
                        {prompt.emotion}
                      </span>
                      {prompt.style && (
                        <span className="bg-blue-900/40 text-blue-300 px-2 py-1 rounded text-xs">
                          {truncateText(prompt.style, 20)}
                        </span>
                      )}
                    </div>

                    {/* Prompt preview */}
                    <div className="bg-slate-900/50 rounded p-3 border border-slate-600/30">
                      <p className="text-gray-300 text-xs leading-relaxed">
                        {truncateText(parsedPrompt.mainPrompt || 'No prompt content', 150)}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      <Button
                        onClick={() => handleStartProject(prompt)}
                        variant="outline"
                        size="sm"
                        className="bg-green-600/20 border-green-400/30 text-green-300 hover:bg-green-600/30 text-xs h-8 flex items-center gap-1"
                      >
                        <Play className="w-3 h-3" />
                        Start Project
                      </Button>
                      
                      <Button
                        onClick={() => handleCopyPrompt(prompt)}
                        variant="outline"
                        size="sm"
                        className="bg-purple-600/20 border-purple-400/30 text-purple-300 hover:bg-purple-600/30 text-xs h-8"
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        Copy
                      </Button>
                      
                      <Button
                        onClick={() => handleDownloadPrompt(prompt)}
                        variant="outline"
                        size="sm"
                        className="bg-blue-600/20 border-blue-400/30 text-blue-300 hover:bg-blue-600/30 text-xs h-8"
                      >
                        <Download className="w-3 h-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
        
        {promptHistory.length > 0 && (
          <div className="mt-4 text-center">
            <p className="text-gray-400 text-xs">
              Showing {promptHistory.length} most recent prompts
            </p>
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default PromptHistory;
