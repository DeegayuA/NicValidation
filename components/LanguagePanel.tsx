"use client";

import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SUPPORTED_LANGUAGES } from "@/lib/constants";
import { useLanguage } from "./language-provider";

interface LanguagePanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LanguagePanel({ open, onOpenChange }: LanguagePanelProps) {
  const { language, setLanguage } = useLanguage(); // Get language context
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang); // Update global language context
  };

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      setIsScrolled(scrollContainer.scrollTop > 0);
      setIsAtBottom(
        scrollContainer.scrollHeight - scrollContainer.scrollTop <= scrollContainer.clientHeight + 2
      );
    };

    scrollContainer.addEventListener("scroll", handleScroll);
    handleScroll(); // Initialize on mount

    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
    };
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Select Language</DialogTitle>
        </DialogHeader>
        <div className="relative">
          <div
            ref={scrollContainerRef}
            className="max-h-[300px] overflow-y-auto flex flex-col gap-2 scrollbar-thin"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <Button
                key={lang.code}
                variant={language === lang.code ? "default" : "outline"}
                onClick={() => handleLanguageChange(lang.code)}
                className="w-full flex items-center gap-2"
              >
                <span>{lang.flag}</span> {/* Display the flag */}
                <span>{lang.name}</span> {/* Display the language name */}
              </Button>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
