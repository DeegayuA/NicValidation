"use client";

import React, { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useSettings } from "../settings-provider";
import { useLanguage } from "../language-provider";
import { Playfair_Display } from 'next/font/google';

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-playfair',
});

export const FlipWords = ({
  words,
  duration = 3000,
  className,
}: {
  words: string[];
  duration?: number;
  className?: string;
}) => {
  const { reducedMotion } = useSettings();
  const { language } = useLanguage();

  const [currentWord, setCurrentWord] = useState(words[0]);
  const [translatedWord, setTranslatedWord] = useState(words[0]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [useNewAnimation, setUseNewAnimation] = useState(false);

  // Fetch translation manually from an API
  const translateWord = async (word: string) => {
    // If the selected language is English (or the same as the source), do nothing
    if (language === "en") {
      setTranslatedWord(word);
      setUseNewAnimation(false);
      return;
    }

    try {
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(word)}&langpair=en|${language}`
      );
      const data = await response.json();
      let translatedText = data.responseData.translatedText;

      // Ignore invalid translations like "PLEASE SELECT TWO DISTINCT LANGUAGES"
      if (!translatedText || translatedText.includes("PLEASE SELECT TWO DISTINCT LANGUAGES")) {
        translatedText = word;
      }

      setTranslatedWord(translatedText);
      setUseNewAnimation(translatedText !== word);
    } catch (error) {
      console.error("Translation failed:", error);
      setTranslatedWord(word);
      setUseNewAnimation(false);
    }
  };

  // Function to cycle through words
  const startAnimation = useCallback(() => {
    const nextWord = words[(words.indexOf(currentWord) + 1) % words.length];
    setCurrentWord(nextWord);
    translateWord(nextWord);
    setIsAnimating(true);
  }, [currentWord, words]);

  // Auto-change words
  useEffect(() => {
    if (!isAnimating) {
      const timeout = setTimeout(() => {
        startAnimation();
      }, duration);
      return () => clearTimeout(timeout);
    }
  }, [isAnimating, duration, startAnimation]);

  return (
    <AnimatePresence onExitComplete={() => setIsAnimating(false)}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 10 }}
        exit={{
          opacity: 0,
          y: -40,
          x: 40,
          filter: "blur(8px)",
          scale: 2,
          position: "absolute",
        }}
        className={cn("z-10 inline-block relative text-left text-neutral-900 dark:text-neutral-100 px-2", className)}
        key={translatedWord}
      >
        {useNewAnimation ? (
          translatedWord
        ) : (
          translatedWord.split(" ").map((word, wordIndex) => (
            <motion.span
              key={word + wordIndex}
              initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: wordIndex * 0.3, duration: 0.3 }}
              className="inline-block whitespace-nowrap"
            >
              {word.split("").map((letter, letterIndex) => (
                <motion.h2
                  key={word + letterIndex}
                  initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{
                    delay: wordIndex * 0.3 + letterIndex * 0.05,
                    duration: 0.2,
                  }}
                  className="inline-block"
                >
                  {letter}
                </motion.h2>
              ))}
              <span className="inline-block">&nbsp;</span>
            </motion.span>
          ))
        )}
      </motion.div>
    </AnimatePresence>
  );
};
