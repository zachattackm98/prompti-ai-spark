
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight } from 'lucide-react';

interface FormStep1SceneIdeaProps {
  sceneIdea: string;
  setSceneIdea: (idea: string) => void;
  onNext: () => void;
  isMultiScene?: boolean;
  currentProject?: any;
}

const FormStep1SceneIdea: React.FC<FormStep1SceneIdeaProps> = ({
  sceneIdea,
  setSceneIdea,
  onNext,
  isMultiScene,
  currentProject
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">
          {isMultiScene ? 'Add New Scene' : 'Describe Your Scene'}
        </h2>
        <p className="text-gray-400">
          {isMultiScene 
            ? `Adding scene ${(currentProject?.scenes?.length || 0) + 1} to "${currentProject?.title}"`
            : 'What cinematic moment do you want to create?'
          }
        </p>
      </div>

      <div>
        <label htmlFor="scene-idea" className="block text-sm font-medium text-gray-300 mb-2">
          Scene Description
        </label>
        <Textarea
          id="scene-idea"
          value={sceneIdea}
          onChange={(e) => setSceneIdea(e.target.value)}
          placeholder="Describe your scene in detail..."
          className="min-h-[120px] bg-slate-800/50 border-white/20 text-white placeholder-gray-400"
        />
      </div>

      <Button
        onClick={onNext}
        disabled={!sceneIdea.trim()}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white"
      >
        Continue
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );
};

export default FormStep1SceneIdea;
