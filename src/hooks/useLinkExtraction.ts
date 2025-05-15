import { useState, useCallback } from 'react';

export function useLinkExtraction() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorExtract, setExtractError] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [url, setUrl] = useState<string>('');

  const extractTextFromLink = useCallback(async (linkUrl: string) => {
    setIsLoading(true);
    setExtractError(null);
    setUrl(linkUrl);
    
    try {
      // Due to CORS restrictions, we need to use a proxy or server-side function
      // For this demo, we'll simulate extraction with a delay
      const isValidUrl = linkUrl.match(/^(http|https):\/\/[^ "]+$/);
      
      if (!isValidUrl) {
        throw new Error('Please enter a valid URL');
      }
      
      // Simulate a network request
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, return placeholder text based on URL
      const domainMatch = linkUrl.match(/^https?:\/\/(?:www\.)?([^\/]+)/i);
      const domain = domainMatch ? domainMatch[1] : 'example.com';
      
      const simulatedText = `This is extracted text from ${domain}. In a real application, this would be the actual content from the webpage. Due to CORS restrictions in browser environments, actual implementation would require a backend service or proxy to fetch and parse the content from ${linkUrl}.

The webpage would typically contain headings, paragraphs, and possibly lists:

# Main Heading
## Subheading

This is a paragraph of text that might appear on the page. It could discuss various topics related to the content of the website.

- List item one
- List item two
- List item three

For a production application, the extraction would handle various HTML structures, filter out navigation, ads, and other non-content elements to provide clean text for text-to-speech conversion.`;
      
      setExtractedText(simulatedText);
    } catch (err) {
      setExtractError(err instanceof Error ? err.message : 'Failed to extract text from URL');
      setExtractedText(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setExtractedText(null);
    setExtractError(null);
    setIsLoading(false);
    setUrl('');
  }, []);

  return {
    extractTextFromLink,
    isLoading,
    errorExtract,
    extractedText,
    url,
    reset
  };
}