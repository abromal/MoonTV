/* eslint-disable @typescript-eslint/no-explicit-any,react-hooks/exhaustive-deps */

'use client';

import { Moon, Sparkles, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

const THEME_MODE_KEY = 'theme-mode';
type ThemeMode = 'light' | 'dark' | 'cyberpunk';

function getNextThemeMode(mode: ThemeMode): ThemeMode {
  if (mode === 'light') return 'dark';
  if (mode === 'dark') return 'cyberpunk';
  return 'light';
}

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');
  const { setTheme, resolvedTheme } = useTheme();

  const setThemeColor = (mode: ThemeMode) => {
    const meta = document.querySelector('meta[name="theme-color"]');
    const color =
      mode === 'cyberpunk'
        ? '#0a0016'
        : mode === 'dark'
        ? '#0c111c'
        : '#f9fbfe';

    if (!meta) {
      const newMeta = document.createElement('meta');
      newMeta.name = 'theme-color';
      newMeta.content = color;
      document.head.appendChild(newMeta);
    } else {
      meta.setAttribute('content', color);
    }
  };

  const applyThemeMode = (mode: ThemeMode) => {
    const root = document.documentElement;

    if (mode === 'cyberpunk') {
      root.classList.add('cyberpunk');
      setTheme('dark');
    } else {
      root.classList.remove('cyberpunk');
      setTheme(mode);
    }

    localStorage.setItem(THEME_MODE_KEY, mode);
    setThemeMode(mode);
    setThemeColor(mode);
  };

  useEffect(() => {
    const root = document.documentElement;
    const storedThemeMode = localStorage.getItem(
      THEME_MODE_KEY
    ) as ThemeMode | null;

    if (storedThemeMode === 'cyberpunk') {
      root.classList.add('cyberpunk');
      setThemeMode('cyberpunk');
      setTheme('dark');
      setThemeColor('cyberpunk');
    } else {
      root.classList.remove('cyberpunk');
      const fallback = resolvedTheme === 'dark' ? 'dark' : 'light';
      setThemeMode(fallback);
      setThemeColor(fallback);
    }

    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className='w-10 h-10' />;
  }

  const toggleTheme = () => {
    const nextMode = getNextThemeMode(themeMode);

    if (!(document as any).startViewTransition) {
      applyThemeMode(nextMode);
      return;
    }

    (document as any).startViewTransition(() => {
      applyThemeMode(nextMode);
    });
  };

  return (
    <button
      onClick={toggleTheme}
      className='w-10 h-10 p-2 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200/50 dark:text-gray-300 dark:hover:bg-gray-700/50 transition-colors'
      aria-label='Toggle theme'
      title={`当前主题：${themeMode}`}
    >
      {themeMode === 'cyberpunk' ? (
        <Sparkles className='w-full h-full text-fuchsia-400' />
      ) : resolvedTheme === 'dark' ? (
        <Sun className='w-full h-full' />
      ) : (
        <Moon className='w-full h-full' />
      )}
    </button>
  );
}
