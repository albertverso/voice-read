import React from "react";
import { LucideCircleDashed, X } from "lucide-react";
import { CustomAudioPlayer } from "./CustomAudioPlayer";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  audioUrl?: string;
};

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, audioUrl }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-xl p-6 relative">
        {/* Botão de fechar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
        >
          <X />
        </button>


        {audioUrl ? (
            <div className="flex flex-col items-center justify-center">
                <h2 className="text-xl font-bold mb-4">Áudio</h2>
                <div className="w-full">
                    <CustomAudioPlayer audioUrl={audioUrl || ""} autoPlay={true} />
                </div>
            </div>
        ) : (
            <div className='flex flex-col items-center justify-center'>
                <LucideCircleDashed size={40} className="animate-spin w-full mb-4" /> 
                <p >
                    Carregando por favor aguarde! Na 1º execução pode demorar um pouco...
                </p> 
            </div>
        )}
      </div>
    </div>
  );
};
