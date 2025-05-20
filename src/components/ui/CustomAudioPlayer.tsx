import { LucideDownload, LucideGauge } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

interface CustomAudioPlayerProps {
  audioUrl: string;
  autoPlay?: boolean;
}

export const CustomAudioPlayer: React.FC<CustomAudioPlayerProps> = ({ audioUrl, autoPlay= false }) => {
  const playerRef = useRef<AudioPlayer | null>(null);
   const [showSpeedOptions, setShowSpeedOptions] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);

 // Atualiza o playbackRate quando mudar e quando o player estiver disponível
  useEffect(() => {
    const audioElement = playerRef.current?.audio?.current;
    if (audioElement) {
      audioElement.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  const handleSpeedChange = (rate: number) => {
    setPlaybackRate(rate);
    setShowSpeedOptions(false);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = 'audio.mp3'; // nome sugerido para o arquivo
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex relative flex-col rounded-md border border-gray-300 dark:border-[#fff] bg-[#fff] py-1">
      <AudioPlayer
        ref={playerRef}
        src={audioUrl}
        autoPlay={autoPlay}
        showJumpControls={true}
        onPlay={() => playerRef.current?.container.current?.focus()}
        // Mantém os controles padrão
        layout="stacked"
        style={{ border: "none", borderRadius: "10px", boxShadow: "none" }}
      />
      {/* Ícone + Dropdown */}
      <div className="flex flex-row items-center justify-between text-sm  text-[#868686] font-bold px-10">
        <div>
          <button
            key="download"
            onClick={handleDownload}
            className="text-[#868686] font-bold hover:opacity-80"
          >
            <LucideDownload size={28} />
          </button>
        </div>
        <div className="">
          <button
            onClick={() => setShowSpeedOptions((prev) => !prev)}
            className="text-[#868686] font-bold hover:opacity-80"
          >
            <LucideGauge size={28} />
          </button>

          {showSpeedOptions && (
            <div className="absolute right-0 z-50 bg-white text-[#868686]  shadow-md">
              {["0.75", "1", "1.25", "1.5", "2"].map((speed) => (
                <div
                  key={speed}
                  onClick={() => handleSpeedChange(parseFloat(speed))}
                  className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                    playbackRate === parseFloat(speed)
                      ? "font-bold text-blue-600"
                      : ""
                  }`}
                >
                  {speed}x
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
