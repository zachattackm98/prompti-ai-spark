
import { useState, useCallback } from 'react';
import { MultiSceneProject, SceneData, GeneratedPrompt } from './types';

export const useMultiSceneState = () => {
  const [currentProject, setCurrentProject] = useState<MultiSceneProject | null>(null);
  const [isMultiScene, setIsMultiScene] = useState(false);

  const startNewProject = useCallback((title: string, initialSceneData: Omit<SceneData, 'sceneNumber'>) => {
    const project: MultiSceneProject = {
      id: crypto.randomUUID(),
      title,
      scenes: [{
        ...initialSceneData,
        sceneNumber: 1
      }],
      currentSceneIndex: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setCurrentProject(project);
    setIsMultiScene(true);
    return project;
  }, []);

  const addNewScene = useCallback((sceneData: Omit<SceneData, 'sceneNumber'>) => {
    if (!currentProject) return null;

    const newScene: SceneData = {
      ...sceneData,
      sceneNumber: currentProject.scenes.length + 1
    };

    const updatedProject = {
      ...currentProject,
      scenes: [...currentProject.scenes, newScene],
      currentSceneIndex: currentProject.scenes.length,
      updatedAt: new Date().toISOString()
    };

    setCurrentProject(updatedProject);
    return updatedProject;
  }, [currentProject]);

  const updateCurrentScene = useCallback((updates: Partial<SceneData>) => {
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

    setCurrentProject(updatedProject);
    return updatedProject;
  }, [currentProject]);

  const setCurrentSceneIndex = useCallback((index: number) => {
    if (!currentProject || index < 0 || index >= currentProject.scenes.length) return;

    setCurrentProject({
      ...currentProject,
      currentSceneIndex: index,
      updatedAt: new Date().toISOString()
    });
  }, [currentProject]);

  const updateScenePrompt = useCallback((sceneIndex: number, prompt: GeneratedPrompt) => {
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

    setCurrentProject(updatedProject);
    return updatedProject;
  }, [currentProject]);

  const resetProject = useCallback(() => {
    setCurrentProject(null);
    setIsMultiScene(false);
  }, []);

  const getCurrentScene = useCallback(() => {
    if (!currentProject) return null;
    return currentProject.scenes[currentProject.currentSceneIndex];
  }, [currentProject]);

  return {
    currentProject,
    isMultiScene,
    getCurrentScene,
    startNewProject,
    addNewScene,
    updateCurrentScene,
    setCurrentSceneIndex,
    updateScenePrompt,
    resetProject
  };
};
