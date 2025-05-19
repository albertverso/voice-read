import { LucideGauge } from 'lucide-react';
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

  // const handleSpeedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   const speed = parseFloat(e.target.value);
  //   const audio = playerRef.current?.audio.current;
  //   if (audio) audio.playbackRate = speed;
  // };
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

  return (
    <div className="flex relative flex-col rounded-md border border-gray-200 dark:border-[#fff] bg-[#fff] py-5">
      <AudioPlayer
        ref={playerRef}
        src={audioUrl}
        autoPlay={autoPlay}
        showJumpControls={true}
        onPlay={() => playerRef.current?.container.current?.focus()}
        // Mantém os controles padrão
        layout="stacked"
        style={{ border: 'none', borderRadius: '10px', boxShadow: 'none',  }}
      />
       {/* Ícone + Dropdown */}
      <div className="absolute bottom-[30px] xl:left-20 lg:left-[52px] md:left-32 sm:left-20 left-16 ">
        <div className="">
          <button
            onClick={() => setShowSpeedOptions((prev) => !prev)}
            className="text-[#868686] font-bold hover:opacity-80"
          >
            <LucideGauge size={28} />
          </button>

          {showSpeedOptions && (
            <div className="absolute mt-3 -left-5 z-50 bg-white text-[#868686]  shadow-md">
              {["0.75", "1", "1.25", "1.5", "2"].map((speed) => (
                <div
                  key={speed}
                  onClick={() => handleSpeedChange(parseFloat(speed))}
                  className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                    playbackRate === parseFloat(speed) ? "font-bold text-blue-600" : ""
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
