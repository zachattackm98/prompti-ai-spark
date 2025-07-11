import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Clock, FolderOpen, Film } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useProjectManagement } from './hooks/useProjectManagement';
import { usePromptHistory } from '@/hooks/usePromptHistory';
import PromptHistory from './PromptHistory';
import ProjectSelector from './ProjectSelector';

interface HistoryProjectTabsProps {
  showHistory: boolean;
  onCreateScenesFromHistory?: (historyItem: any) => void;
  onLoadProject?: (projectId: string) => void;
}

const HistoryProjectTabs: React.FC<HistoryProjectTabsProps> = ({
  showHistory,
  onCreateScenesFromHistory,
  onLoadProject
}) => {
  const [activeTab, setActiveTab] = useState('history');
  const isMobile = useIsMobile();
  const { projects, isLoading: projectsLoading, deleteProject, loadProjects } = useProjectManagement();
  const { promptHistory } = usePromptHistory();

  if (!showHistory) return null;

  const handleLoadProject = (projectId: string) => {
    if (onLoadProject) {
      onLoadProject(projectId);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    await deleteProject(projectId);
    await loadProjects();
  };

  const hasPrompts = promptHistory.length > 0;
  const hasProjects = projects.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-8"
    >
      <Card className="bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-purple-900/20 border border-purple-500/20 p-4 sm:p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-800/50 border border-purple-500/20">
            <TabsTrigger 
              value="history" 
              className="data-[state=active]:bg-purple-600/20 data-[state=active]:text-purple-200 text-slate-300"
            >
              <Clock className="w-4 h-4 mr-2" />
              {isMobile ? 'History' : 'Prompt History'}
              {hasPrompts && (
                <span className="ml-2 px-2 py-0.5 bg-purple-500/30 text-xs rounded-full">
                  {promptHistory.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger 
              value="projects" 
              className="data-[state=active]:bg-purple-600/20 data-[state=active]:text-purple-200 text-slate-300"
            >
              <FolderOpen className="w-4 h-4 mr-2" />
              {isMobile ? 'Projects' : 'Your Projects'}
              {hasProjects && (
                <span className="ml-2 px-2 py-0.5 bg-purple-500/30 text-xs rounded-full">
                  {projects.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="history" className="mt-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-purple-300 mb-4">
                <Clock className="w-4 h-4" />
                <span className="font-medium">Previously Generated Prompts</span>
              </div>
              
              {/* Render prompt history content without the wrapper */}
              <div className="space-y-3">
                <PromptHistory 
                  showHistory={true} 
                  onCreateScenesFromHistory={onCreateScenesFromHistory}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="projects" className="mt-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-purple-300 mb-4">
                <Film className="w-4 h-4" />
                <span className="font-medium">Multi-Scene Projects</span>
              </div>
              
              {!hasProjects && !projectsLoading ? (
                <div className="text-center py-8 space-y-3">
                  <FolderOpen className="w-12 h-12 mx-auto text-slate-500" />
                  <h3 className="text-lg font-medium text-slate-300">No Projects Yet</h3>
                  <p className="text-sm text-slate-400 max-w-md mx-auto">
                    Create your first multi-scene project by continuing any generated scene. 
                    Projects help you build cinematic stories with consistent characters and settings.
                  </p>
                  <div className="bg-purple-900/20 border border-purple-400/30 rounded-lg p-3 mt-4">
                    <p className="text-xs text-purple-200">
                      💡 <strong>Tip:</strong> Generate a scene first, then click "Continue Scene" to start your first project!
                    </p>
                  </div>
                </div>
              ) : (
                <ProjectSelector
                  projects={projects}
                  onLoadProject={handleLoadProject}
                  onDeleteProject={handleDeleteProject}
                  onRefresh={loadProjects}
                  isLoading={projectsLoading}
                />
              )}
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </motion.div>
  );
};

export default HistoryProjectTabs;