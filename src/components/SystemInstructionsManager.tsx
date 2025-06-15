
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash, Save } from "lucide-react";

// Type definition for a system instruction
interface SystemInstruction {
  id: string;
  name: string;
  content: string;
}

const getInitialInstructions = (): SystemInstruction[] => {
  const stored = localStorage.getItem("systemInstructions");
  return stored ? JSON.parse(stored) : [];
};

const saveInstructions = (instructions: SystemInstruction[]) => {
  localStorage.setItem("systemInstructions", JSON.stringify(instructions));
};

const SystemInstructionsManager: React.FC = () => {
  const [instructions, setInstructions] = useState<SystemInstruction[]>([]);
  const [newName, setNewName] = useState("");
  const [newContent, setNewContent] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editContent, setEditContent] = useState("");
  
  useEffect(() => {
    setInstructions(getInitialInstructions());
  }, []);

  const handleAdd = () => {
    if (!newName.trim() || !newContent.trim()) return;
    const newInstruction: SystemInstruction = {
      id: Date.now().toString(),
      name: newName.trim(),
      content: newContent.trim(),
    };
    const updated = [...instructions, newInstruction];
    setInstructions(updated);
    saveInstructions(updated);
    setNewName("");
    setNewContent("");
  };

  const handleDelete = (id: string) => {
    const updated = instructions.filter(item => item.id !== id);
    setInstructions(updated);
    saveInstructions(updated);
  };

  const startEdit = (inst: SystemInstruction) => {
    setEditId(inst.id);
    setEditName(inst.name);
    setEditContent(inst.content);
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditName("");
    setEditContent("");
  };

  const saveEdit = () => {
    if (!editId || !editName.trim() || !editContent.trim()) return;
    const updated = instructions.map(item =>
      item.id === editId ? { ...item, name: editName.trim(), content: editContent.trim() } : item
    );
    setInstructions(updated);
    saveInstructions(updated);
    cancelEdit();
  };

  return (
    <div className="space-y-6">
      <Card className="p-4 mb-6 bg-white/10 text-white rounded-xl">
        <h2 className="text-xl font-bold mb-2">Create System Instruction</h2>
        <div className="space-y-3">
          <input
            type="text"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="Instruction Name"
            className="w-full px-3 py-2 rounded bg-white/5 border border-white/20 text-white focus:outline-none"
          />
          <textarea
            value={newContent}
            onChange={e => setNewContent(e.target.value)}
            placeholder="System Instruction Content"
            className="w-full px-3 py-2 rounded bg-white/5 border border-white/20 text-white focus:outline-none min-h-[70px]"
          />
          <Button onClick={handleAdd} className="inline-flex items-center gap-2" disabled={!newName.trim() || !newContent.trim()}>
            <Plus className="w-4 h-4" /> Add Instruction
          </Button>
        </div>
      </Card>
      <Card className="p-4 bg-white/10 text-white rounded-xl">
        <h2 className="text-xl font-bold mb-4">Your System Instructions</h2>
        {instructions.length === 0 ? (
          <div className="text-gray-400">No instructions created yet.</div>
        ) : (
          <div className="space-y-4">
            {instructions.map(inst => (
              <div key={inst.id} className="border-b border-white/10 pb-4 mb-4 last:mb-0 last:pb-0 last:border-b-0 flex flex-col gap-2">
                {editId === inst.id ? (
                  <>
                    <input
                      type="text"
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      className="w-full px-3 py-2 rounded bg-white/5 border border-white/20 text-white focus:outline-none"
                    />
                    <textarea
                      value={editContent}
                      onChange={e => setEditContent(e.target.value)}
                      className="w-full px-3 py-2 rounded bg-white/5 border border-white/20 text-white focus:outline-none min-h-[56px]"
                    />
                    <div className="flex gap-2">
                      <Button onClick={saveEdit} className="inline-flex gap-1" size="sm">
                        <Save className="w-4 h-4" /> Save
                      </Button>
                      <Button variant="ghost" onClick={cancelEdit} size="sm">Cancel</Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-white">{inst.name}</span>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => startEdit(inst)} aria-label="Edit">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(inst.id)} aria-label="Delete" className="text-red-500 hover:text-red-400">
                          <Trash className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="whitespace-pre-line break-words text-gray-200 text-sm">{inst.content}</div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default SystemInstructionsManager;
