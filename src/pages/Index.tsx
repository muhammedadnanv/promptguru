import { useState } from "react";
import { useSupabaseApiKeys } from "@/hooks/useSupabaseApiKeys";
import { usePromptHistory } from "@/hooks/usePromptHistory";
import Header from "../components/Header";
import VoiceRecorder from "../components/VoiceRecorder";
import PromptFrameworkSelector from "../components/PromptFrameworkSelector";
import AIModelSelector from "../components/AIModelSelector";
import PromptTransformer from "../components/PromptTransformer";
import APIKeyManager from "../components/APIKeyManager";
import WhatsAppWidget from "../components/WhatsAppWidget";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
const Index = () => {
  const {
    apiKeys,
    saveApiKey,
    deleteApiKey
  } = useSupabaseApiKeys();
  const {
    prompts,
    savePrompt,
    saveTransformation,
    deletePrompt
  } = usePromptHistory();
  const [inputText, setInputText] = useState("");
  const [selectedFramework, setSelectedFramework] = useState("CLEAR");
  const [selectedModel, setSelectedModel] = useState("gpt-4");
  const [transformedPrompt, setTransformedPrompt] = useState("");
  const handleAPIKeysUpdate = async (keys: any) => {
    // API keys are now automatically saved through useSupabaseApiKeys hook
  };
  const getModelProvider = (model: string): keyof typeof apiKeys => {
    if (model.includes('gpt')) return 'openai';
    if (model.includes('claude')) return 'anthropic';
    if (model.includes('gemini')) return 'google';
    return 'openai';
  };
  const isAPIKeyConfigured = (): boolean => {
    const provider = getModelProvider(selectedModel);
    const key = apiKeys[provider];
    return !!(key && key.trim() !== '');
  };
  const getConfiguredKeysCount = (): number => {
    return Object.values(apiKeys).filter(key => key && key.trim() !== '').length;
  };
  const handlePromptTransformed = async (transformed: string) => {
    setTransformedPrompt(transformed);

    // Save the prompt and transformation to Supabase
    if (inputText.trim()) {
      const prompt = await savePrompt(inputText, selectedFramework, selectedModel);
      if (prompt && transformed) {
        await saveTransformation(prompt.id, transformed, getModelProvider(selectedModel), selectedModel);
      }
    }
  };
  return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Imaging page link */}
      <div className="container mx-auto px-4 py-4 flex justify-end">
        <Link to="/imaging" className="inline-flex items-center px-3 py-1.5 rounded-lg bg-purple-600/80 hover:bg-purple-700 text-white font-semibold shadow transition">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M21 15V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h3l1.34 2.68a2 2 0 0 0 1.79 1.12h2.74a2 2 0 0 0 1.79-1.12L16 17h3a2 2 0 0 0 2-2z"></path>
          </svg>
          Imaging
        </Link>
      </div>
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center mb-4 md:mb-8">
            <Header />
          </div>
        </div>
        
        <main className="container mx-auto px-4 py-4 md:py-8 max-w-6xl">
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Transform Ideas into Perfect Prompts
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-4">
              Use advanced prompt frameworks and real AI APIs to turn your casual thoughts and voice notes into 
              structured, optimized prompts that get better AI results.
            </p>
          </div>

          <Tabs defaultValue="workspace" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6 md:mb-8">
              <TabsTrigger value="workspace" className="relative text-xs md:text-sm">
                <span className="hidden sm:inline">Workspace</span>
                <span className="sm:hidden">Work</span>
                {!isAPIKeyConfigured() && <AlertCircle className="w-3 h-3 md:w-4 md:h-4 ml-1 md:ml-2 text-yellow-400" />}
              </TabsTrigger>
              
              <TabsTrigger value="history" className="relative text-xs md:text-sm">
                <History className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                <span className="hidden sm:inline">History</span>
                <Badge variant="secondary" className="ml-1 md:ml-2 text-xs">
                  {prompts.length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="workspace" className="space-y-6 md:space-y-8">
              {!isAPIKeyConfigured() && <Card className="p-4 bg-yellow-500/10 border-yellow-500/20">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 flex-shrink-0" />
                    <p className="text-yellow-300 text-sm md:text-base">
                      Configure your API key in the <strong>API Settings</strong> tab to start transforming prompts.
                    </p>
                  </div>
                </Card>}

              <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
                {/* Input Section */}
                <Card className="p-4 md:p-6 bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
                  <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 md:mb-6">Input Your Idea</h2>
                  
                  <VoiceRecorder onTranscript={setInputText} />
                  
                  <div className="mt-4 md:mt-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Or type your casual idea:
                    </label>
                    <textarea value={inputText} onChange={e => setInputText(e.target.value)} placeholder="e.g., I want to write a blog post about sustainable gardening but make it engaging for beginners..." className="w-full h-32 md:h-32 p-3 md:p-4 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none text-sm md:text-base" />
                    <p className="text-xs text-gray-400 mt-2">
                      {inputText.length} characters
                    </p>
                  </div>
                </Card>

                {/* Configuration Section */}
                <Card className="p-4 md:p-6 bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
                  <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 md:mb-6">Configuration</h2>
                  
                  <div className="space-y-4 md:space-y-6">
                    <PromptFrameworkSelector selected={selectedFramework} onSelect={setSelectedFramework} />
                    
                    <AIModelSelector selected={selectedModel} onSelect={setSelectedModel} />

                    {isAPIKeyConfigured() && <div className="flex items-center space-x-2 text-green-400">
                        <CheckCircle className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm">API key configured for {getModelProvider(selectedModel)}</span>
                      </div>}
                  </div>
                </Card>
              </div>

              {/* Transformation Section */}
              <PromptTransformer inputText={inputText} framework={selectedFramework} model={selectedModel} apiKeys={apiKeys} onTransformed={handlePromptTransformed} />
            </TabsContent>

            <TabsContent value="settings">
              <div className="max-w-2xl mx-auto">
                <APIKeyManager onKeysUpdate={handleAPIKeysUpdate} apiKeys={apiKeys} onSaveKey={saveApiKey} onDeleteKey={deleteApiKey} />
                
                <Card className="mt-6 p-4 md:p-6 bg-white/5 backdrop-blur-lg border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-4">How to get API Keys:</h3>
                  <div className="space-y-3 text-sm text-gray-300">
                    <div>
                      <strong className="text-white">OpenAI:</strong> Visit{" "}
                      <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline break-all">
                        platform.openai.com/api-keys
                      </a>
                    </div>
                    <div>
                      <strong className="text-white">Anthropic (Claude):</strong> Visit{" "}
                      <a href="https://console.anthropic.com/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline break-all">
                        console.anthropic.com
                      </a>
                    </div>
                    <div>
                      <strong className="text-white">Google (Gemini):</strong> Visit{" "}
                      <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline break-all">
                        aistudio.google.com/app/apikey
                      </a>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="history">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 md:mb-6">Your Prompt History</h2>
                
                {prompts.length === 0 ? <Card className="p-6 md:p-8 bg-white/5 backdrop-blur-lg border-white/10 text-center">
                    <History className="w-10 h-10 md:w-12 md:h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-300 text-lg">No prompts yet</p>
                    <p className="text-gray-400">Your transformed prompts will appear here</p>
                  </Card> : <div className="space-y-4">
                    {prompts.map(prompt => <Card key={prompt.id} className="p-4 md:p-6 bg-white/5 backdrop-blur-lg border-white/10">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 space-y-2 sm:space-y-0">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-white">{prompt.title}</h3>
                            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm text-gray-400 mt-1">
                              <span>{prompt.framework} framework</span>
                              <span>{prompt.model}</span>
                              <span>{new Date(prompt.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => deletePrompt(prompt.id)} className="text-red-400 hover:text-red-300 self-start sm:self-auto">
                            Delete
                          </Button>
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-300 mb-2">Original Input:</h4>
                            <p className="text-gray-200 text-sm bg-white/5 p-3 rounded break-words">{prompt.content}</p>
                          </div>
                          
                          {prompt.transformations && prompt.transformations.length > 0 && <div>
                              <h4 className="text-sm font-medium text-gray-300 mb-2">Transformed Prompt:</h4>
                              <p className="text-gray-200 text-sm bg-white/5 p-3 rounded break-words">
                                {prompt.transformations[0].transformed_content}
                              </p>
                            </div>}
                        </div>
                      </Card>)}
                  </div>}
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* WhatsApp Widget */}
      <WhatsAppWidget />
    </div>;
};
export default Index;