// frontend/src/hooks/useSanskritTransliteration.ts
"use client";
import { useEffect, useRef, useState } from 'react';
import sanscript from '@indic-transliteration/sanscript';

// Common words that often get mis-transliterated
const FIXED_MAP: Record<string, string> = {
  "namaste": "नमस्ते",
  "surya": "सूर्य",
  "chandra": "चन्द्र",
  "rama": "राम",
  "sita": "सीता",
  "krishna": "कृष्ण",
  "gita": "गीता",
  "veda": "वेद",
  "yoga": "योग",
  "dharma": "धर्म",
  "karma": "कर्म",
  "buddha": "बुद्ध",
  "nirvana": "निर्वाण",
  "mantra": "मन्त्र",
  "guru": "गुरु",
  "atma": "आत्मा",
  "prakriti": "प्रकृति",
  "purusha": "पुरुष",
  "shanti": "शान्ति",
  "prema": "प्रेम"
};

export const useSanskritTransliteration = (
  inputValue: string,
  onChange: (value: string) => void,
  enabled: boolean
) => {
  const [localValue, setLocalValue] = useState(inputValue);
  const isConverting = useRef(false);

  // Sync external changes (e.g., clear button)
  useEffect(() => {
    if (inputValue !== localValue && !isConverting.current) {
      setLocalValue(inputValue);
    }
  }, [inputValue, localValue]);

  const handleChange = (newValue: string) => {
    if (!enabled) {
      onChange(newValue);
      setLocalValue(newValue);
      return;
    }

    // Check if the whole word matches a fixed mapping (case insensitive)
    const trimmed = newValue.trim().toLowerCase();
    if (FIXED_MAP[trimmed]) {
      isConverting.current = true;
      setLocalValue(FIXED_MAP[trimmed]);
      onChange(FIXED_MAP[trimmed]);
      isConverting.current = false;
      return;
    }

    // Otherwise use sanscript with ITRANS scheme (more forgiving)
    let converted = newValue;
    try {
      // Try ITRANS first (works for "namaste" -> "namaste" -> "नमस्ते")
      converted = sanscript.t(newValue, 'itrans', 'devanagari');
    } catch (e) {
      console.warn('ITRANS transliteration error:', e);
      try {
        // Fallback to IAST
        converted = sanscript.t(newValue, 'iast', 'devanagari');
      } catch (e2) {
        console.warn('IAST transliteration error:', e2);
      }
    }

    isConverting.current = true;
    setLocalValue(converted);
    onChange(converted);
    isConverting.current = false;
  };

  return { value: localValue, onChange: handleChange };
};