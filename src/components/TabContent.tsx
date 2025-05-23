import React, { useState } from 'react';
import { ImageUpload } from './ImageUpload';
import { LinkExtractor } from './LinkExtractor';
import { TextInput } from './TextInput';
// import { Player } from './Player';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/Tabs';
import { gerarAudio } from "../services/ttsService";
import AutoTextarea from './ui/AutoTextarea';
import { Button } from './ui/Button';
import { LucideCircleDashed, LucidePlay } from 'lucide-react';
import { sendImage } from '../services/geminiService';
import { extractTextFromUrl } from '../services/extractUrlService';
import 'react-h5-audio-player/lib/styles.css';
import { CustomAudioPlayer } from './ui/CustomAudioPlayer';
import { Modal } from './ui/EditModal';

export const TabContent: React.FC = () => {
  const [text, setText] = useState('');
  const [textUrl, setTextUrl] = useState('');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const clearText = () => {
    setText('');
  };
  
  const handleGerarAudio = async () => {
    setAudioUrl(null);
    setLoading(true);
    setModalOpen(true);
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

  const handleImageSelected = async (file: File) => {
    setLoadingImage(true);
    setError(null);
    try {
      const result = await sendImage(file);
      if (result.status === 200) {
        setText(result.text);
      } else {
        alert(result.message || "Erro ao processar imagem.");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro inesperado.");
    } finally {
      setLoadingImage(false);
    }
  };

  const handleExtractText = async (url: string) => {
    try {
      const result = await extractTextFromUrl(url);
      const texto = `Titulo: ${result.title} \nConteudo: ${result.text}`
      setTextUrl(texto);
    } catch (err: any) {
      setError(err.message || 'Erro ao extrair conteúdo.');
    }
  };

  return (
    <div className="container mx-auto px-4 pb-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 xl:gap-8 gap-4">
        <div className="lg:col-span-2">
          <Tabs defaultValue="text" className="mb-8">
            <TabsList>
              <TabsTrigger value="text">Digitar Texto</TabsTrigger>
              <TabsTrigger value="file">Enviar Imagem</TabsTrigger>
              <TabsTrigger value="url">Extrair Texto</TabsTrigger>
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
              <div className='mb-3 flex items-center text-center'>
                <label htmlFor="text-input" className="text-sm font-medium">
                  Escaneia a imagem e transforma em texto para fazer a leitura
                </label>
              </div>
              <ImageUpload
                isLoading={loadingImage}
                error={error}
                onImageSelected={handleImageSelected}
              />
            </TabsContent>
            
            <TabsContent value="url" className="mt-4">
              <div className='mb-3 flex items-center text-center'>
                <label htmlFor="text-input" className="text-sm font-medium">
                  Escaneia o site(preferencialmente sites de notícias) para fazer a leitura
                </label>
              </div>
              <LinkExtractor 
                onTextExtracted={() => setText(textUrl)}
                extractedText={textUrl}
                onExtractUrl={handleExtractText}
              />
            </TabsContent>
          </Tabs>
          
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h2 className="text-lg font-medium mb-4">Visualização de texto</h2>
            {text ? (
            <div className="relative">
              <AutoTextarea text={text} setText={setText} />
            </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 italic">
                Nenhum texto inserido ainda. Digite diretamente, carregue uma imagem ou extraia de uma URL.
              </p>
            )}
          </div>
        </div>
        
        <div>
            <div className="sticky top-24 lg:mt-10">
              <h2 className="xl:text-2xl text-lg text-center w-full font-semibold mb-4">Reprodutor de texto para fala</h2>
              {/* <Player text={text} /> */}
              <div className={`max-w-xl mx-auto ${!audioUrl && 'cursor-not-allowed'}`}>
                <div
                  className={`mt-4 w-full ${!audioUrl ? 'pointer-events-none opacity-50' : ''}`}
                >
                  {/* <audio controls src={audioUrl || ""} className="w-full" /> */}
                  <CustomAudioPlayer audioUrl={audioUrl || ""} />

                </div>
              </div>
              <div className='flex items-center justify-center pt-4'>
                <div className={`${!text && 'cursor-not-allowed'}`}>
                  <Button
                    onClick={handleGerarAudio}
                    variant="classic"
                    size="sm"
                    className={`flex items-center gap-1 bg-black text-white w-48 dark:bg-white dark:text-black ${!text && 'disabled opacity-50 cursor-not-allowed'}`}
                    disabled={!text}
                  >
                    {loading ? 
                    <div className='flex flex-rowitems-center justify-center'>
                      <LucideCircleDashed size={20} className="animate-spin w-full mr-2" /> 
                      <p >
                        Carregando...
                      </p> 
                    </div>
                    :
                    <div className='flex flex-row gap-2 items-center justify-center'>
                      <LucidePlay size={20} /> 
                      <p>
                        Gerar audio
                      </p>
                    </div>
                    } 
                  </Button>
                </div>
              </div>
              <div className="mt-6 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-medium mb-3">Atalhos de teclado</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span>Play/Pause</span>
                    <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">Space</kbd>
                  </li>
                  <li className="flex justify-between">
                    <span>Pare</span>
                    <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">Esc</kbd>
                  </li>
                  <li className="flex justify-between">
                    <span>Aumentar Volume</span>
                    <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">↑</kbd>
                  </li>
                  <li className="flex justify-between">
                    <span>Abaixar Volume</span>
                    <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">↓</kbd>
                  </li>
                  <li className="flex justify-between">
                    <span>Aumentar Velocidade de Reprodução</span>
                    <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">→</kbd>
                  </li>
                  <li className="flex justify-between">
                    <span>Diminuir Volume de Reprodução</span>
                    <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">←</kbd>
                  </li>
                </ul>
              </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        audioUrl={audioUrl || ""}
      >
      </Modal>
    </div>
  );
};