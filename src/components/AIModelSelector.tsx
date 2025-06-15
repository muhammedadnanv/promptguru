
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AIModel {
  id: string;
  name: string;
  provider: string;
  strengths: string[];
  badge?: string;
  description: string;
}

const models: AIModel[] = [
  {
    id: "openrouter/anthropic/claude-3.5-sonnet",
    name: "Claude 3.5 Sonnet",
    provider: "OpenRouter",
    strengths: ["Writing", "Analysis", "Code"],
    badge: "Recommended",
    description: "Excellent for creative writing and complex analysis"
  },
  {
    id: "openrouter/openai/gpt-4o",
    name: "GPT-4o",
    provider: "OpenRouter",
    strengths: ["Reasoning", "Multimodal", "Code"],
    badge: "Latest",
    description: "OpenAI's most advanced model via OpenRouter"
  },
  {
    id: "openrouter/meta-llama/llama-3.1-405b-instruct",
    name: "Llama 3.1 405B",
    provider: "OpenRouter",
    strengths: ["Open Source", "Large Context", "Reasoning"],
    description: "Meta's most powerful open-source model"
  },
  {
    id: "openrouter/google/gemini-pro-1.5",
    name: "Gemini Pro 1.5",
    provider: "OpenRouter",
    strengths: ["Multimodal", "Long Context", "Speed"],
    description: "Google's advanced model with massive context window"
  }
];

interface AIModelSelectorProps {
  selected: string;
  onSelect: (model: string) => void;
}

const AIModelSelector = ({ selected, onSelect }: AIModelSelectorProps) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-3">
        Select AI Model
        <span className="text-xs text-gray-400 block font-normal mt-1">
          All models run via OpenRouter with embedded API key
        </span>
      </label>
      
      <div className="grid grid-cols-1 gap-3">
        {models.map((model) => (
          <Card
            key={model.id}
            className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-lg ${
              selected === model.id
                ? "bg-blue-500/20 border-blue-400 shadow-lg ring-2 ring-blue-400/50"
                : "bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30"
            }`}
            onClick={() => onSelect(model.id)}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-white">{model.name}</h3>
                {model.badge && (
                  <Badge 
                    variant={model.badge === "Recommended" ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {model.badge}
                  </Badge>
                )}
              </div>
              <span className="text-xs text-gray-400 font-medium">{model.provider}</span>
            </div>
            
            <p className="text-xs text-gray-400 mb-3">{model.description}</p>
            
            <div className="flex flex-wrap gap-1">
              {model.strengths.map((strength) => (
                <Badge key={strength} variant="outline" className="text-xs">
                  {strength}
                </Badge>
              ))}
            </div>
          </Card>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
        <p className="text-xs text-green-300">
          <strong>Ready to use:</strong> All models are pre-configured with OpenRouter and ready to transform your prompts.
        </p>
      </div>
    </div>
  );
};

export default AIModelSelector;
