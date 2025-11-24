'use client';

import { useEffect } from 'react';
import { useThemeStore, type Theme } from '@/lib/theme-store';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Palette, Sparkles, Zap, Star, Gem } from 'lucide-react';

const themes: { value: Theme; label: string; icon: React.ReactNode }[] = [
  { value: 'avengers', label: 'Avengers', icon: <Zap className="h-4 w-4" /> },
  { value: 'disney', label: 'Disney', icon: <Sparkles className="h-4 w-4" /> },
  { value: 'powerrangers', label: 'Power Rangers', icon: <Zap className="h-4 w-4" /> },
  { value: 'ramayan', label: 'Ramayan', icon: <Star className="h-4 w-4" /> },
  { value: 'kgf', label: 'KGF', icon: <Gem className="h-4 w-4" /> },
];

export function ThemeToggle() {
  const { theme, setTheme } = useThemeStore();

  useEffect(() => {
    // Apply theme on mount and when theme changes
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme]);

  const currentTheme = themes.find((t) => t.value === theme);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Palette className="h-4 w-4" />
          <span className="hidden sm:inline">{currentTheme?.label || 'Theme'}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {themes.map((themeOption) => (
          <DropdownMenuItem
            key={themeOption.value}
            onClick={() => setTheme(themeOption.value)}
            className={`flex items-center gap-2 cursor-pointer ${
              theme === themeOption.value ? 'bg-primary/10 text-primary' : ''
            }`}
          >
            {themeOption.icon}
            <span>{themeOption.label}</span>
            {theme === themeOption.value && (
              <span className="ml-auto text-primary">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

