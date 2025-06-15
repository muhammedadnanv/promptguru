
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Eye, EyeOff, Check, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface APIKeys {
  openai: string;
  anthropic: string;
  google: string;
}

type Provider = keyof APIKeys;

const providerOptions: { key: Provider; name: string; placeholder: string }[] = [
  { key: 'openai', name: 'OpenAI', placeholder: 'sk-...' },
  { key: 'anthropic', name: 'Anthropic (Claude)', placeholder: 'sk-ant-...' },
  { key: 'google', name: 'Google (Gemini)', placeholder: 'AI...' }
];

interface APIKeyManagerProps {
  onKeysUpdate: (keys: APIKeys) => void;
  apiKeys: APIKeys;
  onSaveKey: (provider: Provider, key: string) => Promise<{ success: boolean; error?: any }>;
  onDeleteKey: (provider: Provider) => Promise<{ success: boolean; error?: any }>;
}

const APIKeyManager: React.FC<APIKeyManagerProps> = ({
  onKeysUpdate,
  apiKeys,
  onSaveKey,
  onDeleteKey
}) => {
  const [selectedProvider, setSelectedProvider] = useState<Provider>('openai');
  const [localKey, setLocalKey] = useState(apiKeys[selectedProvider]);
  const [showKey, setShowKey] = useState(false);
  const [saving, setSaving] = useState(false);

  // Sync input value when provider or apiKeys changes
  React.useEffect(() => {
    setLocalKey(apiKeys[selectedProvider] || '');
  }, [apiKeys, selectedProvider]);

  const handleSave = async () => {
    if (!localKey.trim()) return;
    setSaving(true);
    try {
      const res = await onSaveKey(selectedProvider, localKey.trim());
      if (res.success) {
        toast.success(`${providerOptions.find(p => p.key === selectedProvider)?.name} API key saved successfully`);
      } else {
        toast.error(`Failed to save API key: ${res.error?.message || 'Unknown error'}`);
      }
    } catch (e) {
      toast.error('Failed to save API key');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      const res = await onDeleteKey(selectedProvider);
      if (res.success) {
        setLocalKey('');
        toast.success(`${providerOptions.find(p => p.key === selectedProvider)?.name} API key deleted`);
      } else {
        toast.error(`Failed to delete API key: ${res.error?.message || 'Unknown error'}`);
      }
    } catch (e) {
      toast.error('Failed to delete API key');
    } finally {
      setSaving(false);
    }
  };

  const isValidKey = !!(apiKeys[selectedProvider]?.trim());
  const hasUnsavedChanges = localKey !== (apiKeys[selectedProvider] || '');

  return (
    <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20">
      <h2 className="text-2xl font-semibold text-white mb-6">API Key Configuration</h2>

      <div className="space-y-6 max-w-md mx-auto">
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <Label className="text-white mb-2 block">Provider</Label>
            <Select value={selectedProvider} onValueChange={v => setSelectedProvider(v as Provider)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select provider" />
              </SelectTrigger>
              <SelectContent>
                {providerOptions.map((p) => (
                  <SelectItem key={p.key} value={p.key}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {isValidKey && (
            <Badge variant="default" className="bg-green-500/20 text-green-400 ml-2 mb-2">
              Configured
            </Badge>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="api-key-input" className="text-white">API Key</Label>
          <div className="relative">
            <Input
              id="api-key-input"
              type={showKey ? "text" : "password"}
              value={localKey}
              onChange={e => setLocalKey(e.target.value)}
              placeholder={providerOptions.find(p => p.key === selectedProvider)?.placeholder}
              className="bg-white/5 border-white/20 text-white pr-20"
            />
            <div className="absolute inset-y-0 right-0 flex items-center space-x-1 pr-3">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowKey(v => !v)}
                className="h-6 w-6 p-0 text-gray-400 hover:text-white"
              >
                {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
              {hasUnsavedChanges && localKey.trim() && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleSave}
                  disabled={saving}
                  className="h-6 w-6 p-0 text-green-400 hover:text-green-300"
                >
                  <Check className="h-4 w-4" />
                </Button>
              )}
              {isValidKey && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  disabled={saving}
                  className="h-6 w-6 p-0 text-red-400 hover:text-red-300"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          {!isValidKey && !localKey.trim() && (
            <p className="text-xs text-gray-400">
              Enter your {providerOptions.find(p => p.key === selectedProvider)?.name} API key to enable this provider
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <p className="text-sm text-blue-300">
          <strong>Security Notice:</strong> Your API key is encrypted and stored securely. It is never shared or visible to others.
        </p>
      </div>
    </Card>
  );
};

export default APIKeyManager;
