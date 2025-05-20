import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/Button';
import { Clipboard, Copy, X } from 'lucide-react';

// Tipagem das props
interface TextInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onClear: () => void;
  placeholder?: string;
  maxLength?: number;
  click?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const TextInput: React.FC<TextInputProps> = ({
  value,
  onChange,
  onClear,
  placeholder = 'Insira ou cole o texto para ser lido em voz alta...',
  maxLength = 5000,
}) => {
  const [charCount, setCharCount] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    setCharCount(value.length);
  }, [value]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    if (maxLength && newText.length > maxLength) return;
    onChange(e);
  };

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      if (clipboardText) {
        const truncatedText = maxLength ? clipboardText.slice(0, maxLength) : clipboardText;
        onChange({ target: { value: truncatedText } } as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>);
      }
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
    }
  };

  const handleCopy = async () => {
    if (!value) return;

    try {
      await navigator.clipboard.writeText(value);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleClear = () => {
    onClear();
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <div className="w-full">
      <div className="mb-3 flex justify-between items-center">
        <label htmlFor="text-input" className="text-sm font-medium">
          Texto para fazer leitura
        </label>
        <span 
          className={`text-xs ${
            maxLength && charCount > maxLength * 0.9 
              ? 'text-red-500 dark:text-red-400' 
              : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          {charCount}/{maxLength} caracteres
        </span>
      </div>
      
      <div className="relative">
        <textarea
          id="text-input"
          ref={textareaRef}
          value={value}
          onChange={handleTextChange}
          placeholder={placeholder}
          className="w-full min-h-[200px] resize-none p-4 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          aria-describedby="text-input-instructions"
        />
        
        {value && (
          <button
            onClick={handleClear}
            className="absolute top-3 right-5 p-1 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            aria-label="Clear text"
          >
            <X size={16} />
          </button>
        )}
      </div>
      
      <p id="text-input-instructions" className="mt-1 text-xs text-gray-500 dark:text-gray-400">
        Digite ou cole o texto que deseja que seja lido em voz alta. Você também pode enviar um arquivo ou extrair o texto de uma URL.
      </p>
      
      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          onClick={handlePaste}
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
        >
          <Clipboard size={16} /> Colar da área de transferência
        </Button>
        <div className={`${!value && 'cursor-not-allowed'}`}>
          <Button
            onClick={handleCopy}
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            disabled={!value}
            >
            <Copy size={16} /> {copySuccess ? 'Copiado!' : 'Copiar Texto'}
          </Button>   
        </div>
      </div>
    </div>
  );
};