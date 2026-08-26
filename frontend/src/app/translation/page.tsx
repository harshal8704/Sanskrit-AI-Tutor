<<<<<<< HEAD
// frontend/src/app/translation/page.tsx
=======
>>>>>>> 07c3d9f08eff2b3ab07b9877857805df5f6a218d
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import Sidebar from "@/components/Sidebar";
<<<<<<< HEAD
import { useSanskritTransliteration } from "@/hooks/useSanskritTransliteration";
import WordSuggestions from "@/components/WordSuggestions";
=======
import SanskritInput from "@/components/SanskritInput";
>>>>>>> 07c3d9f08eff2b3ab07b9877857805df5f6a218d
import { motion, AnimatePresence } from "framer-motion";
import { 
  Languages, 
  ArrowRightLeft, 
  Database, 
  Globe,
  Loader2,
  BookMarked,
  Sparkles,
  Info,
<<<<<<< HEAD
  Zap,
  Volume2
=======
  ChevronRight,
  Zap
>>>>>>> 07c3d9f08eff2b3ab07b9877857805df5f6a218d
} from "lucide-react";

export default function Translation() {
  const [user, setUser] = useState<any>(null);
<<<<<<< HEAD
  const [suggestionsPrefix, setSuggestionsPrefix] = useState("");
=======
>>>>>>> 07c3d9f08eff2b3ab07b9877857805df5f6a218d
  const [inputText, setInputText] = useState("");
  const [results, setResults] = useState<any>(null);
  const [direction, setDirection] = useState("en_to_sa");
  const [useApi, setUseApi] = useState(true);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

<<<<<<< HEAD
  // Enable transliteration only when direction is sa_to_en (user typing Sanskrit)
  const shouldTransliterate = direction === 'sa_to_en';
  const transliteration = useSanskritTransliteration(
    inputText,
    setInputText,
    shouldTransliterate
  );

=======
>>>>>>> 07c3d9f08eff2b3ab07b9877857805df5f6a218d
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/");
      return;
    }
    setUser(JSON.parse(storedUser));
  }, [router]);

  const handleTranslate = async () => {
    if (!inputText) return;
    setLoading(true);
    setResults(null);
    try {
      const res = await api.tools.translate({ text: inputText, direction, use_api: useApi });
      setResults(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const swapDirection = () => {
    setDirection(prev => prev === 'en_to_sa' ? 'sa_to_en' : 'en_to_sa');
    setInputText("");
    setResults(null);
<<<<<<< HEAD
    setSuggestionsPrefix("");
=======
>>>>>>> 07c3d9f08eff2b3ab07b9877857805df5f6a218d
  };

  if (!user) return null;

  return (
    <div className="page-layout">
      <Sidebar user={user} />
      
      <main className="main-content">
<<<<<<< HEAD
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="zen-card"
          style={{ marginBottom: '40px', padding: '40px', borderRadius: '30px' }}
        >
          <div className="flex items-center gap-3 mb-4">
             <motion.div 
                whileHover={{ rotate: 180 }}
                className="logo-box" 
                style={{ background: 'var(--accent)' }}
             >
                <Languages size={20} />
             </motion.div>
             <span style={{ color: 'var(--accent)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.75rem' }}>Neural Linguistic Bridge</span>
          </div>
          <h1 style={{ fontSize: '3.5rem', marginBottom: '12px', letterSpacing: '-2px', fontWeight: '800' }}>Divine Translator</h1>
          <p style={{ color: 'var(--text-dim)', fontSize: '1.2rem', maxWidth: '650px', lineHeight: '1.6' }}>
            Seamlessly deconstruct and reassemble meanings across the cultural divide between English and Sanskrit.
          </p>
        </motion.header>

        <div className="grid" style={{ gridTemplateColumns: '1.6fr 1fr', alignItems: 'start', gap: '40px' }}>
          
          <div className="flex flex-col gap-8">
=======
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="zen-card"
          style={{ 
            padding: '32px 36px', 
            marginBottom: '32px', 
            borderRadius: '28px',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '250px', height: '250px', background: 'var(--primary)', opacity: 0.06, borderRadius: '50%', filter: 'blur(70px)', pointerEvents: 'none' }}></div>

          <div className="badge badge-primary mb-2" style={{ padding: '6px 14px', fontSize: '0.78rem' }}>
             <Languages size={14} /> Bilingual Studio
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 400, marginBottom: '6px' }}>Sanskrit Translation Studio</h1>
          <p style={{ color: 'var(--text-dim)', fontSize: '1.05rem', maxWidth: '650px', lineHeight: '1.5', fontWeight: 500 }}>
            Translate seamlessly between English and Classical Sanskrit with dictionary roots and AI contextual analysis.
          </p>
        </motion.header>

        <div className="grid" style={{ gridTemplateColumns: '1.6fr 1fr', alignItems: 'start', gap: '32px' }}>
          
          <div className="flex flex-col gap-6">
            {/* Input Composer Box */}
>>>>>>> 07c3d9f08eff2b3ab07b9877857805df5f6a218d
            <motion.div 
               layout
               initial={{ opacity: 0, scale: 0.98 }}
               animate={{ opacity: 1, scale: 1 }}
<<<<<<< HEAD
               className="zen-card overflow-hidden"
               style={{ padding: '0', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.08)' }}
            >
              <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'var(--border-soft)', background: 'var(--bg-card)' }}>
                <div className="flex items-center gap-6">
                  <motion.div 
                    animate={{ color: direction === 'en_to_sa' ? 'var(--primary)' : 'var(--text-dim)' }}
                    style={{ fontWeight: '800', fontSize: '0.8rem', letterSpacing: '1px' }}
                  >ENGLISH</motion.div>
=======
               className="zen-card"
               style={{ 
                 padding: '24px', 
                 borderRadius: '28px'
               }}
            >
              {/* Header Toolbar */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                paddingBottom: '20px', 
                marginBottom: '20px',
                borderBottom: '1px solid var(--border-soft)'
              }}>
                <div className="flex items-center gap-4">
                  <motion.div animate={{ color: direction === 'en_to_sa' ? 'var(--primary)' : 'var(--text-dim)' }} style={{ fontWeight: '800', fontSize: '0.88rem', letterSpacing: '1.5px' }}>ENGLISH</motion.div>
>>>>>>> 07c3d9f08eff2b3ab07b9877857805df5f6a218d
                  
                  <motion.button 
                    whileHover={{ scale: 1.1, rotate: 180 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={swapDirection}
<<<<<<< HEAD
                    style={{ 
                        background: 'var(--bg-main)', 
                        border: '1px solid var(--border-soft)', 
                        borderRadius: '12px', 
                        width: '40px', 
                        height: '40px',
=======
                    title="Swap Translation Direction"
                    style={{ 
                        background: 'var(--bg-main)', 
                        border: '1px solid var(--border-soft)', 
                        borderRadius: '50%', 
                        width: '38px', 
                        height: '38px',
>>>>>>> 07c3d9f08eff2b3ab07b9877857805df5f6a218d
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
<<<<<<< HEAD
                        color: 'var(--primary)'
=======
                        color: 'var(--primary)',
                        boxShadow: 'var(--shadow-sm)'
>>>>>>> 07c3d9f08eff2b3ab07b9877857805df5f6a218d
                    }}
                  >
                    <ArrowRightLeft size={16} />
                  </motion.button>
                  
<<<<<<< HEAD
                  <motion.div 
                    animate={{ color: direction === 'sa_to_en' ? 'var(--primary)' : 'var(--text-dim)' }}
                    style={{ fontWeight: '800', fontSize: '0.8rem', letterSpacing: '1px' }}
                  >SANSKRIT</motion.div>
                </div>
                
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div className="relative flex items-center">
                        <input 
                        type="checkbox" 
                        className="sr-only"
                        checked={useApi} 
                        onChange={(e) => setUseApi(e.target.checked)}
                        />
                        <div className={`w-10 h-5 rounded-full transition-colors ${useApi ? 'bg-primary' : 'bg-gray-300'}`} style={{ backgroundColor: useApi ? 'var(--primary)' : 'var(--border-soft)' }}></div>
                        <div className={`absolute w-3 h-3 bg-white rounded-full transition-transform ${useApi ? 'translate-x-6' : 'translate-x-1'}`}></div>
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-dim)' }} className="group-hover:text-primary transition-colors">AI ENGINE</span>
=======
                  <motion.div animate={{ color: direction === 'sa_to_en' ? 'var(--primary)' : 'var(--text-dim)' }} style={{ fontWeight: '800', fontSize: '0.88rem', letterSpacing: '1.5px' }}>SANSKRIT</motion.div>
                </div>
                
                <div className="flex items-center">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', userSelect: 'none' }}>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <input 
                          type="checkbox" 
                          style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
                          checked={useApi} 
                          onChange={(e) => setUseApi(e.target.checked)}
                        />
                        <div style={{ width: '44px', height: '22px', borderRadius: '12px', transition: 'all 0.3s', backgroundColor: useApi ? 'var(--primary)' : 'var(--border-soft)' }}></div>
                        <div style={{ position: 'absolute', width: '16px', height: '16px', backgroundColor: '#fff', borderRadius: '50%', transition: 'all 0.3s', transform: useApi ? 'translateX(24px)' : 'translateX(3px)' }}></div>
                    </div>
                    <span style={{ fontSize: '0.78rem', fontWeight: '800', color: useApi ? 'var(--primary)' : 'var(--text-dim)', letterSpacing: '0.5px' }}>AI ENGINE</span>
>>>>>>> 07c3d9f08eff2b3ab07b9877857805df5f6a218d
                  </label>
                </div>
              </div>

<<<<<<< HEAD
              {/* Textarea and Suggestions Container */}
              <div style={{ position: 'relative', background: 'var(--bg-card)' }}>
                <textarea 
                  className="w-full" 
                  style={{ 
                    minHeight: '260px', 
                    fontSize: direction === 'sa_to_en' ? '2.2rem' : '1.6rem',
                    lineHeight: '1.4',
                    background: 'transparent',
                    border: 'none',
                    padding: '40px',
                    fontFamily: direction === 'sa_to_en' ? 'Noto Sans Devanagari' : 'inherit',
                    resize: 'none',
                    fontWeight: direction === 'sa_to_en' ? '500' : '400'
                  }}
                  placeholder={direction === 'en_to_sa' ? "Type English words..." : "Type in Roman (e.g., 'namaste') → instantly converts to Devanagari"}
                  value={shouldTransliterate ? transliteration.value : inputText}
                  onChange={(e) => {
                    if (shouldTransliterate) {
                      transliteration.onChange(e.target.value);
                      setSuggestionsPrefix(e.target.value);
                    } else {
                      setInputText(e.target.value);
                    }
                  }}
                />
                
                {/* Suggestions Dropdown */}
                <WordSuggestions 
                  prefix={shouldTransliterate ? suggestionsPrefix : ""}
                  onSelect={(word) => {
                    if (shouldTransliterate) {
                      transliteration.onChange(word);
                      setSuggestionsPrefix(word);
                    }
                  }}
                  enabled={shouldTransliterate && inputText.length > 0}
                />
                
                {direction === 'sa_to_en' && (
                  <div style={{ position: 'absolute', bottom: '10px', left: '40px', fontSize: '0.7rem', color: 'var(--text-light)' }}>
                    ✨ Real-time Roman → Devanagari conversion active
                  </div>
                )}
                
                <div style={{ position: 'absolute', bottom: '30px', right: '30px' }}>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-primary" 
                    onClick={handleTranslate} 
                    disabled={loading || !inputText}
                    style={{ padding: '16px 40px', borderRadius: '18px', fontSize: '1rem' }}
                  >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} fill="currentColor" />}
                    <span>{loading ? "Translating..." : "Translate"}</span>
=======
              {/* Writing Area */}
              <div className="flex flex-col gap-4">
                <SanskritInput 
                  value={inputText}
                  onChange={(val) => setInputText(val)}
                  placeholder={direction === 'en_to_sa' ? "Type English sentence or words to translate..." : "Enter Sanskrit text in Devanagari or use keyboard..."}
                  showLabel={false}
                  style={{
                    fontSize: direction === 'sa_to_en' ? '1.8rem' : '1.35rem',
                    lineHeight: '1.5',
                    background: 'var(--bg-main)',
                    border: '1.5px solid var(--border-soft)',
                    borderRadius: '20px',
                    padding: '20px 24px',
                    fontFamily: direction === 'sa_to_en' ? 'Noto Sans Devanagari' : 'inherit',
                    fontWeight: direction === 'sa_to_en' ? '600' : '500',
                    color: 'var(--text-main)',
                    minHeight: '180px',
                    width: '100%'
                  }}
                />

                {/* Dedicated Action Bar (No overlapping absolute buttons) */}
                <div className="flex items-center justify-between pt-2">
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-light)', fontWeight: 600 }}>
                    {inputText.length} characters
                  </span>

                  <motion.button 
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleTranslate} 
                    disabled={loading || !inputText}
                    className="btn-primary"
                    style={{ 
                      padding: '12px 36px', 
                      borderRadius: '100px', 
                      fontSize: '0.92rem'
                    }}
                  >
                    {loading ? <Loader2 className="animate-spin" size={18} /> : <Zap size={18} fill="currentColor" />}
                    <span>{loading ? "Translating..." : "Translate Now"}</span>
>>>>>>> 07c3d9f08eff2b3ab07b9877857805df5f6a218d
                  </motion.button>
                </div>
              </div>
            </motion.div>

<<<<<<< HEAD
            {/* Results Display */}
            <AnimatePresence mode="wait">
              {results && (
                <motion.div 
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="flex flex-col gap-8"
                >
                  <div className="flex items-center justify-between" style={{ padding: '0 20px' }}>
                    <div className="flex items-center gap-3" style={{ color: 'var(--text-dim)', fontSize: '0.8rem', fontWeight: '800' }}>
                      {results.source === 'database' ? <Database size={16} /> : <Globe size={16} />}
                      <span style={{ textTransform: 'uppercase', letterSpacing: '2px' }}>
                        Source: {results.source === 'database' ? 'Internal Registry' : 'Neural Expansion Engine'}
=======
            {/* Translation Output Results */}
            <AnimatePresence mode="wait">
              {results && (
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col gap-6"
                >
                  <div className="flex items-center justify-between" style={{ padding: '0 12px' }}>
                    <div className="flex items-center gap-2" style={{ color: 'var(--text-dim)', fontSize: '0.82rem', fontWeight: '800' }}>
                      {results.source === 'database' ? <Database size={16} /> : <Globe size={16} />}
                      <span style={{ textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Source: <span style={{ color: 'var(--primary)' }}>{results.source === 'database' ? 'Internal Lexicon' : 'AI Neural Engine'}</span>
>>>>>>> 07c3d9f08eff2b3ab07b9877857805df5f6a218d
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-6">
                    {results.results.length > 0 ? (
                      results.results.map((res: any, i: number) => (
                        <motion.div 
                          key={i} 
<<<<<<< HEAD
                          initial={{ opacity: 0, x: -30 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1, duration: 0.5 }}
                          className="zen-card overflow-hidden group"
                          style={{ border: 'none', boxShadow: '0 15px 40px rgba(0,0,0,0.04)' }}
                        >
                          <div className="flex items-stretch">
                            <div style={{ flex: 1, padding: '48px' }}>
                              
                              {direction === 'en_to_sa' ? (
                                // English -> Sanskrit Mode
                                <>
                                  <div className="flex items-center gap-6 mb-6">
                                    <h2 className="devanagari" style={{ fontSize: '4.5rem', lineHeight: 1, color: 'var(--primary)' }}>{res.devanagari}</h2>
                                    <motion.button whileHover={{ scale: 1.2 }} style={{ background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer' }}>
                                      <Volume2 size={24} />
                                    </motion.button>
                                  </div>
                                  <p style={{ fontStyle: 'italic', color: 'var(--text-dim)', fontSize: '1.4rem', marginBottom: '32px', opacity: 0.7 }}>{res.sanskrit}</p>
                                  
                                  <div className="flex flex-wrap gap-4 items-center">
                                    <span style={{ background: 'var(--primary)', padding: '8px 16px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '900', color: 'white', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                      {res.word_type}
                                    </span>
                                    <span style={{ fontWeight: '800', fontSize: '1.6rem', color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
                                      {res.meanings.join(' • ')}
                                    </span>
                                  </div>
                                </>
                              ) : (
                                // Sanskrit -> English Mode
                                <>
                                  <div className="flex items-center gap-6 mb-2">
                                    <span style={{ background: 'rgba(var(--primary-rgb), 0.1)', padding: '6px 14px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: '900', color: 'var(--primary)', textTransform: 'uppercase' }}>
                                      Translation Result
                                    </span>
                                  </div>
                                  <h2 style={{ fontSize: '4rem', fontWeight: '900', color: 'var(--text-main)', marginBottom: '16px', letterSpacing: '-2px' }}>
                                    {res.english || res.meanings[0]}
                                  </h2>
                                  <div className="flex items-center gap-4 mb-32">
                                     <span className="devanagari" style={{ fontSize: '2rem', color: 'var(--primary)' }}>{res.devanagari}</span>
                                     <span style={{ color: 'var(--text-light)', fontSize: '1.2rem' }}>— {res.sanskrit}</span>
                                  </div>
                                  
                                  <div className="flex items-center gap-4">
                                     <span style={{ fontSize: '0.9rem', color: 'var(--text-dim)', border: '1px solid var(--border-soft)', padding: '6px 12px', borderRadius: '8px' }}>{res.word_type}</span>
                                     <div className="flex gap-2">
                                        {res.meanings.slice(1).map((m: string, mi: number) => (
                                          <span key={mi} style={{ color: 'var(--text-light)', fontSize: '1rem' }}>• {m}</span>
                                        ))}
                                     </div>
                                  </div>
                                </>
                              )}
                            </div>
                            
                            {res.example && (
                              <div className="p-10" style={{ width: '360px', background: 'rgba(var(--primary-rgb), 0.02)', borderLeft: '1px solid var(--border-soft)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <div className="flex items-center gap-3 mb-6 text-dim" style={{ fontSize: '0.75rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--primary)' }}>
                                  <Sparkles size={16} />
                                  <span>Context Matrix</span>
                                </div>
                                <p style={{ fontSize: '1.2rem', lineHeight: '1.7', color: 'var(--text-main)', fontStyle: 'italic', position: 'relative', paddingLeft: '20px' }}>
                                  <span style={{ position: 'absolute', left: 0, top: 0, fontSize: '2rem', color: 'var(--border-soft)', lineHeight: 1 }}>"</span>
                                  {res.example}
                                  <span style={{ fontSize: '2rem', color: 'var(--border-soft)', lineHeight: 1 }}>"</span>
                                </p>
                              </div>
                            )}
                          </div>
=======
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.08, duration: 0.4 }}
                          className="zen-card overflow-hidden"
                          style={{ 
                            padding: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            borderRadius: '24px'
                          }}
                        >
                           <div style={{ display: 'flex', flexWrap: 'wrap', minHeight: '240px' }}>
                             {/* Left Output */}
                             <div style={{ flex: '1 1 300px', padding: '36px', background: 'var(--bg-card)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                               {direction === 'en_to_sa' ? (
                                  <>
                                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '12px' }}>Sanskrit Result</div>
                                    <div className="flex items-center gap-4 mb-2">
                                      <h2 className="devanagari" style={{ fontSize: '3.8rem', lineHeight: 1.1, color: 'var(--primary)', fontWeight: 800 }}>{res.devanagari}</h2>
                                    </div>
                                    <p style={{ fontStyle: 'italic', fontWeight: 600, color: 'var(--text-main)', fontSize: '1.35rem', marginBottom: '24px', letterSpacing: '1px', textTransform: 'uppercase' }}>{res.sanskrit}</p>
                                    
                                    <div className="flex flex-wrap gap-3 items-center mt-auto border-t border-dashed" style={{ borderColor: 'var(--border-soft)', paddingTop: '20px' }}>
                                      <span className="badge badge-primary">
                                        {res.word_type}
                                      </span>
                                      <span style={{ fontWeight: '700', fontSize: '1.15rem', color: 'var(--text-main)' }}>
                                        {res.meanings.join(' • ')}
                                      </span>
                                    </div>
                                  </>
                               ) : (
                                  <>
                                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '12px' }}>English Result</div>
                                    <h2 style={{ fontSize: '3.2rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '12px', letterSpacing: '-1px', lineHeight: 1.1 }}>
                                      {res.english || res.meanings[0]}
                                    </h2>
                                    <div className="flex items-center gap-4 mb-6">
                                       <span className="devanagari" style={{ fontSize: '2rem', color: 'var(--primary)', fontWeight: 800 }}>{res.devanagari}</span>
                                       <span style={{ color: 'var(--text-light)', fontSize: '1.15rem', fontStyle: 'italic' }}>— {res.sanskrit}</span>
                                    </div>
                                    
                                    <div className="flex items-center gap-3 mt-auto border-t border-dashed" style={{ borderColor: 'var(--border-soft)', paddingTop: '20px' }}>
                                       <span className="badge badge-primary">{res.word_type}</span>
                                       <div className="flex gap-2">
                                          {res.meanings.slice(1).map((m: string, mi: number) => (
                                            <span key={mi} style={{ color: 'var(--text-dim)', fontSize: '0.95rem', fontWeight: 600 }}>• {m}</span>
                                          ))}
                                       </div>
                                    </div>
                                  </>
                               )}
                             </div>

                             {/* Right Context Example */}
                             {res.example && (
                               <div style={{ flex: '1 1 240px', background: 'var(--bg-subtle)', borderLeft: '1px solid var(--border-soft)', padding: '36px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                 <div className="flex items-center gap-2 mb-4" style={{ fontSize: '0.78rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--primary)' }}>
                                   <Sparkles size={16} />
                                   <span>Context Sentence</span>
                                 </div>
                                 <p style={{ fontSize: '1.1rem', lineHeight: '1.7', color: 'var(--text-main)', fontWeight: 500, fontStyle: 'italic' }}>
                                   "{res.example}"
                                 </p>
                               </div>
                             )}
                           </div>
>>>>>>> 07c3d9f08eff2b3ab07b9877857805df5f6a218d
                        </motion.div>
                      ))
                    ) : (
                      <motion.div 
<<<<<<< HEAD
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="zen-card" 
                        style={{ padding: '80px', textAlign: 'center', background: 'rgba(var(--primary-rgb), 0.02)', border: '2px dashed var(--border-soft)' }}
                      >
                        <div style={{ fontSize: '4rem', marginBottom: '24px' }}>🕯️</div>
                        <h3 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '16px', color: 'var(--text-main)' }}>Void of Results</h3>
                        <p style={{ color: 'var(--text-dim)', maxWidth: '400px', margin: '0 auto', fontSize: '1.1rem', lineHeight: '1.6' }}>We couldn't find a direct translation in our local registry. Turn on the AI Engine switch above for a deeper linguistic search.</p>
=======
                        initial={{ scale: 0.96, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="zen-card" 
                        style={{ padding: '50px', textAlign: 'center', background: 'var(--bg-subtle)' }}
                      >
                        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🕯️</div>
                        <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '10px', color: 'var(--text-main)' }}>No Direct Match</h3>
                        <p style={{ color: 'var(--text-dim)', maxWidth: '400px', margin: '0 auto', fontSize: '0.95rem', lineHeight: '1.6' }}>
                          Toggle the AI Engine switch above for a deep neural translation search.
                        </p>
>>>>>>> 07c3d9f08eff2b3ab07b9877857805df5f6a218d
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

<<<<<<< HEAD
          <aside className="flex flex-col gap-8">
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="zen-card overflow-hidden" 
              style={{ padding: '0', border: '1px solid var(--border-soft)', boxShadow: '0 30px 60px rgba(var(--primary-rgb), 0.05)', borderRadius: '30px' }}
            >
              <div className="p-8 border-b" style={{ borderColor: 'var(--border-soft)', background: 'rgba(var(--primary-rgb), 0.08)' }}>
                <div className="flex items-center gap-3" style={{ color: 'var(--primary)' }}>
                   <BookMarked size={22} strokeWidth={2.5} />
                   <h4 style={{ margin: 0, fontSize: '0.8rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px' }}>DAILY INSIGHT</h4>
                </div>
              </div>
              <div className="p-12 text-center" style={{ background: 'var(--bg-card)' }}>
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <h2 className="devanagari" style={{ fontSize: '3.5rem', marginBottom: '15px', color: 'var(--primary)' }}>शाश्वत</h2>
                </motion.div>
                <p style={{ fontWeight: '900', color: 'var(--text-main)', fontSize: '1.4rem', letterSpacing: '1px' }}>SHASHWAT</p>
                <div style={{ height: '2px', width: '50px', background: 'var(--primary)', margin: '24px auto', borderRadius: '2px' }}></div>
                <p style={{ fontSize: '1.1rem', color: 'var(--text-dim)', lineHeight: '1.8', maxWidth: '220px', margin: '0 auto' }}>
                  "That which is eternal, unchanging, and transcends time."
=======
          {/* Sidebar Info Card */}
          <aside className="flex flex-col gap-6">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="zen-card" 
              style={{ padding: '0', borderRadius: '24px', overflow: 'hidden' }}
            >
              <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-soft)', background: 'var(--bg-subtle)' }}>
                <div className="flex items-center gap-2.5" style={{ color: 'var(--primary)' }}>
                   <BookMarked size={18} />
                   <h4 style={{ margin: 0, fontSize: '0.8rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1.5px' }}>DAILY SANSKRIT WORD</h4>
                </div>
              </div>
              <div style={{ padding: '36px 24px', textAlign: 'center', background: 'var(--bg-card)' }}>
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <h2 className="devanagari" style={{ fontSize: '3.2rem', marginBottom: '8px', color: 'var(--primary)', fontWeight: 800 }}>शाश्वत</h2>
                </motion.div>
                <p style={{ fontWeight: '900', color: 'var(--text-main)', fontSize: '1.2rem', letterSpacing: '1.5px' }}>SHASHWAT</p>
                <div style={{ height: '3px', width: '32px', background: 'var(--primary)', margin: '20px auto', borderRadius: '3px' }}></div>
                <p style={{ fontSize: '1rem', color: 'var(--text-dim)', lineHeight: '1.6', fontWeight: 500 }}>
                  "That which is eternal, enduring, and unchanged by time."
>>>>>>> 07c3d9f08eff2b3ab07b9877857805df5f6a218d
                </p>
              </div>
            </motion.div>

            <motion.div 
<<<<<<< HEAD
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="zen-card"
              style={{ padding: '40px', background: 'var(--primary)', color: 'white', border: 'none', boxShadow: '0 20px 40px rgba(var(--primary-rgb), 0.2)' }}
            >
              <div className="flex items-center gap-3 mb-8">
                 <div style={{ padding: '8px', background: 'rgba(255,255,255,0.2)', borderRadius: '10px' }}>
                    <Info size={18} />
                 </div>
                 <h4 style={{ fontSize: '0.8rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px' }}>HOW TO TRANSLATE</h4>
              </div>
              
              <div className="flex flex-col gap-6">
                 <div className="flex gap-4">
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 'bold' }}>1</div>
                    <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.9)', lineHeight: '1.5' }}>Enter text in Devanagari or standard English transliteration.</p>
                 </div>
                 <div className="flex gap-4">
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 'bold' }}>2</div>
                    <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.9)', lineHeight: '1.5' }}>Enable the AI Engine for deeper results if the local registry is insufficient.</p>
=======
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="zen-card"
              style={{ padding: '28px', background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)', color: 'white', border: 'none', borderRadius: '24px', boxShadow: 'var(--shadow-glow)' }}
            >
              <div className="flex items-center gap-3 mb-6">
                 <div style={{ padding: '8px', background: 'rgba(255,255,255,0.2)', borderRadius: '10px' }}>
                    <Info size={18} />
                 </div>
                 <h4 style={{ fontSize: '0.82rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1.5px' }}>TRANSLATION GUIDANCE</h4>
              </div>
              
              <div className="flex flex-col gap-4">
                 <div className="flex gap-3 items-start">
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 'bold', flexShrink: 0 }}>1</div>
                    <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.92)', lineHeight: '1.5', fontWeight: 500 }}>Use Devanagari script or English transliteration.</p>
                 </div>
                 <div className="flex gap-3 items-start">
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 'bold', flexShrink: 0 }}>2</div>
                    <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.92)', lineHeight: '1.5', fontWeight: 500 }}>Turn on AI Engine for contextual sentence analysis.</p>
>>>>>>> 07c3d9f08eff2b3ab07b9877857805df5f6a218d
                 </div>
              </div>
            </motion.div>
          </aside>
        </div>
      </main>
    </div>
  );
}
