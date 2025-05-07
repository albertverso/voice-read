import { useState, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

type FileType = 'pdf' | 'txt' | 'doc' | 'unknown';

interface FileData {
  text: string;
  fileName: string;
  fileType: FileType;
  fileSize: number;
}

export function useFileUpload() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileData, setFileData] = useState<FileData | null>(null);

  const determineFileType = (fileName: string): FileType => {
    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    if (extension === 'pdf') return 'pdf';
    if (extension === 'txt') return 'txt';
    if (extension === 'doc' || extension === 'docx') return 'doc';
    return 'unknown';
  };

  const extractTextFromPdf = async (arrayBuffer: ArrayBuffer): Promise<string> => {
    try {
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const textItems = textContent.items.map((item: any) => item.str).join(' ');
        fullText += textItems + '\n\n';
      }
      
      return fullText;
    } catch (err) {
      throw new Error('Failed to extract text from PDF');
    }
  };

  const readTextFile = (arrayBuffer: ArrayBuffer): string => {
    const decoder = new TextDecoder('utf-8');
    return decoder.decode(arrayBuffer);
  };

  const handleFileUpload = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const fileName = file.name;
      const fileType = determineFileType(fileName);
      const fileSize = file.size;
      
      if (fileType === 'unknown') {
        throw new Error('Unsupported file type');
      }
      
      const arrayBuffer = await file.arrayBuffer();
      let text = '';
      
      if (fileType === 'pdf') {
        text = await extractTextFromPdf(arrayBuffer);
      } else if (fileType === 'txt') {
        text = readTextFile(arrayBuffer);
      } else if (fileType === 'doc') {
        throw new Error('DOC/DOCX files are not supported yet');
      }
      
      setFileData({ text, fileName, fileType, fileSize });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload file');
      setFileData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setFileData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    handleFileUpload,
    isLoading,
    error,
    fileData,
    reset
  };
}