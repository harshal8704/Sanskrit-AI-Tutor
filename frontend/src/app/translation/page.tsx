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
  Zap,
  Volume2
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
    <div className="page-layout bg-gray-50 dark:bg-[#0f0f13] min-h-screen text-gray-900 dark:text-gray-100">
      <Sidebar user={user} />
      
      <main className="main-content" style={{ padding: '60px 40px', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Premium Zen Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="zen-card"
          style={{ 
            padding: '40px', 
            marginBottom: '40px', 
            borderRadius: '30px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-soft)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0,0,0,0.03)'
          }}
        >
          <div style={{ position: 'absolute', top: '-100px', left: '-100px', width: '300px', height: '300px', background: 'var(--primary)', opacity: 0.05, borderRadius: '50%', filter: 'blur(80px)' }}></div>
          <div style={{ position: 'absolute', bottom: '-100px', right: '-100px', width: '300px', height: '300px', background: 'var(--accent)', opacity: 0.03, borderRadius: '50%', filter: 'blur(80px)' }}></div>

          <div style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 800, letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
             <Languages size={18} /> Linguistic Bridge
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '8px', letterSpacing: '-1px', color: 'var(--text-main)' }}>Divine Translator</h1>
          <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem', maxWidth: '650px', lineHeight: '1.5', fontWeight: 500 }}>
            Seamlessly deconstruct and reassemble meanings across the cultural divide between English and Sanskrit.
          </p>
        </motion.header>

        <div className="grid" style={{ gridTemplateColumns: '1.6fr 1fr', alignItems: 'start', gap: '50px' }}>
          
          <div className="flex flex-col gap-10">
            {/* Input Composer Box */}
            <motion.div 
               layout
               initial={{ opacity: 0, scale: 0.98 }}
               animate={{ opacity: 1, scale: 1 }}
               className="zen-card"
               style={{ 
                 padding: '0', 
                 border: '1px solid var(--border-soft)', 
                 boxShadow: '0 20px 50px rgba(var(--primary-rgb),0.03)',
                 borderRadius: '30px',
                 overflow: 'hidden',
                 background: 'var(--bg-card)'
               }}
            >
              {/* Toolbar */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                padding: '24px 32px', 
                borderBottom: '1px solid var(--border-soft)', 
                background: 'rgba(var(--primary-rgb), 0.02)' 
              }}>
                <div className="flex items-center gap-6">
                  <motion.div animate={{ color: direction === 'en_to_sa' ? 'var(--primary)' : 'var(--text-dim)' }} style={{ fontWeight: '800', fontSize: '0.9rem', letterSpacing: '2px' }}>ENGLISH</motion.div>
                  
                  <motion.button 
                    whileHover={{ scale: 1.1, rotate: 180 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={swapDirection}
                    style={{ 
                        background: 'var(--bg-main)', 
                        border: '1px solid var(--border-soft)', 
                        borderRadius: '50%', 
                        width: '44px', 
                        height: '44px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: 'var(--primary)',
                        boxShadow: '0 4px 12px rgba(var(--primary-rgb), 0.1)'
                    }}
                  >
                    <ArrowRightLeft size={18} />
                  </motion.button>
                  
                  <motion.div animate={{ color: direction === 'sa_to_en' ? 'var(--primary)' : 'var(--text-dim)' }} style={{ fontWeight: '800', fontSize: '0.9rem', letterSpacing: '2px' }}>SANSKRIT</motion.div>
                </div>
                
                <div className="flex items-center">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <input 
                        type="checkbox" 
                        style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
                        checked={useApi} 
                        onChange={(e) => setUseApi(e.target.checked)}
                        />
                        <div style={{ width: '48px', height: '24px', borderRadius: '12px', transition: 'all 0.3s', backgroundColor: useApi ? 'var(--primary)' : 'var(--border-soft)' }}></div>
                        <div style={{ position: 'absolute', width: '16px', height: '16px', backgroundColor: '#fff', borderRadius: '50%', transition: 'all 0.3s', transform: useApi ? 'translateX(28px)' : 'translateX(4px)' }}></div>
                    </div>
                    <span style={{ fontSize: '0.8rem', fontWeight: '800', color: useApi ? 'var(--primary)' : 'var(--text-dim)', letterSpacing: '1px' }}>AI ENGINE</span>
                  </label>
                </div>
              </div>

              {/* Input Area */}
              <div style={{ position: 'relative', minHeight: '300px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ flex: 1, padding: '40px 40px 100px 40px' }}>
                  <SanskritInput 
                    value={inputText}
                    onChange={(val) => setInputText(val)}
                    placeholder={direction === 'en_to_sa' ? "Type english words..." : "Enter Sanskrit (Devanagari)..."}
                    showLabel={false}
                    style={{
                      fontSize: direction === 'sa_to_en' ? '3rem' : '2rem',
                      lineHeight: '1.4',
                      background: 'transparent',
                      border: 'none',
                      fontFamily: direction === 'sa_to_en' ? 'Noto Sans Devanagari' : 'inherit',
                      fontWeight: direction === 'sa_to_en' ? '600' : '500',
                      padding: 0,
                      color: 'var(--text-main)',
                      width: '100%'
                    }}
                  />
                </div>
                
                <div style={{ position: 'absolute', bottom: '30px', right: '30px' }}>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleTranslate} 
                    disabled={loading || !inputText}
                    style={{ 
                      padding: '16px 40px', 
                      borderRadius: '100px', 
                      fontSize: '1rem', 
                      fontWeight: 800,
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '12px',
                      background: loading || !inputText ? 'var(--bg-main)' : 'var(--primary)',
                      color: loading || !inputText ? 'var(--text-dim)' : '#fff',
                      border: 'none',
                      cursor: loading || !inputText ? 'not-allowed' : 'pointer',
                      boxShadow: loading || !inputText ? 'none' : '0 10px 25px rgba(var(--primary-rgb), 0.3)'
                    }}
                  >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} fill="currentColor" />}
                    <span>{loading ? "Translating..." : "Translate"}</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Results Area */}
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
                    <div className="flex items-center gap-3" style={{ color: 'var(--text-dim)', fontSize: '0.85rem', fontWeight: '800' }}>
                      {results.source === 'database' ? <Database size={18} /> : <Globe size={18} />}
                      <span style={{ textTransform: 'uppercase', letterSpacing: '2px' }}>
                        Source: <span style={{ color: 'var(--primary)' }}>{results.source === 'database' ? 'Internal Registry' : 'Neural Expansion Engine'}</span>
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-8">
                    {results.results.length > 0 ? (
                      results.results.map((res: any, i: number) => (
                        <motion.div 
                          key={i} 
                          initial={{ opacity: 0, x: -30 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1, duration: 0.5 }}
                          className="zen-card overflow-hidden"
                          style={{ 
                            border: '1px solid var(--border-soft)', 
                            boxShadow: '0 20px 60px rgba(var(--primary-rgb),0.05)',
                            padding: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            borderRadius: '30px'
                          }}
                        >
                           <div style={{ display: 'flex', minHeight: '300px' }}>
                             {/* Left Primary Focus */}
                             <div style={{ flex: 1, padding: '50px', background: 'var(--bg-card)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                               {direction === 'en_to_sa' ? (
                                  <>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '16px' }}>Sanskrit Translation</div>
                                    <div className="flex items-center gap-6 mb-4">
                                      <h2 className="devanagari" style={{ fontSize: '5rem', lineHeight: 1.1, color: 'var(--primary)', fontWeight: 800 }}>{res.devanagari}</h2>
                                    </div>
                                    <p style={{ fontStyle: 'italic', fontWeight: 600, color: 'var(--text-main)', fontSize: '1.6rem', marginBottom: '40px', letterSpacing: '2px', textTransform: 'uppercase' }}>{res.sanskrit}</p>
                                    
                                    <div className="flex flex-wrap gap-4 items-center mt-auto border-t border-dashed" style={{ borderColor: 'var(--border-soft)', paddingTop: '30px' }}>
                                      <span style={{ background: 'rgba(var(--primary-rgb), 0.1)', padding: '8px 16px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: '900', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                        {res.word_type}
                                      </span>
                                      <span style={{ fontWeight: '800', fontSize: '1.4rem', color: 'var(--text-main)' }}>
                                        {res.meanings.join(' • ')}
                                      </span>
                                    </div>
                                  </>
                               ) : (
                                  <>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '16px' }}>English Translation</div>
                                    <h2 style={{ fontSize: '4.5rem', fontWeight: '900', color: 'var(--text-main)', marginBottom: '16px', letterSpacing: '-2px', lineHeight: 1.1 }}>
                                      {res.english || res.meanings[0]}
                                    </h2>
                                    <div className="flex items-center gap-6 mb-10">
                                       <span className="devanagari" style={{ fontSize: '2.5rem', color: 'var(--primary)', fontWeight: 800 }}>{res.devanagari}</span>
                                       <span style={{ color: 'var(--text-light)', fontSize: '1.4rem', fontStyle: 'italic' }}>— {res.sanskrit}</span>
                                    </div>
                                    
                                    <div className="flex items-center gap-4 mt-auto border-t border-dashed" style={{ borderColor: 'var(--border-soft)', paddingTop: '30px' }}>
                                       <span style={{ fontSize: '0.85rem', fontWeight: 900, color: 'var(--primary)', background: 'rgba(var(--primary-rgb), 0.1)', padding: '8px 16px', borderRadius: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>{res.word_type}</span>
                                       <div className="flex gap-2">
                                          {res.meanings.slice(1).map((m: string, mi: number) => (
                                            <span key={mi} style={{ color: 'var(--text-dim)', fontSize: '1.1rem', fontWeight: 600 }}>• {m}</span>
                                          ))}
                                       </div>
                                    </div>
                                  </>
                               )}
                             </div>

                             {/* Right Context Margin */}
                             {res.example && (
                               <div style={{ width: '380px', background: 'rgba(var(--primary-rgb), 0.02)', borderLeft: '1px solid var(--border-soft)', padding: '50px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                 <div className="flex items-center gap-3 mb-8" style={{ fontSize: '0.8rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--primary)' }}>
                                   <Sparkles size={18} />
                                   <span>Context Matrix</span>
                                 </div>
                                 <div style={{ position: 'relative' }}>
                                   <div style={{ position: 'absolute', left: '-20px', top: '-30px', fontSize: '6rem', color: 'var(--primary)', opacity: 0.1, fontFamily: 'serif', lineHeight: 1 }}>"</div>
                                   <p style={{ fontSize: '1.3rem', lineHeight: '1.8', color: 'var(--text-main)', fontWeight: 500, fontStyle: 'italic', position: 'relative', zIndex: 1 }}>
                                     {res.example}
                                   </p>
                                 </div>
                               </div>
                             )}
                           </div>
                        </motion.div>
                      ))
                    ) : (
                      <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="zen-card" 
                        style={{ padding: '80px', textAlign: 'center', background: 'rgba(var(--primary-rgb), 0.02)', border: '2px dashed var(--border-soft)' }}
                      >
                        <div style={{ fontSize: '4rem', marginBottom: '24px' }}>🕯️</div>
                        <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '16px', color: 'var(--text-main)' }}>Void of Results</h3>
                        <p style={{ color: 'var(--text-dim)', maxWidth: '400px', margin: '0 auto', fontSize: '1.1rem', lineHeight: '1.6' }}>We couldn't find a direct translation in our local registry. Turn on the AI Engine switch above for a deeper linguistic search.</p>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <aside className="flex flex-col gap-8">
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="zen-card" 
              style={{ padding: '0', border: '1px solid var(--border-soft)', boxShadow: '0 30px 60px rgba(var(--primary-rgb), 0.05)', borderRadius: '30px', overflow: 'hidden' }}
            >
              <div style={{ padding: '30px', borderBottom: '1px solid var(--border-soft)', background: 'rgba(var(--primary-rgb), 0.03)' }}>
                <div className="flex items-center gap-3" style={{ color: 'var(--primary)' }}>
                   <BookMarked size={20} strokeWidth={2.5} />
                   <h4 style={{ margin: 0, fontSize: '0.85rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px' }}>DAILY INSIGHT</h4>
                </div>
              </div>
              <div style={{ padding: '50px 30px', textAlign: 'center', background: 'var(--bg-card)' }}>
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <h2 className="devanagari" style={{ fontSize: '4rem', marginBottom: '16px', color: 'var(--primary)', fontWeight: 800 }}>शाश्वत</h2>
                </motion.div>
                <p style={{ fontWeight: '900', color: 'var(--text-main)', fontSize: '1.5rem', letterSpacing: '2px' }}>SHASHWAT</p>
                <div style={{ height: '3px', width: '40px', background: 'var(--primary)', margin: '30px auto', borderRadius: '3px' }}></div>
                <p style={{ fontSize: '1.15rem', color: 'var(--text-dim)', lineHeight: '1.7', fontWeight: 500 }}>
                  "That which is eternal, unchanging, and transcends time."
                </p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="zen-card"
              style={{ padding: '40px', background: 'var(--primary)', color: 'white', border: 'none', boxShadow: '0 20px 40px rgba(var(--primary-rgb), 0.3)', borderRadius: '30px' }}
            >
              <div className="flex items-center gap-4 mb-8">
                 <div style={{ padding: '10px', background: 'rgba(255,255,255,0.2)', borderRadius: '12px' }}>
                    <Info size={20} />
                 </div>
                 <h4 style={{ fontSize: '0.9rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px' }}>HOW TO TRANSLATE</h4>
              </div>
              
              <div className="flex flex-col gap-6">
                 <div className="flex gap-4 items-start">
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold', flexShrink: 0 }}>1</div>
                    <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.9)', lineHeight: '1.6', fontWeight: 500 }}>Enter text in Devanagari or standard English transliteration.</p>
                 </div>
                 <div className="flex gap-4 items-start">
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold', flexShrink: 0 }}>2</div>
                    <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.9)', lineHeight: '1.6', fontWeight: 500 }}>Enable the AI Engine switch for a neural-powered analysis of complex sentences.</p>
                 </div>
              </div>
            </motion.div>
          </aside>
        </div>
      </main>
    </div>
  );
}
