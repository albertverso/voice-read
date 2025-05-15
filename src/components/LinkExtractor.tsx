// src/components/LinkExtractor.tsx
import React, { useState, useEffect } from 'react';
import { Button } from './ui/Button';
import { Link, AlertTriangle } from 'lucide-react';

interface LinkExtractorProps {
  onTextExtracted: (text: string) => void;
  extractedText: string;
  onExtractUrl: (url: string) => void;
}

export const LinkExtractor: React.FC<LinkExtractorProps> = ({
  onTextExtracted,
  extractedText,
  onExtractUrl,
}) => {
  const [inputUrl, setInputUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasResult, setHasResult] = useState(false);

  useEffect(() => {
    if (extractedText) {
      setHasResult(true);
    }
  }, [extractedText]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      await onExtractUrl(inputUrl.trim());
    } catch (err) {
      setError('Erro ao extrair texto.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseText = () => {
    onTextExtracted(extractedText);
    setInputUrl('');
    setHasResult(false);
  };

  const handleCancel = () => {
    setInputUrl('');
    setHasResult(false);
  };

  return (
    <div className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800">
      <h3 className="text-lg font-medium mb-4">Extrair Texto da URL</h3>

      {!hasResult ? (
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-grow">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Link className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </div>
                <input
                  type="url"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800"
                  disabled={isLoading}
                />
              </div>
            </div>
            <Button type="submit" disabled={!inputUrl.trim() || isLoading} isLoading={isLoading}>
              Extrair Texto
            </Button>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-md flex items-start">
              <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
        </form>
      ) : (
        <div className="space-y-4">
          <div className="border border-gray-200 dark:border-gray-700 rounded p-3 max-h-[200px] overflow-y-auto">
            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
              {extractedText}
            </p>
          </div>

          <div className="flex space-x-3">
            <Button onClick={handleUseText}>
              <span>Usar esse texto</span>
            </Button>
            <Button variant="outline" onClick={handleCancel}>
              <span>Cancelar</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
