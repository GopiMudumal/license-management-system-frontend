'use client';

import { useEffect } from 'react';
import { useThemeStore } from '@/lib/theme-store';

export function ThemeInitializer() {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    // Apply theme on mount
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme]);

  return null;
}

