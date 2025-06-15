
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Pause, Play } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TextToSpeechProps {
  text: string;
  className?: string;
}

const TextToSpeech = ({ text, className = "" }: TextToSpeechProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  const { toast } = useToast();

  const handleSpeak = () => {
    if (!text.trim()) {
      toast({
        title: "No text to speak",
        description: "Please provide some text first.",
        variant: "destructive",
      });
      return;
    }

    if ('speechSynthesis' in window) {
      if (isPaused) {
        speechSynthesis.resume();
        setIsPaused(false);
        setIsPlaying(true);
        return;
      }

      if (isPlaying) {
        speechSynthesis.pause();
        setIsPaused(true);
        setIsPlaying(false);
        return;
      }

      const newUtterance = new SpeechSynthesisUtterance(text);
      
      newUtterance.onstart = () => {
        setIsPlaying(true);
        setIsPaused(false);
      };

      newUtterance.onend = () => {
        setIsPlaying(false);
        setIsPaused(false);
        setUtterance(null);
      };

      newUtterance.onerror = () => {
        setIsPlaying(false);
        setIsPaused(false);
        setUtterance(null);
        toast({
          title: "Speech Error",
          description: "There was an error with text-to-speech.",
          variant: "destructive",
        });
      };

      // Configure voice settings
      newUtterance.rate = 0.9;
      newUtterance.pitch = 1;
      newUtterance.volume = 0.8;

      setUtterance(newUtterance);
      speechSynthesis.speak(newUtterance);
    } else {
      toast({
        title: "Not supported",
        description: "Text-to-speech is not supported in your browser.",
        variant: "destructive",
      });
    }
  };

  const handleStop = () => {
    if (speechSynthesis.speaking || speechSynthesis.paused) {
      speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
      setUtterance(null);
    }
  };

  if (!text.trim()) return null;

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Button
        onClick={handleSpeak}
        variant="ghost"
        size="sm"
        className="text-gray-400 hover:text-white"
        title={isPaused ? "Resume" : isPlaying ? "Pause" : "Play"}
      >
        {isPaused ? (
          <Play className="w-4 h-4" />
        ) : isPlaying ? (
          <Pause className="w-4 h-4" />
        ) : (
          <Volume2 className="w-4 h-4" />
        )}
      </Button>
      
      {(isPlaying || isPaused) && (
        <Button
          onClick={handleStop}
          variant="ghost"
          size="sm"
          className="text-gray-400 hover:text-red-400"
          title="Stop"
        >
          <VolumeX className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};

export default TextToSpeech;
