
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, RefreshCw } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface PromptHistoryHeaderProps {
  hasPrompts: boolean;
  onClearAll: () => void;
  onRefresh: () => void;
  isLoading: boolean;
}

const PromptHistoryHeader: React.FC<PromptHistoryHeaderProps> = ({ hasPrompts, onClearAll, onRefresh, isLoading }) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-xl font-bold text-white">Prompt History</h3>
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRefresh}
          disabled={isLoading}
          className="text-blue-400 border-blue-400/30 hover:bg-blue-500/10 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
        {hasPrompts && (
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
                <AlertDialogAction onClick={onClearAll} className="bg-red-500 hover:bg-red-600">
                  Clear All
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  );
};

export default PromptHistoryHeader;
