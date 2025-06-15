
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface Prompt {
  id: string;
  title: string | null;
  content: string;
  framework: string;
  model: string;
  created_at: string;
  transformations?: Transformation[];
}

interface Transformation {
  id: string;
  transformed_content: string;
  provider: string;
  model_used: string;
  processing_time: number | null;
  created_at: string;
}

export const usePromptHistory = () => {
  const { user } = useAuth();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(false);

  const loadPrompts = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('prompts')
        .select(`
          *,
          transformations (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setPrompts(data || []);
    } catch (error) {
      console.error('Error loading prompts:', error);
    } finally {
      setLoading(false);
    }
  };

  const savePrompt = async (
    content: string,
    framework: string,
    model: string,
    title?: string
  ) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('prompts')
        .insert({
          user_id: user.id,
          content,
          framework,
          model,
          title: title || `Prompt - ${new Date().toLocaleDateString()}`
        })
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error saving prompt:', error);
      return null;
    }
  };

  const saveTransformation = async (
    promptId: string,
    transformedContent: string,
    provider: string,
    modelUsed: string,
    processingTime?: number
  ) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('transformations')
        .insert({
          prompt_id: promptId,
          user_id: user.id,
          transformed_content: transformedContent,
          provider,
          model_used: modelUsed,
          processing_time: processingTime
        })
        .select()
        .single();

      if (error) throw error;

      // Refresh prompts to include the new transformation
      loadPrompts();
      
      return data;
    } catch (error) {
      console.error('Error saving transformation:', error);
      return null;
    }
  };

  const deletePrompt = async (promptId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('prompts')
        .delete()
        .eq('id', promptId)
        .eq('user_id', user.id);

      if (error) throw error;

      setPrompts(prev => prev.filter(p => p.id !== promptId));
    } catch (error) {
      console.error('Error deleting prompt:', error);
    }
  };

  useEffect(() => {
    if (user) {
      loadPrompts();
    } else {
      setPrompts([]);
    }
  }, [user]);

  return {
    prompts,
    loading,
    savePrompt,
    saveTransformation,
    deletePrompt,
    refreshPrompts: loadPrompts
  };
};
