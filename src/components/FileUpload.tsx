import React, { useRef } from 'react';
import { Button } from './ui/Button';
import { File, Upload, FileText, AlertTriangle } from 'lucide-react';
import { useFileUpload } from '../hooks/useFileUpload';

interface FileUploadProps {
  onTextExtracted: (text: string) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onTextExtracted }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { handleFileUpload, isLoading, error, fileData, reset } = useFileUpload();

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const onFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await handleFileUpload(files[0]);
    }
  };

  const handleExtractedText = () => {
    if (fileData?.text) {
      onTextExtracted(fileData.text);
      reset();
    }
  };

  return (
    <div className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800">
      <h3 className="text-lg font-medium mb-4">Upload Document</h3>
      
      {!fileData ? (
        <>
          <div 
            className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center cursor-pointer hover:border-primary dark:hover:border-primary transition-colors"
            onClick={triggerFileInput}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                triggerFileInput();
              }
            }}
            tabIndex={0}
            role="button"
            aria-label="Upload file"
          >
            <div className="flex flex-col items-center">
              <Upload 
                size={40} 
                className="mb-3 text-gray-500 dark:text-gray-400" 
              />
              <p className="text-base mb-1">Drag & drop a file here, or click to select</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Supports PDF and TXT files (max 10MB)</p>
            </div>
          </div>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={onFileSelected}
            accept=".pdf,.txt"
            className="hidden"
            aria-label="Upload file"
          />
          
          {error && (
            <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-md flex items-start">
              <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
        </>
      ) : (
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <FileText size={24} className="text-primary" />
            </div>
            <div className="flex-grow">
              <h4 className="font-medium">{fileData.fileName}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {(fileData.fileSize / 1024).toFixed(1)} KB • {fileData.fileType.toUpperCase()}
              </p>
            </div>
          </div>
          
          <div className="border border-gray-200 dark:border-gray-700 rounded p-3 max-h-[150px] overflow-y-auto">
            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
              {fileData.text.slice(0, 300)}
              {fileData.text.length > 300 && '...'}
            </p>
          </div>
          
          <div className="flex space-x-3">
            <Button
              onClick={handleExtractedText}
              className="flex items-center space-x-1"
            >
              <span>Use This Text</span>
            </Button>
            <Button
              variant="outline"
              onClick={reset}
              className="flex items-center space-x-1"
            >
              <span>Cancel</span>
            </Button>
          </div>
        </div>
      )}
      
      {isLoading && (
        <div className="mt-4 text-center">
          <div className="inline-block animate-spin h-8 w-8 border-4 border-gray-300 dark:border-gray-700 border-t-primary rounded-full"></div>
          <p className="mt-2">Extracting text from your document...</p>
        </div>
      )}
    </div>
  );
};