import { useState } from "react";
import { usePromptHistory } from "@/hooks/usePromptHistory";
import Header from "../components/Header";
import VoiceRecorder from "../components/VoiceRecorder";
import PromptFrameworkSelector from "../components/PromptFrameworkSelector";
import AIModelSelector from "../components/AIModelSelector";
import PromptTransformer from "../components/PromptTransformer";
import WhatsAppWidget from "../components/WhatsAppWidget";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { History, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import APIKeyManager from "@/components/APIKeyManager";
import { useSupabaseApiKeys } from "@/hooks/useSupabaseApiKeys";
import SystemInstructionsManager from "../components/SystemInstructionsManager";
import VibeCodingPromptCreator from "@/components/VibeCodingPromptCreator";

// NEW: Helper for responsive classnames
const responsiveCard =
  "p-3 xs:p-4 md:p-6 bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl rounded-2xl md:rounded-xl";

const Index = () => {
  const { prompts, savePrompt, saveTransformation, deletePrompt } = usePromptHistory();
  const [inputText, setInputText] = useState("");
  const [selectedFramework, setSelectedFramework] = useState("CLEAR");
  const [selectedModel, setSelectedModel] = useState("anthropic/claude-3.5-sonnet");
  const [transformedPrompt, setTransformedPrompt] = useState("");

  const {
    apiKeys,
    loading: apiKeyLoading,
    saveApiKey,
    deleteApiKey,
    refreshKeys
  } = useSupabaseApiKeys();

  const getModelProvider = (model: string): string => {
    return "openrouter";
  };

  const handlePromptTransformed = async (transformed: string) => {
    setTransformedPrompt(transformed);

    if (inputText.trim()) {
      const prompt = await savePrompt(inputText, selectedFramework, selectedModel);
      if (prompt && transformed) {
        await saveTransformation(prompt.id, transformed, getModelProvider(selectedModel), selectedModel);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Imaging page link */}
      <div className="container mx-auto px-3 xs:px-3 sm:px-4 py-3 flex justify-end">
        <Link
          to="/imaging"
          className="inline-flex items-center px-4 py-3 sm:px-4 sm:py-2 rounded-xl bg-purple-600/80 hover:bg-purple-700 text-white font-semibold shadow transition text-base md:text-base"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M21 15V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h3l1.34 2.68a2 2 0 0 0 1.79 1.12h2.74a2 2 0 0 0 1.79-1.12L16 17h3a2 2 0 0 0 2-2z"></path>
          </svg>
          <span className="hidden xs:inline">Imaging</span>
        </Link>
      </div>
      <div className="relative z-10">
        <div className="container mx-auto px-2 xs:px-3 sm:px-4 py-3">
          <div className="flex flex-col md:flex-row justify-between items-center mb-4 md:mb-8 gap-4 xs:gap-5">
            <Header />
          </div>
        </div>
        <main className="container mx-auto px-0 xs:px-2 sm:px-4 py-2 md:py-8 max-w-6xl">
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 md:mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight">
              Transform Ideas into Perfect Prompts
            </h1>
            <p className="text-sm xs:text-base md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-2 xs:px-4">
              Use advanced prompt frameworks and AI models via OpenRouter to turn your casual thoughts and voice notes into 
              structured, optimized prompts that get better AI results.
            </p>
          </div>
          <Tabs defaultValue="workspace" className="w-full">
            <TabsList className="grid w-full grid-cols-1 xs:grid-cols-5 gap-3 mb-5 md:mb-8"
              style={{ touchAction: "manipulation" }}
            >
              {/* Each tab trigger's font and padding improved for mobile */}
              <TabsTrigger
                value="workspace"
                className="relative text-sm xs:text-base sm:text-lg md:text-sm px-2 py-3 md:px-4 md:py-3 rounded-lg min-h-[48px]"
                style={{ minWidth: 48 }}
              >
                <span className="hidden sm:inline">Workspace</span>
                <span className="sm:hidden">Work</span>
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="relative text-sm xs:text-base sm:text-lg md:text-sm px-2 py-3 md:px-4 md:py-3 rounded-lg min-h-[48px]"
                style={{ minWidth: 48 }}
              >
                <History className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                <span className="hidden sm:inline">History</span>
                <Badge variant="secondary" className="ml-2 text-xs">{prompts.length}</Badge>
              </TabsTrigger>
              <TabsTrigger
                value="api-settings"
                className="relative text-sm xs:text-base sm:text-lg md:text-sm px-2 py-3 md:px-4 md:py-3 rounded-lg min-h-[48px]"
                style={{ minWidth: 48 }}
              >
                <Settings className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                <span className="hidden sm:inline">API Settings</span>
                <span className="sm:hidden">API</span>
              </TabsTrigger>
              <TabsTrigger
                value="system-instructions"
                className="relative text-sm xs:text-base sm:text-lg md:text-sm px-2 py-3 md:px-4 md:py-3 rounded-lg min-h-[48px]"
                style={{ minWidth: 48 }}
              >
                <span className="hidden sm:inline">System Instructions</span>
                <span className="sm:hidden">System</span>
              </TabsTrigger>
              <TabsTrigger
                value="vibe-coding"
                className="relative text-sm xs:text-base sm:text-lg md:text-sm px-2 py-3 md:px-4 md:py-3 rounded-lg min-h-[48px]"
                style={{ minWidth: 48 }}
              >
                <span className="hidden sm:inline">Vibe Coding</span>
                <span className="sm:hidden">Vibe</span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="workspace" className="space-y-6 md:space-y-8">
              <div className="flex flex-col lg:grid lg:grid-cols-2 gap-5 md:gap-8">
                {/* Input Section */}
                <Card className={`${responsiveCard} w-full`}>
                  <h2 className="text-lg xs:text-xl md:text-2xl font-semibold text-white mb-3 xs:mb-4 md:mb-6">Input Your Idea</h2>
                  <div className="flex flex-col gap-3 xs:gap-4 sm:gap-5">
                    <VoiceRecorder onTranscript={setInputText} />
                    <div>
                      <label className="block text-sm sm:text-base font-medium text-gray-300 mb-2">
                        Or type your casual idea:
                      </label>
                      <textarea
                        value={inputText}
                        onChange={e => setInputText(e.target.value)}
                        placeholder="e.g., I want to write a blog post about sustainable gardening but make it engaging for beginners..."
                        className="w-full min-h-[90px] xs:min-h-[110px] sm:h-28 md:h-32 p-3 xs:p-4 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none text-base xs:text-lg"
                        style={{ lineHeight: 1.75 }}
                      />
                      <p className="text-xs xs:text-sm text-gray-400 mt-2">
                        {inputText.length} characters
                      </p>
                    </div>
                  </div>
                </Card>
                {/* Configuration Section */}
                <Card className={`${responsiveCard} w-full mt-5 lg:mt-0`}>
                  <h2 className="text-lg xs:text-xl md:text-2xl font-semibold text-white mb-3 xs:mb-4 md:mb-6">Configuration</h2>
                  <div className="space-y-4 xs:space-y-5 md:space-y-6">
                    <PromptFrameworkSelector selected={selectedFramework} onSelect={setSelectedFramework} />
                    <AIModelSelector selected={selectedModel} onSelect={setSelectedModel} />
                  </div>
                </Card>
              </div>
              {/* Transformation Section */}
              <PromptTransformer 
                inputText={inputText} 
                framework={selectedFramework} 
                model={selectedModel} 
                apiKeys={{openai: "", anthropic: "", google: ""}} 
                onTransformed={handlePromptTransformed} 
              />
            </TabsContent>

            {/* API Settings Tab */}
            <TabsContent value="api-settings">
              <div className="max-w-md md:max-w-2xl mx-auto px-2 xs:px-0">
                <APIKeyManager
                  onKeysUpdate={refreshKeys}
                  apiKeys={apiKeys}
                  onSaveKey={saveApiKey}
                  onDeleteKey={deleteApiKey}
                />
              </div>
            </TabsContent>

            <TabsContent value="history">
              <div className="max-w-lg md:max-w-4xl mx-auto overflow-x-auto">
                <h2 className="text-xl xs:text-2xl md:text-2xl font-semibold text-white mb-4 xs:mb-6">Your Prompt History</h2>
                {prompts.length === 0 ? (
                  <Card className="p-4 xs:p-6 md:p-8 bg-white/5 backdrop-blur-lg border-white/10 text-center rounded-xl">
                    <History className="w-8 h-8 md:w-12 md:h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-300 text-base xs:text-lg">No prompts yet</p>
                    <p className="text-gray-400 text-sm">Your transformed prompts will appear here</p>
                  </Card>
                ) : (
                  <div className="space-y-4 min-w-[90vw] max-w-full sm:min-w-0">
                    {prompts.map(prompt => (
                      <Card key={prompt.id} className="p-3 xs:p-4 md:p-6 bg-white/5 backdrop-blur-lg border-white/10 rounded-xl">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 sm:mb-3 space-y-2 sm:space-y-0">
                          <div className="flex-1">
                            <h3 className="text-base xs:text-lg md:text-lg font-semibold text-white">{prompt.title}</h3>
                            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs xs:text-sm text-gray-400 mt-1">
                              <span>{prompt.framework} framework</span>
                              <span>{prompt.model}</span>
                              <span>{new Date(prompt.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deletePrompt(prompt.id)}
                            className="text-red-400 hover:text-red-300 self-start sm:self-auto min-h-[44px] xs:min-w-[44px] px-2 py-2"
                            style={{ fontSize: 18 }}
                          >
                            Delete
                          </Button>
                        </div>
                        <div className="space-y-2 xs:space-y-2 sm:space-y-3">
                          <div>
                            <h4 className="text-xs xs:text-sm md:text-sm font-medium text-gray-300 mb-1">Original Input:</h4>
                            <p className="text-gray-200 text-xs xs:text-sm md:text-sm bg-white/5 p-2 xs:p-3 rounded break-words overflow-x-auto">{prompt.content}</p>
                          </div>
                          {prompt.transformations && prompt.transformations.length > 0 && (
                            <div>
                              <h4 className="text-xs xs:text-sm md:text-sm font-medium text-gray-300 mb-1">Transformed Prompt:</h4>
                              <p className="text-gray-200 text-xs xs:text-sm md:text-sm bg-white/5 p-2 xs:p-3 rounded break-words overflow-x-auto">{prompt.transformations[0].transformed_content}</p>
                            </div>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="system-instructions" className="py-4">
              <SystemInstructionsManager />
            </TabsContent>

            <TabsContent value="vibe-coding" className="py-4">
              <div className="max-w-2xl mx-auto">
                <VibeCodingPromptCreator />
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
      <WhatsAppWidget />
    </div>
  );
};

export default Index;
