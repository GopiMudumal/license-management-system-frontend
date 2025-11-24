import { create } from 'zustand';

export type Theme = 'avengers' | 'disney' | 'powerrangers' | 'ramayan' | 'kgf';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

// Load theme from localStorage on initialization
const getInitialTheme = (): Theme => {
  if (typeof window === 'undefined') return 'avengers';
  const stored = localStorage.getItem('theme-storage');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      return parsed.state?.theme || 'avengers';
    } catch {
      return 'avengers';
    }
  }
  return 'avengers';
};

export const useThemeStore = create<ThemeState>((set) => ({
  theme: getInitialTheme(),
  setTheme: (theme: Theme) => {
    set({ theme });
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme-storage', JSON.stringify({ state: { theme } }));
      document.documentElement.setAttribute('data-theme', theme);
    }
  },
}));

