import React, { useEffect } from 'react';
import { Header } from './components/Header';
import { AccessibilityProvider } from './contexts/AccessibilityContext';
import { HomePage } from './pages/HomePage';
import { Footer } from './components/Footer';
import { RoutesApp } from './routes/routes';

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
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
        
        <Header />
        <main className='flex-grow w-full'>
          <RoutesApp />
        </main>
        <Footer />
      </div>
    </AccessibilityProvider>
  );
}

export default App;