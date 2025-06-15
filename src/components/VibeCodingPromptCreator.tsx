
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash } from "lucide-react";

interface VibePrompt {
  id: string;
  content: string;
}

const getVibePrompts = (): VibePrompt[] => {
  const stored = localStorage.getItem("vibeCodingPrompts");
  return stored ? JSON.parse(stored) : [];
};

const saveVibePrompts = (prompts: VibePrompt[]) => {
  localStorage.setItem("vibeCodingPrompts", JSON.stringify(prompts));
};

const VibeCodingPromptCreator: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [prompts, setPrompts] = useState<VibePrompt[]>([]);

  useEffect(() => {
    setPrompts(getVibePrompts());
  }, []);

  const handleAdd = () => {
    if (!prompt.trim()) return;
    const newPrompt: VibePrompt = {
      id: Date.now().toString(),
      content: prompt.trim(),
    };
    const updated = [newPrompt, ...prompts];
    setPrompts(updated);
    saveVibePrompts(updated);
    setPrompt("");
  };

  const handleDelete = (id: string) => {
    const updated = prompts.filter((item) => item.id !== id);
    setPrompts(updated);
    saveVibePrompts(updated);
  };

  return (
    <div className="space-y-6">
      <Card className="p-4 bg-gradient-to-r from-blue-800 via-purple-800 to-blue-800 text-white rounded-xl">
        <h2 className="text-lg font-bold mb-2">Vibe Coding Prompt Creator</h2>
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Write your Vibe Coding prompt..."
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            className="bg-white/10 border-white/10 placeholder:text-purple-200 text-white"
            maxLength={160}
          />
          <Button
            onClick={handleAdd}
            className="inline-flex items-center gap-1"
            disabled={!prompt.trim()}
          >
            <Plus className="w-4 h-4" /> Add
          </Button>
        </div>
        <p className="text-xs text-gray-300 mt-1">{prompt.length}/160 characters</p>
      </Card>
      <Card className="p-4 bg-white/10 text-white rounded-xl">
        <h3 className="text-md font-semibold mb-3">Your Vibe Coding Prompts</h3>
        {prompts.length === 0 ? (
          <div className="text-gray-400 italic">No Vibe prompts yet.</div>
        ) : (
          <ul className="space-y-3">
            {prompts.map(p => (
              <li key={p.id} className="flex items-center justify-between gap-2 bg-white/5 p-3 rounded">
                <span className="break-words flex-1">{p.content}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-400 hover:text-red-300"
                  onClick={() => handleDelete(p.id)}
                  aria-label="Delete"
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
};

export default VibeCodingPromptCreator;
