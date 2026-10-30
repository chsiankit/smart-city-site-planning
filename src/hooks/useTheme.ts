import { useTheme as useNewTheme, ThemeProvider as NewThemeProvider } from '../contexts/ThemeContext';

export { NewThemeProvider as ThemeProvider };

export function useTheme() {
  const context = useNewTheme();
  return {
    ...context,
    // Backwards-compatible aliases
    theme: context.isDark ? 'dark' : 'light',
    colorTheme: context.theme,
    toggleTheme: () => {
      context.setMode(context.isDark ? 'light' : 'dark');
    },
    setTheme: (t: 'light' | 'dark') => {
      context.setMode(t);
    },
  };
}
