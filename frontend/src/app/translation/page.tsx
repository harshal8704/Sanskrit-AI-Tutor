"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import Sidebar from "@/components/Sidebar";
import SanskritInput from "@/components/SanskritInput";
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
  ChevronRight,
  Zap
} from "lucide-react";

export default function Translation() {
  const [user, setUser] = useState<any>(null);
  const [inputText, setInputText] = useState("");
  const [results, setResults] = useState<any>(null);
  const [direction, setDirection] = useState("en_to_sa");
  const [useApi, setUseApi] = useState(true);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
  };

  if (!user) return null;

  return (
    <div className="page-layout">
      <Sidebar user={user} />
      
      <main className="main-content">
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
            <motion.div 
               layout
               initial={{ opacity: 0, scale: 0.98 }}
               animate={{ opacity: 1, scale: 1 }}
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
                  
                  <motion.button 
                    whileHover={{ scale: 1.1, rotate: 180 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={swapDirection}
                    title="Swap Translation Direction"
                    style={{ 
                        background: 'var(--bg-main)', 
                        border: '1px solid var(--border-soft)', 
                        borderRadius: '50%', 
                        width: '38px', 
                        height: '38px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: 'var(--primary)',
                        boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    <ArrowRightLeft size={16} />
                  </motion.button>
                  
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
                  </label>
                </div>
              </div>

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
                  </motion.button>
                </div>
              </div>
            </motion.div>

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
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-6">
                    {results.results.length > 0 ? (
                      results.results.map((res: any, i: number) => (
                        <motion.div 
                          key={i} 
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
                        </motion.div>
                      ))
                    ) : (
                      <motion.div 
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
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

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
                </p>
              </div>
            </motion.div>

            <motion.div 
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
                 </div>
              </div>
            </motion.div>
          </aside>
        </div>
      </main>
    </div>
  );
}
