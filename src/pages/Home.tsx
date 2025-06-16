import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  Mic, 
  Settings, 
  History, 
  ArrowRight, 
  Zap, 
  Brain, 
  MessageSquare,
  Code,
  Wand2,
  CreditCard
} from "lucide-react";
import Header from "@/components/Header";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="relative z-10">
        <div className="container mx-auto px-2 xs:px-3 sm:px-4 py-3">
          <div className="flex flex-col md:flex-row justify-between items-center mb-4 md:mb-8 gap-4 xs:gap-5">
            <Header />
            <div className="flex gap-3">
              <Link
                to="/payment"
                className="inline-flex items-center px-4 py-3 sm:px-4 sm:py-2 rounded-xl bg-green-600/80 hover:bg-green-700 text-white font-semibold shadow transition text-base md:text-base"
              >
                <CreditCard className="w-5 h-5 mr-2" />
                <span className="hidden xs:inline">Pay Now</span>
              </Link>
              <Link
                to="/imaging"
                className="inline-flex items-center px-4 py-3 sm:px-4 sm:py-2 rounded-xl bg-purple-600/80 hover:bg-purple-700 text-white font-semibold shadow transition text-base md:text-base"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M21 15V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h3l1.34 2.68a2 2 0 0 0 1.79 1.12h2.74a2 2 0 0 0 1.79-1.12L16 17h3a2 2 0 0 0 2-2z"></path>
                </svg>
                <span className="hidden xs:inline">Imaging</span>
              </Link>
              <Link to="/workspace">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3">
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <main className="container mx-auto px-2 xs:px-3 sm:px-4 py-2 md:py-8 max-w-6xl">
          {/* Hero Section */}
          <div className="text-center mb-12 md:mb-16">
            <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 md:mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight">
              Transform Ideas into Perfect Prompts
            </h1>
            <p className="text-lg xs:text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed px-2 xs:px-4 mb-8">
              Use advanced prompt frameworks and AI models via OpenRouter to turn your casual thoughts and voice notes into 
              structured, optimized prompts that get better AI results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/workspace">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg">
                  Start Creating Prompts
                  <Sparkles className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Badge variant="secondary" className="text-sm px-4 py-2">
                Powered by OpenRouter AI
              </Badge>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16">
            <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20 rounded-xl">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mb-4">
                <Mic className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Voice to Prompt</h3>
              <p className="text-gray-300">
                Speak your ideas naturally and watch them transform into structured, optimized prompts automatically.
              </p>
            </Card>

            <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20 rounded-xl">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">AI Frameworks</h3>
              <p className="text-gray-300">
                Choose from proven prompt frameworks like CLEAR, STAR, and others to structure your requests perfectly.
              </p>
            </Card>

            <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20 rounded-xl">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-orange-500 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Multiple AI Models</h3>
              <p className="text-gray-300">
                Access Claude, GPT-4, Gemini and other leading AI models through OpenRouter integration.
              </p>
            </Card>

            <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20 rounded-xl">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center mb-4">
                <History className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Prompt History</h3>
              <p className="text-gray-300">
                Keep track of all your prompts and transformations. Never lose a great prompt idea again.
              </p>
            </Card>

            <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20 rounded-xl">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mb-4">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Custom Instructions</h3>
              <p className="text-gray-300">
                Set up personalized system instructions to tailor AI responses to your specific needs and style.
              </p>
            </Card>

            <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20 rounded-xl">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center mb-4">
                <Code className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Vibe Coding</h3>
              <p className="text-gray-300">
                Create quick, single-line prompts for rapid coding sessions and creative bursts.
              </p>
            </Card>
          </div>

          {/* How It Works */}
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl xs:text-3xl md:text-4xl font-bold text-white mb-8">
              How It Works
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">1. Input Your Idea</h3>
                <p className="text-gray-300">
                  Type or speak your casual thoughts, ideas, or requests in natural language.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Wand2 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">2. Choose Framework</h3>
                <p className="text-gray-300">
                  Select a prompt framework and AI model that best fits your use case.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">3. Get Perfect Prompts</h3>
                <p className="text-gray-300">
                  Receive optimized, structured prompts that get better results from AI models.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <Card className="p-8 md:p-12 bg-gradient-to-r from-purple-800/50 to-blue-800/50 backdrop-blur-lg border-white/20 rounded-2xl">
              <h2 className="text-2xl xs:text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Transform Your Ideas?
              </h2>
              <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
                Join thousands of users who are getting better AI results with optimized prompts.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/workspace">
                  <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg">
                    Start Your Journey
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link to="/payment">
                  <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8 py-4 text-lg">
                    Upgrade to Premium
                    <CreditCard className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
