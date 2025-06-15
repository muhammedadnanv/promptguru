
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Save, Key } from "lucide-react";
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
    const saved = localStorage.getItem('ai-api-keys');
    return saved ? JSON.parse(saved) : { openai: '', anthropic: '', google: '' };
  });
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const handleSave = () => {
    localStorage.setItem('ai-api-keys', JSON.stringify(keys));
    onKeysUpdate(keys);
    toast({
      title: "API Keys Saved",
      description: "Your API keys have been saved securely in your browser.",
    });
  };

  const toggleKeyVisibility = (provider: string) => {
    setShowKeys(prev => ({ ...prev, [provider]: !prev[provider] }));
  };

  const updateKey = (provider: keyof APIKeys, value: string) => {
    setKeys(prev => ({ ...prev, [provider]: value }));
  };

  return (
    <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20">
      <div className="flex items-center space-x-2 mb-4">
        <Key className="w-5 h-5 text-purple-400" />
        <h3 className="text-xl font-semibold text-white">API Key Configuration</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label className="text-gray-300 mb-2 block">OpenAI API Key</Label>
          <div className="flex space-x-2">
            <Input
              type={showKeys.openai ? "text" : "password"}
              placeholder="sk-..."
              value={keys.openai}
              onChange={(e) => updateKey('openai', e.target.value)}
              className="bg-white/5 border-white/20 text-white"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleKeyVisibility('openai')}
              className="text-gray-400"
            >
              {showKeys.openai ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        <div>
          <Label className="text-gray-300 mb-2 block">Anthropic API Key (Claude)</Label>
          <div className="flex space-x-2">
            <Input
              type={showKeys.anthropic ? "text" : "password"}
              placeholder="sk-ant-..."
              value={keys.anthropic}
              onChange={(e) => updateKey('anthropic', e.target.value)}
              className="bg-white/5 border-white/20 text-white"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleKeyVisibility('anthropic')}
              className="text-gray-400"
            >
              {showKeys.anthropic ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        <div>
          <Label className="text-gray-300 mb-2 block">Google AI API Key (Gemini)</Label>
          <div className="flex space-x-2">
            <Input
              type={showKeys.google ? "text" : "password"}
              placeholder="AIza..."
              value={keys.google}
              onChange={(e) => updateKey('google', e.target.value)}
              className="bg-white/5 border-white/20 text-white"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleKeyVisibility('google')}
              className="text-gray-400"
            >
              {showKeys.google ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        <Button
          onClick={handleSave}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        >
          <Save className="w-4 h-4 mr-2" />
          Save API Keys
        </Button>

        <p className="text-xs text-gray-400 text-center">
          Keys are stored locally in your browser and never sent to our servers
        </p>
      </div>
    </Card>
  );
};

export default APIKeyManager;
