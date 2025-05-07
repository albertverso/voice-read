import React, { useEffect, useState } from 'react';
import { Button } from './ui/Button';
import { Play, Pause, StopCircle, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { useSpeech } from '../hooks/useSpeech';
import { formatTime } from '../lib/utils';

interface PlayerProps {
  text: string;
}

export const Player: React.FC<PlayerProps> = ({ text }) => {
  const { 
    speak, 
    stop, 
    pause, 
    resume, 
    isSpeaking, 
    isPaused, 
    isSupported,
    voices,
    setOptions,
    currentOptions,
    currentTime,
    totalTime
  } = useSpeech();
  
  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(1);

  useEffect(() => {
    // Reset the player state when text changes
    if (isSpeaking) {
      stop();
    }
  }, [text, stop, isSpeaking]);

  const handlePlay = () => {
    if (isPaused) {
      resume();
    } else {
      speak(text);
    }
  };

  const handleMuteToggle = () => {
    if (isMuted) {
      setOptions({ volume: previousVolume });
      setIsMuted(false);
    } else {
      setPreviousVolume(currentOptions.volume);
      setOptions({ volume: 0 });
      setIsMuted(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setOptions({ volume: newVolume });
    if (newVolume === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOptions({ rate: parseFloat(e.target.value) });
  };

  const handleVoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedVoice = voices.find(voice => voice.name === e.target.value) || null;
    setOptions({ voice: selectedVoice });
  };

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      {!isSupported ? (
        <div className="text-red-500 dark:text-red-400 p-4 text-center">
          <p>Text-to-speech is not supported in your browser.</p>
          <p className="text-sm mt-2">Try using a modern browser like Chrome, Safari, or Edge.</p>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            {/* Progress bar */}
            <div>
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(totalTime)}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-primary h-full transition-all duration-300 ease-in-out"
                  style={{ width: `${totalTime ? (currentTime / totalTime) * 100 : 0}%` }}
                />
              </div>
            </div>
            
            {/* Control buttons */}
            <div className="flex justify-center items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  // Would skip back 10 seconds in a real implementation
                  stop();
                  handlePlay();
                }}
                aria-label="Skip back"
              >
                <SkipBack className="h-5 w-5" />
              </Button>
              
              <Button
                variant="primary"
                size="icon"
                onClick={handlePlay}
                disabled={!text.trim()}
                aria-label={isPaused ? "Resume" : "Play"}
                className="h-12 w-12 rounded-full"
              >
                {isPaused ? (
                  <Play className="h-6 w-6" />
                ) : isSpeaking ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6" />
                )}
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={stop}
                disabled={!isSpeaking}
                aria-label="Stop"
              >
                <StopCircle className="h-5 w-5" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  // Would skip forward 10 seconds in a real implementation
                }}
                aria-label="Skip forward"
              >
                <SkipForward className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Volume control */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleMuteToggle}
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </Button>
              
              <div className="flex-grow">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={currentOptions.volume}
                  onChange={handleVolumeChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  aria-label="Volume"
                />
              </div>
            </div>
          </div>
          
          {/* Advanced options */}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-medium mb-3">Voice Settings</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="voice-select" className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                  Voice
                </label>
                <select
                  id="voice-select"
                  onChange={handleVoiceChange}
                  value={currentOptions.voice?.name || ''}
                  className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800"
                >
                  {voices.map(voice => (
                    <option key={voice.name} value={voice.name}>
                      {voice.name} ({voice.lang})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                  Speed: {currentOptions.rate.toFixed(1)}x
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={currentOptions.rate}
                  onChange={handleRateChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};