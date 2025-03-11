"use client";

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Settings, Moon, Sun, Globe, Dot } from 'lucide-react';
import { useTheme } from 'next-themes'; // Importing useTheme
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { SettingsPanel } from './settings-panel';
import { useSettings } from '@/components/settings-provider';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ACCENT_COLORS } from '@/lib/constants';
import { FloatingNav } from './ui/floating-navbar';
import { LanguagePanel } from './LanguagePanel';

export function MainNavbar() {
  const { setTheme, theme } = useTheme(); // Using useTheme hook
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false); 
  const { accentColor, fontSize, setAccentColor } = useSettings();

  const handleThemeChange = () => {
    let newTheme: 'dark' | 'light';
  
    // Switch between themes based on current theme
    if (theme === 'dark') {
      newTheme = 'light';
    } else {
      newTheme = 'dark'; // Set to dark if not light
    }
  
    // Set the new theme
    setTheme(newTheme);
  
    // Update accent color based on the new theme
    const html = document.querySelector('html');
    if (html) {
      let mode = newTheme === 'light' ? 'lightMode' : 'darkMode';
  
      // Find and set the correct accent color based on the mode
      const currentAccent = ACCENT_COLORS.find(
        (color) => color.lightMode === accentColor || color.darkMode === accentColor
      );
  
      if (currentAccent) {
        // Set the accent color based on mode (lightMode or darkMode)
        setAccentColor(currentAccent[mode as 'lightMode' | 'darkMode']);
      } else {
        // Default to a fallback accent color if no match is found
        setAccentColor(ACCENT_COLORS[5][mode as 'lightMode' | 'darkMode']);
      }
    }
  };

  const navItems = [
        // { 
    //   name: "|", 
    //   divider: true, 
    //   icon: <Dot className="h-3 w-3 sm:h-3 sm:w-3 text-foreground ml-2" /> 
    // },
    // {
    //   name: "Home",
    //   link: "/",
    //   icon: <IconHome className="h-3 w-3 sm:h-5 sm:w-5 bg-transparent text-foreground hover:filter hover:brightness-110 hover:hue-rotate(10deg) hover:bg-muted/10 hover:text-accent-foreground" />,
    //   hideOnMd: true,
    // },
    // {
    //   name: "App",
    //   link: "/web/app",
    //   icon: <IconAppWindow className="h-3 w-3 sm:h-5 sm:w-5 bg-transparent text-foreground hover:filter hover:brightness-110 hover:hue-rotate(10deg) hover:bg-muted/10 hover:text-accent-foreground" />,
    // },
    // {
    //   name: "Contact",
    //   link: "/web/contact",
    //   icon: (
    //     <IconMessage className="h-3 w-3 sm:h-5 sm:w-5 bg-transparent text-foreground hover:filter hover:brightness-110 hover:hue-rotate(10deg) hover:bg-muted/10 hover:text-accent-foreground" />
    //   ),
    // },
    // {
    //   name: "About",
    //   link: "/web/about",
    //   icon: (
    //     <IconUsersGroup className="h-3 w-3 sm:h-5 sm:w-5 bg-transparent text-foreground hover:filter hover:brightness-110 hover:hue-rotate(10deg) hover:bg-muted/10 hover:text-accent-foreground" />
    //   ),
    // }, 
    {
      name: "Settings",
      onClick: () => setSettingsOpen(true),
      icon: <Settings className="h-3 w-3 sm:h-5 sm:w-5 bg-transparent text-foreground hover:filter hover:brightness-110 hover:hue-rotate(10deg) hover:bg-muted/10 hover:text-accent-foreground" />,
      fontSizeClass: fontSize ? `text-${fontSize}` : 'text-base',
    },
    {
      name: "Language",
      onClick: () => setLanguageOpen(true),
      icon: <Globe className="h-3 w-3 sm:h-5 sm:w-5 text-foreground hover:text-accent-foreground" />,
      fontSizeClass: fontSize ? `text-${fontSize}` : 'text-base',
    },
    {
      name: theme === "light" ? "Dark" : "Light", // Toggle button text
      onClick: handleThemeChange,
      icon: theme === "light" ? (
        <Moon className="h-3 w-3 sm:h-5 sm:w-5 bg-transparent text-foreground hover:filter hover:brightness-110 hover:hue-rotate(10deg) hover:bg-muted/10 hover:text-accent-foreground" />
      ) : (
        <Sun className="h-3 w-3 sm:h-5 sm:w-5 bg-transparent text-foreground hover:filter hover:brightness-110 hover:hue-rotate(10deg) hover:bg-muted/10 hover:text-accent-foreground" />
      ),
      fontSizeClass: fontSize ? `text-${fontSize}` : 'text-base',
    },
    { 
      name: "|", 
      divider: true, 
      icon: <Dot className="h-3 w-3 sm:h-3 sm:w-3 text-foreground mr-2" /> 
    },
  ];

  return (
    <header className={cn("sticky top-0 z-50 backdrop-blur-md border-b w-full")} style={{ backgroundColor: accentColor }}>
      <div className="fixed w-full">
        <FloatingNav 
          navItems={navItems.map(item => ({
            ...item,
            className: item.fontSizeClass 
          }))} 
        />
      </div>
      <SettingsPanel open={settingsOpen} onOpenChange={setSettingsOpen} />
      <LanguagePanel open={languageOpen} onOpenChange={setLanguageOpen} />
    </header>
  );
}