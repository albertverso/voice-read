import { useState, useEffect, useCallback, useRef } from 'react';

interface SpeechOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  voice?: SpeechSynthesisVoice | null;
}

export interface UseSpeechReturn {
  speak: (text: string) => void;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  isSpeaking: boolean;
  isPaused: boolean;
  isSupported: boolean;
  voices: SpeechSynthesisVoice[];
  setOptions: (options: SpeechOptions) => void;
  currentOptions: SpeechOptions;
  currentTime: number;
  totalTime: number;
}

const defaultOptions: Required<SpeechOptions> = {
  rate: 1,
  pitch: 1,
  volume: 1,
  voice: null,
};

export function useSpeech(): UseSpeechReturn {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [options, setOptions] = useState<Required<SpeechOptions>>(defaultOptions);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const textRef = useRef('');
  const timerRef = useRef<number | null>(null);

  // Check if speech synthesis is supported
  useEffect(() => {
    const isSpeechSupported = 'speechSynthesis' in window;
    setIsSupported(isSpeechSupported);

    if (isSpeechSupported) {
      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        if (availableVoices.length > 0) {
          setVoices(availableVoices);
          setOptions(prev => ({
            ...prev,
            voice: availableVoices.find(voice => voice.default) || availableVoices[0]
          }));
        }
      };

      loadVoices();
      
      // Chrome loads voices asynchronously
      window.speechSynthesis.onvoiceschanged = loadVoices;
      
      return () => {
        window.speechSynthesis.onvoiceschanged = null;
      };
    }
  }, []);

  // Timer for tracking speech progress
  useEffect(() => {
    if (isSpeaking && !isPaused) {
      timerRef.current = window.setInterval(() => {
        setCurrentTime(prev => {
          if (prev < totalTime) return prev + 0.1;
          return prev;
        });
      }, 100);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isSpeaking, isPaused, totalTime]);

  const updateOptions = useCallback((newOptions: SpeechOptions) => {
    setOptions(prev => ({ ...prev, ...newOptions }));
  }, []);

  const speak = useCallback((text: string) => {
    if (!isSupported || !text.trim()) return;

    // Stop any current speech
    stop();
    
    textRef.current = text;
    utteranceRef.current = new SpeechSynthesisUtterance(text);
    
    // Apply speech options
    utteranceRef.current.rate = options.rate;
    utteranceRef.current.pitch = options.pitch;
    utteranceRef.current.volume = options.volume;
    if (options.voice) {
      utteranceRef.current.voice = options.voice;
    }

    // Estimate total time (very rough estimation)
    const wordCount = text.split(/\s+/).length;
    const avgWordsPerMinute = 150 * options.rate;
    const estimatedTimeSeconds = (wordCount / avgWordsPerMinute) * 60;
    setTotalTime(estimatedTimeSeconds);
    setCurrentTime(0);

    // Event handlers
    utteranceRef.current.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };

    utteranceRef.current.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      setCurrentTime(0);
    };

    utteranceRef.current.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utteranceRef.current);
  }, [isSupported, options]);

  const stop = useCallback(() => {
    if (!isSupported) return;
    
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
    setCurrentTime(0);
  }, [isSupported]);

  const pause = useCallback(() => {
    if (!isSupported || !isSpeaking || isPaused) return;
    
    window.speechSynthesis.pause();
    setIsPaused(true);
  }, [isSupported, isSpeaking, isPaused]);

  const resume = useCallback(() => {
    if (!isSupported || !isSpeaking || !isPaused) return;
    
    window.speechSynthesis.resume();
    setIsPaused(false);
  }, [isSupported, isSpeaking, isPaused]);

  return {
    speak,
    stop,
    pause,
    resume,
    isSpeaking,
    isPaused,
    isSupported,
    voices,
    setOptions: updateOptions,
    currentOptions: options,
    currentTime,
    totalTime
  };
}