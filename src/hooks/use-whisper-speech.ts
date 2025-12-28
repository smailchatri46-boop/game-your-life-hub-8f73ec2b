import { useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface UseWhisperSpeechOptions {
  onResult?: (transcript: string) => void;
  onError?: (error: string) => void;
  onLimitReached?: (message: string) => void;
}

export function useWhisperSpeech(options: UseWhisperSpeechOptions = {}) {
  const { onResult, onError, onLimitReached } = options;
  const { user } = useAuth();
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startListening = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Find supported mime type
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') 
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
          ? 'audio/webm'
          : MediaRecorder.isTypeSupported('audio/mp4')
            ? 'audio/mp4'
            : 'audio/ogg';

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        setIsProcessing(true);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());

        try {
          const audioBlob = new Blob(chunksRef.current, { type: mimeType });
          
          // Convert blob to base64
          const reader = new FileReader();
          const base64Promise = new Promise<string>((resolve, reject) => {
            reader.onloadend = () => {
              const base64 = (reader.result as string).split(',')[1];
              resolve(base64);
            };
            reader.onerror = reject;
          });
          reader.readAsDataURL(audioBlob);
          
          const base64Audio = await base64Promise;

          // Send to Whisper edge function
          const { data, error } = await supabase.functions.invoke('whisper-transcribe', {
            body: { 
              audio: base64Audio,
              mimeType: mimeType,
              userId: user?.id
            }
          });

          if (error) {
            throw new Error(error.message);
          }

          // Handle limit reached responses
          if (data?.error === 'daily_limit_reached' || data?.error === 'monthly_limit_reached' || data?.error === 'audio_too_long') {
            onLimitReached?.(data.message);
            return;
          }

          if (data?.text) {
            setTranscript(data.text);
            onResult?.(data.text);
          }
        } catch (error) {
          console.error('Whisper transcription error:', error);
          onError?.(error instanceof Error ? error.message : 'Transcription failed');
        } finally {
          setIsProcessing(false);
          setIsListening(false);
        }
      };

      mediaRecorder.start();
      setIsListening(true);
      setTranscript('');
    } catch (error) {
      console.error('Microphone access error:', error);
      onError?.('not-allowed');
      setIsListening(false);
    }
  }, [onResult, onError]);

  const stopListening = useCallback(() => {
    if (mediaRecorderRef.current && isListening) {
      mediaRecorderRef.current.stop();
    }
  }, [isListening]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  return {
    isListening,
    isProcessing,
    isSupported: typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getUserMedia,
    transcript,
    startListening,
    stopListening,
    toggleListening,
  };
}
