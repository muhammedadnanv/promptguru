
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Wand2, Check, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generatePromptWithAI } from "../services/aiService";
import TextToSpeech from "./TextToSpeech";

interface APIKeys {
  openai: string;
  anthropic: string;
  google: string;
}

interface PromptTransformerProps {
  inputText: string;
  framework: string;
  model: string;
  apiKeys: APIKeys;
  onTransformed: (prompt: string) => void;
}

const PromptTransformer = ({ inputText, framework, model, apiKeys, onTransformed }: PromptTransformerProps) => {
  const [transformedPrompt, setTransformedPrompt] = useState("");
  const [isTransforming, setIsTransforming] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Determine model provider (OpenRouter, OpenAI, Anthropic, Google)
  const getModelProvider = (model: string): keyof APIKeys | "openrouter" => {
    console.log("Checking model provider for:", model);
    if (model.toLowerCase().includes("openrouter")) {
      console.log("Detected OpenRouter model");
      return "openrouter";
    }
    if (model.includes("gpt")) {
      console.log("Detected OpenAI model");
      return "openai";
    }
    if (model.includes("claude")) {
      console.log("Detected Anthropic model");
      return "anthropic";
    }
    if (model.includes("gemini")) {
      console.log("Detected Google model");
      return "google";
    }
    console.log("Defaulting to OpenAI model");
    return "openai";
  };

  // For OpenRouter models, always allow (no API key required), blank or missing keys OK
  const isAPIKeyConfigured = (): boolean => {
    const provider = getModelProvider(model);
    console.log("Checking API key configuration for provider:", provider);
    
    if (provider === "openrouter") {
      console.log("OpenRouter model - always allowing");
      return true;
    }
    if (provider === "google") {
      console.log("Google model - always allowing (embedded key)");
      return true;
    }
    
    const key = apiKeys[provider as keyof APIKeys];
    const hasKey = !!(key && key.trim() !== "");
    console.log(`${provider} API key configured:`, hasKey);
    return hasKey;
  };

  const handleTransform = async () => {
    console.log("Transform button clicked with:", { model, framework, inputText: inputText.substring(0, 50) + "..." });
    setError(null);

    if (!inputText.trim()) {
      setError("Please provide some text or record a voice note first.");
      toast({
        title: "Input required",
        description: "Please provide some text or record a voice note first.",
        variant: "destructive",
      });
      return;
    }

    const provider = getModelProvider(model);
    console.log("Provider determined as:", provider);

    // Only block for API key if NOT OpenRouter or Google (so OpenRouter always passes!)
    if (!isAPIKeyConfigured() && !["openrouter", "google"].includes(provider)) {
      const providerNames = {
        openai: "OpenAI",
        anthropic: "Anthropic",
        google: "Google",
        openrouter: "OpenRouter",
      };

      const errorMsg = `Please configure your ${providerNames[provider]} API key in the API Settings tab.`;
      console.log("Blocking due to missing API key:", errorMsg);
      setError(errorMsg);
      toast({
        title: "API Key required",
        description: errorMsg,
        variant: "destructive",
      });
      return;
    }

    console.log("Proceeding with transformation...");
    setIsTransforming(true);

    try {
      console.log("Starting prompt transformation...", {
        model,
        framework,
        inputLength: inputText.length,
      });

      const result = await generatePromptWithAI(inputText, framework, model, apiKeys);
      console.log("AI service result:", result);

      if (result.error) {
        console.log("AI service returned error:", result.error);
        setError(result.error);
        toast({
          title: "Transform failed",
          description: result.error,
          variant: "destructive",
        });
        return;
      }

      if (!result.content || result.content.trim() === "") {
        console.log("AI service returned empty content");
        setError("No content was generated. Please try again.");
        toast({
          title: "Transform failed",
          description: "No content was generated. Please try again.",
          variant: "destructive",
        });
        return;
      }

      console.log("Transformation successful, content length:", result.content.length);
      setTransformedPrompt(result.content);
      onTransformed(result.content);
      setError(null);

      toast({
        title: "Prompt transformed!",
        description: `Successfully optimized using ${framework} framework with ${model}.`,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      console.error("Transform error:", error);
      setError(errorMessage);

      toast({
        title: "Transform failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsTransforming(false);
    }
  };

  const handleCopy = async () => {
    if (transformedPrompt) {
      try {
        await navigator.clipboard.writeText(transformedPrompt);
        setCopied(true);
        
        toast({
          title: "Copied!",
          description: "Optimized prompt copied to clipboard.",
        });
      } catch (error) {
        toast({
          title: "Copy failed",
          description: "Could not copy to clipboard. Please try selecting and copying manually.",
          variant: "destructive",
        });
      }
    }
  };

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  // Clear error when inputs change
  useEffect(() => {
    setError(null);
  }, [inputText, model, framework]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Button
          onClick={handleTransform}
          disabled={isTransforming || !inputText.trim() || !isAPIKeyConfigured()}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
        >
          {isTransforming ? (
            <>
              <Wand2 className="w-5 h-5 mr-2 animate-spin" />
              Transforming with AI...
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5 mr-2" />
              Transform Prompt
            </>
          )}
        </Button>

        {/* Never show API key warning if provider is OpenRouter or Google */}
        {!isAPIKeyConfigured() &&
          !["openrouter", "google"].includes(getModelProvider(model)) && (
            <p className="text-sm text-yellow-400 mt-2 flex items-center justify-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              Configure API key for {getModelProvider(model)} in Settings
            </p>
          )}
      </div>

      {error && (
        <Card className="p-4 bg-red-500/10 border-red-500/20">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <p className="text-red-300">{error}</p>
          </div>
        </Card>
      )}

      {(transformedPrompt || isTransforming) && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Before */}
          <Card className="p-6 bg-white/5 backdrop-blur-lg border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Before</h3>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">Casual Input</Badge>
                <TextToSpeech text={inputText} />
              </div>
            </div>
            <div className="bg-white/5 rounded-lg p-4 min-h-[200px]">
              <p className="text-gray-300 leading-relaxed">
                {inputText || "Your input will appear here..."}
              </p>
            </div>
          </Card>

          {/* After */}
          <Card className="p-6 bg-white/5 backdrop-blur-lg border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">After</h3>
              <div className="flex items-center space-x-2">
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500">
                  {framework} Framework
                </Badge>
                <Badge variant="outline">{model}</Badge>
                {transformedPrompt && <TextToSpeech text={transformedPrompt} />}
              </div>
            </div>
            
            <div className="bg-white/5 rounded-lg p-4 min-h-[200px] relative">
              {isTransforming ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                </div>
              ) : transformedPrompt ? (
                <>
                  <p className="text-gray-300 leading-relaxed pr-12 whitespace-pre-wrap">
                    {transformedPrompt}
                  </p>
                  <Button
                    onClick={handleCopy}
                    variant="ghost"
                    size="sm"
                    className="absolute top-4 right-4 text-gray-400 hover:text-white"
                  >
                    {copied ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </>
              ) : (
                <p className="text-gray-500 italic">
                  Your AI-optimized prompt will appear here...
                </p>
              )}
            </div>
            
            {transformedPrompt && (
              <div className="mt-4 flex justify-end">
                <Button
                  onClick={handleCopy}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Prompt
                    </>
                  )}
                </Button>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};

export default PromptTransformer;
