
import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { PromptHistory as PromptHistoryType } from './types';

interface PromptHistoryProps {
  promptHistory: PromptHistoryType[];
  showHistory: boolean;
}

const PromptHistory: React.FC<PromptHistoryProps> = ({ promptHistory, showHistory }) => {
  if (!showHistory) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-8"
    >
      <Card className="bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-purple-900/20 border border-purple-500/20 p-6">
        <h3 className="text-xl font-bold text-white mb-4">Recent Prompts</h3>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {promptHistory.length === 0 ? (
            <p className="text-gray-400 text-center py-4">No prompts generated yet</p>
          ) : (
            promptHistory.map((prompt) => (
              <div
                key={prompt.id}
                className="bg-slate-800/60 rounded-lg p-4 border border-slate-700"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-purple-300">{prompt.scene_idea.substring(0, 50)}...</h4>
                  <span className="text-xs text-gray-400">{new Date(prompt.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex gap-2 text-xs">
                  <span className="bg-purple-900/40 text-purple-300 px-2 py-1 rounded">{prompt.platform}</span>
                  <span className="bg-pink-900/40 text-pink-300 px-2 py-1 rounded">{prompt.emotion}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default PromptHistory;
