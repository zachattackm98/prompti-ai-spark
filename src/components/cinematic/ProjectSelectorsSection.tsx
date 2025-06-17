
import React from 'react';
import ProjectSelector from './ProjectSelector';
import SceneSelector from './SceneSelector';
import { MultiSceneProject } from './hooks/types';

interface ProjectSelectorsSectionProps {
  user: any;
  currentProject: MultiSceneProject | null;
  userProjects: MultiSceneProject[];
  projectsLoading: boolean;
  canAddMoreScenes: boolean;
  onLoadProject: (projectId: string) => void;
  onDeleteProject: (projectId: string) => void;
  onRefreshProjects: () => void;
  onSceneSelect: (sceneIndex: number) => void;
  onAddScene: () => void;
}

const ProjectSelectorsSection: React.FC<ProjectSelectorsSectionProps> = ({
  user,
  currentProject,
  userProjects,
  projectsLoading,
  canAddMoreScenes,
  onLoadProject,
  onDeleteProject,
  onRefreshProjects,
  onSceneSelect,
  onAddScene
}) => {
  return (
    <>
      {/* Project selector for authenticated users */}
      {user && !currentProject && userProjects.length > 0 && (
        <ProjectSelector
          projects={userProjects}
          onLoadProject={onLoadProject}
          onDeleteProject={onDeleteProject}
          onRefresh={onRefreshProjects}
          isLoading={projectsLoading}
        />
      )}

      {/* Scene selector for multi-scene projects */}
      {currentProject && (
        <SceneSelector
          project={currentProject}
          onSceneSelect={onSceneSelect}
          onAddScene={onAddScene}
          canAddScene={canAddMoreScenes}
        />
      )}
    </>
  );
};

export default ProjectSelectorsSection;
