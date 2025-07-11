import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Film, ArrowRight } from 'lucide-react';
import { GeneratedPrompt } from './types';

interface ContinueScenePromptProps {
  generatedPrompt: GeneratedPrompt;
  onContinueScene: (projectTitle: string, nextSceneIdea: string) => void;
  children: React.ReactNode;
}

const ContinueScenePrompt: React.FC<ContinueScenePromptProps> = ({
  generatedPrompt,
  onContinueScene,
  children
}) => {
  const [nextSceneIdea, setNextSceneIdea] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Generate a simple project title from the first 30 characters of the prompt
  const generateProjectTitle = () => {
    const prompt = generatedPrompt.mainPrompt || '';
    const words = prompt.split(' ').slice(0, 5).join(' ');
    return words.length > 30 ? `${words.substring(0, 30)}...` : words;
  };

  const handleContinue = () => {
    if (nextSceneIdea.trim()) {
      const projectTitle = generateProjectTitle();
      onContinueScene(projectTitle, nextSceneIdea.trim());
      setIsOpen(false);
      setNextSceneIdea('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="bg-slate-900 border-purple-400/30 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-purple-300">
            <Film className="w-5 h-5" />
            Continue Scene
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-slate-300">
            Describe what happens next. AI will automatically maintain character and setting continuity.
          </p>
          
          <Textarea
            value={nextSceneIdea}
            onChange={(e) => setNextSceneIdea(e.target.value)}
            placeholder="e.g., The character walks into the building and meets someone unexpected..."
            className="bg-slate-800/60 border-purple-400/30 text-white placeholder:text-gray-500 min-h-[100px]"
          />
          
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleContinue}
              disabled={!nextSceneIdea.trim()}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              Continue
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContinueScenePrompt;