
import { Sparkles, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="border-b border-white/10 bg-white/5 backdrop-blur-lg">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Prompt Guru</h1>
            <p className="text-sm text-gray-400">AI Prompt Optimization</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" className="text-white hover:text-purple-300">
            Pricing
          </Button>
          <Button variant="ghost" className="text-white hover:text-purple-300">
            Sign In
          </Button>
          <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
            <Crown className="w-4 h-4 mr-2" />
            Get Pro
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
