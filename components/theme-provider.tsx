"use client";
import { useState, useEffect } from 'react';
import { ThemeProvider as NextThemeProvider, useTheme } from 'next-themes';

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
      enableSystem={false}  // Disable system theme preference
      enableColorScheme={true} // Enable color scheme to respect 'dark' or 'light' classes
      disableTransitionOnChange={false}  // Optional: to avoid transition effects when switching themes
      defaultTheme="dark"  // Set 'dark' as the default theme
    >
      {children}
    </NextThemeProvider>
  );
};

export { CustomThemeProvider as ThemeProvider };