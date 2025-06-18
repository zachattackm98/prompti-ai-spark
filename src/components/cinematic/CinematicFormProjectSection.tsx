
import React from 'react';
import ProjectSelectorsSection from './ProjectSelectorsSection';
import { useProjectManagement } from './hooks/useProjectManagement';
import { MultiSceneProject } from './hooks/types';

interface CinematicFormProjectSectionProps {
  user: any;
  currentProject: MultiSceneProject | null;
  canAddMoreScenes: boolean;
  onSceneSelect: (index: number) => void;
  onAddScene: () => void;
  onLoadProject: (projectId: string) => Promise<MultiSceneProject | null>;
}

const CinematicFormProjectSection: React.FC<CinematicFormProjectSectionProps> = ({
  user,
  currentProject,
  canAddMoreScenes,
  onSceneSelect,
  onAddScene,
  onLoadProject
}) => {
  const {
    userProjects,
    projectsLoading,
    loadUserProjectsData,
    handleDeleteProject
  } = useProjectManagement(user);

  const handleLoadProjectFromSelector = async (projectId: string) => {
    try {
      console.log('[CINEMATIC-FORM-PROJECT] Loading project from selector:', projectId);
      await onLoadProject(projectId);
    } catch (error) {
      console.error('[CINEMATIC-FORM-PROJECT] Error loading project:', error);
    }
  };

  return (
    <ProjectSelectorsSection
      user={user}
      currentProject={currentProject}
      userProjects={userProjects}
      projectsLoading={projectsLoading}
      canAddMoreScenes={canAddMoreScenes}
      onLoadProject={handleLoadProjectFromSelector}
      onDeleteProject={handleDeleteProject}
      onRefreshProjects={loadUserProjectsData}
      onSceneSelect={onSceneSelect}
      onAddScene={onAddScene}
    />
  );
};

export default CinematicFormProjectSection;
