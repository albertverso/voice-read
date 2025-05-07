import React, { useEffect } from 'react';
import { Header } from './components/Header';
import { TabContent } from './components/TabContent';
import { AccessibilityProvider } from './contexts/AccessibilityContext';

function App() {
  useEffect(() => {
    // Set up keyboard listeners for accessibility
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip navigation: pressing Tab and then Enter on "Skip to content" link
      if (e.key === 'Tab' && !e.shiftKey) {
        const skipLink = document.getElementById('skip-to-content');
        if (skipLink && document.activeElement === skipLink) {
          skipLink.classList.remove('sr-only');
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <AccessibilityProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
        <a 
          href="#main" 
          id="skip-to-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-primary text-white px-4 py-2 rounded-md"
        >
          Skip to content
        </a>
        
        <Header />
        
        <main id="main" className="pb-16">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-6">
              Convert Text to Speech
            </h1>
            <p className="text-xl text-center max-w-3xl mx-auto mb-12 text-gray-600 dark:text-gray-300">
              An accessible text-to-speech tool designed for people with visual impairments.
              Enter text, upload documents, or extract from URLs and listen to them read aloud.
            </p>
          </div>
          
          <TabContent />
        </main>
        
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-600 dark:text-gray-300 mb-4 md:mb-0">
                &copy; {new Date().getFullYear()} VoiceRead - Accessible Text-to-Speech
              </p>
              <nav className="flex flex-wrap gap-6">
                <a href="#" className="text-primary hover:underline">Accessibility Statement</a>
                <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                <a href="#" className="text-primary hover:underline">Terms of Service</a>
                <a href="#" className="text-primary hover:underline">Contact</a>
              </nav>
            </div>
          </div>
        </footer>
      </div>
    </AccessibilityProvider>
  );
}

export default App;