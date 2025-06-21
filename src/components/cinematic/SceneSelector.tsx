
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Film, ChevronLeft, ChevronRight } from 'lucide-react';
import { MultiSceneProject } from './hooks/types';

interface SceneSelectorProps {
  currentProject: MultiSceneProject;
  onSceneSelect: (sceneIndex: number) => void;
  onAddScene: () => void;
  canAddMoreScenes: boolean;
}

const SceneSelector: React.FC<SceneSelectorProps> = ({
  currentProject,
  onSceneSelect,
  onAddScene,
  canAddMoreScenes
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <Card className="bg-gradient-to-r from-slate-900/90 to-purple-900/30 border border-purple-500/20 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Film className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">{currentProject.title}</h3>
            <span className="text-sm text-purple-300">
              ({currentProject.scenes.length} scene{currentProject.scenes.length !== 1 ? 's' : ''})
            </span>
          </div>
          {canAddMoreScenes && (
            <Button
              onClick={onAddScene}
              size="sm"
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Scene
            </Button>
          )}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {currentProject.scenes.map((scene, index) => (
            <Button
              key={scene.sceneNumber}
              onClick={() => onSceneSelect(index)}
              variant={index === currentProject.currentSceneIndex ? "default" : "outline"}
              size="sm"
              className={`min-w-fit ${
                index === currentProject.currentSceneIndex
                  ? "bg-purple-600 text-white"
                  : "border-purple-400/30 text-purple-300 hover:bg-purple-900/30"
              }`}
            >
              <div className="flex items-center gap-2">
                <span>Scene {scene.sceneNumber}</span>
                {scene.generatedPrompt && (
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                )}
              </div>
            </Button>
          ))}
        </div>

        {currentProject.scenes.length > 1 && (
          <div className="mt-3 text-xs text-purple-300 bg-purple-900/20 rounded p-2">
            💡 Tip: Switch between scenes to maintain story continuity across your cinematic sequence
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default SceneSelector;
