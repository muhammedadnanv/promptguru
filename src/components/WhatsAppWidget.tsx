
import React, { useState } from 'react';
import { MessageCircle, X, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const WhatsAppWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  // WhatsApp number for the AI Agent (you can replace this with your actual WhatsApp Business number)
  const whatsappNumber = "+1234567890";
  const whatsappMessage = "Hi! I'd like to use the AI Agent for prompt optimization.";
  
  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappUrl = `https://wa.me/${whatsappNumber.replace('+', '')}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <>
      {/* Floating WhatsApp Button */}
      <div className="fixed bottom-4 right-4 z-50 md:bottom-6 md:right-6">
        <Button
          onClick={() => setIsOpen(true)}
          className="h-12 w-12 md:h-14 md:w-14 rounded-full bg-green-500 hover:bg-green-600 shadow-lg hover:shadow-xl transition-all duration-300 group"
          size="icon"
        >
          <MessageCircle className="h-5 w-5 md:h-6 md:w-6 text-white group-hover:scale-110 transition-transform" />
        </Button>
        
        {/* Notification badge */}
        <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 min-w-5 h-5 rounded-full flex items-center justify-center">
          AI
        </Badge>
      </div>

      {/* WhatsApp Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="bg-white/95 backdrop-blur-lg border-white/20 p-6 max-w-md w-full mx-4 relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                <MessageCircle className="h-8 w-8 text-white" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900">
                WhatsApp AI Agent
              </h3>
              
              <p className="text-gray-600 text-sm leading-relaxed">
                Get instant AI-powered prompt optimization directly on WhatsApp! 
                Chat with our AI agent to transform your ideas into perfect prompts.
              </p>

              <div className="space-y-3">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h4 className="font-semibold text-gray-900 text-sm mb-2">Features:</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Real-time prompt optimization</li>
                    <li>• Voice message support</li>
                    <li>• Multiple AI frameworks</li>
                    <li>• Instant responses 24/7</li>
                  </ul>
                </div>

                <Button
                  onClick={handleWhatsAppClick}
                  className="w-full bg-green-500 hover:bg-green-600 text-white"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Start WhatsApp Chat
                  <ExternalLink className="h-3 w-3 ml-2" />
                </Button>

                <p className="text-xs text-gray-500">
                  You'll be redirected to WhatsApp to start chatting with our AI agent.
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
