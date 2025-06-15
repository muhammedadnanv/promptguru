
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
  ai_provider: string;
  model_used: string;
  created_at: string;
}

export const usePromptHistory = () => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);

  // Use a proper UUID format for the global user
  const GLOBAL_USER_ID = "00000000-0000-0000-0000-000000000001";

  const loadPrompts = async () => {
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
        throw error;
      }

      console.log("Loaded prompts:", data);
      setPrompts(data || []);
    } catch (error) {
      console.error('Error loading prompts:', error);
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
        .select()
        .single();

      if (error) {
        console.error('Error saving prompt:', error);
        throw error;
      }

      console.log("Saved prompt:", data);
      await loadPrompts(); // Reload prompts
      return data;
    } catch (error) {
      console.error('Error saving prompt:', error);
      return null;
    }
  };

  const saveTransformation = async (
    promptId: string, 
    transformedContent: string, 
    aiProvider: string, 
    modelUsed: string
  ): Promise<Transformation | null> => {
    try {
      console.log("Saving transformation:", { promptId, transformedContent: transformedContent.substring(0, 50), aiProvider, modelUsed });
      
      const { data, error } = await supabase
        .from('transformations')
        .insert([
          {
            prompt_id: promptId,
            transformed_content: transformedContent,
            ai_provider: aiProvider,
            model_used: modelUsed,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error('Error saving transformation:', error);
        throw error;
      }

      console.log("Saved transformation:", data);
      await loadPrompts(); // Reload prompts
      return data;
    } catch (error) {
      console.error('Error saving transformation:', error);
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
        throw error;
      }

      console.log("Deleted prompt:", id);
      await loadPrompts(); // Reload prompts
    } catch (error) {
      console.error('Error deleting prompt:', error);
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
