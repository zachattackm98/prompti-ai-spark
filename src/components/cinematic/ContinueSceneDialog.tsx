import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Film, ArrowRight } from 'lucide-react';
import { GeneratedPrompt } from './types';

interface ContinueSceneDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (projectTitle: string, nextSceneIdea: string) => void;
  currentPrompt: GeneratedPrompt | null;
  currentSceneIdea: string;
  currentPlatform: string;
  currentEmotion: string;
}

const ContinueSceneDialog: React.FC<ContinueSceneDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  currentPrompt,
  currentSceneIdea,
  currentPlatform,
  currentEmotion
}) => {
  const [projectTitle, setProjectTitle] = useState('');
  const [nextSceneIdea, setNextSceneIdea] = useState('');

  const handleConfirm = () => {
    if (projectTitle.trim() && nextSceneIdea.trim()) {
      onConfirm(projectTitle.trim(), nextSceneIdea.trim());
      onOpenChange(false);
      // Reset fields for next time
      setProjectTitle('');
      setNextSceneIdea('');
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    // Reset fields
    setProjectTitle('');
    setNextSceneIdea('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg mx-4">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Film className="w-5 h-5" />
            Continue Your Cinematic Story
          </DialogTitle>
          <DialogDescription>
            Create the next scene in your cinematic sequence. The current scene's settings and style will be preserved for continuity.
          </DialogDescription>
        </DialogHeader>

        <motion.div 
          className="space-y-4 py-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Current Scene Summary */}
          {currentPrompt && (
            <div className="p-3 bg-muted/50 rounded-lg border">
              <Label className="text-sm font-medium text-muted-foreground">Current Scene</Label>
              <p className="text-sm mt-1 line-clamp-2">
                {currentSceneIdea || 'Previous scene'}
              </p>
              <div className="flex gap-2 mt-2 text-xs text-muted-foreground">
                <span>Platform: {currentPlatform}</span>
                <span>•</span>
                <span>Emotion: {currentEmotion}</span>
              </div>
            </div>
          )}

          {/* Project Title Input */}
          <div className="space-y-2">
            <Label htmlFor="project-title">Project Title</Label>
            <Input
              id="project-title"
              placeholder="e.g., Epic Adventure Series, Character Journey..."
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Next Scene Idea */}
          <div className="space-y-2">
            <Label htmlFor="next-scene">Next Scene Description</Label>
            <Textarea
              id="next-scene"
              placeholder="Describe what happens in the next scene of your story..."
              value={nextSceneIdea}
              onChange={(e) => setNextSceneIdea(e.target.value)}
              className="min-h-[100px] resize-none"
            />
          </div>

          {/* Continuity Notice */}
          <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="flex items-start gap-2">
              <ArrowRight className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-primary">Continuity Features</p>
                <p className="text-muted-foreground mt-1">
                  Platform, emotion, camera settings, lighting, and style preferences will be preserved from your current scene.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm}
            disabled={!projectTitle.trim() || !nextSceneIdea.trim()}
            className="gap-2"
          >
            <ArrowRight className="w-4 h-4" />
            Continue Scene
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContinueSceneDialog;