
import { useState, useCallback } from 'react';
import { MultiSceneProject, SceneData, GeneratedPrompt } from './types';
import { useMultiSceneDatabase } from './useMultiSceneDatabase';

export const useMultiSceneState = () => {
  const [currentProject, setCurrentProject] = useState<MultiSceneProject | null>(null);
  const [isMultiScene, setIsMultiScene] = useState(false);
  const { saveProject, loadProject, deleteProject, loadUserProjects } = useMultiSceneDatabase();

  const startNewProject = useCallback(async (title: string, initialSceneData: Omit<SceneData, 'sceneNumber'>) => {
    console.log('useMultiSceneState: Starting new project:', title);
    
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
      console.log('useMultiSceneState: Project created and saved to database:', savedProjectId);
    } else {
      console.error('useMultiSceneState: Failed to save project to database');
    }
    
    return project;
  }, [saveProject]);

  const addNewScene = useCallback(async (sceneData: Omit<SceneData, 'sceneNumber'>) => {
    if (!currentProject) return null;

    console.log('useMultiSceneState: Adding new scene to project');

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
      console.log('useMultiSceneState: Scene added and project updated in database');
    } else {
      console.error('useMultiSceneState: Failed to save updated project to database');
    }

    return updatedProject;
  }, [currentProject, saveProject]);

  const updateCurrentScene = useCallback(async (updates: Partial<SceneData>) => {
    if (!currentProject) return null;

    console.log('useMultiSceneState: Updating current scene:', currentProject.currentSceneIndex + 1);

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
      console.log('useMultiSceneState: Scene updated in database');
    } else {
      console.error('useMultiSceneState: Failed to save scene update to database');
    }

    return updatedProject;
  }, [currentProject, saveProject]);

  const setCurrentSceneIndex = useCallback(async (index: number) => {
    if (!currentProject || index < 0 || index >= currentProject.scenes.length) return;

    console.log('useMultiSceneState: Setting current scene index to:', index + 1);

    const updatedProject = {
      ...currentProject,
      currentSceneIndex: index,
      updatedAt: new Date().toISOString()
    };

    // Save to database
    const savedProjectId = await saveProject(updatedProject);
    if (savedProjectId) {
      setCurrentProject(updatedProject);
      console.log('useMultiSceneState: Current scene index updated in database');
    } else {
      console.error('useMultiSceneState: Failed to save scene index update to database');
    }
  }, [currentProject, saveProject]);

  const updateScenePrompt = useCallback(async (sceneIndex: number, prompt: GeneratedPrompt) => {
    if (!currentProject) return null;

    console.log('useMultiSceneState: Updating prompt for scene:', sceneIndex + 1);

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
      console.log('useMultiSceneState: Scene prompt updated in database');
    } else {
      console.error('useMultiSceneState: Failed to save prompt update to database');
    }

    return updatedProject;
  }, [currentProject, saveProject]);

  const resetProject = useCallback(() => {
    console.log('useMultiSceneState: Resetting project state completely');
    setCurrentProject(null);
    setIsMultiScene(false);
  }, []);

  const getCurrentScene = useCallback(() => {
    if (!currentProject) return null;
    return currentProject.scenes[currentProject.currentSceneIndex];
  }, [currentProject]);

  const loadProjectById = useCallback(async (projectId: string, loadSceneDataToCurrentState?: (sceneData: SceneData) => void) => {
    console.log('useMultiSceneState: Loading project by ID:', projectId);
    const project = await loadProject(projectId);
    if (project) {
      // Always set current scene index to 0 (Scene 1)
      const updatedProject = {
        ...project,
        currentSceneIndex: 0,
        updatedAt: new Date().toISOString()
      };
      
      setCurrentProject(updatedProject);
      setIsMultiScene(true);
      
      // Save the updated scene index to database
      await saveProject(updatedProject);
      
      // Load Scene 1's data to current state if callback provided
      if (loadSceneDataToCurrentState && updatedProject.scenes.length > 0) {
        loadSceneDataToCurrentState(updatedProject.scenes[0]);
        console.log('useMultiSceneState: Scene 1 data loaded to current state');
      }
      
      console.log('useMultiSceneState: Project loaded from database, defaulted to Scene 1');
      return updatedProject;
    } else {
      console.error('useMultiSceneState: Failed to load project from database');
    }
    return project;
  }, [loadProject, saveProject]);

  const deleteCurrentProject = useCallback(async () => {
    if (!currentProject) return false;
    
    console.log('useMultiSceneState: Deleting current project:', currentProject.id);
    const success = await deleteProject(currentProject.id);
    if (success) {
      setCurrentProject(null);
      setIsMultiScene(false);
      console.log('useMultiSceneState: Project deleted from database');
    } else {
      console.error('useMultiSceneState: Failed to delete project from database');
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
