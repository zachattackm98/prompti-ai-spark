
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Clock, Video } from 'lucide-react';

interface ComingSoonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ComingSoonDialog: React.FC<ComingSoonDialogProps> = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-slate-900 border-purple-500/20">
        <DialogHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <Clock className="w-8 h-8 text-white" />
          </div>
          <DialogTitle className="text-2xl font-bold text-white">
            Demo Video Coming Soon!
          </DialogTitle>
          <DialogDescription className="text-gray-300 text-base leading-relaxed">
            We're putting the finishing touches on an amazing demo video that showcases 
            AiPromptMachine in action. Stay tuned for cinematic magic!
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-3 mt-6">
          <Button 
            onClick={() => onOpenChange(false)}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            <Video className="w-4 h-4 mr-2" />
            Get Notified When Ready
          </Button>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="w-full border-purple-500/40 text-purple-300 bg-slate-800/50 hover:bg-purple-500/20 hover:text-purple-200"
          >
            Continue Creating Prompts
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ComingSoonDialog;
