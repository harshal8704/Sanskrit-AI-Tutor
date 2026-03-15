"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import Sidebar from "@/components/Sidebar";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Languages, 
  ArrowRightLeft, 
  Search, 
  Database, 
  Globe,
  Loader2,
  BookMarked,
  Sparkles,
  Info,
  Copy,
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
    <div className="page-layout">
      <Sidebar user={user} />
      
      <main className="main-content">
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: '50px' }}
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
            <motion.div 
               layout
               initial={{ opacity: 0, scale: 0.98 }}
               animate={{ opacity: 1, scale: 1 }}
               className="zen-card overflow-hidden"
               style={{ padding: '0', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.08)' }}
            >
              <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'var(--border-soft)', background: 'var(--bg-card)' }}>
                <div className="flex items-center gap-6">
                  <motion.div 
                    animate={{ color: direction === 'en_to_sa' ? 'var(--primary)' : 'var(--text-dim)' }}
                    style={{ fontWeight: '800', fontSize: '0.8rem', letterSpacing: '1px' }}
                  >ENGLISH</motion.div>
                  
                  <motion.button 
                    whileHover={{ scale: 1.1, rotate: 180 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={swapDirection}
                    style={{ 
                        background: 'var(--bg-main)', 
                        border: '1px solid var(--border-soft)', 
                        borderRadius: '12px', 
                        width: '40px', 
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: 'var(--primary)'
                    }}
                  >
                    <ArrowRightLeft size={16} />
                  </motion.button>
                  
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
                  </label>
                </div>
              </div>

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
                  placeholder={direction === 'en_to_sa' ? "Type english words..." : "Enter Sanskrit (Devanagari)..."}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
                
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
                  </motion.button>
                </div>
              </div>
            </motion.div>

            <AnimatePresence mode="wait">
              {results && (
                <motion.div 
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="flex flex-col gap-8"
                >
                  <div className="flex items-center justify-between px-4">
                    <div className="flex items-center gap-3" style={{ color: 'var(--text-dim)', fontSize: '0.8rem', fontWeight: '800' }}>
                      {results.source === 'database' ? <Database size={16} /> : <Globe size={16} />}
                      <span style={{ textTransform: 'uppercase', letterSpacing: '2px' }}>
                        Source: {results.source === 'database' ? 'Internal Registry' : 'Neural Expansion Engine'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-6">
                    {results.results.length > 0 ? (
                      results.results.map((res: any, i: number) => (
                        <motion.div 
                          key={i} 
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
                                // Sanskrit -> English Mode (Swapped Hierarchy)
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
                        </motion.div>
                      ))
                    ) : (
                      <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="zen-card p-20 text-center" 
                        style={{ background: 'var(--bg-main)', borderStyle: 'dashed', borderWidth: '2px' }}
                      >
                        <div style={{ fontSize: '4rem', marginBottom: '24px' }}>🕯️</div>
                        <h3 className="mb-4" style={{ fontSize: '1.5rem' }}>No Result Found</h3>
                        <p style={{ color: 'var(--text-dim)', maxWidth: '350px', margin: '0 auto', fontSize: '1.1rem' }}>We couldn't find a direct translation in our registry. Try enabling the AI Engine for a deeper search.</p>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <aside className="flex flex-col gap-10">
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="zen-card overflow-hidden" 
              style={{ padding: '0', border: 'none', boxShadow: '0 30px 60px rgba(var(--primary-rgb), 0.15)' }}
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
                </p>
              </div>
              <motion.button 
                whileHover={{ background: 'var(--primary)', color: 'white' }}
                style={{ width: '100%', padding: '20px', border: 'none', background: 'rgba(var(--primary-rgb), 0.1)', fontSize: '0.75rem', fontWeight: '900', color: 'var(--primary)', cursor: 'pointer', transition: 'all 0.3s' }}
              >
                LEARN MORE <ChevronRight size={14} style={{ display: 'inline', marginLeft: '8px' }} />
              </motion.button>
            </motion.div>

            <motion.div 
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
                 </div>
              </div>
            </motion.div>
          </aside>
        </div>
      </main>
    </div>
  );
}
