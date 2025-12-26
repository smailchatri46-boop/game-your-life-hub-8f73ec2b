import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { Mic, MicOff } from "lucide-react";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { useToast } from "@/hooks/use-toast";

interface DailyReflectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date: string; // formatted date string
  dateKey: string; // YYYY-MM-DD
  completionPercent: number;
  existingReflection?: string;
  onSave: (dateKey: string, text: string) => void;
}

const PLACEHOLDER_PROMPTS = [
  "Why did today go well?",
  "What made today difficult?",
  "What did you learn today?",
  "What are you grateful for today?",
  "What would you do differently?",
];

export function DailyReflectionModal({
  open,
  onOpenChange,
  date,
  dateKey,
  completionPercent,
  existingReflection,
  onSave,
}: DailyReflectionModalProps) {
  const [text, setText] = useState(existingReflection || "");
  const [placeholderIndex] = useState(() => Math.floor(Math.random() * PLACEHOLDER_PROMPTS.length));
  const { toast } = useToast();

  const { isListening, isSupported, toggleListening } = useSpeechRecognition({
    onResult: (transcript) => {
      setText((prev) => prev + (prev ? " " : "") + transcript);
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

  useEffect(() => {
    if (open) {
      setText(existingReflection || "");
    }
  }, [open, existingReflection]);

  const handleSave = () => {
    onSave(dateKey, text);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Daily Reflection</DialogTitle>
          <div className="flex items-center gap-3 pt-2">
            <span className="text-sm text-muted-foreground">{date}</span>
            {completionPercent >= 0 && (
              <span className="text-sm font-medium">
                <span className="gradient-text">{completionPercent}%</span>
                <span className="text-muted-foreground ml-1">completed</span>
              </span>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          <div className="relative">
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={PLACEHOLDER_PROMPTS[placeholderIndex]}
              className="min-h-[150px] resize-none pr-12"
            />
            {isSupported && (
              <Button
                type="button"
                variant={isListening ? "destructive" : "ghost"}
                size="icon"
                className={`absolute bottom-2 right-2 h-8 w-8 rounded-full transition-all ${
                  isListening ? "animate-pulse bg-destructive" : "hover:bg-primary/10"
                }`}
                onClick={toggleListening}
                title={isListening ? "Stop recording" : "Start voice input"}
              >
                {isListening ? (
                  <MicOff className="h-4 w-4" />
                ) : (
                  <Mic className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>

          {isListening && (
            <p className="text-xs text-muted-foreground animate-pulse flex items-center gap-2">
              <span className="w-2 h-2 bg-destructive rounded-full" />
              Listening... Speak now
            </p>
          )}

          {!isSupported && (
            <p className="text-xs text-muted-foreground">
              Voice input not supported in this browser. Try Chrome or Edge.
            </p>
          )}

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button variant="gradient" onClick={handleSave}>
              Save Reflection
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
