
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Save, Key, AlertCircle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface APIKeys {
  openai: string;
  anthropic: string;
  google: string;
}

interface APIKeyManagerProps {
  onKeysUpdate: (keys: APIKeys) => void;
}

const APIKeyManager = ({ onKeysUpdate }: APIKeyManagerProps) => {
  const [keys, setKeys] = useState<APIKeys>(() => {
    try {
      const saved = localStorage.getItem('ai-api-keys');
      return saved ? JSON.parse(saved) : { openai: '', anthropic: '', google: '' };
    } catch {
      return { openai: '', anthropic: '', google: '' };
    }
  });
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [validationStatus, setValidationStatus] = useState<Record<string, 'valid' | 'invalid' | 'unknown'>>({});
  const { toast } = useToast();

  useEffect(() => {
    validateAllKeys();
  }, []);

  const validateAllKeys = () => {
    const status: Record<string, 'valid' | 'invalid' | 'unknown'> = {};
    
    Object.entries(keys).forEach(([provider, key]) => {
      if (!key || key.trim() === '') {
        status[provider] = 'unknown';
      } else {
        status[provider] = validateKeyFormat(provider as keyof APIKeys, key) ? 'valid' : 'invalid';
      }
    });
    
    setValidationStatus(status);
  };

  const validateKeyFormat = (provider: keyof APIKeys, key: string): boolean => {
    if (!key || key.trim() === '') return false;
    
    switch (provider) {
      case 'openai':
        return key.startsWith('sk-') && key.length > 20;
      case 'anthropic':
        return key.startsWith('sk-ant-') && key.length > 30;
      case 'google':
        return key.startsWith('AIza') && key.length > 30;
      default:
        return false;
    }
  };

  const handleSave = () => {
    try {
      // Validate all keys before saving
      const hasValidKeys = Object.entries(keys).some(([provider, key]) => 
        key.trim() !== '' && validateKeyFormat(provider as keyof APIKeys, key)
      );

      if (!hasValidKeys) {
        toast({
          title: "No valid API keys",
          description: "Please add at least one valid API key before saving.",
          variant: "destructive",
        });
        return;
      }

      localStorage.setItem('ai-api-keys', JSON.stringify(keys));
      onKeysUpdate(keys);
      validateAllKeys();
      
      const validCount = Object.values(validationStatus).filter(status => status === 'valid').length;
      
      toast({
        title: "API Keys Saved",
        description: `${validCount} valid API key(s) saved successfully.`,
      });
    } catch (error) {
      console.error('Error saving API keys:', error);
      toast({
        title: "Save Failed",
        description: "Could not save API keys. Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleKeyVisibility = (provider: string) => {
    setShowKeys(prev => ({ ...prev, [provider]: !prev[provider] }));
  };

  const updateKey = (provider: keyof APIKeys, value: string) => {
    const trimmedValue = value.trim();
    setKeys(prev => ({ ...prev, [provider]: trimmedValue }));
    
    // Update validation status for this key
    setValidationStatus(prev => ({
      ...prev,
      [provider]: trimmedValue === '' ? 'unknown' : validateKeyFormat(provider, trimmedValue) ? 'valid' : 'invalid'
    }));
  };

  const getKeyStatus = (provider: string) => {
    const status = validationStatus[provider];
    switch (status) {
      case 'valid':
        return { icon: CheckCircle, color: 'text-green-500', message: 'Valid format' };
      case 'invalid':
        return { icon: AlertCircle, color: 'text-red-500', message: 'Invalid format' };
      default:
        return null;
    }
  };

  const keyConfigs = [
    {
      key: 'openai' as keyof APIKeys,
      label: 'OpenAI API Key',
      placeholder: 'sk-...',
      description: 'For GPT-4 and GPT-3.5 models',
      example: 'sk-1234567890abcdef...'
    },
    {
      key: 'anthropic' as keyof APIKeys,
      label: 'Anthropic API Key (Claude)',
      placeholder: 'sk-ant-...',
      description: 'For Claude models',
      example: 'sk-ant-1234567890abcdef...'
    },
    {
      key: 'google' as keyof APIKeys,
      label: 'Google AI API Key (Gemini)',
      placeholder: 'AIza...',
      description: 'For Gemini models',
      example: 'AIza1234567890abcdef...'
    }
  ];

  return (
    <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20">
      <div className="flex items-center space-x-2 mb-6">
        <Key className="w-5 h-5 text-purple-400" />
        <h3 className="text-xl font-semibold text-white">API Key Configuration</h3>
      </div>
      
      <div className="space-y-6">
        {keyConfigs.map(({ key, label, placeholder, description, example }) => {
          const status = getKeyStatus(key);
          const StatusIcon = status?.icon;
          
          return (
            <div key={key}>
              <Label className="text-gray-300 mb-2 block">
                {label}
                <span className="text-xs text-gray-400 block font-normal">
                  {description} • Format: {example}
                </span>
              </Label>
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <Input
                    type={showKeys[key] ? "text" : "password"}
                    placeholder={placeholder}
                    value={keys[key]}
                    onChange={(e) => updateKey(key, e.target.value)}
                    className="bg-white/5 border-white/20 text-white pr-10"
                  />
                  {StatusIcon && (
                    <StatusIcon className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${status.color}`} />
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleKeyVisibility(key)}
                  className="text-gray-400 hover:text-white"
                >
                  {showKeys[key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
              {status && (
                <p className={`text-xs mt-1 ${status.color}`}>
                  {status.message}
                </p>
              )}
            </div>
          );
        })}

        <Button
          onClick={handleSave}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        >
          <Save className="w-4 h-4 mr-2" />
          Save API Keys
        </Button>

        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-blue-300 mb-2">Security Notice</h4>
          <p className="text-xs text-blue-200">
            Your API keys are stored securely in your browser's local storage and are never sent to our servers. 
            They are only used to communicate directly with the respective AI providers.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default APIKeyManager;
