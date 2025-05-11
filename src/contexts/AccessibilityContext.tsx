import React, { createContext, useContext, useState, useEffect } from 'react';

type FontSize = 'pequeno' | 'medio' | 'grande' | 'extra-grande'
type ContrastMode = 'normal' | 'grande' | 'extra-grande';
type ThemeMode = 'claro' | 'escuro' | 'sistema';

interface AccessibilityState {
  fontSize: FontSize;
  contrastMode: ContrastMode;
  themeMode: ThemeMode;
  reducedMotion: boolean;
  lineSpacing: number; // percentage, e.g., 150 for 1.5
  focusIndicatorsEnhanced: boolean;
}

interface AccessibilityContextType {
  settings: AccessibilityState;
  setFontSize: (size: FontSize) => void;
  setContrastMode: (mode: ContrastMode) => void;
  setThemeMode: (mode: ThemeMode) => void;
  setReducedMotion: (reduced: boolean) => void;
  setLineSpacing: (spacing: number) => void;
  setFocusIndicatorsEnhanced: (enhanced: boolean) => void;
  resetToDefaults: () => void;
}

const defaultSettings: AccessibilityState = {
  fontSize: 'medio',
  contrastMode: 'normal',
  themeMode: 'sistema',
  reducedMotion: false,
  lineSpacing: 150,
  focusIndicatorsEnhanced: true,
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AccessibilityState>(() => {
    // Load settings from localStorage if available
    const savedSettings = localStorage.getItem('accessibility-settings');
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
  });

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
    
    // Apply settings to document
    document.documentElement.setAttribute('data-font-size', settings.fontSize);
    document.documentElement.setAttribute('data-contrast', settings.contrastMode);
    document.documentElement.setAttribute('data-theme', settings.themeMode);
    
    if (settings.reducedMotion) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
    
    if (settings.focusIndicatorsEnhanced) {
      document.documentElement.classList.add('enhanced-focus');
    } else {
      document.documentElement.classList.remove('enhanced-focus');
    }
    
    // Apply line spacing to body
    document.body.style.lineHeight = `${settings.lineSpacing}%`;
    
    // Handle system preference for dark mode if set to 'system'
    if (settings.themeMode === 'sistema') {
      const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const updateTheme = (e: MediaQueryListEvent | MediaQueryList) => {
        document.documentElement.classList.toggle('dark', e.matches);
      };
      
      updateTheme(darkModeMediaQuery);
      darkModeMediaQuery.addEventListener('change', updateTheme);
      
      return () => darkModeMediaQuery.removeEventListener('change', updateTheme);
    } else {
      document.documentElement.classList.toggle('dark', settings.themeMode === 'escuro');
    }
  }, [settings]);

  const setFontSize = (size: FontSize) => {
    setSettings(prev => ({ ...prev, fontSize: size }));
  };

  const setContrastMode = (mode: ContrastMode) => {
    setSettings(prev => ({ ...prev, contrastMode: mode }));
  };

  const setThemeMode = (mode: ThemeMode) => {
    setSettings(prev => ({ ...prev, themeMode: mode }));
  };

  const setReducedMotion = (reduced: boolean) => {
    setSettings(prev => ({ ...prev, reducedMotion: reduced }));
  };

  const setLineSpacing = (spacing: number) => {
    setSettings(prev => ({ ...prev, lineSpacing: spacing }));
  };

  const setFocusIndicatorsEnhanced = (enhanced: boolean) => {
    setSettings(prev => ({ ...prev, focusIndicatorsEnhanced: enhanced }));
  };

  const resetToDefaults = () => {
    setSettings(defaultSettings);
  };

  return (
    <AccessibilityContext.Provider
      value={{
        settings,
        setFontSize,
        setContrastMode,
        setThemeMode,
        setReducedMotion,
        setLineSpacing,
        setFocusIndicatorsEnhanced,
        resetToDefaults,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = (): AccessibilityContextType => {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};