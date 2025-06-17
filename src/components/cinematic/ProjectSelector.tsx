
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Film, FolderOpen, Trash2 } from 'lucide-react';
import { MultiSceneProject } from './hooks/types';

interface ProjectSelectorProps {
  projects: MultiSceneProject[];
  onLoadProject: (projectId: string) => void;
  onDeleteProject: (projectId: string) => void;
  onRefresh: () => void;
  isLoading?: boolean;
}

const ProjectSelector: React.FC<ProjectSelectorProps> = ({
  projects,
  onLoadProject,
  onDeleteProject,
  onRefresh,
  isLoading = false
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');

  useEffect(() => {
    onRefresh();
  }, [onRefresh]);

  if (projects.length === 0 && !isLoading) {
    return null;
  }

  const handleLoadProject = () => {
    if (selectedProjectId) {
      onLoadProject(selectedProjectId);
      setSelectedProjectId('');
    }
  };

  const selectedProject = projects.find(p => p.id === selectedProjectId);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <Card className="bg-gradient-to-r from-slate-900/90 to-blue-900/30 border border-blue-500/20 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Load Existing Project</h3>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-4">
            <div className="text-blue-300">Loading projects...</div>
          </div>
        ) : projects.length > 0 ? (
          <div className="space-y-4">
            <div className="flex gap-3">
              <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                <SelectTrigger className="flex-1 bg-slate-800/60 border-blue-400/30 text-white">
                  <SelectValue placeholder="Select a project to load..." />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-blue-400/30">
                  {projects.map((project) => (
                    <SelectItem 
                      key={project.id} 
                      value={project.id}
                      className="text-white hover:bg-slate-700"
                    >
                      <div className="flex items-center gap-2">
                        <Film className="w-4 h-4" />
                        <span>{project.title}</span>
                        <span className="text-xs text-blue-300">
                          ({project.scenes.length} scene{project.scenes.length !== 1 ? 's' : ''})
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                onClick={handleLoadProject}
                disabled={!selectedProjectId}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <FolderOpen className="w-4 h-4 mr-2" />
                Load
              </Button>
            </div>

            {selectedProject && (
              <div className="p-3 bg-slate-800/40 rounded border border-blue-400/20">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium">{selectedProject.title}</h4>
                    <p className="text-sm text-blue-300">
                      {selectedProject.scenes.length} scenes • 
                      Last updated: {new Date(selectedProject.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onDeleteProject(selectedProject.id);
                      setSelectedProjectId('');
                    }}
                    className="border-red-400/30 text-red-300 hover:bg-red-900/30"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-4 text-blue-300">
            No saved projects found. Create your first multi-scene project!
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default ProjectSelector;
