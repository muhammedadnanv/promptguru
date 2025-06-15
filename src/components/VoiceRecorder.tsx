
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
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        setIsProcessing(true);
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
        
        // Simulate transcription (in real app, you'd use speech-to-text API)
        setTimeout(() => {
          const mockTranscript = "I want to create content about sustainable gardening that's engaging for beginners and includes practical tips they can implement immediately.";
          onTranscript(mockTranscript);
          setIsProcessing(false);
          toast({
            title: "Voice recorded!",
            description: "Your voice note has been transcribed.",
          });
        }, 2000);
        
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      
      toast({
        title: "Recording started",
        description: "Speak your idea clearly...",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

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
