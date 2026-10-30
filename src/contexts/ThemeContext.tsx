import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';
export type ThemeColor = 'ocean-blue' | 'emerald-green' | 'midnight-purple' | 'sunset-orange' | 'minimal-neutral';

export interface ThemeOption {
  id: ThemeColor;
  name: string;
  primaryColor: string;
  accentColor: string;
}

export const THEME_OPTIONS: ThemeOption[] = [
  { id: 'ocean-blue', name: 'Ocean Blue', primaryColor: '#0284c7', accentColor: '#0f766e' },
  { id: 'emerald-green', name: 'Emerald Green', primaryColor: '#059669', accentColor: '#10b981' },
  { id: 'midnight-purple', name: 'Midnight Purple', primaryColor: '#7c3aed', accentColor: '#8b5cf6' },
  { id: 'sunset-orange', name: 'Sunset Orange', primaryColor: '#ea580c', accentColor: '#f97316' },
  { id: 'minimal-neutral', name: 'Minimal Slate', primaryColor: '#334155', accentColor: '#64748b' },
];

interface ThemeContextType {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  theme: ThemeColor;
  setTheme: (theme: ThemeColor) => void;
  isDark: boolean;
  themeMeta: ThemeOption;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') return 'dark';
    return (localStorage.getItem('smartcity_theme_mode') as ThemeMode) || 'dark';
  });

  const [theme, setThemeState] = useState<ThemeColor>(() => {
    if (typeof window === 'undefined') return 'ocean-blue';
    return (localStorage.getItem('smartcity_theme_color') as ThemeColor) || 'ocean-blue';
  });

  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    if (mode === 'dark') return true;
    if (mode === 'light') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const updateResolved = () => {
      const activeDark = mode === 'dark' || (mode === 'system' && mediaQuery.matches);
      setIsDark(activeDark);
      if (activeDark) {
        root.classList.add('dark');
        root.classList.remove('light');
        root.setAttribute('data-mode', 'dark');
        localStorage.setItem('smart_city_theme', 'dark');
      } else {
        root.classList.remove('dark');
        root.classList.add('light');
        root.setAttribute('data-mode', 'light');
        localStorage.setItem('smart_city_theme', 'light');
      }
    };

    updateResolved();
    mediaQuery.addEventListener('change', updateResolved);
    return () => mediaQuery.removeEventListener('change', updateResolved);
  }, [mode]);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
  }, [theme]);

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('smartcity_theme_mode', newMode);
      const root = document.documentElement;
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const activeDark = newMode === 'dark' || (newMode === 'system' && mediaQuery.matches);
      setIsDark(activeDark);
      if (activeDark) {
        root.classList.add('dark');
        root.classList.remove('light');
        root.setAttribute('data-mode', 'dark');
        localStorage.setItem('smart_city_theme', 'dark');
      } else {
        root.classList.remove('dark');
        root.classList.add('light');
        root.setAttribute('data-mode', 'light');
        localStorage.setItem('smart_city_theme', 'light');
      }
    }
  };

  const setTheme = (newTheme: ThemeColor) => {
    setThemeState(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('smartcity_theme_color', newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
    }
  };

  const themeMeta = THEME_OPTIONS.find((t) => t.id === theme) || THEME_OPTIONS[0];

  return (
    <ThemeContext.Provider value={{ mode, setMode, theme, setTheme, isDark, themeMeta }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
