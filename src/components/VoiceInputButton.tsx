import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

interface VoiceInputButtonProps {
  onTranscript: (text: string) => void;
  className?: string;
  size?: "sm" | "default" | "lg";
}

export function VoiceInputButton({ onTranscript, className = "", size = "default" }: VoiceInputButtonProps) {
  const { toast } = useToast();

  const { isListening, isSupported, toggleListening, transcript } = useSpeechRecognition({
    onResult: (finalTranscript) => {
      onTranscript(finalTranscript);
    },
    onError: (error) => {
      toast({
        title: "Voice input error",
        description: error === "not-allowed" 
          ? "Please allow microphone access to use voice input" 
          : `Error: ${error}`,
        variant: "destructive",
      });
    },
  });

  if (!isSupported) {
    return null;
  }

  const sizeClasses = {
    sm: "h-6 w-6",
    default: "h-8 w-8",
    lg: "h-10 w-10",
  };

  const iconSizes = {
    sm: "h-3 w-3",
    default: "h-4 w-4",
    lg: "h-5 w-5",
  };

  return (
    <Button
      type="button"
      variant={isListening ? "destructive" : "ghost"}
      size="icon"
      className={`rounded-full transition-all ${sizeClasses[size]} ${
        isListening ? "animate-pulse" : "hover:bg-primary/10"
      } ${className}`}
      onClick={toggleListening}
      title={isListening ? "Stop recording" : "Start voice input"}
    >
      {isListening ? (
        <MicOff className={iconSizes[size]} />
      ) : (
        <Mic className={iconSizes[size]} />
      )}
    </Button>
  );
}

export function VoiceInputIndicator({ isListening }: { isListening: boolean }) {
  if (!isListening) return null;
  
  return (
    <p className="text-xs text-muted-foreground animate-pulse flex items-center gap-2">
      <span className="w-2 h-2 bg-destructive rounded-full" />
      Listening... Speak now
    </p>
  );
}
