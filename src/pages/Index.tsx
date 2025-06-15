
import { useState } from "react";
import Header from "../components/Header";
import VoiceRecorder from "../components/VoiceRecorder";
import PromptFrameworkSelector from "../components/PromptFrameworkSelector";
import AIModelSelector from "../components/AIModelSelector";
import PromptTransformer from "../components/PromptTransformer";
import APIKeyManager from "../components/APIKeyManager";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface APIKeys {
  openai: string;
  anthropic: string;
  google: string;
}

const Index = () => {
  const [inputText, setInputText] = useState("");
  const [selectedFramework, setSelectedFramework] = useState("CLEAR");
  const [selectedModel, setSelectedModel] = useState("gpt-4");
  const [transformedPrompt, setTransformedPrompt] = useState("");
  const [apiKeys, setApiKeys] = useState<APIKeys>(() => {
    const saved = localStorage.getItem('ai-api-keys');
    return saved ? JSON.parse(saved) : { openai: '', anthropic: '', google: '' };
  });

  const handleAPIKeysUpdate = (keys: APIKeys) => {
    setApiKeys(keys);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div 
        className="absolute inset-0 opacity-20" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />
      
      <div className="relative z-10">
        <Header />
        
        <main className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Transform Ideas into Perfect Prompts
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Use advanced prompt frameworks and AI APIs to turn your casual thoughts and voice notes into 
              structured, optimized prompts that get better AI results.
            </p>
          </div>

          <Tabs defaultValue="workspace" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="workspace">Workspace</TabsTrigger>
              <TabsTrigger value="settings">API Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="workspace" className="space-y-8">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Input Section */}
                <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
                  <h2 className="text-2xl font-semibold text-white mb-6">Input Your Idea</h2>
                  
                  <VoiceRecorder onTranscript={setInputText} />
                  
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Or type your casual idea:
                    </label>
                    <textarea
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="e.g., I want to write a blog post about sustainable gardening but make it engaging for beginners..."
                      className="w-full h-32 p-4 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    />
                  </div>
                </Card>

                {/* Configuration Section */}
                <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
                  <h2 className="text-2xl font-semibold text-white mb-6">Configuration</h2>
                  
                  <div className="space-y-6">
                    <PromptFrameworkSelector 
                      selected={selectedFramework}
                      onSelect={setSelectedFramework}
                    />
                    
                    <AIModelSelector 
                      selected={selectedModel}
                      onSelect={setSelectedModel}
                    />
                  </div>
                </Card>
              </div>

              {/* Transformation Section */}
              <PromptTransformer 
                inputText={inputText}
                framework={selectedFramework}
                model={selectedModel}
                apiKeys={apiKeys}
                onTransformed={setTransformedPrompt}
              />
            </TabsContent>

            <TabsContent value="settings">
              <div className="max-w-2xl mx-auto">
                <APIKeyManager onKeysUpdate={handleAPIKeysUpdate} />
                
                <Card className="mt-6 p-6 bg-white/5 backdrop-blur-lg border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-4">How to get API Keys:</h3>
                  <div className="space-y-3 text-sm text-gray-300">
                    <div>
                      <strong className="text-white">OpenAI:</strong> Visit{" "}
                      <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                        platform.openai.com/api-keys
                      </a>
                    </div>
                    <div>
                      <strong className="text-white">Anthropic (Claude):</strong> Visit{" "}
                      <a href="https://console.anthropic.com/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                        console.anthropic.com
                      </a>
                    </div>
                    <div>
                      <strong className="text-white">Google (Gemini):</strong> Visit{" "}
                      <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                        aistudio.google.com/app/apikey
                      </a>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Index;
