
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { usePromptHistory } from '@/hooks/usePromptHistory';
import { useToast } from '@/hooks/use-toast';
import { usePromptHistoryActions } from './history/usePromptHistoryActions';
import PromptHistoryHeader from './history/PromptHistoryHeader';
import PromptHistoryEmpty from './history/PromptHistoryEmpty';
import PromptHistoryItem from './history/PromptHistoryItem';
import { useIsMobile } from '@/hooks/use-mobile';

interface PromptHistoryProps {
  showHistory: boolean;
  onCreateScenesFromHistory?: (historyItem: any) => void;
}

const PromptHistory: React.FC<PromptHistoryProps> = ({ 
  showHistory,
  onCreateScenesFromHistory 
}) => {
  const { promptHistory, isLoading, deletePromptHistoryItem, clearAllHistory } = usePromptHistory();
  const { toast } = useToast();
  const { copyToClipboard, downloadPrompt } = usePromptHistoryActions();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const isMobile = useIsMobile();

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

  const handleCreateScenes = (item: any) => {
    if (onCreateScenesFromHistory) {
      onCreateScenesFromHistory(item);
      toast({
        title: "Creating Multi-Scene Project",
        description: "Setting up 2 scenes from your selected prompt...",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-8"
    >
      <Card className="bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-purple-900/20 border border-purple-500/20 p-4 sm:p-6">
        <PromptHistoryHeader 
          hasPrompts={promptHistory.length > 0}
          onClearAll={handleClearAll}
        />
        
        <div className={`space-y-3 ${isMobile ? 'max-h-80' : 'max-h-96'} overflow-y-auto`}>
          {isLoading || promptHistory.length === 0 ? (
            <PromptHistoryEmpty isLoading={isLoading} />
          ) : (
            promptHistory.map((item) => (
              <PromptHistoryItem
                key={item.id}
                item={item}
                isExpanded={expandedItems.has(item.id)}
                onToggleExpanded={toggleExpanded}
                onCopyToClipboard={copyToClipboard}
                onDownloadPrompt={downloadPrompt}
                onDeleteItem={handleDeleteItem}
                onCreateScenes={handleCreateScenes}
              />
            ))
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default PromptHistory;
