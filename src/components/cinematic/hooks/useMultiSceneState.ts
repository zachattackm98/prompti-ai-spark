
import { useState, useCallback } from 'react';
import { MultiSceneProject, SceneData, GeneratedPrompt } from './types';
import { useMultiSceneDatabase } from './useMultiSceneDatabase';

export const useMultiSceneState = () => {
  const [currentProject, setCurrentProject] = useState<MultiSceneProject | null>(null);
  const [isMultiScene, setIsMultiScene] = useState(false);
  const { saveProject, loadProject, deleteProject, loadUserProjects } = useMultiSceneDatabase();

  const startNewProject = useCallback(async (title: string, initialSceneData: Omit<SceneData, 'sceneNumber'>) => {
    const projectId = crypto.randomUUID();
    const project: MultiSceneProject = {
      id: projectId,
      title,
      scenes: [{
        ...initialSceneData,
        sceneNumber: 1,
        id: crypto.randomUUID()
      }],
      currentSceneIndex: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Save to database
    const savedProjectId = await saveProject(project);
    if (savedProjectId) {
      setCurrentProject(project);
      setIsMultiScene(true);
      console.log('Project saved to database:', savedProjectId);
    } else {
      console.error('Failed to save project to database');
    }
    
    return project;
  }, [saveProject]);

  const addNewScene = useCallback(async (sceneData: Omit<SceneData, 'sceneNumber'>) => {
    if (!currentProject) return null;

    const newScene: SceneData = {
      ...sceneData,
      sceneNumber: currentProject.scenes.length + 1,
      id: crypto.randomUUID()
    };

    const updatedProject = {
      ...currentProject,
      scenes: [...currentProject.scenes, newScene],
      currentSceneIndex: currentProject.scenes.length,
      updatedAt: new Date().toISOString()
    };

    // Save to database
    const savedProjectId = await saveProject(updatedProject);
    if (savedProjectId) {
      setCurrentProject(updatedProject);
      console.log('Scene added and project updated in database');
    } else {
      console.error('Failed to save updated project to database');
    }

    return updatedProject;
  }, [currentProject, saveProject]);

  const updateCurrentScene = useCallback(async (updates: Partial<SceneData>) => {
    if (!currentProject) return null;

    const updatedScenes = [...currentProject.scenes];
    updatedScenes[currentProject.currentSceneIndex] = {
      ...updatedScenes[currentProject.currentSceneIndex],
      ...updates
    };

    const updatedProject = {
      ...currentProject,
      scenes: updatedScenes,
      updatedAt: new Date().toISOString()
    };

    // Save to database
    const savedProjectId = await saveProject(updatedProject);
    if (savedProjectId) {
      setCurrentProject(updatedProject);
      console.log('Scene updated in database');
    } else {
      console.error('Failed to save scene update to database');
    }

    return updatedProject;
  }, [currentProject, saveProject]);

  const setCurrentSceneIndex = useCallback(async (index: number) => {
    if (!currentProject || index < 0 || index >= currentProject.scenes.length) return;

    const updatedProject = {
      ...currentProject,
      currentSceneIndex: index,
      updatedAt: new Date().toISOString()
    };

    // Save to database
    const savedProjectId = await saveProject(updatedProject);
    if (savedProjectId) {
      setCurrentProject(updatedProject);
      console.log('Current scene index updated in database');
    } else {
      console.error('Failed to save scene index update to database');
    }
  }, [currentProject, saveProject]);

  const updateScenePrompt = useCallback(async (sceneIndex: number, prompt: GeneratedPrompt) => {
    if (!currentProject) return null;

    const updatedScenes = [...currentProject.scenes];
    updatedScenes[sceneIndex] = {
      ...updatedScenes[sceneIndex],
      generatedPrompt: prompt
    };

    const updatedProject = {
      ...currentProject,
      scenes: updatedScenes,
      updatedAt: new Date().toISOString()
    };

    // Save to database
    const savedProjectId = await saveProject(updatedProject);
    if (savedProjectId) {
      setCurrentProject(updatedProject);
      console.log('Scene prompt updated in database');
    } else {
      console.error('Failed to save prompt update to database');
    }

    return updatedProject;
  }, [currentProject, saveProject]);

  const resetProject = useCallback(() => {
    setCurrentProject(null);
    setIsMultiScene(false);
  }, []);

  const getCurrentScene = useCallback(() => {
    if (!currentProject) return null;
    return currentProject.scenes[currentProject.currentSceneIndex];
  }, [currentProject]);

  const loadProjectById = useCallback(async (projectId: string) => {
    const project = await loadProject(projectId);
    if (project) {
      setCurrentProject(project);
      setIsMultiScene(true);
      console.log('Project loaded from database');
    } else {
      console.error('Failed to load project from database');
    }
    return project;
  }, [loadProject]);

  const deleteCurrentProject = useCallback(async () => {
    if (!currentProject) return false;
    
    const success = await deleteProject(currentProject.id);
    if (success) {
      setCurrentProject(null);
      setIsMultiScene(false);
      console.log('Project deleted from database');
    } else {
      console.error('Failed to delete project from database');
    }
    return success;
  }, [currentProject, deleteProject]);

  return {
    currentProject,
    isMultiScene,
    getCurrentScene,
    startNewProject,
    addNewScene,
    updateCurrentScene,
    setCurrentSceneIndex,
    updateScenePrompt,
    resetProject,
    loadProjectById,
    deleteCurrentProject,
    loadUserProjects
  };
};
