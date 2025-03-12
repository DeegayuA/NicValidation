"use client";

import { useState, useEffect } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      if (item === null) return initialValue;

      // Fix: Remove extra surrounding quotes if any
      const cleanItem = item.replace(/^"|"$/g, "");

      if (typeof initialValue === "number") return Number(cleanItem) as T;
      if (typeof initialValue === "boolean") return (cleanItem === "true") as T;

      return cleanItem as T;
    } catch (error) {
      console.log("Error reading from localStorage:", error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      if (typeof storedValue === "string" || typeof storedValue === "number" || typeof storedValue === "boolean") {
        window.localStorage.setItem(key, String(storedValue));
      } else {
        window.localStorage.setItem(key, JSON.stringify(storedValue));
      }
    } catch (error) {
      console.log("Error saving to localStorage:", error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue] as const;
}