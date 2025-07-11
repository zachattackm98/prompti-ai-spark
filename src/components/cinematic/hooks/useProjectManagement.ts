import { useState, useCallback, useEffect } from 'react';
import { MultiSceneProject } from './types';
import { useMultiSceneDatabase } from './useMultiSceneDatabase';

export const useProjectManagement = () => {
  const [projects, setProjects] = useState<MultiSceneProject[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { loadUserProjects, deleteProject: dbDeleteProject } = useMultiSceneDatabase();

  const loadProjects = useCallback(async () => {
    setIsLoading(true);
    try {
      const userProjects = await loadUserProjects();
      setProjects(userProjects);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setIsLoading(false);
    }
  }, [loadUserProjects]);

  const deleteProject = useCallback(async (projectId: string): Promise<boolean> => {
    const success = await dbDeleteProject(projectId);
    if (success) {
      setProjects(prev => prev.filter(p => p.id !== projectId));
    }
    return success;
  }, [dbDeleteProject]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  return {
    projects,
    isLoading,
    loadProjects,
    deleteProject
  };
};