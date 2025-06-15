
import React, { useState } from 'react';
import { MessageCircle, X, ExternalLink, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const WhatsAppWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  // WhatsApp AI service link
  const whatsappAILink = "https://wa.me/ais/1797534074533445?s=5";
  
  const handleWhatsAppClick = () => {
    window.open(whatsappAILink, '_blank');
  };

  return (
    <>
      {/* Floating WhatsApp Button */}
      <div className="fixed bottom-4 right-4 z-50 md:bottom-6 md:right-6">
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 md:h-16 md:w-16 rounded-full bg-green-500 hover:bg-green-600 shadow-xl hover:shadow-2xl transition-all duration-300 group active:scale-95"
          size="icon"
        >
          <MessageCircle className="h-6 w-6 md:h-7 md:w-7 text-white group-hover:scale-110 transition-transform" />
        </Button>
        
        {/* AI Badge */}
        <Badge className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 min-w-6 h-6 rounded-full flex items-center justify-center font-semibold shadow-lg">
          <Bot className="h-3 w-3 mr-1" />
          AI
        </Badge>
      </div>

      {/* WhatsApp Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <Card className="bg-white/95 backdrop-blur-lg border-white/20 w-full sm:max-w-md sm:mx-4 sm:rounded-lg rounded-t-2xl sm:rounded-b-lg relative animate-in slide-in-from-bottom-full sm:fade-in duration-300">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 h-8 w-8 z-10 bg-white/80 hover:bg-white/90 rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>

            <div className="p-6 pb-8 sm:pb-6 space-y-6">
              {/* Header */}
              <div className="text-center space-y-3">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <Bot className="h-10 w-10 text-white" />
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    AI Prompt Assistant
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed px-2">
                    Get instant AI-powered prompt optimization directly on WhatsApp! 
                    Chat with our AI assistant to transform your ideas into perfect prompts.
                  </p>
                </div>
              </div>

              {/* Features */}
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-xl border border-gray-100">
                <h4 className="font-semibold text-gray-900 text-sm mb-3 flex items-center">
                  <Bot className="h-4 w-4 mr-2 text-blue-500" />
                  AI Features:
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                  <div className="flex items-center space-x-1">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span>Real-time optimization</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span>Voice message support</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span>Multiple AI frameworks</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span>24/7 availability</span>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <div className="space-y-3">
                <Button
                  onClick={handleWhatsAppClick}
                  className="w-full h-12 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95"
                >
                  <MessageCircle className="h-5 w-5 mr-3" />
                  Start AI Chat on WhatsApp
                  <ExternalLink className="h-4 w-4 ml-3" />
                </Button>

                <p className="text-xs text-gray-500 text-center px-4">
                  You'll be redirected to WhatsApp to start chatting with our AI assistant. 
                  No phone number required - it's an AI service.
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
};

export default WhatsAppWidget;
