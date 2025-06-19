
import { useState, useCallback } from 'react';
import { MultiSceneProject, SceneData, GeneratedPrompt } from './types';
import { useMultiSceneOperations } from './useMultiSceneOperations';

export const useSimplifiedMultiSceneState = () => {
  const [currentProject, setCurrentProject] = useState<MultiSceneProject | null>(null);
  const [isMultiScene, setIsMultiScene] = useState(false);
  
  const {
    createProject,
    addScene,
    updateScene,
    switchScene,
    updateScenePrompt,
    loadProject,
    deleteProject,
    loadUserProjects
  } = useMultiSceneOperations();

  const startNewProject = useCallback(async (title: string, initialSceneData: Omit<SceneData, 'sceneNumber'>) => {
    const project = await createProject(title, initialSceneData);
    if (project) {
      setCurrentProject(project);
      setIsMultiScene(true);
    }
    return project;
  }, [createProject]);

  const addNewScene = useCallback(async (sceneData: Omit<SceneData, 'sceneNumber'>) => {
    if (!currentProject) return null;
    
    const updatedProject = await addScene(currentProject, sceneData);
    if (updatedProject) {
      setCurrentProject(updatedProject);
    }
    return updatedProject;
  }, [currentProject, addScene]);

  const updateCurrentScene = useCallback(async (updates: Partial<SceneData>) => {
    if (!currentProject) return null;
    
    const updatedProject = await updateScene(currentProject, currentProject.currentSceneIndex, updates);
    if (updatedProject) {
      setCurrentProject(updatedProject);
    }
    return updatedProject;
  }, [currentProject, updateScene]);

  const setCurrentSceneIndex = useCallback(async (index: number) => {
    if (!currentProject) return;
    
    const updatedProject = await switchScene(currentProject, index);
    if (updatedProject) {
      setCurrentProject(updatedProject);
    }
  }, [currentProject, switchScene]);

  const updateScenePromptById = useCallback(async (sceneIndex: number, prompt: GeneratedPrompt) => {
    if (!currentProject) return null;
    
    const updatedProject = await updateScenePrompt(currentProject, sceneIndex, prompt);
    if (updatedProject) {
      setCurrentProject(updatedProject);
    }
    return updatedProject;
  }, [currentProject, updateScenePrompt]);

  const resetProject = useCallback(() => {
    console.log('[SIMPLIFIED-MULTI-SCENE] Resetting project state');
    setCurrentProject(null);
    setIsMultiScene(false);
  }, []);

  const getCurrentScene = useCallback(() => {
    if (!currentProject) return null;
    return currentProject.scenes[currentProject.currentSceneIndex];
  }, [currentProject]);

  const loadProjectById = useCallback(async (projectId: string) => {
    console.log('[SIMPLIFIED-MULTI-SCENE] Loading project by ID:', projectId);
    const project = await loadProject(projectId);
    if (project) {
      setCurrentProject(project);
      setIsMultiScene(true);
      console.log('[SIMPLIFIED-MULTI-SCENE] Project loaded from database');
      return project;
    } else {
      console.error('[SIMPLIFIED-MULTI-SCENE] Failed to load project from database');
      return null;
    }
  }, [loadProject]);

  const deleteCurrentProject = useCallback(async () => {
    if (!currentProject) return false;
    
    console.log('[SIMPLIFIED-MULTI-SCENE] Deleting current project:', currentProject.id);
    const success = await deleteProject(currentProject.id);
    if (success) {
      setCurrentProject(null);
      setIsMultiScene(false);
      console.log('[SIMPLIFIED-MULTI-SCENE] Project deleted from database');
    } else {
      console.error('[SIMPLIFIED-MULTI-SCENE] Failed to delete project from database');
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
    updateScenePrompt: updateScenePromptById,
    resetProject,
    loadProjectById,
    deleteCurrentProject,
    loadUserProjects
  };
};
