
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Youtube } from 'lucide-react';

interface VideoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const VideoDialog = ({ open, onOpenChange }: VideoDialogProps) => {
  // Extract video ID from YouTube URL: https://youtu.be/WVwQXtAOLnk
  const YOUTUBE_VIDEO_ID = "WVwQXtAOLnk";
  const YOUTUBE_EMBED_URL = `https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=0&rel=0&modestbranding=1&playsinline=1&showinfo=0`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-w-[95vw] bg-slate-900 border border-white/20 text-white p-0">
        <DialogHeader className="p-6 pb-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-gradient-to-r from-red-500 to-red-600 w-10 h-10 rounded-full flex items-center justify-center">
              <Youtube className="w-5 h-5 text-white" />
            </div>
            <DialogTitle className="text-xl font-bold text-white">
              AiPromptMachine Demo
            </DialogTitle>
          </div>
          <DialogDescription className="text-gray-300">
            See how AiPromptMachine transforms your ideas into professional video prompts
          </DialogDescription>
        </DialogHeader>
        
        <div className="px-6">
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              src={YOUTUBE_EMBED_URL}
              className="absolute top-0 left-0 w-full h-full rounded-lg"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>
        
        <div className="p-6 pt-4">
          <div className="flex justify-center">
            <Button 
              onClick={() => onOpenChange(false)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              Close Demo
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoDialog;
