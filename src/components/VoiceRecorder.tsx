
import { useState, useRef } from "react";
import { Mic, MicOff, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface VoiceRecorderProps {
  onTranscript: (text: string) => void;
}

const VoiceRecorder = ({ onTranscript }: VoiceRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { toast } = useToast();

  const startRecording = async () => {
    // Check for speech recognition support
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognitionAPI) {
      setIsSupported(false);
      toast({
        title: "Not supported",
        description: "Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const recognition = new SpeechRecognitionAPI();
      recognitionRef.current = recognition;
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      
      let finalTranscript = '';
      
      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }
        
        console.log('Speech recognition result:', finalTranscript + interimTranscript);
      };
      
      recognition.onstart = () => {
        setIsRecording(true);
        setIsProcessing(false);
        toast({
          title: "Recording started",
          description: "Speak your idea clearly. Click the red button to stop.",
        });
      };
      
      recognition.onend = () => {
        setIsRecording(false);
        setIsProcessing(true);
        
        setTimeout(() => {
          if (finalTranscript.trim()) {
            onTranscript(finalTranscript.trim());
            toast({
              title: "Voice recorded!",
              description: "Your voice note has been transcribed successfully.",
            });
          } else {
            toast({
              title: "No speech detected",
              description: "Please try speaking more clearly or check your microphone.",
              variant: "destructive",
            });
          }
          setIsProcessing(false);
        }, 500);
      };
      
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
        setIsProcessing(false);
        
        let errorMessage = "Speech recognition error occurred.";
        switch (event.error) {
          case 'no-speech':
            errorMessage = "No speech was detected. Please try again.";
            break;
          case 'audio-capture':
            errorMessage = "Microphone is not accessible. Please check permissions.";
            break;
          case 'not-allowed':
            errorMessage = "Microphone permission denied. Please allow microphone access.";
            break;
          case 'network':
            errorMessage = "Network error occurred. Please check your connection.";
            break;
        }
        
        toast({
          title: "Recording Error",
          description: errorMessage,
          variant: "destructive",
        });
      };
      
      recognition.start();
    } catch (error) {
      console.error('Microphone access error:', error);
      toast({
        title: "Microphone Access Error",
        description: "Could not access microphone. Please check permissions and try again.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
    }
  };

  if (!isSupported) {
    return (
      <div className="text-center">
        <div className="w-20 h-20 rounded-full bg-gray-500 flex items-center justify-center mx-auto mb-4">
          <MicOff className="w-8 h-8 text-white" />
        </div>
        <p className="text-sm text-gray-400">
          Speech recognition not supported in this browser
        </p>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="mb-4">
        {!isRecording && !isProcessing && (
          <Button
            onClick={startRecording}
            className="w-20 h-20 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Mic className="w-8 h-8 text-white" />
          </Button>
        )}
        
        {isRecording && (
          <Button
            onClick={stopRecording}
            className="w-20 h-20 rounded-full bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 shadow-lg animate-pulse"
          >
            <Square className="w-8 h-8 text-white" />
          </Button>
        )}
        
        {isProcessing && (
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center animate-spin">
            <MicOff className="w-8 h-8 text-white" />
          </div>
        )}
      </div>
      
      <p className="text-sm text-gray-300">
        {isRecording && "Recording... Click to stop"}
        {isProcessing && "Processing your voice..."}
        {!isRecording && !isProcessing && "Click to record your idea"}
      </p>
    </div>
  );
};

export default VoiceRecorder;
