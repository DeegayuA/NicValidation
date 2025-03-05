"use client";

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { ThemeProvider as NextThemeProvider, useTheme } from 'next-themes';

const ThemeFixer = () => {
  const { theme, setTheme, systemTheme } = useTheme();

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");

    if (storedTheme === '"system"') {
      localStorage.setItem("theme", "system");
      setTheme("system");
    }

    // Ensure correct application of "system" theme
    if (theme === "system" && systemTheme) {
      setTheme(systemTheme);
    }
  }, [theme, systemTheme, setTheme]);

  return null;
};

export { ThemeFixer };

const CustomThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);

  // Ensures that the component has been mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  // Avoid rendering theme on the server side to prevent hydration mismatch
  if (!mounted) return null;

  return (
    <NextThemeProvider
      attribute="class"  // Use 'class' instead of 'data-theme' to modify HTML class attribute for TailwindCSS compatibility
      defaultTheme="system"  // Use system preference as default theme
      enableSystem  // Enable switching based on system theme
      disableTransitionOnChange={false}  // Optionally disable CSS transitions when switching themes
    >
      {children}
    </NextThemeProvider>
  );
};

export { CustomThemeProvider as ThemeProvider };
