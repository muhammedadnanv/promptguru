
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface APIKeys {
  openai: string;
  anthropic: string;
  google: string;
}

export const useSupabaseApiKeys = () => {
  const [apiKeys, setApiKeys] = useState<APIKeys>({ openai: '', anthropic: '', google: '' });
  const [loading, setLoading] = useState(false);

  // Simple encryption/decryption (for demo purposes - use proper encryption in production)
  const encrypt = (text: string): string => {
    return btoa(text);
  };

  const decrypt = (encryptedText: string): string => {
    try {
      return atob(encryptedText);
    } catch {
      return '';
    }
  };

  // Demo Mode: Share API keys globally (no user)
  const globalId = 'global_public_keys';

  const loadApiKeys = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_api_keys')
        .select('provider, encrypted_key')
        .eq('user_id', globalId)
        .eq('is_active', true);

      if (error) throw error;

      const keys: APIKeys = { openai: '', anthropic: '', google: '' };
      data?.forEach((item) => {
        if (item.provider in keys) {
          keys[item.provider as keyof APIKeys] = decrypt(item.encrypted_key);
        }
      });

      setApiKeys(keys);
    } catch (error) {
      console.error('Error loading API keys:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveApiKey = async (provider: keyof APIKeys, key: string) => {
    try {
      const encryptedKey = encrypt(key);
      const { error } = await supabase
        .from('user_api_keys')
        .upsert({
          user_id: globalId,
          provider,
          encrypted_key: encryptedKey,
          is_active: true
        });

      if (error) throw error;
      setApiKeys(prev => ({ ...prev, [provider]: key }));
      return { success: true };
    } catch (error) {
      console.error('Error saving API key:', error);
      return { success: false, error };
    }
  };

  const deleteApiKey = async (provider: keyof APIKeys) => {
    try {
      const { error } = await supabase
        .from('user_api_keys')
        .delete()
        .eq('user_id', globalId)
        .eq('provider', provider);

      if (error) throw error;
      setApiKeys(prev => ({ ...prev, [provider]: '' }));
      return { success: true };
    } catch (error) {
      console.error('Error deleting API key:', error);
      return { success: false, error };
    }
  };

  useEffect(() => {
    loadApiKeys();
    // eslint-disable-next-line
  }, []);

  return {
    apiKeys,
    loading,
    saveApiKey,
    deleteApiKey,
    refreshKeys: loadApiKeys
  };
};
