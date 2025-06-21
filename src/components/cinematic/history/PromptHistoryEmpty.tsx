
import React from 'react';
import { AlertCircle } from 'lucide-react';

interface PromptHistoryEmptyProps {
  isLoading: boolean;
}

const PromptHistoryEmpty: React.FC<PromptHistoryEmptyProps> = ({ isLoading }) => {
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto"></div>
        <p className="text-gray-400 mt-2">Loading history...</p>
      </div>
    );
  }

  return (
    <div className="text-center py-8">
      <AlertCircle className="w-12 h-12 text-gray-500 mx-auto mb-2" />
      <p className="text-gray-400">No prompts generated yet</p>
      <p className="text-sm text-gray-500 mt-1">Your generated prompts will appear here</p>
    </div>
  );
};

export default PromptHistoryEmpty;
