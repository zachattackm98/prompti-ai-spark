
import React, { useState, useCallback } from 'react';
import { useMultiSceneDatabase } from './useMultiSceneDatabase';
import { MultiSceneProject } from './types';

export const useProjectManagement = (user: any) => {
  const [userProjects, setUserProjects] = useState<MultiSceneProject[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const { loadUserProjects, deleteProject } = useMultiSceneDatabase();

  const loadUserProjectsData = useCallback(async () => {
    if (!user) return;
    
    setProjectsLoading(true);
    try {
      const projects = await loadUserProjects();
      setUserProjects(projects);
    } catch (error) {
      console.error('Error loading user projects:', error);
    } finally {
      setProjectsLoading(false);
    }
  }, [user, loadUserProjects]);

  const handleDeleteProject = async (projectId: string) => {
    try {
      const success = await deleteProject(projectId);
      if (success) {
        // Refresh the projects list
        await loadUserProjectsData();
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  // Load projects when user changes
  React.useEffect(() => {
    if (user) {
      loadUserProjectsData();
    }
  }, [user, loadUserProjectsData]);

  return {
    userProjects,
    projectsLoading,
    loadUserProjectsData,
    handleDeleteProject
  };
};
