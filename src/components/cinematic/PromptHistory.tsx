
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Download, Copy, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { usePromptHistory, PromptHistoryItem } from '@/hooks/usePromptHistory';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface PromptHistoryProps {
  showHistory: boolean;
}

const PromptHistory: React.FC<PromptHistoryProps> = ({ showHistory }) => {
  const { promptHistory, isLoading, deletePromptHistoryItem, clearAllHistory, loadPromptHistory } = usePromptHistory();
  const { toast } = useToast();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  if (!showHistory) return null;

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Prompt copied to clipboard.",
    });
  };

  const downloadPrompt = (item: PromptHistoryItem) => {
    try {
      const promptData = JSON.parse(item.generated_prompt);
      const content = `CINEMATIC VIDEO PROMPT
Generated: ${new Date(item.created_at).toLocaleDateString()}
Platform: ${item.platform.toUpperCase()}
Emotion: ${item.emotion}
Scene: ${item.scene_idea}

MAIN PROMPT:
${promptData.mainPrompt}

TECHNICAL SPECIFICATIONS:
${promptData.technicalSpecs}

STYLE NOTES:
${promptData.styleNotes}`;

      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `prompt-${item.platform}-${new Date(item.created_at).toISOString().split('T')[0]}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download prompt.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteItem = async (id: string) => {
    const success = await deletePromptHistoryItem(id);
    if (success) {
      toast({
        title: "Deleted",
        description: "Prompt history item removed.",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to delete prompt history item.",
        variant: "destructive"
      });
    }
  };

  const handleClearAll = async () => {
    const success = await clearAllHistory();
    if (success) {
      toast({
        title: "Cleared",
        description: "All prompt history has been cleared.",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to clear prompt history.",
        variant: "destructive"
      });
    }
  };

  const getPlatformColor = (platform: string) => {
    const colors = {
      veo3: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      sora: 'bg-green-500/20 text-green-300 border-green-500/30',
      runway: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      pika: 'bg-orange-500/20 text-orange-300 border-orange-500/30'
    };
    return colors[platform as keyof typeof colors] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  };

  const getEmotionColor = (emotion: string) => {
    const colors = {
      Dramatic: 'bg-red-500/20 text-red-300',
      Mysterious: 'bg-indigo-500/20 text-indigo-300',
      Uplifting: 'bg-yellow-500/20 text-yellow-300',
      Melancholic: 'bg-blue-500/20 text-blue-300',
      Intense: 'bg-orange-500/20 text-orange-300',
      Serene: 'bg-green-500/20 text-green-300',
      Suspenseful: 'bg-purple-500/20 text-purple-300',
      Romantic: 'bg-pink-500/20 text-pink-300',
      Epic: 'bg-amber-500/20 text-amber-300',
      Intimate: 'bg-rose-500/20 text-rose-300'
    };
    return colors[emotion as keyof typeof colors] || 'bg-gray-500/20 text-gray-300';
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
          {promptHistory.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-red-400 border-red-400/30 hover:bg-red-500/10">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear All History</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete all your prompt history. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleClearAll} className="bg-red-500 hover:bg-red-600">
                    Clear All
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
        
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto"></div>
              <p className="text-gray-400 mt-2">Loading history...</p>
            </div>
          ) : promptHistory.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-gray-500 mx-auto mb-2" />
              <p className="text-gray-400">No prompts generated yet</p>
              <p className="text-sm text-gray-500 mt-1">Your generated prompts will appear here</p>
            </div>
          ) : (
            promptHistory.map((item) => {
              const isExpanded = expandedItems.has(item.id);
              let promptData;
              try {
                promptData = JSON.parse(item.generated_prompt);
              } catch {
                promptData = null;
              }

              return (
                <div
                  key={item.id}
                  className="bg-slate-800/60 rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition-colors"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-semibold text-white text-sm leading-tight">
                      {item.scene_idea.length > 60 
                        ? `${item.scene_idea.substring(0, 60)}...` 
                        : item.scene_idea}
                    </h4>
                    <span className="text-xs text-gray-400 ml-2 flex-shrink-0">
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge className={getPlatformColor(item.platform)}>
                      {item.platform.toUpperCase()}
                    </Badge>
                    <Badge className={getEmotionColor(item.emotion)}>
                      {item.emotion}
                    </Badge>
                    {item.style && (
                      <Badge variant="outline" className="text-gray-300 border-gray-500">
                        {item.style.length > 20 ? `${item.style.substring(0, 20)}...` : item.style}
                      </Badge>
                    )}
                  </div>

                  {promptData && isExpanded && (
                    <div className="mt-3 p-3 bg-slate-900/60 rounded border border-slate-600">
                      <div className="space-y-3 text-sm">
                        <div>
                          <h5 className="font-medium text-purple-300 mb-1">Main Prompt:</h5>
                          <p className="text-gray-300 leading-relaxed">{promptData.mainPrompt}</p>
                        </div>
                        <div>
                          <h5 className="font-medium text-blue-300 mb-1">Technical Specs:</h5>
                          <p className="text-gray-300 leading-relaxed">{promptData.technicalSpecs}</p>
                        </div>
                        <div>
                          <h5 className="font-medium text-pink-300 mb-1">Style Notes:</h5>
                          <p className="text-gray-300 leading-relaxed">{promptData.styleNotes}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExpanded(item.id)}
                      className="text-gray-400 hover:text-white"
                    >
                      {isExpanded ? (
                        <>
                          <EyeOff className="w-4 h-4 mr-1" />
                          Hide Details
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4 mr-1" />
                          View Details
                        </>
                      )}
                    </Button>
                    
                    <div className="flex gap-1">
                      {promptData && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(`${promptData.mainPrompt}\n\n${promptData.technicalSpecs}\n\n${promptData.styleNotes}`)}
                            className="text-gray-400 hover:text-white"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => downloadPrompt(item)}
                            className="text-gray-400 hover:text-white"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Prompt</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this prompt? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteItem(item.id)} className="bg-red-500 hover:bg-red-600">
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default PromptHistory;
