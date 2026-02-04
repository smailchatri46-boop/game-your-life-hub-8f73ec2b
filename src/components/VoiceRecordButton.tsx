import { useState, useRef, useCallback } from "react";
import { Mic, Square, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface VoiceRecordButtonProps {
  onTranscription: (text: string) => void;
  className?: string;
  disabled?: boolean;
}

export function VoiceRecordButton({ onTranscription, className, disabled }: VoiceRecordButtonProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const startTimeRef = useRef<number>(0);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        }
      });

      // Use webm format which is widely supported
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') 
        ? 'audio/webm;codecs=opus' 
        : 'audio/webm';
        
      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      startTimeRef.current = Date.now();

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach(track => track.stop());
        
        if (audioChunksRef.current.length === 0) {
          toast.error("No audio recorded");
          return;
        }

        // Calculate recording duration
        const durationSeconds = Math.ceil((Date.now() - startTimeRef.current) / 1000);

        setIsProcessing(true);
        
        try {
          // Combine chunks and convert to base64
          const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
          const arrayBuffer = await audioBlob.arrayBuffer();
          const base64Audio = btoa(
            new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
          );

          // Call edge function for transcription with duration for usage tracking
          const { data, error } = await supabase.functions.invoke('voice-transcribe', {
            body: { audioBase64: base64Audio, durationSeconds }
          });

          if (error) {
            console.error('Transcription error:', error);
            if (error.message?.includes('limit')) {
              toast.error(error.message);
            } else {
              toast.error("Failed to transcribe audio");
            }
            return;
          }

          if (data?.error) {
            toast.error(data.error);
            return;
          }

          if (data?.text) {
            onTranscription(data.text);
            toast.success("Voice transcribed!");
          } else {
            toast.error("Could not transcribe audio. Try speaking more clearly.");
          }
        } catch (err) {
          console.error('Processing error:', err);
          toast.error("Failed to process audio");
        } finally {
          setIsProcessing(false);
        }
      };

      mediaRecorder.start(1000); // Collect chunks every second
      setIsRecording(true);
    } catch (err) {
      console.error('Microphone access error:', err);
      toast.error("Could not access microphone. Please check permissions.");
    }
  }, [onTranscription]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  const handleClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={handleClick}
      disabled={disabled || isProcessing}
      className={cn(
        "h-9 w-9 rounded-full transition-all text-muted-foreground hover:text-foreground hover:bg-secondary/50",
        isRecording && "bg-secondary text-foreground",
        className
      )}
      title={isRecording ? "Stop recording" : "Record voice"}
    >
      {isProcessing ? (
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      ) : isRecording ? (
        <Square className="h-4 w-4" />
      ) : (
        <Mic className="h-4 w-4" />
      )}
    </Button>
  );
}
