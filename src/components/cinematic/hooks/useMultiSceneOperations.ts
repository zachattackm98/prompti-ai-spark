
import { useCallback } from 'react';
import { MultiSceneProject, SceneData, GeneratedPrompt } from './types';
import { useMultiSceneDatabase } from './useMultiSceneDatabase';
import { supabase } from '@/integrations/supabase/client';

export const useMultiSceneOperations = () => {
  const { saveProject, loadProject, deleteProject, loadUserProjects } = useMultiSceneDatabase();

  const createProject = useCallback(async (title: string, initialSceneData: Omit<SceneData, 'sceneNumber'>): Promise<MultiSceneProject | null> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('[MULTI-SCENE-OPS] User not authenticated');
      return null;
    }

    console.log('[MULTI-SCENE-OPS] Creating new project:', title);

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
    
    console.log('[MULTI-SCENE-OPS] Created project structure:', {
      id: project.id,
      title: project.title,
      sceneCount: project.scenes.length
    });
    
    const savedProjectId = await saveProject(project);
    if (!savedProjectId) {
      console.error('[MULTI-SCENE-OPS] Failed to save project to database');
      return null;
    }
    
    console.log('[MULTI-SCENE-OPS] Project saved to database:', savedProjectId);
    return project;
  }, [saveProject]);

  const addScene = useCallback(async (project: MultiSceneProject, sceneData: Omit<SceneData, 'sceneNumber'>): Promise<MultiSceneProject | null> => {
    console.log('[MULTI-SCENE-OPS] Adding new scene to project:', project.id);

    const newSceneNumber = project.scenes.length + 1;
    const newSceneId = crypto.randomUUID();
    
    const newScene: SceneData = {
      ...sceneData,
      sceneNumber: newSceneNumber,
      id: newSceneId
    };

    const updatedProject = {
      ...project,
      scenes: [...project.scenes, newScene],
      currentSceneIndex: newSceneNumber - 1,
      updatedAt: new Date().toISOString()
    };

    const savedProjectId = await saveProject(updatedProject);
    if (!savedProjectId) {
      console.error('[MULTI-SCENE-OPS] Failed to save updated project to database');
      return null;
    }

    console.log('[MULTI-SCENE-OPS] Scene added and project updated in database');
    return updatedProject;
  }, [saveProject]);

  const updateScene = useCallback(async (project: MultiSceneProject, sceneIndex: number, updates: Partial<SceneData>): Promise<MultiSceneProject | null> => {
    console.log('[MULTI-SCENE-OPS] Updating scene:', {
      projectId: project.id,
      sceneIndex,
      sceneNumber: project.scenes[sceneIndex]?.sceneNumber
    });

    const updatedScenes = [...project.scenes];
    const currentScene = updatedScenes[sceneIndex];
    
    if (!currentScene) {
      console.error('[MULTI-SCENE-OPS] Scene not found at index:', sceneIndex);
      return null;
    }

    updatedScenes[sceneIndex] = {
      ...currentScene,
      ...updates,
      id: currentScene.id,
      sceneNumber: currentScene.sceneNumber
    };

    const updatedProject = {
      ...project,
      scenes: updatedScenes,
      updatedAt: new Date().toISOString()
    };

    const savedProjectId = await saveProject(updatedProject);
    if (!savedProjectId) {
      console.error('[MULTI-SCENE-OPS] Failed to save scene update to database');
      return null;
    }

    console.log('[MULTI-SCENE-OPS] Scene updated in database');
    return updatedProject;
  }, [saveProject]);

  const switchScene = useCallback(async (project: MultiSceneProject, sceneIndex: number): Promise<MultiSceneProject | null> => {
    if (sceneIndex < 0 || sceneIndex >= project.scenes.length) {
      console.error('[MULTI-SCENE-OPS] Invalid scene index:', sceneIndex);
      return null;
    }

    console.log('[MULTI-SCENE-OPS] Switching to scene index:', sceneIndex);

    const updatedProject = {
      ...project,
      currentSceneIndex: sceneIndex,
      updatedAt: new Date().toISOString()
    };

    const savedProjectId = await saveProject(updatedProject);
    if (!savedProjectId) {
      console.error('[MULTI-SCENE-OPS] Failed to save scene index update to database');
      return null;
    }

    console.log('[MULTI-SCENE-OPS] Current scene index updated in database');
    return updatedProject;
  }, [saveProject]);

  const updateScenePrompt = useCallback(async (project: MultiSceneProject, sceneIndex: number, prompt: GeneratedPrompt): Promise<MultiSceneProject | null> => {
    console.log('[MULTI-SCENE-OPS] Updating scene prompt:', {
      projectId: project.id,
      sceneIndex,
      sceneNumber: project.scenes[sceneIndex]?.sceneNumber
    });

    return updateScene(project, sceneIndex, { generatedPrompt: prompt });
  }, [updateScene]);

  return {
    createProject,
    addScene,
    updateScene,
    switchScene,
    updateScenePrompt,
    loadProject,
    deleteProject,
    loadUserProjects
  };
};
