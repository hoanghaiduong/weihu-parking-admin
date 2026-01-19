import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light' | 'system';
export type BrandColor = 'lime' | 'blue' | 'purple' | 'orange' | 'cyan';
export type FontFamily = 'jakarta' | 'inter' | 'roboto';

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  defaultColor?: BrandColor;
  defaultFont?: FontFamily;
  storageKey?: string;
  colorKey?: string;
  fontKey?: string;
}

interface ThemeProviderState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  brandColor: BrandColor;
  setBrandColor: (color: BrandColor) => void;
  fontFamily: FontFamily;
  setFontFamily: (font: FontFamily) => void;
}

const initialState: ThemeProviderState = {
  theme: 'light',
  setTheme: () => null,
  brandColor: 'cyan',
  setBrandColor: () => null,
  fontFamily: 'jakarta',
  setFontFamily: () => null,
};

const ThemeContext = createContext<ThemeProviderState>(initialState);

const COLOR_MAP: Record<BrandColor, string> = {
  lime: '132 204 22',
  blue: '59 130 246',
  purple: '168 85 247',
  orange: '249 115 22',
  cyan: '6 182 212',
};

const FONT_MAP: Record<FontFamily, string> = {
  jakarta: '"Plus Jakarta Sans"',
  inter: '"Inter"',
  roboto: '"Roboto"',
};

export function ThemeProvider({
  children,
  defaultTheme = 'light',
  defaultColor = 'cyan',
  defaultFont = 'jakarta',
  storageKey = 'weihu-ui-theme-v2',
  colorKey = 'weihu-brand-color-v2',
  fontKey = 'weihu-font-family-v1',
  ...props
}: ThemeProviderProps) {
  
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );

  const [brandColor, setBrandColor] = useState<BrandColor>(
    () => (localStorage.getItem(colorKey) as BrandColor) || defaultColor
  );

  const [fontFamily, setFontFamily] = useState<FontFamily>(
    () => (localStorage.getItem(fontKey) as FontFamily) || defaultFont
  );

  // Apply Theme
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('dark');
    const applySystemTheme = () => {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.toggle('dark', systemTheme === 'dark');
    };

    if (theme === 'system') {
      applySystemTheme();
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applySystemTheme();
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      root.classList.toggle('dark', theme === 'dark');
    }
  }, [theme]);

  // Apply Brand Color
  useEffect(() => {
    const root = window.document.documentElement;
    root.style.setProperty('--primary', COLOR_MAP[brandColor] || COLOR_MAP.cyan);
  }, [brandColor]);

  // Apply Font Family
  useEffect(() => {
    const root = window.document.documentElement;
    root.style.setProperty('--font-sans', FONT_MAP[fontFamily] || FONT_MAP.jakarta);
  }, [fontFamily]);

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      localStorage.setItem(storageKey, newTheme);
      setTheme(newTheme);
    },
    brandColor,
    setBrandColor: (newColor: BrandColor) => {
      localStorage.setItem(colorKey, newColor);
      setBrandColor(newColor);
    },
    fontFamily,
    setFontFamily: (newFont: FontFamily) => {
      localStorage.setItem(fontKey, newFont);
      setFontFamily(newFont);
    }
  };

  return (
    <ThemeContext.Provider {...props} value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};