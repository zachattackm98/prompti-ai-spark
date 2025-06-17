
import { supabase } from '@/integrations/supabase/client';
import { MultiSceneProject } from '../types';

export const saveProject = async (project: MultiSceneProject): Promise<string | null> => {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('User not authenticated');
      return null;
    }

    // First, save or update the project
    const { data: projectData, error: projectError } = await supabase
      .from('cinematic_projects')
      .upsert({
        id: project.id,
        user_id: user.id,
        title: project.title,
        current_scene_index: project.currentSceneIndex,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (projectError) {
      console.error('Error saving project:', projectError);
      throw new Error(projectError.message);
    }

    return project.id;
  } catch (err) {
    console.error('Error in saveProject:', err);
    throw err;
  }
};

export const loadProject = async (projectId: string): Promise<MultiSceneProject | null> => {
  try {
    // Load project details
    const { data: projectData, error: projectError } = await supabase
      .from('cinematic_projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (projectError) {
      console.error('Error loading project:', projectError);
      throw new Error(projectError.message);
    }

    return {
      id: projectData.id,
      title: projectData.title,
      scenes: [], // Will be loaded separately
      currentSceneIndex: projectData.current_scene_index,
      createdAt: projectData.created_at,
      updatedAt: projectData.updated_at
    };
  } catch (err) {
    console.error('Error in loadProject:', err);
    throw err;
  }
};

export const deleteProject = async (projectId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('cinematic_projects')
      .delete()
      .eq('id', projectId);

    if (error) {
      console.error('Error deleting project:', error);
      throw new Error(error.message);
    }

    return true;
  } catch (err) {
    console.error('Error in deleteProject:', err);
    return false;
  }
};

export const loadUserProjects = async (): Promise<MultiSceneProject[]> => {
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
      throw new Error(projectsError.message);
    }

    return projectsData.map(project => ({
      id: project.id,
      title: project.title,
      scenes: project.cinematic_scenes
        .sort((a: any, b: any) => a.scene_number - b.scene_number)
        .map((scene: any) => ({
          id: scene.id,
          sceneNumber: scene.scene_number,
          sceneIdea: scene.scene_idea,
          selectedPlatform: scene.selected_platform,
          selectedEmotion: scene.selected_emotion,
          dialogSettings: scene.dialog_settings as any,
          soundSettings: scene.sound_settings as any,
          cameraSettings: scene.camera_settings as any,
          lightingSettings: scene.lighting_settings as any,
          styleReference: scene.style_reference,
          generatedPrompt: scene.generated_prompt as any
        })),
      currentSceneIndex: project.current_scene_index,
      createdAt: project.created_at,
      updatedAt: project.updated_at
    }));
  } catch (err) {
    console.error('Error in loadUserProjects:', err);
    return [];
  }
};
