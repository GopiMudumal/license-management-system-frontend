'use client';

import { useEffect, useState, useRef } from 'react';
import { useThemeStore } from '@/lib/theme-store';

// Theme-specific loader configurations
const themeConfigs = {
  avengers: {
    primaryColor: 'hsl(0, 84%, 60%)',
    accentColor: 'hsl(45, 93%, 47%)',
    emoji: '⚡',
    text: 'Assembling...',
    particles: 12,
  },
  disney: {
    primaryColor: 'hsl(280, 70%, 65%)',
    accentColor: 'hsl(200, 80%, 60%)',
    emoji: '✨',
    text: 'Making magic...',
    particles: 8,
  },
  powerrangers: {
    primaryColor: 'hsl(0, 90%, 55%)',
    accentColor: 'hsl(50, 95%, 50%)',
    emoji: '⚡',
    text: 'Morphing...',
    particles: 6,
  },
  ramayan: {
    primaryColor: 'hsl(35, 95%, 55%)',
    accentColor: 'hsl(220, 60%, 50%)',
    emoji: '🕉️',
    text: 'Blessing...',
    particles: 10,
  },
  kgf: {
    primaryColor: 'hsl(40, 95%, 50%)',
    accentColor: 'hsl(30, 90%, 55%)',
    emoji: '💎',
    text: 'Loading power...',
    particles: 14,
  },
};

// Get minimum loading time from environment variable (default: 5000ms = 5 seconds)
const getMinLoadingTime = () => {
  if (typeof window === "undefined") return 5000;
  const envValue = process.env.NEXT_PUBLIC_MIN_LOADING_TIME;
  const minTime = parseInt(envValue || "5000", 10);
  return 0; // If 0, use actual API response time minTime || 0
};

export function GlobalLoader() {
  const [loading, setLoading] = useState(false);
  const theme = useThemeStore((state) => state.theme);
  const config = themeConfigs[theme] || themeConfigs.avengers;
  const loadingStartTimeRef = useRef<number | null>(null);
  const minLoadingTimeRef = useRef<number>(getMinLoadingTime());
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Listen for API loading state
    const handleLoadingStart = () => {
      loadingStartTimeRef.current = Date.now();
      setLoading(true);
    };

    const handleLoadingEnd = () => {
      const startTime = loadingStartTimeRef.current;
      if (startTime === null) {
        setLoading(false);
        return;
      }

      const elapsedTime = Date.now() - startTime;
      const minTime = minLoadingTimeRef.current;

      // If minTime is 0, use actual API response time
      if (minTime === 0) {
        // Small delay to prevent flickering
        setTimeout(() => {
          setLoading(false);
          loadingStartTimeRef.current = null;
        }, 100);
        return;
      }

      // Calculate remaining time to meet minimum duration
      const remainingTime = Math.max(0, minTime - elapsedTime);

      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set timeout to hide loader after minimum duration
      timeoutRef.current = setTimeout(() => {
        setLoading(false);
        loadingStartTimeRef.current = null;
        timeoutRef.current = null;
      }, remainingTime + 100); // Add 100ms for smooth transition
    };

    // Custom events for loading state
    window.addEventListener('api-loading-start', handleLoadingStart);
    window.addEventListener('api-loading-end', handleLoadingEnd);

    return () => {
      window.removeEventListener('api-loading-start', handleLoadingStart);
      window.removeEventListener('api-loading-end', handleLoadingEnd);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/90 backdrop-blur-md">
      <div className="relative">
        {/* Main loader circle with theme colors */}
        <div className="relative w-40 h-40">
          {/* Outer rotating ring */}
          <div
            className="absolute inset-0 rounded-full border-4 border-transparent"
            style={{
              borderTopColor: config.primaryColor,
              borderRightColor: config.accentColor,
              animation: 'spin 1s linear infinite',
            }}
          />
          
          {/* Middle ring */}
          <div
            className="absolute inset-4 rounded-full border-4 border-transparent"
            style={{
              borderBottomColor: config.primaryColor,
              borderLeftColor: config.accentColor,
              animation: 'spin 1.5s linear infinite reverse',
            }}
          />
          
          {/* Inner ring */}
          <div
            className="absolute inset-8 rounded-full border-2 border-transparent"
            style={{
              borderTopColor: config.accentColor,
              borderRightColor: config.primaryColor,
              animation: 'spin 0.8s linear infinite',
            }}
          />
          
          {/* Inner pulsing circle */}
          <div
            className="absolute inset-12 rounded-full"
            style={{
              background: `radial-gradient(circle, ${config.primaryColor}60, ${config.accentColor}40)`,
              animation: 'pulse 1s ease-in-out infinite',
            }}
          />
          
          {/* Center emoji/icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="text-5xl"
              style={{ 
                animation: 'bounce-slow 1s ease-in-out infinite',
                filter: 'drop-shadow(0 0 8px currentColor)',
              }}
            >
              {config.emoji}
            </div>
          </div>
        </div>

        {/* Floating particles around the loader */}
        {[...Array(config.particles)].map((_, i) => {
          const angle = (i * Math.PI * 2) / config.particles;
          const radius = 80;
          const floatX = Math.cos(angle + Math.PI / 2) * 15;
          const floatY = Math.sin(angle + Math.PI / 2) * 15;
          
          return (
            <div
              key={i}
              className="absolute w-3 h-3 rounded-full"
              style={{
                background: i % 2 === 0 ? config.primaryColor : config.accentColor,
                left: `calc(50% + ${radius * Math.cos(angle)}px)`,
                top: `calc(50% + ${radius * Math.sin(angle)}px)`,
                transform: 'translate(-50%, -50%)',
                animation: `float 2s ease-in-out infinite`,
                animationDelay: `${i * 0.15}s`,
                boxShadow: `0 0 10px ${i % 2 === 0 ? config.primaryColor : config.accentColor}`,
                '--float-x': `${floatX}px`,
                '--float-y': `${floatY}px`,
              } as React.CSSProperties & { '--float-x': string; '--float-y': string }}
            />
          );
        })}

        {/* Loading text with gradient */}
        <div className="mt-10 text-center">
          <p
            className="text-xl font-bold animate-pulse"
            style={{
              background: `linear-gradient(135deg, ${config.primaryColor}, ${config.accentColor})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: `0 0 20px ${config.primaryColor}40`,
            }}
          >
            {config.text}
          </p>
        </div>

        {/* Additional decorative elements */}
        <div 
          className="absolute -top-20 -left-20 w-40 h-40 rounded-full opacity-20 blur-3xl" 
          style={{ background: config.primaryColor }} 
        />
        <div 
          className="absolute -bottom-20 -right-20 w-40 h-40 rounded-full opacity-20 blur-3xl" 
          style={{ background: config.accentColor }} 
        />
      </div>
    </div>
  );
}
