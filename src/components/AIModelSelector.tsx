
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
    id: "gpt-4",
    name: "GPT-4",
    provider: "OpenAI",
    strengths: ["Advanced Reasoning", "Code", "Analysis"],
    badge: "Latest",
    description: "Most capable OpenAI model for complex tasks"
  },
  {
    id: "gpt-3.5-turbo",
    name: "GPT-3.5 Turbo",
    provider: "OpenAI",
    strengths: ["Speed", "Cost-Effective", "General Purpose"],
    description: "Fast and efficient for most tasks"
  },
  {
    id: "claude-3",
    name: "Claude 3 Sonnet",
    provider: "Anthropic",
    strengths: ["Writing", "Safety", "Long Context"],
    badge: "Recommended",
    description: "Excellent for creative writing and analysis"
  },
  {
    id: "gemini-pro",
    name: "Gemini Pro",
    provider: "Google",
    strengths: ["Multimodal", "Integration", "Research"],
    description: "Google's advanced AI with strong research capabilities"
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
          Choose the AI model to transform your prompts
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
      
      <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
        <p className="text-xs text-amber-300">
          <strong>Note:</strong> You need to configure the corresponding API key in the API Settings tab to use each model.
        </p>
      </div>
    </div>
  );
};

export default AIModelSelector;
