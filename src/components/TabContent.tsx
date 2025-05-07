import React, { useState } from 'react';
import { FileUpload } from './FileUpload';
import { LinkExtractor } from './LinkExtractor';
import { TextInput } from './TextInput';
import { Player } from './Player';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/Tabs';

export const TabContent: React.FC = () => {
  const [text, setText] = useState('');

  const handleTextChange = (newText: string) => {
    setText(newText);
  };

  const clearText = () => {
    setText('');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Tabs defaultValue="text" className="mb-8">
            <TabsList>
              <TabsTrigger value="text">Direct Text Input</TabsTrigger>
              <TabsTrigger value="file">Upload File</TabsTrigger>
              <TabsTrigger value="url">Extract from URL</TabsTrigger>
            </TabsList>
            
            <TabsContent value="text" className="mt-4">
              <TextInput
                value={text}
                onChange={handleTextChange}
                onClear={clearText}
              />
            </TabsContent>
            
            <TabsContent value="file" className="mt-4">
              <FileUpload onTextExtracted={handleTextChange} />
            </TabsContent>
            
            <TabsContent value="url" className="mt-4">
              <LinkExtractor onTextExtracted={handleTextChange} />
            </TabsContent>
          </Tabs>
          
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-medium mb-4">Text Preview</h2>
            {text ? (
              <div className="max-h-[400px] overflow-y-auto">
                <p className="whitespace-pre-line">{text}</p>
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 italic">
                No text entered yet. Type directly, upload a file, or extract from a URL.
              </p>
            )}
          </div>
        </div>
        
        <div>
          <div className="sticky top-24">
            <h2 className="text-xl font-semibold mb-4">Text-to-Speech Player</h2>
            <Player text={text} />
            
            <div className="mt-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-medium mb-3">Keyboard Shortcuts</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span>Play/Pause</span>
                  <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">Space</kbd>
                </li>
                <li className="flex justify-between">
                  <span>Stop</span>
                  <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">Esc</kbd>
                </li>
                <li className="flex justify-between">
                  <span>Volume Up</span>
                  <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">↑</kbd>
                </li>
                <li className="flex justify-between">
                  <span>Volume Down</span>
                  <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">↓</kbd>
                </li>
                <li className="flex justify-between">
                  <span>Speed Up</span>
                  <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">→</kbd>
                </li>
                <li className="flex justify-between">
                  <span>Speed Down</span>
                  <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">←</kbd>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};