"use client";
import { useEffect } from 'react';

declare global {
  interface Window {
    google: any;
    onLoad: () => void;
  }
}

export const useSanskritTransliteration = (textareaRef: React.RefObject<HTMLTextAreaElement> | null) => {
  useEffect(() => {
    if (!textareaRef || !textareaRef.current) return;

    const initializeTransliteration = () => {
      if (!window.google || !window.google.elements || !window.google.elements.transliteration) {
        console.warn("Google Transliteration API not loaded yet");
        return;
      }

      try {
        const control = new window.google.elements.transliteration.TransliterationControl({
          sourceLanguage: 'en',
          destinationLanguage: ['sa'],
          shortcutKey: 'ctrl+g',
          transliterationEnabled: true,
        });

        control.makeTransliteratable([textareaRef.current], {
          adjustCursor: true,
        });
        console.log("✅ Sanskrit transliteration enabled");
      } catch (error) {
        console.error("Failed to initialize transliteration:", error);
      }
    };

    if (window.google && window.google.elements) {
      initializeTransliteration();
    } else {
      window.onLoad = initializeTransliteration;
      const timeout = setTimeout(() => {
        if (window.google && window.google.elements) {
          initializeTransliteration();
        } else {
          console.warn("Google Transliteration API failed to load within timeout");
        }
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [textareaRef]);
};