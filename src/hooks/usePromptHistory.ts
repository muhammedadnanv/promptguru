
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Prompt {
  id: string;
  user_id: string;
  title: string;
  content: string;
  framework: string;
  model: string;
  created_at: string;
  transformations?: Transformation[];
}

interface Transformation {
  id: string;
  prompt_id: string;
  transformed_content: string;
  provider: string;
  model_used: string;
  user_id: string;
  created_at: string;
}

export const usePromptHistory = () => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);

  // Use a proper UUID format for the global user
  const GLOBAL_USER_ID = "00000000-0000-0000-0000-000000000001";

  const loadPrompts = async () => {
    setLoading(true);
    try {
      console.log("Loading prompts for user:", GLOBAL_USER_ID);
      const { data, error } = await supabase
        .from('prompts')
        .select(`
          *,
          transformations(*)
        `)
        .eq('user_id', GLOBAL_USER_ID)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading prompts:', error);
        setPrompts([]);
        return;
      }

      console.log("Fetched prompts data:", data);
      setPrompts(data || []);
    } catch (error) {
      console.error('Exception in loadPrompts:', error);
      setPrompts([]);
    } finally {
      setLoading(false);
    }
  };

  const savePrompt = async (content: string, framework: string, model: string): Promise<Prompt | null> => {
    try {
      console.log("Saving prompt:", { content: content.substring(0, 50), framework, model });

      const title = content.length > 50 ? content.substring(0, 50) + '...' : content;

      const { data, error } = await supabase
        .from('prompts')
        .insert([
          {
            user_id: GLOBAL_USER_ID,
            title,
            content,
            framework,
            model,
          },
        ])
        .select();

      if (error) {
        console.error('Error saving prompt:', error);
        return null;
      }
      if (!data || !Array.isArray(data) || data.length === 0) {
        console.error('No prompt data returned after insert', { data });
        return null;
      }
      console.log("Prompt saved:", data[0]);

      await loadPrompts();
      return data[0];
    } catch (error) {
      console.error('Exception in savePrompt:', error);
      return null;
    }
  };

  const saveTransformation = async (
    promptId: string, 
    transformedContent: string, 
    provider: string, 
    modelUsed: string
  ): Promise<Transformation | null> => {
    try {
      console.log("Saving transformation:", { promptId, transformedContent: transformedContent.substring(0, 50), provider, modelUsed });
      const { data, error } = await supabase
        .from('transformations')
        .insert([
          {
            prompt_id: promptId,
            transformed_content: transformedContent,
            provider: provider,
            model_used: modelUsed,
            user_id: GLOBAL_USER_ID,
          },
        ])
        .select();
      if (error) {
        console.error('Error saving transformation:', error);
        return null;
      }
      if (!data || !Array.isArray(data) || data.length === 0) {
        console.error('No transformation data returned after insert', { data });
        return null;
      }
      console.log("Transformation saved:", data[0]);
      await loadPrompts();
      return data[0];
    } catch (error) {
      console.error('Exception in saveTransformation:', error);
      return null;
    }
  };

  const deletePrompt = async (id: string) => {
    try {
      console.log("Deleting prompt:", id);
      const { error } = await supabase
        .from('prompts')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting prompt:', error);
        return;
      }
      console.log("Prompt deleted:", id);

      await loadPrompts();
    } catch (error) {
      console.error('Exception in deletePrompt:', error);
    }
  };

  useEffect(() => {
    loadPrompts();
  }, []);

  return {
    prompts,
    loading,
    savePrompt,
    saveTransformation,
    deletePrompt,
    refreshPrompts: loadPrompts,
  };
};
