import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Link, AlertTriangle } from 'lucide-react';
import { useLinkExtraction } from '../hooks/useLinkExtraction';

interface LinkExtractorProps {
  onTextExtracted: (text: string) => void;
}

export const LinkExtractor: React.FC<LinkExtractorProps> = ({ onTextExtracted }) => {
  const [inputUrl, setInputUrl] = useState('');
  const { extractTextFromLink, isLoading, error, extractedText, url, reset } = useLinkExtraction();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputUrl.trim()) {
      extractTextFromLink(inputUrl.trim());
    }
  };

  const handleExtractedText = () => {
    if (extractedText) {
      onTextExtracted(extractedText);
      reset();
      setInputUrl('');
    }
  };

  return (
    <div className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800">
      <h3 className="text-lg font-medium mb-4">Extract Text from URL</h3>
      
      {!extractedText ? (
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-grow">
              <label htmlFor="url-input" className="sr-only">Enter website URL</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Link className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </div>
                <input
                  type="url"
                  id="url-input"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800"
                  disabled={isLoading}
                  aria-describedby="url-instructions"
                />
              </div>
              <p id="url-instructions" className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Enter a URL to extract text content from a webpage.
              </p>
            </div>
            <Button
              type="submit"
              disabled={!inputUrl.trim() || isLoading}
              isLoading={isLoading}
              className="whitespace-nowrap"
            >
              Extract Text
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
          <div className="flex items-center space-x-3">
            <Link className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
              {url}
            </span>
          </div>
          
          <div className="border border-gray-200 dark:border-gray-700 rounded p-3 max-h-[200px] overflow-y-auto">
            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
              {extractedText}
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
              onClick={() => {
                reset();
                setInputUrl('');
              }}
              className="flex items-center space-x-1"
            >
              <span>Cancel</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};