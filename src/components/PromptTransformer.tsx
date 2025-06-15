
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Wand2, ArrowRight, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { transformPrompt } from "../utils/promptFrameworks";

interface PromptTransformerProps {
  inputText: string;
  framework: string;
  model: string;
  onTransformed: (prompt: string) => void;
}

const PromptTransformer = ({ inputText, framework, model, onTransformed }: PromptTransformerProps) => {
  const [transformedPrompt, setTransformedPrompt] = useState("");
  const [isTransforming, setIsTransforming] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleTransform = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Input required",
        description: "Please provide some text or record a voice note first.",
        variant: "destructive",
      });
      return;
    }

    setIsTransforming(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const result = transformPrompt(inputText, framework, model);
      setTransformedPrompt(result);
      onTransformed(result);
      setIsTransforming(false);
      
      toast({
        title: "Prompt transformed!",
        description: `Successfully optimized using ${framework} framework.`,
      });
    }, 2000);
  };

  const handleCopy = async () => {
    if (transformedPrompt) {
      await navigator.clipboard.writeText(transformedPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      
      toast({
        title: "Copied!",
        description: "Optimized prompt copied to clipboard.",
      });
    }
  };

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Button
          onClick={handleTransform}
          disabled={isTransforming || !inputText.trim()}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
        >
          {isTransforming ? (
            <>
              <Wand2 className="w-5 h-5 mr-2 animate-spin" />
              Transforming...
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5 mr-2" />
              Transform Prompt
            </>
          )}
        </Button>
      </div>

      {(transformedPrompt || isTransforming) && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Before */}
          <Card className="p-6 bg-white/5 backdrop-blur-lg border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Before</h3>
              <Badge variant="outline">Casual Input</Badge>
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
              </div>
            </div>
            
            <div className="bg-white/5 rounded-lg p-4 min-h-[200px] relative">
              {isTransforming ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                </div>
              ) : transformedPrompt ? (
                <>
                  <p className="text-gray-300 leading-relaxed pr-12">
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
                  Your optimized prompt will appear here...
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
