import React, { useRef } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

interface CustomAudioPlayerProps {
  audioUrl: string;
}

export const CustomAudioPlayer: React.FC<CustomAudioPlayerProps> = ({ audioUrl }) => {
  const playerRef = useRef<AudioPlayer | null>(null);

  const handleSpeedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const speed = parseFloat(e.target.value);
    const audio = playerRef.current?.audio.current;
    if (audio) audio.playbackRate = speed;
  };

  return (
    <div className="flex flex-col items-center justify-center rounded-md border-2 border-[#fff] bg-[#fff]">
      <AudioPlayer
        ref={playerRef}
        src={audioUrl}
        autoPlay={true}
        showJumpControls={true}
        onPlay={() => playerRef.current?.container.current?.focus()}
        // Mantém os controles padrão
        layout="stacked"
        style={{ border: 'none', borderRadius: '10px', boxShadow: 'none',  }}
      />
      <div className="flex flex-row items-center justify-center gap-2 text-sm  text-[#868686] font-bold pb-2 ">
        <label htmlFor="speed">Velocidade:</label>
        <select
          id="speed"
          onChange={handleSpeedChange}
          className="border rounded px-2 py-1 outline-none focus:outline-none"
        >
          <option value="0.75">0.75x</option>
          <option value="1" selected>1x</option>
          <option value="1.25">1.25x</option>
          <option value="1.5">1.5x</option>
          <option value="2">2x</option>
        </select>
      </div>
    </div>
  );
};
