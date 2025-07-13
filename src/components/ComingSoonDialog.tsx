
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Video, Clock } from 'lucide-react';

interface ComingSoonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resourceTitle?: string;
}

const ComingSoonDialog = ({ open, onOpenChange, resourceTitle }: ComingSoonDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-slate-900 border border-white/20 text-white">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full w-fit">
            <Video className="w-8 h-8 text-purple-400" />
          </div>
          <DialogTitle className="text-xl font-bold text-white">
            {resourceTitle ? `${resourceTitle} Coming Soon!` : 'Feature Coming Soon!'}
          </DialogTitle>
          <DialogDescription className="text-gray-300 mt-2">
            {resourceTitle 
              ? `We're working hard to bring you ${resourceTitle.toLowerCase()}. This feature will be available soon!`
              : 'We\'re working hard to create amazing features for AiPromptMachine. Stay tuned!'
            }
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center justify-center gap-2 mt-4 p-4 bg-slate-800/50 rounded-lg">
          <Clock className="w-4 h-4 text-yellow-400" />
          <span className="text-sm text-gray-300">
            Expected release: Coming very soon
          </span>
        </div>
        
        <div className="flex justify-center mt-6">
          <Button 
            onClick={() => onOpenChange(false)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            Got it, thanks!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ComingSoonDialog;
