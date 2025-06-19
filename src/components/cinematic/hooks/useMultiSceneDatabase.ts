
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MultiSceneProject, SceneData } from './types';

export const useMultiSceneDatabase = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveProject = useCallback(async (project: MultiSceneProject): Promise<string | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // First, save or update the project
      const { data: projectData, error: projectError } = await supabase
        .from('cinematic_projects')
        .upsert({
          id: project.id,
          title: project.title,
          current_scene_index: project.currentSceneIndex,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (projectError) {
        console.error('Error saving project:', projectError);
        setError(projectError.message);
        return null;
      }

      // Then save all scenes
      const scenesData = project.scenes.map(scene => ({
        id: scene.id || undefined,
        project_id: project.id,
        scene_number: scene.sceneNumber,
        scene_idea: scene.sceneIdea,
        selected_platform: scene.selectedPlatform,
        selected_emotion: scene.selectedEmotion,
        dialog_settings: scene.dialogSettings,
        sound_settings: scene.soundSettings,
        camera_settings: scene.cameraSettings,
        lighting_settings: scene.lightingSettings,
        style_reference: scene.styleReference,
        generated_prompt: scene.generatedPrompt,
        updated_at: new Date().toISOString()
      }));

      const { error: scenesError } = await supabase
        .from('cinematic_scenes')
        .upsert(scenesData);

      if (scenesError) {
        console.error('Error saving scenes:', scenesError);
        setError(scenesError.message);
        return null;
      }

      return project.id;
    } catch (err) {
      console.error('Error in saveProject:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadProject = useCallback(async (projectId: string): Promise<MultiSceneProject | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Load project details
      const { data: projectData, error: projectError } = await supabase
        .from('cinematic_projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (projectError) {
        console.error('Error loading project:', projectError);
        setError(projectError.message);
        return null;
      }

      // Load scenes for the project
      const { data: scenesData, error: scenesError } = await supabase
        .from('cinematic_scenes')
        .select('*')
        .eq('project_id', projectId)
        .order('scene_number');

      if (scenesError) {
        console.error('Error loading scenes:', scenesError);
        setError(scenesError.message);
        return null;
      }

      // Transform database data to our types
      const scenes: SceneData[] = scenesData.map(scene => ({
        id: scene.id,
        sceneNumber: scene.scene_number,
        sceneIdea: scene.scene_idea,
        selectedPlatform: scene.selected_platform,
        selectedEmotion: scene.selected_emotion,
        dialogSettings: scene.dialog_settings,
        soundSettings: scene.sound_settings,
        cameraSettings: scene.camera_settings,
        lightingSettings: scene.lighting_settings,
        styleReference: scene.style_reference,
        generatedPrompt: scene.generated_prompt
      }));

      const project: MultiSceneProject = {
        id: projectData.id,
        title: projectData.title,
        scenes,
        currentSceneIndex: projectData.current_scene_index,
        createdAt: projectData.created_at,
        updatedAt: projectData.updated_at
      };

      return project;
    } catch (err) {
      console.error('Error in loadProject:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteProject = useCallback(async (projectId: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('cinematic_projects')
        .delete()
        .eq('id', projectId);

      if (error) {
        console.error('Error deleting project:', error);
        setError(error.message);
        return false;
      }

      return true;
    } catch (err) {
      console.error('Error in deleteProject:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadUserProjects = useCallback(async (): Promise<MultiSceneProject[]> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data: projectsData, error: projectsError } = await supabase
        .from('cinematic_projects')
        .select(`
          *,
          cinematic_scenes (*)
        `)
        .order('updated_at', { ascending: false });

      if (projectsError) {
        console.error('Error loading user projects:', projectsError);
        setError(projectsError.message);
        return [];
      }

      // Transform database data to our types
      const projects: MultiSceneProject[] = projectsData.map(project => ({
        id: project.id,
        title: project.title,
        scenes: project.cinematic_scenes
          .sort((a, b) => a.scene_number - b.scene_number)
          .map(scene => ({
            id: scene.id,
            sceneNumber: scene.scene_number,
            sceneIdea: scene.scene_idea,
            selectedPlatform: scene.selected_platform,
            selectedEmotion: scene.selected_emotion,
            dialogSettings: scene.dialog_settings,
            soundSettings: scene.sound_settings,
            cameraSettings: scene.camera_settings,
            lightingSettings: scene.lighting_settings,
            styleReference: scene.style_reference,
            generatedPrompt: scene.generated_prompt
          })),
        currentSceneIndex: project.current_scene_index,
        createdAt: project.created_at,
        updatedAt: project.updated_at
      }));

      return projects;
    } catch (err) {
      console.error('Error in loadUserProjects:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    saveProject,
    loadProject,
    deleteProject,
    loadUserProjects,
    isLoading,
    error,
    clearError: () => setError(null)
  };
};
