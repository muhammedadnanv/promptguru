
import { useState, useRef, useEffect } from "react";
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
  const [isSupported, setIsSupported] = useState(true);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check if speech synthesis is supported
    if (!('speechSynthesis' in window)) {
      setIsSupported(false);
    }

    // Cleanup on unmount
    return () => {
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    // Stop current speech when text changes
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
    }
  }, [text]);

  const handleSpeak = () => {
    if (!isSupported) {
      toast({
        title: "Not supported",
        description: "Text-to-speech is not supported in your browser.",
        variant: "destructive",
      });
      return;
    }

    if (!text.trim()) {
      toast({
        title: "No text to speak",
        description: "Please provide some text first.",
        variant: "destructive",
      });
      return;
    }

    // Handle resume from pause
    if (isPaused && speechSynthesis.paused) {
      speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    // Handle pause
    if (isPlaying && speechSynthesis.speaking && !speechSynthesis.paused) {
      speechSynthesis.pause();
      setIsPaused(true);
      setIsPlaying(false);
      return;
    }

    // Start new speech
    if (!speechSynthesis.speaking) {
      const newUtterance = new SpeechSynthesisUtterance(text);
      utteranceRef.current = newUtterance;
      
      // Configure voice settings
      newUtterance.rate = 0.9;
      newUtterance.pitch = 1;
      newUtterance.volume = 0.8;
      
      // Set a preferred voice if available
      const voices = speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.lang.startsWith('en') && voice.name.includes('Google')
      ) || voices.find(voice => voice.lang.startsWith('en'));
      
      if (preferredVoice) {
        newUtterance.voice = preferredVoice;
      }

      newUtterance.onstart = () => {
        console.log('Speech started');
        setIsPlaying(true);
        setIsPaused(false);
      };

      newUtterance.onend = () => {
        console.log('Speech ended');
        setIsPlaying(false);
        setIsPaused(false);
        utteranceRef.current = null;
      };

      newUtterance.onerror = (event) => {
        console.error('Speech error:', event.error);
        setIsPlaying(false);
        setIsPaused(false);
        utteranceRef.current = null;
        
        toast({
          title: "Speech Error",
          description: `Error: ${event.error}. Please try again.`,
          variant: "destructive",
        });
      };

      newUtterance.onpause = () => {
        console.log('Speech paused');
        setIsPaused(true);
        setIsPlaying(false);
      };

      newUtterance.onresume = () => {
        console.log('Speech resumed');
        setIsPaused(false);
        setIsPlaying(true);
      };

      try {
        speechSynthesis.speak(newUtterance);
      } catch (error) {
        console.error('Speech synthesis error:', error);
        toast({
          title: "Speech Error",
          description: "Could not start text-to-speech. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleStop = () => {
    if (speechSynthesis.speaking || speechSynthesis.paused) {
      speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
      utteranceRef.current = null;
    }
  };

  if (!isSupported || !text.trim()) {
    return null;
  }

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
