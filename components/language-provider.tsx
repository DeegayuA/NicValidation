"use client";

// Extend the Window interface to include googleTranslateInit
declare global {
  interface Window {
    googleTranslateInit: () => void;
    google?: {
      translate: {
        TranslateElement: new (options: any, element: string) => void;
      };
    };
  }
}

import React, { createContext, useContext, useEffect } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { SUPPORTED_LANGUAGES } from "@/lib/constants";

type LanguageContextType = {
  language: string;
  setLanguage: (lang: string) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useLocalStorage("language", "en");

  // Load Google Translate script dynamically
  useEffect(() => {
    if (!window.google?.translate) {
      const script = document.createElement("script");
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateInit";
      script.async = true;
      document.body.appendChild(script);
    }

    window.googleTranslateInit = () => {
      if (window.google && window.google.translate) {
        new window.google.translate.TranslateElement(
          { pageLanguage: "en", includedLanguages: SUPPORTED_LANGUAGES.map((l) => l.code).join(",") },
          "google_translate_element"
        );
      }
    };

    if (window.google?.translate) {
      window.googleTranslateInit();
    }
  }, []);

  // Function to apply translation
  const applyTranslation = () => {
    const selectElement = document.querySelector(".goog-te-combo") as HTMLSelectElement;
    if (selectElement) {
      selectElement.value = language;
      selectElement.dispatchEvent(new Event("change"));
    }
  };

  useEffect(() => {
    setTimeout(() => {
      if (window.google?.translate) {
        applyTranslation();
      }
    }, 1500);
  }, [language]);

  // **Remove translations and reload only once when switching back to English**
  useEffect(() => {
    if (language === "en" && sessionStorage.getItem("reload-once") !== "true") {
      sessionStorage.setItem("reload-once", "true");

      setTimeout(() => {
        const frame = document.querySelector(".goog-te-banner-frame") as HTMLIFrameElement | null;        if (frame) {
          const resetButton = frame.contentDocument?.querySelector(".goog-te-button") as HTMLElement;
          if (resetButton) resetButton.click();
        }

        document.body.style.transform = ""; // Remove any Google Translate styling

        setTimeout(() => {
          window.location.reload();
        }, 1000); // Reload after 1 second
      }, 500);
    } else if (language !== "en") {
      sessionStorage.removeItem("reload-once"); // Allow reload when switching away from English again
    }
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
      <div id="google_translate_element" className="hidden"></div>
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
