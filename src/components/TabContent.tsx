import React, { useState } from 'react';
import { FileUpload } from './FileUpload';
import { LinkExtractor } from './LinkExtractor';
import { TextInput } from './TextInput';
// import { Player } from './Player';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/Tabs';
import { gerarAudio } from "../services/ttsService";

export const TabContent: React.FC = () => {
  const [text, setText] = useState('');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTextChange = (newText: string) => {
    setText(newText);
  };

  const clearText = () => {
    setText('');
  };

  const handleGerarAudio = async () => {
    setLoading(true);
    try {
      const blob = await gerarAudio(text);
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    } catch (error) {
      alert("Erro ao gerar áudio");
      console.error(error);
    } finally {
      setLoading(false);
    }
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
                onChange={(e) => setText(e.target.value)}
                onClear={clearText}
                click={handleGerarAudio}
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
            {/* <Player text={text} /> */}
            <div className="p-4 max-w-xl mx-auto">
              {/* <button
                onClick={handleGerarAudio}
                className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
                disabled={loading || !texto}
              >
                {loading ? "Gerando áudio..." : "Ouvir"}
              </button> */}
              <div
                className={`mt-4 w-full ${!audioUrl ? 'pointer-events-none opacity-50' : ''}`}
              >
                <audio controls src={audioUrl || ""} className="w-full" />
              </div>
              
            </div>
  
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