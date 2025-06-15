
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Framework {
  id: string;
  name: string;
  description: string;
  structure: string[];
  useCase: string;
}

const frameworks: Framework[] = [
  {
    id: "CLEAR",
    name: "CLEAR",
    description: "Context, Length, Examples, Audience, Role",
    structure: ["Context", "Length", "Examples", "Audience", "Role"],
    useCase: "Best for content creation and writing tasks"
  },
  {
    id: "STAR",
    name: "STAR",
    description: "Situation, Task, Action, Result",
    structure: ["Situation", "Task", "Action", "Result"],
    useCase: "Perfect for problem-solving and analysis"
  },
  {
    id: "STaC",
    name: "STaC",
    description: "Situation, Task, Context",
    structure: ["Situation", "Task", "Context"],
    useCase: "Great for quick, focused requests"
  },
  {
    id: "PEACH",
    name: "PEACH",
    description: "Purpose, Examples, Audience, Context, Hope",
    structure: ["Purpose", "Examples", "Audience", "Context", "Hope"],
    useCase: "Ideal for creative and marketing content"
  }
];

interface PromptFrameworkSelectorProps {
  selected: string;
  onSelect: (framework: string) => void;
}

const PromptFrameworkSelector = ({ selected, onSelect }: PromptFrameworkSelectorProps) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-3">
        Choose Prompt Framework
      </label>
      
      <div className="grid grid-cols-2 gap-3">
        {frameworks.map((framework) => (
          <Card
            key={framework.id}
            className={`p-4 cursor-pointer transition-all duration-200 ${
              selected === framework.id
                ? "bg-purple-500/20 border-purple-400 shadow-lg"
                : "bg-white/5 border-white/20 hover:bg-white/10"
            }`}
            onClick={() => onSelect(framework.id)}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white">{framework.name}</h3>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-1 h-auto">
                    <Info className="w-4 h-4 text-gray-400" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 bg-slate-800 border-slate-700">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-white">{framework.name} Framework</h4>
                    <p className="text-sm text-gray-300">{framework.description}</p>
                    <div>
                      <p className="text-xs font-medium text-gray-400 mb-2">Structure:</p>
                      <div className="flex flex-wrap gap-1">
                        {framework.structure.map((item) => (
                          <Badge key={item} variant="secondary" className="text-xs">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-purple-300">{framework.useCase}</p>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            
            <p className="text-xs text-gray-400">{framework.useCase}</p>
            
            <div className="flex flex-wrap gap-1 mt-2">
              {framework.structure.slice(0, 3).map((item) => (
                <Badge key={item} variant="outline" className="text-xs">
                  {item}
                </Badge>
              ))}
              {framework.structure.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{framework.structure.length - 3}
                </Badge>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PromptFrameworkSelector;
