
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface PromptHistoryItem {
  id: string;
  scene_idea: string;
  platform: string;
  style: string | null;
  emotion: string;
  generated_prompt: string;
  created_at: string;
}

export const usePromptHistory = () => {
  const [promptHistory, setPromptHistory] = useState<PromptHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const loadPromptHistory = async () => {
    if (!user) {
      setPromptHistory([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('prompt_history')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10); // Limit to most recent 10 prompts

      if (fetchError) {
        console.error('Error fetching prompt history:', fetchError);
        setError(fetchError.message);
        return;
      }

      setPromptHistory(data || []);
    } catch (err) {
      console.error('Error in loadPromptHistory:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  const deletePromptHistoryItem = async (id: string) => {
    if (!user) return false;

    try {
      const { error: deleteError } = await supabase
        .from('prompt_history')
        .delete()
        .eq('id', id);

      if (deleteError) {
        console.error('Error deleting prompt history item:', deleteError);
        return false;
      }

      // Remove from local state
      setPromptHistory(prev => prev.filter(item => item.id !== id));
      return true;
    } catch (err) {
      console.error('Error in deletePromptHistoryItem:', err);
      return false;
    }
  };

  const clearAllHistory = async () => {
    if (!user) return false;

    try {
      const { error: deleteError } = await supabase
        .from('prompt_history')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all user's records

      if (deleteError) {
        console.error('Error clearing prompt history:', deleteError);
        return false;
      }

      setPromptHistory([]);
      return true;
    } catch (err) {
      console.error('Error in clearAllHistory:', err);
      return false;
    }
  };

  // Load history when user changes or component mounts
  useEffect(() => {
    loadPromptHistory();
  }, [user]);

  return {
    promptHistory,
    isLoading,
    error,
    loadPromptHistory,
    deletePromptHistoryItem,
    clearAllHistory
  };
};
