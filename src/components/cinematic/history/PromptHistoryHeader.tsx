
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface PromptHistoryHeaderProps {
  hasPrompts: boolean;
  onClearAll: () => void;
}

const PromptHistoryHeader: React.FC<PromptHistoryHeaderProps> = ({ hasPrompts, onClearAll }) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-xl font-bold text-white">Prompt History</h3>
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
  );
};

export default PromptHistoryHeader;
