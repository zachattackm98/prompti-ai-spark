
import { useCallback } from 'react';
import { MultiSceneProject } from './types';
import { saveProject, loadProject, deleteProject, loadUserProjects } from './database/projectOperations';
import { saveScenes, loadScenes } from './database/sceneOperations';
import { useDatabaseState } from './database/databaseState';

export const useMultiSceneDatabase = () => {
  const { isLoading, setIsLoading, error, setError, clearError } = useDatabaseState();

  const saveProjectWithScenes = useCallback(async (project: MultiSceneProject): Promise<string | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Save project first
      const savedProjectId = await saveProject(project);
      if (!savedProjectId) {
        setError('Failed to save project');
        return null;
      }

      // Then save all scenes
      await saveScenes(project.id, project.scenes);

      return savedProjectId;
    } catch (err) {
      console.error('Error in saveProject:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading, setError]);

  const loadProjectWithScenes = useCallback(async (projectId: string): Promise<MultiSceneProject | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Load project details
      const project = await loadProject(projectId);
      if (!project) {
        setError('Project not found');
        return null;
      }

      // Load scenes for the project
      const scenes = await loadScenes(projectId);
      
      return {
        ...project,
        scenes
      };
    } catch (err) {
      console.error('Error in loadProject:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading, setError]);

  const deleteProjectById = useCallback(async (projectId: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      return await deleteProject(projectId);
    } catch (err) {
      console.error('Error in deleteProject:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading, setError]);

  const loadAllUserProjects = useCallback(async (): Promise<MultiSceneProject[]> => {
    setIsLoading(true);
    setError(null);
    
    try {
      return await loadUserProjects();
    } catch (err) {
      console.error('Error in loadUserProjects:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading, setError]);

  return {
    saveProject: saveProjectWithScenes,
    loadProject: loadProjectWithScenes,
    deleteProject: deleteProjectById,
    loadUserProjects: loadAllUserProjects,
    isLoading,
    error,
    clearError
  };
};
