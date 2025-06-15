
import React from 'react';
import { motion } from 'framer-motion';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

interface SceneStepProps {
  sceneIdea: string;
  setSceneIdea: (value: string) => void;
  onNext: () => void;
}

const SceneStep: React.FC<SceneStepProps> = ({ sceneIdea, setSceneIdea, onNext }) => {
  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center space-y-3">
        <h3 className="text-2xl font-bold text-white">Describe Your Scene</h3>
        <p className="text-gray-300">Tell us about the cinematic moment you want to create</p>
      </div>
      
      <Textarea
        value={sceneIdea}
        onChange={(e) => setSceneIdea(e.target.value)}
        placeholder="e.g., A lone astronaut floating in space, Earth visible in the background, golden hour lighting..."
        className="bg-slate-800/60 border-purple-400/30 text-white placeholder:text-gray-400 min-h-[120px] focus:border-purple-400/60 focus:ring-purple-400/20"
      />
      
      <div className="flex justify-end">
        <Button
          onClick={onNext}
          disabled={!sceneIdea.trim()}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
        >
          Next Step <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </motion.div>
  );
};

export default SceneStep;
