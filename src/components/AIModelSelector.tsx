
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AIModel {
  id: string;
  name: string;
  provider: string;
  strengths: string[];
  badge?: string;
}

const models: AIModel[] = [
  {
    id: "gpt-4",
    name: "GPT-4",
    provider: "OpenAI",
    strengths: ["Reasoning", "Code", "Analysis"],
    badge: "Popular"
  },
  {
    id: "gpt-3.5-turbo",
    name: "GPT-3.5 Turbo",
    provider: "OpenAI",
    strengths: ["Speed", "Cost", "General"]
  },
  {
    id: "claude-3",
    name: "Claude 3 Sonnet",
    provider: "Anthropic",
    strengths: ["Writing", "Safety", "Long Context"],
    badge: "Recommended"
  },
  {
    id: "gemini-pro",
    name: "Gemini Pro",
    provider: "Google",
    strengths: ["Multimodal", "Speed", "Integration"]
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
        Target AI Model
      </label>
      
      <div className="grid grid-cols-1 gap-3">
        {models.map((model) => (
          <Card
            key={model.id}
            className={`p-4 cursor-pointer transition-all duration-200 ${
              selected === model.id
                ? "bg-blue-500/20 border-blue-400 shadow-lg"
                : "bg-white/5 border-white/20 hover:bg-white/10"
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
              <span className="text-xs text-gray-400">{model.provider}</span>
            </div>
            
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
    </div>
  );
};

export default AIModelSelector;
