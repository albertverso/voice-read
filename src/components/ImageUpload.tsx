import React, { useRef } from 'react';
import { Upload, AlertTriangle } from 'lucide-react';

interface FileUploadProps {
  isLoading: boolean;
  error?: string | null;
  onImageSelected: (file: File) => void;
  click?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const ImageUpload: React.FC<FileUploadProps> = ({
  isLoading,
  error,
  onImageSelected,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageSelected(file);
    }
  };

  return (
    <div className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800">
      <h3 className="text-lg font-medium mb-4">Carregar imagem</h3>
        <>
          <div
            className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center cursor-pointer hover:border-primary dark:hover:border-primary transition-colors"
            onClick={triggerFileInput}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && triggerFileInput()}
            tabIndex={0}
            role="button"
            aria-label="Upload Imagem"
          >
            <div className="flex flex-col items-center">
              <Upload size={40} className="mb-3 text-gray-500 dark:text-gray-400" />
              <p className="text-base mb-1">Arraste e solte ou clique para selecionar</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Suporta imagens PNG e JPG (máx. 10MB)
              </p>
            </div>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/png, image/jpeg"
            className="hidden"
          />

          {error && (
            <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-md flex items-start">
              <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
        </>

      {isLoading && (
        <div className="mt-4 text-center">
          <div className="inline-block animate-spin h-8 w-8 border-4 border-gray-300 dark:border-gray-700 border-t-primary rounded-full"></div>
          <p className="mt-2">Extraindo texto da imagem...</p>
        </div>
      )}
    </div>
  );
};
