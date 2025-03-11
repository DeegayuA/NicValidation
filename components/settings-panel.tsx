"use client";

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useSettings } from '@/components/settings-provider';
import { Circle, Moon, Sun } from 'lucide-react';
import { ACCENT_COLORS, getRandomColor } from '@/lib/constants';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from '@/components/ui/tooltip';

interface SettingsPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// const themePalettes = Object.entries(THEME_COLORS)
//   .filter(([key]) => key.startsWith('palette-'))
//   .map(([key, value]) => ({
//     name: key.replace('palette-', '').replace(/-/g, ' '),
//     value: key,
//     primary: value.primary,
//     secondary: value.secondary,
//     backgroundLight: value.backgroundLight,
//     backgroundDark: value.backgroundDark,
//     textLight: value.textLight,
//     textDark: value.textDark,
//   }));

export function SettingsPanel({ open, onOpenChange }: SettingsPanelProps) {
  const { theme, setHapticFeedback, hapticFeedback, setFontSize, fontSize, setLineHeight, lineHeight, setLetterSpacing, letterSpacing, setReducedMotion, reducedMotion, setHighContrast, highContrast, setScreenReader, screenReader, setAntiFlicker, antiFlicker, setAccentColor, accentColor, setPalette, palette } = useSettings();
  const { setTheme: setNextTheme } = useTheme();
  const [filteredAccentColors, setFilteredAccentColors] = useState(() => {
    return ACCENT_COLORS.map(color => {
      const mode = theme === 'light' ? 'lightMode' : 'darkMode';
      return {
        name: color.name,
        value: color[mode],
        mode: mode
      }
    });
  });

  useEffect(() => {
    const html = document.querySelector('html');
    if (!html) return;

    // Helper function to apply theme and accent color instantly
    const applyThemeAndAccent = (currentTheme: string) => {
      const mode = currentTheme === 'dark' ? 'lightMode' : 'darkMode';

      // Filter and update accent colors based on the theme
      const updatedAccentColors = ACCENT_COLORS.map(color => ({
        name: color.name,
        value: color[mode],
        mode: mode,
      }));
      setFilteredAccentColors(updatedAccentColors);

      // Update the accent color if it's part of ACCENT_COLORS
      const currentAccent = ACCENT_COLORS.find(
        color => color.lightMode === accentColor || color.darkMode === accentColor
      );
      if (currentAccent) {
        const newAccentColor = mode === 'lightMode' ? currentAccent.lightMode : currentAccent.darkMode;
        if (newAccentColor !== accentColor) {
          setAccentColor(newAccentColor);
        }
      }
    };

    // Apply theme and accent color on load
    const initialTheme = html.classList.contains('light') ? 'dark' : 'light';
    applyThemeAndAccent(initialTheme);

    // Observe for theme changes
    const observer = new MutationObserver(() => {
      const currentTheme = html.classList.contains('dark') ? 'dark' : 'light';
      applyThemeAndAccent(currentTheme);
    });

    observer.observe(html, { attributes: true, attributeFilter: ['class'] });

    // Cleanup observer on component unmount
    return () => observer.disconnect();
  }, [accentColor]);

  const handleHapticFeedbackChange = (haptic: boolean) => {
    setHapticFeedback(haptic);
    if (haptic && typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };

  const handleResetSettings = () => {
    const isMobile = window.innerWidth <= 768;

    setFontSize(isMobile ? 10 : 14);
    setLineHeight(isMobile ? 1.4 : 1.5);
    setLetterSpacing(isMobile ? 0.1 : 0);
    setReducedMotion(false);
    setHighContrast(false);
    setScreenReader(false);
    setAntiFlicker(false);
    setHapticFeedback(false);
    setPalette('palette-1');
  };

  const [isRandom, setIsRandom] = useState(false);

  useEffect(() => {
    if (isRandom) {
      // Retrieve visit count from localStorage
      const visitCount = parseInt(localStorage.getItem('visitCount') || '0', 10);
  
      // Increment visit count
      localStorage.setItem('visitCount', (visitCount + 1).toString());
  
      // Change the accent color once per visit
      const randomColor = getRandomColor();
      const mode = theme === 'light' ? 'lightMode' : 'darkMode';
      setAccentColor(randomColor[mode]);
    }
  }, [isRandom, theme]);
  
  
  

  const handleAccentColorChange = (color: string) => {
    if (color === ACCENT_COLORS[0].lightMode || color === ACCENT_COLORS[0].darkMode) {
      setIsRandom(true);
      const randomColor = getRandomColor();
      const mode = theme === 'light' ? 'lightMode' : 'darkMode';
      setAccentColor(randomColor[mode]);
    } else {
      setIsRandom(false);
      setAccentColor(color);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]" style={{ fontSize, lineHeight, letterSpacing: `${letterSpacing}px` }}>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Customize your experience.
          </DialogDescription>
        </DialogHeader>
        <div className="py-0 space-y-2">
          {/* <div className="flex items-center justify-between">
                <Label htmlFor="theme-toggle">Theme</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleThemeChange}
                >
                  {theme === 'light' ? <Moon className="h-5 w-5 mr-2" /> : <Sun className="h-5 w-5 mr-2" />}
                  {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                </Button>
              </div> */}
          <div className="flex items-center justify-between">
            <Label htmlFor="haptic-feedback">Haptic Feedback</Label>
            <Switch
              id="haptic-feedback"
              checked={hapticFeedback}
              onCheckedChange={handleHapticFeedbackChange}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="reduced-motion">Reduced Motion</Label>
            <Switch
              id="reduced-motion"
              checked={reducedMotion}
              onCheckedChange={setReducedMotion}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="high-contrast">High Contrast</Label>
            <Switch
              id="high-contrast"
              checked={highContrast}
              onCheckedChange={setHighContrast}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="screen-reader">Screen Reader Support</Label>
            <Switch
              id="screen-reader"
              checked={screenReader}
              onCheckedChange={setScreenReader}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="anti-flicker">Anti-Flicker</Label>
            <Switch
              id="anti-flicker"
              checked={antiFlicker}
              onCheckedChange={setAntiFlicker}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="font-size">Font Size</Label>
            <Slider
              id="font-size"
              min={6}
              max={24}
              step={2}
              value={[fontSize]}
              onValueChange={(value) => setFontSize(value[0])}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="line-height">Line Height</Label>
            <Slider
              id="line-height"
              min={1}
              max={2}
              step={0.1}
              value={[lineHeight]}
              onValueChange={(value) => setLineHeight(value[0])}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="letter-spacing">Letter Spacing</Label>
            <Slider
              id="letter-spacing"
              min={-2}
              max={2}
              step={0.1}
              value={[letterSpacing]}
              onValueChange={(value) => setLetterSpacing(value[0])}
            />
          </div>
          <div className="space-y-2">
            <Label>Accent Color</Label>
            <div className="flex items-center gap-2 flex-wrap">
              <TooltipProvider>
                {filteredAccentColors.map((color, index) => (
                  <Tooltip key={color.value}>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => handleAccentColorChange(color.value)}
                        className={cn(
                          'h-6 w-6 rounded-full border-2 border-transparent flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                          accentColor === color.value && 'ring-2 ring-primary',
                        )}
                        style={{ backgroundColor: color.value }}
                      >
                        {index === 0 && <span className="text-white text-xs font-bold">R</span>}
                        <span className="sr-only">{color.name}</span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" align="center">
                      {color.name}
                    </TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
            </div>

          </div>

          {/* <div className="space-y-2">
                <Label>Theme Palette</Label>
                <div className="flex items-center gap-2 flex-wrap">
                  {themePalettes.map((paletteItem) => (
                    <button
                      key={paletteItem.value}
                      onClick={() => handlePaletteChange(paletteItem.value)}
                      className={cn(
                        'h-12 w-12 rounded-md border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                        palette === paletteItem.value && 'ring-2 ring-primary',
                      )}
                    >
                      <div className="flex flex-col h-full w-full">
                        <div className="h-1/6 w-full" style={{ backgroundColor: THEME_COLORS[paletteItem.value as keyof typeof THEME_COLORS]?.primary }} />
                        <div className="h-1/6 w-full" style={{ backgroundColor: THEME_COLORS[paletteItem.value as keyof typeof THEME_COLORS]?.secondary }} />
                        <div className="h-1/6 w-full" style={{ backgroundColor: THEME_COLORS[paletteItem.value as keyof typeof THEME_COLORS]?.backgroundLight }} />
                        <div className="h-1/6 w-full" style={{ backgroundColor: THEME_COLORS[paletteItem.value as keyof typeof THEME_COLORS]?.backgroundDark }} />
                        <div className="h-1/6 w-full" style={{ backgroundColor: THEME_COLORS[paletteItem.value as keyof typeof THEME_COLORS]?.textLight }} />
                        <div className="h-1/6 w-full" style={{ backgroundColor: THEME_COLORS[paletteItem.value as keyof typeof THEME_COLORS]?.textDark }} />
                      </div>
                      <span className="sr-only">
                        {paletteItem.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div> */}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleResetSettings}>
            Reset Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
