
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
    id: "openai/gpt-4o",
    name: "GPT-4o",
    provider: "OpenAI",
    strengths: ["Reasoning", "Multimodal", "Code"],
    badge: "Latest",
    description: "OpenAI's most advanced model"
  },
  {
    id: "openai/gpt-4o-mini",
    name: "GPT-4o Mini",
    provider: "OpenAI",
    strengths: ["Fast", "Efficient", "Code"],
    description: "Fast and efficient version of GPT-4o"
  },
  {
    id: "anthropic/claude-3.5-sonnet",
    name: "Claude 3.5 Sonnet",
    provider: "Anthropic",
    strengths: ["Writing", "Analysis", "Code"],
    badge: "Recommended",
    description: "Excellent for creative writing and complex analysis"
  },
  {
    id: "anthropic/claude-3-haiku",
    name: "Claude 3 Haiku",
    provider: "Anthropic",
    strengths: ["Speed", "Efficiency", "Analysis"],
    description: "Fast and efficient Claude model"
  },
  {
    id: "google/gemini-pro-1.5",
    name: "Gemini Pro 1.5",
    provider: "Google",
    strengths: ["Multimodal", "Long Context", "Speed"],
    description: "Google's advanced model with massive context window"
  },
  {
    id: "meta-llama/llama-3.1-405b-instruct",
    name: "Llama 3.1 405B",
    provider: "Meta",
    strengths: ["Open Source", "Large Context", "Reasoning"],
    description: "Meta's most powerful open-source model"
  },
  {
    id: "meta-llama/llama-3.1-70b-instruct",
    name: "Llama 3.1 70B",
    provider: "Meta",
    strengths: ["Open Source", "Efficient", "Reasoning"],
    description: "Balanced performance and efficiency"
  },
  {
    id: "mistralai/mistral-large",
    name: "Mistral Large",
    provider: "Mistral AI",
    strengths: ["Multilingual", "Code", "Reasoning"],
    description: "High-performance multilingual model"
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
          All models available via OpenRouter API
        </span>
      </label>
      
      <div className="grid grid-cols-1 gap-3 max-h-80 overflow-y-auto">
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
