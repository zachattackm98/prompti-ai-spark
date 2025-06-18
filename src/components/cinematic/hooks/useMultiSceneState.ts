import { useState, useCallback } from 'react';
import { MultiSceneProject, SceneData, GeneratedPrompt } from './types';
import { useMultiSceneDatabase } from './useMultiSceneDatabase';
import { supabase } from '@/integrations/supabase/client';

export const useMultiSceneState = () => {
  const [currentProject, setCurrentProject] = useState<MultiSceneProject | null>(null);
  const [isMultiScene, setIsMultiScene] = useState(false);
  const { saveProject, loadProject, deleteProject, loadUserProjects } = useMultiSceneDatabase();

  const startNewProject = useCallback(async (title: string, initialSceneData: Omit<SceneData, 'sceneNumber'>) => {
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('[MULTI-SCENE] User not authenticated');
      return null;
    }

    console.log('[MULTI-SCENE] Starting new project:', title);

    const projectId = crypto.randomUUID();
    const sceneId = crypto.randomUUID();
    
    const project: MultiSceneProject = {
      id: projectId,
      title,
      scenes: [{
        ...initialSceneData,
        sceneNumber: 1,
        id: sceneId
      }],
      currentSceneIndex: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    console.log('[MULTI-SCENE] Created project structure:', {
      id: project.id,
      title: project.title,
      sceneCount: project.scenes.length,
      firstSceneId: project.scenes[0].id
    });
    
    // Save to database
    const savedProjectId = await saveProject(project);
    if (savedProjectId) {
      setCurrentProject(project);
      setIsMultiScene(true);
      console.log('[MULTI-SCENE] Project saved to database:', savedProjectId);
    } else {
      console.error('[MULTI-SCENE] Failed to save project to database');
    }
    
    return project;
  }, [saveProject]);

  const addNewScene = useCallback(async (sceneData: Omit<SceneData, 'sceneNumber'>) => {
    if (!currentProject) {
      console.error('[MULTI-SCENE] No current project for adding scene');
      return null;
    }

    console.log('[MULTI-SCENE] Adding new scene to project:', currentProject.id);

    const newSceneNumber = currentProject.scenes.length + 1;
    const newSceneId = crypto.randomUUID();
    
    const newScene: SceneData = {
      ...sceneData,
      sceneNumber: newSceneNumber,
      id: newSceneId
    };

    console.log('[MULTI-SCENE] New scene created:', {
      number: newScene.sceneNumber,
      id: newScene.id
    });

    const updatedProject = {
      ...currentProject,
      scenes: [...currentProject.scenes, newScene],
      currentSceneIndex: newSceneNumber - 1, // Switch to the new scene
      updatedAt: new Date().toISOString()
    };

    // Save to database
    const savedProjectId = await saveProject(updatedProject);
    if (savedProjectId) {
      setCurrentProject(updatedProject);
      console.log('[MULTI-SCENE] Scene added and project updated in database');
    } else {
      console.error('[MULTI-SCENE] Failed to save updated project to database');
    }

    return updatedProject;
  }, [currentProject, saveProject]);

  const updateCurrentScene = useCallback(async (updates: Partial<SceneData>) => {
    if (!currentProject) {
      console.error('[MULTI-SCENE] No current project for scene update');
      return null;
    }

    console.log('[MULTI-SCENE] Updating current scene:', {
      projectId: currentProject.id,
      sceneIndex: currentProject.currentSceneIndex,
      sceneNumber: currentProject.scenes[currentProject.currentSceneIndex]?.sceneNumber
    });

    const updatedScenes = [...currentProject.scenes];
    const currentScene = updatedScenes[currentProject.currentSceneIndex];
    
    if (!currentScene) {
      console.error('[MULTI-SCENE] Current scene not found');
      return null;
    }

    // Ensure we keep the scene ID and number
    updatedScenes[currentProject.currentSceneIndex] = {
      ...currentScene,
      ...updates,
      id: currentScene.id, // Preserve original ID
      sceneNumber: currentScene.sceneNumber // Preserve original scene number
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
      console.log('[MULTI-SCENE] Scene updated in database');
    } else {
      console.error('[MULTI-SCENE] Failed to save scene update to database');
    }

    return updatedProject;
  }, [currentProject, saveProject]);

  const setCurrentSceneIndex = useCallback(async (index: number) => {
    if (!currentProject || index < 0 || index >= currentProject.scenes.length) {
      console.error('[MULTI-SCENE] Invalid scene index:', index);
      return;
    }

    console.log('[MULTI-SCENE] Switching to scene index:', index);

    const updatedProject = {
      ...currentProject,
      currentSceneIndex: index,
      updatedAt: new Date().toISOString()
    };

    // Save to database
    const savedProjectId = await saveProject(updatedProject);
    if (savedProjectId) {
      setCurrentProject(updatedProject);
      console.log('[MULTI-SCENE] Current scene index updated in database');
    } else {
      console.error('[MULTI-SCENE] Failed to save scene index update to database');
    }
  }, [currentProject, saveProject]);

  const updateScenePrompt = useCallback(async (sceneIndex: number, prompt: GeneratedPrompt) => {
    if (!currentProject) {
      console.error('[MULTI-SCENE] No current project for prompt update');
      return null;
    }

    console.log('[MULTI-SCENE] Updating scene prompt:', {
      projectId: currentProject.id,
      sceneIndex,
      sceneNumber: currentProject.scenes[sceneIndex]?.sceneNumber
    });

    const updatedScenes = [...currentProject.scenes];
    if (!updatedScenes[sceneIndex]) {
      console.error('[MULTI-SCENE] Scene not found at index:', sceneIndex);
      return null;
    }

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
      console.log('[MULTI-SCENE] Scene prompt updated in database');
    } else {
      console.error('[MULTI-SCENE] Failed to save prompt update to database');
    }

    return updatedProject;
  }, [currentProject, saveProject]);

  const resetProject = useCallback(() => {
    console.log('[MULTI-SCENE] Resetting project state');
    setCurrentProject(null);
    setIsMultiScene(false);
  }, []);

  const getCurrentScene = useCallback(() => {
    if (!currentProject) return null;
    return currentProject.scenes[currentProject.currentSceneIndex];
  }, [currentProject]);

  const loadProjectById = useCallback(async (projectId: string) => {
    console.log('[MULTI-SCENE] Loading project by ID:', projectId);
    const project = await loadProject(projectId);
    if (project) {
      setCurrentProject(project);
      setIsMultiScene(true);
      console.log('[MULTI-SCENE] Project loaded from database');
      return project;
    } else {
      console.error('[MULTI-SCENE] Failed to load project from database');
      return null;
    }
  }, [loadProject]);

  const deleteCurrentProject = useCallback(async () => {
    if (!currentProject) return false;
    
    console.log('[MULTI-SCENE] Deleting current project:', currentProject.id);
    const success = await deleteProject(currentProject.id);
    if (success) {
      setCurrentProject(null);
      setIsMultiScene(false);
      console.log('[MULTI-SCENE] Project deleted from database');
    } else {
      console.error('[MULTI-SCENE] Failed to delete project from database');
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
