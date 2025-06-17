
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Film, Plus, Sparkles } from 'lucide-react';
import { GeneratedPrompt } from './hooks/types';

interface ContinueScenePromptProps {
  generatedPrompt: GeneratedPrompt;
  onContinueScene: (projectTitle: string, nextSceneIdea: string) => void;
  onStartOver: () => void;
  isLoading?: boolean;
}

const ContinueScenePrompt: React.FC<ContinueScenePromptProps> = ({
  generatedPrompt,
  onContinueScene,
  onStartOver,
  isLoading = false
}) => {
  const [projectTitle, setProjectTitle] = useState('');
  const [nextSceneIdea, setNextSceneIdea] = useState('');
  const [showContinueForm, setShowContinueForm] = useState(false);

  const handleContinue = () => {
    if (!projectTitle.trim() || !nextSceneIdea.trim()) return;
    onContinueScene(projectTitle, nextSceneIdea);
    setShowContinueForm(false);
    setProjectTitle('');
    setNextSceneIdea('');
  };

  if (!showContinueForm) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 space-y-4"
      >
        <Card className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-400/30 p-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-purple-300">
              <Sparkles className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Love this scene?</h3>
              <Sparkles className="w-5 h-5" />
            </div>
            
            <p className="text-white text-sm font-medium">
              Turn it into a multi-scene cinematic story! Continue with Scene 2 while maintaining 
              character consistency and narrative flow.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Button
                onClick={() => setShowContinueForm(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                <Film className="w-4 h-4 mr-2" />
                Continue Scene
              </Button>
              
              <Button
                onClick={onStartOver}
                variant="outline"
                className="border-purple-400/50 text-purple-200 hover:bg-purple-900/30 hover:text-white bg-slate-800/60"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Single Scene
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6"
    >
      <Card className="bg-gradient-to-br from-slate-900/80 to-purple-900/30 border border-purple-400/30 p-6">
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-xl font-bold text-white mb-2">Continue Your Story</h3>
            <p className="text-gray-300 text-sm">
              Create Scene 2 with automatic character and setting continuity
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="project-title" className="text-purple-300">
                Project Title
              </Label>
              <Input
                id="project-title"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                placeholder="e.g., The Heist Chronicles"
                className="bg-slate-800/60 border-purple-400/30 text-white"
              />
            </div>

            <div>
              <Label htmlFor="next-scene" className="text-purple-300">
                Scene 2 Idea
              </Label>
              <Textarea
                id="next-scene"
                value={nextSceneIdea}
                onChange={(e) => setNextSceneIdea(e.target.value)}
                placeholder="What happens next? Describe the continuation of your story..."
                className="bg-slate-800/60 border-purple-400/30 text-white min-h-[100px]"
              />
            </div>
          </div>

          <div className="flex gap-3 justify-center pt-4">
            <Button
              onClick={handleContinue}
              disabled={!projectTitle.trim() || !nextSceneIdea.trim() || isLoading}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              {isLoading ? (
                <>Processing...</>
              ) : (
                <>
                  <Film className="w-4 h-4 mr-2" />
                  Create Scene 2
                </>
              )}
            </Button>
            
            <Button
              onClick={() => setShowContinueForm(false)}
              variant="outline"
              className="border-slate-600 text-white hover:bg-slate-700"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default ContinueScenePrompt;
