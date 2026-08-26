<<<<<<< HEAD
﻿import React, { useState, useRef } from 'react';
import VirtualKeyboard from './VirtualKeyboard'; // Make sure the path is correct
=======
import React, { useState, useRef } from 'react';
import VirtualKeyboard from './VirtualKeyboard';
import { motion, AnimatePresence } from 'framer-motion';
import { Keyboard, X } from 'lucide-react';
>>>>>>> 07c3d9f08eff2b3ab07b9877857805df5f6a218d

interface SanskritInputProps {
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
    style?: React.CSSProperties;
    className?: string;
    showLabel?: boolean;
}

export default function SanskritInput({ 
    value, 
    onChange, 
<<<<<<< HEAD
    placeholder = "Type in English, or use the virtual keyboard for Hindi/Sanskrit...",
=======
    placeholder = "Type in English, or use the virtual keyboard for Devanagari/Sanskrit...",
>>>>>>> 07c3d9f08eff2b3ab07b9877857805df5f6a218d
    style,
    className = "",
    showLabel = true
}: SanskritInputProps) {
    const [showKeyboard, setShowKeyboard] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const normalizeSanskrit = (input: string) => {
        const matraMap: { [key: string]: string } = {
            'अ': '',
            'आ': 'ा',
            'इ': 'ि',
            'ई': 'ी',
            'उ': 'ु',
            'ऊ': 'ू',
            'ऋ': 'ृ',
            'ए': 'े',
            'ऐ': 'ै',
            'ओ': 'ो',
            'औ': 'ौ',
        };

        let result = input;
<<<<<<< HEAD
        // Handle Halant + Vowel -> Matra (e.g., न् + अ -> न, न् + आ -> ना)
=======
>>>>>>> 07c3d9f08eff2b3ab07b9877857805df5f6a218d
        for (const [vowel, matra] of Object.entries(matraMap)) {
            const pattern = new RegExp(`्${vowel}`, 'g');
            result = result.replace(pattern, matra);
        }
        return result;
    };

    const handleKeyPress = (char: string) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;

<<<<<<< HEAD
        // Insert char then normalize
=======
>>>>>>> 07c3d9f08eff2b3ab07b9877857805df5f6a218d
        const rawText = value.substring(0, start) + char + value.substring(end);
        const normalized = normalizeSanskrit(rawText);
        
        onChange(normalized);

<<<<<<< HEAD
        // Adjust cursor position
=======
>>>>>>> 07c3d9f08eff2b3ab07b9877857805df5f6a218d
        const lengthDiff = rawText.length - normalized.length;
        setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd = start + char.length - lengthDiff;
            textarea.focus();
        }, 0);
    };

    const handleNativeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newVal = normalizeSanskrit(e.target.value);
        onChange(newVal);
    };

    const handleBackspace = () => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;

        if (start !== end) {
            onChange(value.substring(0, start) + value.substring(end));
            setTimeout(() => {
                textarea.selectionStart = textarea.selectionEnd = start;
                textarea.focus();
            }, 0);
        } else if (start > 0) {
            onChange(value.substring(0, start - 1) + value.substring(end));
            setTimeout(() => {
                textarea.selectionStart = textarea.selectionEnd = start - 1;
                textarea.focus();
            }, 0);
        }
    };

    return (
<<<<<<< HEAD
        <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>

            {/* Header & Toggle Button */}
            <div style={{ display: 'flex', justifyContent: showLabel ? 'space-between' : 'flex-end', marginBottom: '12px' }}>
                {showLabel && (
                    <label style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--text-main)', letterSpacing: '-0.2px' }}>
                        Enter Text (पाठम् लिखतु)
                    </label>
                )}
                <button
                    onClick={() => setShowKeyboard(!showKeyboard)}
                    style={{
                        padding: '10px 20px',
                        background: showKeyboard ? '#e74c3c' : 'var(--primary)',
                        color: 'white',
                        borderRadius: '12px',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: '700',
                        fontSize: '0.8rem',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: '0 8px 20px rgba(var(--primary-rgb), 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}
                >
                    {showKeyboard ? '✕ Close Keyboard' : '⌨️ Devanagari Keyboard'}
                </button>
            </div>

            {/* The Actual Text Box */}
=======
        <div style={{ position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>

            {/* Header Controls */}
            <div className="flex items-center justify-between">
                {showLabel ? (
                    <label style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-main)', letterSpacing: '-0.2px' }}>
                        Enter Text (पाठम् लिखतु)
                    </label>
                ) : <div />}

                <button
                    type="button"
                    onClick={() => setShowKeyboard(!showKeyboard)}
                    style={{
                        padding: '7px 14px',
                        background: showKeyboard ? 'var(--accent-rose)' : 'var(--primary-light)',
                        color: showKeyboard ? '#ffffff' : 'var(--primary)',
                        borderRadius: '10px',
                        border: showKeyboard ? 'none' : '1px solid rgba(var(--primary-rgb), 0.25)',
                        cursor: 'pointer',
                        fontWeight: '700',
                        fontSize: '0.78rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        transition: 'all 0.25s var(--transition)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                    }}
                >
                    {showKeyboard ? <X size={14} /> : <Keyboard size={14} />}
                    <span>{showKeyboard ? 'Close Keyboard' : 'Devanagari Keyboard'}</span>
                </button>
            </div>

            {/* Textarea Input */}
>>>>>>> 07c3d9f08eff2b3ab07b9877857805df5f6a218d
            <textarea
                ref={textareaRef}
                value={value}
                onChange={handleNativeChange}
<<<<<<< HEAD
                onClick={() => {
                    if (textareaRef.current) textareaRef.current.focus();
                }}
                placeholder={placeholder}
                style={{
                    width: '100%',
                    minHeight: '150px',
                    padding: '24px',
                    fontSize: '1.25rem',
                    borderRadius: '24px',
                    border: '1.5px solid var(--border-soft)',
                    background: 'var(--bg-card)',
                    color: 'var(--text-main)',
                    fontFamily: '"Noto Sans Devanagari", sans-serif',
                    resize: 'none',
                    flex: 1,
                    boxShadow: 'var(--shadow)',
                    ...style
                }}
                className={`focus:outline-none focus:border-primary ${className}`}
            />

            {/* Render the Keyboard conditionally */}
            {showKeyboard && (
                <div style={{ marginTop: '20px' }}>
                    <VirtualKeyboard
                        onKeyPress={handleKeyPress}
                        onBackspace={handleBackspace}
                        onClose={() => setShowKeyboard(false)}
                    />
                </div>
            )}

        </div>
    );
}
=======
                placeholder={placeholder}
                style={{
                    width: '100%',
                    minHeight: '160px',
                    padding: '20px 24px',
                    fontSize: '1.35rem',
                    lineHeight: '1.5',
                    borderRadius: '20px',
                    border: '1.5px solid var(--border-soft)',
                    background: 'var(--bg-card)',
                    color: 'var(--text-main)',
                    fontFamily: '"Noto Sans Devanagari", "Plus Jakarta Sans", sans-serif',
                    resize: 'vertical',
                    outline: 'none',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'border-color 0.25s, box-shadow 0.25s',
                    ...style
                }}
                className={`focus:border-primary ${className}`}
            />

            {/* Virtual Keyboard Accordion */}
            <AnimatePresence>
                {showKeyboard && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0, y: -10 }}
                        animate={{ opacity: 1, height: 'auto', y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        style={{ overflow: 'hidden', marginTop: '4px' }}
                    >
                        <VirtualKeyboard
                            onKeyPress={handleKeyPress}
                            onBackspace={handleBackspace}
                            onClose={() => setShowKeyboard(false)}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}
>>>>>>> 07c3d9f08eff2b3ab07b9877857805df5f6a218d
