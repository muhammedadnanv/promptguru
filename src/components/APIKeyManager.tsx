
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, Check, X, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface APIKeys {
  openai: string;
  anthropic: string;
  google: string;
}

interface APIKeyManagerProps {
  onKeysUpdate: (keys: APIKeys) => void;
  apiKeys: APIKeys;
  onSaveKey: (provider: keyof APIKeys, key: string) => Promise<{ success: boolean; error?: any }>;
  onDeleteKey: (provider: keyof APIKeys) => Promise<{ success: boolean; error?: any }>;
}

const APIKeyManager: React.FC<APIKeyManagerProps> = ({ 
  onKeysUpdate, 
  apiKeys, 
  onSaveKey, 
  onDeleteKey 
}) => {
  const [localKeys, setLocalKeys] = useState<APIKeys>(apiKeys);
  const [showKeys, setShowKeys] = useState({
    openai: false,
    anthropic: false,
    google: false
  });
  const [saving, setSaving] = useState({
    openai: false,
    anthropic: false,
    google: false
  });

  const providers = [
    { key: 'openai' as keyof APIKeys, name: 'OpenAI', placeholder: 'sk-...' },
    { key: 'anthropic' as keyof APIKeys, name: 'Anthropic (Claude)', placeholder: 'sk-ant-...' },
    { key: 'google' as keyof APIKeys, name: 'Google (Gemini)', placeholder: 'AI...' }
  ];

  const handleSaveKey = async (provider: keyof APIKeys) => {
    const key = localKeys[provider].trim();
    if (!key) return;

    setSaving(prev => ({ ...prev, [provider]: true }));
    
    try {
      const result = await onSaveKey(provider, key);
      if (result.success) {
        toast.success(`${providers.find(p => p.key === provider)?.name} API key saved successfully`);
      } else {
        toast.error(`Failed to save API key: ${result.error?.message || 'Unknown error'}`);
      }
    } catch (error) {
      toast.error('Failed to save API key');
    } finally {
      setSaving(prev => ({ ...prev, [provider]: false }));
    }
  };

  const handleDeleteKey = async (provider: keyof APIKeys) => {
    setSaving(prev => ({ ...prev, [provider]: true }));
    
    try {
      const result = await onDeleteKey(provider);
      if (result.success) {
        setLocalKeys(prev => ({ ...prev, [provider]: '' }));
        toast.success(`${providers.find(p => p.key === provider)?.name} API key deleted`);
      } else {
        toast.error(`Failed to delete API key: ${result.error?.message || 'Unknown error'}`);
      }
    } catch (error) {
      toast.error('Failed to delete API key');
    } finally {
      setSaving(prev => ({ ...prev, [provider]: false }));
    }
  };

  const isValidKey = (provider: keyof APIKeys): boolean => {
    const key = apiKeys[provider];
    return !!(key && key.trim() !== '');
  };

  const hasUnsavedChanges = (provider: keyof APIKeys): boolean => {
    return localKeys[provider] !== apiKeys[provider];
  };

  // Update local keys when apiKeys prop changes
  React.useEffect(() => {
    setLocalKeys(apiKeys);
  }, [apiKeys]);

  return (
    <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20">
      <h2 className="text-2xl font-semibold text-white mb-6">API Key Configuration</h2>
      
      <div className="space-y-6">
        {providers.map((provider) => (
          <div key={provider.key} className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor={provider.key} className="text-white flex items-center space-x-2">
                <span>{provider.name}</span>
                {isValidKey(provider.key) && (
                  <Badge variant="default" className="bg-green-500/20 text-green-400">
                    <Check className="w-3 h-3 mr-1" />
                    Configured
                  </Badge>
                )}
              </Label>
              
              {isValidKey(provider.key) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteKey(provider.key)}
                  disabled={saving[provider.key]}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
            
            <div className="relative">
              <Input
                id={provider.key}
                type={showKeys[provider.key] ? "text" : "password"}
                value={localKeys[provider.key]}
                onChange={(e) => setLocalKeys(prev => ({ 
                  ...prev, 
                  [provider.key]: e.target.value 
                }))}
                placeholder={provider.placeholder}
                className="bg-white/5 border-white/20 text-white pr-20"
              />
              <div className="absolute inset-y-0 right-0 flex items-center space-x-1 pr-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowKeys(prev => ({ 
                    ...prev, 
                    [provider.key]: !prev[provider.key] 
                  }))}
                  className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                >
                  {showKeys[provider.key] ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
                
                {hasUnsavedChanges(provider.key) && localKeys[provider.key].trim() && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSaveKey(provider.key)}
                    disabled={saving[provider.key]}
                    className="h-6 w-6 p-0 text-green-400 hover:text-green-300"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            
            {!isValidKey(provider.key) && localKeys[provider.key].trim() === '' && (
              <p className="text-xs text-gray-400">
                Enter your {provider.name} API key to enable this provider
              </p>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <p className="text-sm text-blue-300">
          <strong>Security Notice:</strong> Your API keys are encrypted and stored securely in your account. 
          They are never shared or visible to others.
        </p>
      </div>
    </Card>
  );
};

export default APIKeyManager;
