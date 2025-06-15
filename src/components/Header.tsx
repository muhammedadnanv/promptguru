
import { Sparkles } from "lucide-react";

const Header = () => {
  return (
    <div className="flex items-center space-x-3">
      <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
        <Sparkles className="w-4 h-4 md:w-6 md:h-6 text-white" />
      </div>
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-white">Prompt Guru</h1>
        <p className="text-xs md:text-sm text-gray-400">AI Prompt Optimization</p>
      </div>
    </div>
  );
};

export default Header;
