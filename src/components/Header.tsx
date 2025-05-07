import React, { useState } from 'react';
import { Menu, X, Settings, Sun, Moon, AlertTriangle } from 'lucide-react';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { Button } from './ui/Button';

export const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { 
    settings, 
    setFontSize, 
    setContrastMode, 
    setThemeMode, 
    setReducedMotion,
    setLineSpacing,
    setFocusIndicatorsEnhanced,
    resetToDefaults
  } = useAccessibility();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleSettings = () => setSettingsOpen(!settingsOpen);

  return (
    <header className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleMenu}
            className="p-2 md:hidden"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="text-2xl font-bold text-primary">
            <span className="sr-only">VoiceRead</span>
            <span aria-hidden="true">🔊</span> VoiceRead
          </h1>
        </div>
        
        <nav className={`${menuOpen ? 'flex' : 'hidden'} md:flex absolute md:static top-16 left-0 right-0 flex-col md:flex-row items-center gap-4 p-4 md:p-0 bg-white dark:bg-gray-900 md:bg-transparent shadow-md md:shadow-none`}>
          <a href="#" className="md:px-3 py-2 hover:text-primary" onClick={(e) => { e.preventDefault(); toggleMenu(); }}>Home</a>
          <a href="#" className="md:px-3 py-2 hover:text-primary" onClick={(e) => { e.preventDefault(); toggleMenu(); }}>How to Use</a>
          <a href="#" className="md:px-3 py-2 hover:text-primary" onClick={(e) => { e.preventDefault(); toggleMenu(); }}>About</a>
          <a href="#" className="md:px-3 py-2 hover:text-primary" onClick={(e) => { e.preventDefault(); toggleMenu(); }}>Contact</a>
        </nav>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setThemeMode(settings.themeMode === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label={settings.themeMode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {settings.themeMode === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <button
            onClick={toggleSettings}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Accessibility settings"
            aria-expanded={settingsOpen}
            aria-controls="accessibility-panel"
          >
            <Settings size={20} />
          </button>
        </div>
      </div>
      
      {/* Accessibility Settings Panel */}
      {settingsOpen && (
        <div
          id="accessibility-panel"
          className="container mx-auto px-4 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-md"
          role="dialog"
          aria-label="Accessibility settings"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Accessibility Settings</h2>
            <button
              onClick={() => setSettingsOpen(false)}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Close settings"
            >
              <X size={24} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-3">Display</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Font Size</label>
                  <div className="flex space-x-2">
                    {(['small', 'medium', 'large', 'x-large'] as const).map((size) => (
                      <button
                        key={size}
                        onClick={() => setFontSize(size)}
                        className={`px-3 py-2 rounded-md ${
                          settings.fontSize === size
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                        aria-pressed={settings.fontSize === size}
                      >
                        {size.charAt(0).toUpperCase() + size.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Contrast Mode</label>
                  <div className="flex space-x-2">
                    {(['normal', 'high', 'ultra'] as const).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setContrastMode(mode)}
                        className={`px-3 py-2 rounded-md ${
                          settings.contrastMode === mode
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                        aria-pressed={settings.contrastMode === mode}
                      >
                        {mode.charAt(0).toUpperCase() + mode.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Theme</label>
                  <div className="flex space-x-2">
                    {(['light', 'dark', 'system'] as const).map((theme) => (
                      <button
                        key={theme}
                        onClick={() => setThemeMode(theme)}
                        className={`px-3 py-2 rounded-md ${
                          settings.themeMode === theme
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                        aria-pressed={settings.themeMode === theme}
                      >
                        {theme.charAt(0).toUpperCase() + theme.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3">Motion & Reading</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Reduce Motion</label>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.reducedMotion}
                      onChange={(e) => setReducedMotion(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Enhanced Focus Indicators</label>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.focusIndicatorsEnhanced}
                      onChange={(e) => setFocusIndicatorsEnhanced(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Line Spacing: {settings.lineSpacing}%
                  </label>
                  <input
                    type="range"
                    min="100"
                    max="200"
                    step="10"
                    value={settings.lineSpacing}
                    onChange={(e) => setLineSpacing(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <Button
              variant="outline"
              onClick={resetToDefaults}
              className="mr-2"
            >
              Reset to Defaults
            </Button>
            <Button
              onClick={() => setSettingsOpen(false)}
            >
              Save Changes
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};