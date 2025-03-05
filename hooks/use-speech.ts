"use client";

    import { useState, useRef, useCallback } from 'react';

    interface UseSpeechOptions {
      onStart?: () => void;
      onEnd?: () => void;
      onError?: (error: any) => void;
    }

    export function useSpeech(options: UseSpeechOptions = {}) {
      const { onStart, onEnd, onError } = options;
      const [isPlaying, setIsPlaying] = useState(false);
      const synthRef = useRef<SpeechSynthesisUtterance | null>(null);

      const speak = useCallback((text: string) => {
        if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
          console.error('Speech synthesis is not supported in this browser.');
          return;
        }

        if (synthRef.current) {
          window.speechSynthesis.cancel();
          synthRef.current = null;
        }

        const utterance = new SpeechSynthesisUtterance(text);
        synthRef.current = utterance;

        utterance.onstart = () => {
          setIsPlaying(true);
          onStart?.();
        };

        utterance.onend = () => {
          setIsPlaying(false);
          onEnd?.();
        };

        utterance.onerror = (event) => {
          setIsPlaying(false);
          onError?.(event.error);
        };

        window.speechSynthesis.speak(utterance);
      }, [onStart, onEnd, onError]);

      const stop = useCallback(() => {
        if (synthRef.current) {
          window.speechSynthesis.cancel();
          synthRef.current = null;
          setIsPlaying(false);
        }
      }, []);

      return {
        speak,
        stop,
        isPlaying,
      };
    }
