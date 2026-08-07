"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import Sidebar from "@/components/Sidebar";
import SanskritInput from "@/components/SanskritInput";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, 
  Sparkles, 
  Info, 
  AlertCircle,
  FileText,
  Loader2,
  Zap,
  CheckCircle2,
  BookOpen
} from "lucide-react";

export default function Grammar() {
  const [user, setUser] = useState<any>(null);
  const [inputText, setInputText] = useState("");
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [useAi, setUseAi] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/");
      return;
    }
    setUser(JSON.parse(storedUser));
  }, [router]);

  const handleCheck = async () => {
    if (!inputText) return;
    setLoading(true);
    setAnalysis(null);
    try {
      const res = await api.tools.checkGrammar(inputText, useAi);
      setAnalysis(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
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
          style={{ marginBottom: '32px' }}
        >
          <div className="badge badge-primary mb-2" style={{ padding: '6px 14px', fontSize: '0.78rem' }}>
            <ShieldCheck size={14} /> Vyakaraņa Analysis Engine
          </div>
          <h1 style={{ fontSize: '2.6rem', marginBottom: '6px' }}>Sanskrit Syntax Verification</h1>
          <p style={{ color: 'var(--text-dim)', fontSize: '1.05rem', fontWeight: 500 }}>
            Analyze sentence structure, case declensions (विभक्ति), and verb conjugations (धातु) with precision.
          </p>
        </motion.header>

        <section className="grid" style={{ gridTemplateColumns: '1fr 1.2fr', gap: '28px' }}>
          
          {/* Input Side */}
          <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <div className="zen-card" style={{ padding: '28px', marginBottom: '24px' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2" style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '0.95rem' }}>
                  <FileText size={18} />
                  <span>Sanskrit Input Sentence</span>
                </div>
              </div>

              <div style={{ position: 'relative', width: '100%', minHeight: '180px', marginBottom: '20px' }}>
                <SanskritInput
                  value={inputText}
                  onChange={(val) => setInputText(val)}
                  placeholder="रामः वनं गच्छति..."
                  showLabel={false}
                  style={{
                    fontSize: '1.8rem',
                    lineHeight: '1.5',
                    background: 'var(--bg-main)',
                    border: '1.5px solid var(--border-soft)',
                    padding: '24px',
                    color: 'var(--text-main)',
                    minHeight: '180px',
                    borderRadius: '20px'
                  }}
                  className="devanagari"
                />
              </div>

              <div className="flex justify-between items-center flex-wrap gap-4">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <div className="relative flex items-center">
                    <input 
                      type="checkbox" 
                      style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
                      checked={useAi} 
                      onChange={(e) => setUseAi(e.target.checked)}
                    />
                    <div style={{ width: '44px', height: '22px', borderRadius: '12px', transition: 'all 0.3s', backgroundColor: useAi ? 'var(--primary)' : 'var(--border-soft)' }}></div>
                    <div style={{ position: 'absolute', width: '16px', height: '16px', backgroundColor: '#fff', borderRadius: '50%', transition: 'all 0.3s', transform: useAi ? 'translateX(24px)' : 'translateX(3px)' }}></div>
                  </div>
                  <span style={{ fontSize: '0.8rem', fontWeight: '800', color: useAi ? 'var(--primary)' : 'var(--text-dim)', letterSpacing: '0.5px' }}>
                    AI VERIFICATION (GROK)
                  </span>
                </label>

                <button className="btn-primary" onClick={handleCheck} disabled={loading || !inputText} style={{ padding: '12px 28px' }}>
                  {loading ? <Loader2 className="animate-spin" size={18} /> : useAi ? <Zap size={18} fill="currentColor" /> : <ShieldCheck size={18} />}
                  <span>{loading ? "Analyzing..." : useAi ? "AI Deep Scan" : "Verify Syntax"}</span>
                </button>
              </div>
            </div>

            {/* Quick Practice Pills */}
            <div className="zen-card" style={{ padding: '24px' }}>
              <div className="flex items-center gap-2 mb-4">
                <BookOpen size={16} color="var(--primary)" />
                <h4 style={{ fontSize: '0.85rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 800 }}>Quick Practice Sentences</h4>
              </div>
              <div className="flex flex-col gap-2.5" style={{ maxHeight: '350px', overflowY: 'auto', paddingRight: '6px' }}>
                {[
                  "रामः वनं गच्छति।", 
                  "सीता फलं खादति।", 
                  "बालकाः पठन्ति।",
                  "अहं विद्यालयं गच्छामि।",
                  "सः पुस्तकं पठति।",
                  "वयं उद्याने क्रीडामः।",
                  "माता भोजनं पचति।",
                  "बालकाः कक्षायां उपविशन्ति।",
                  "यदा अहं विद्यालयं गच्छामि तदा मित्राणि मिलन्ति।",
                  "यदि त्वं परिश्रमं करोषि तर्हि सफलः भविष्यसि।",
                  "अहं विद्यालयः गच्छामि।",
                  "सा पुस्तकं पठन्ति।",
                  "बालकः फलानि खादन्ति।"
                ].map(t => (
                  <button 
                    key={t} 
                    className="btn-secondary" 
                    style={{ fontSize: '0.9rem', padding: '10px 16px', border: '1px solid var(--border-soft)', justifyContent: 'flex-start', color: 'var(--text-main)', borderRadius: '14px' }} 
                    onClick={() => setInputText(t)}
                  >
                    <span className="devanagari">{t}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Result Output Side */}
          <motion.div initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <div className="zen-card" style={{ padding: '32px', minHeight: '100%' }}>
              <h3 className="mb-6" style={{ fontSize: '1.4rem' }}>Linguistic Inspection</h3>
              
              <AnimatePresence mode="wait">
                {!analysis ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '280px', color: 'var(--text-light)', textAlign: 'center', padding: '20px' }}>
                    <Sparkles size={44} style={{ opacity: 0.2, marginBottom: '16px', color: 'var(--primary)' }} />
                    <p style={{ fontSize: '1.05rem', color: 'var(--text-dim)', maxWidth: '340px' }}>
                      Select a quick practice phrase or enter a sentence to see grammatical breakdown.
                    </p>
                  </div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    {/* Score Bar */}
                    <div className="flex items-center justify-between p-5 mb-8" style={{ background: 'var(--bg-main)', borderRadius: '20px', border: '1px solid var(--border-soft)' }}>
                      <div className="flex items-center gap-6">
                        <div style={{ fontSize: '2.5rem', fontWeight: '900', color: analysis.score >= 80 ? 'var(--accent-green)' : 'var(--primary)', lineHeight: 1 }}>
                          {analysis.score}%
                        </div>
                        <div>
                          <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Grammar Score</h4>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>
                            {analysis.issues.length === 0 ? "Perfect syntax structure." : `${analysis.issues.length} linguistic observation${analysis.issues.length === 1 ? '' : 's'}.`}
                          </p>
                        </div>
                      </div>
                      {analysis.ai_verified && (
                        <div className="badge badge-primary" style={{ padding: '6px 12px', fontSize: '0.72rem' }}>
                          <Zap size={14} fill="currentColor" /> GROK VERIFIED
                        </div>
                      )}
                    </div>

                    {/* Detailed Issues */}
                    <div className="mb-8">
                      <h4 className="mb-3" style={{ fontSize: '0.82rem', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 800 }}>Syntax Notes</h4>
                      {analysis.issues.length > 0 ? (
                        <div className="flex flex-col gap-3">
                          {analysis.issues.map((issue: string, i: number) => (
                            <div key={i} className="flex items-center gap-3 p-3.5 rounded-xl" style={{ border: '1px solid rgba(var(--primary-rgb), 0.2)', color: 'var(--primary)', background: 'var(--primary-light)' }}>
                              <AlertCircle size={18} style={{ flexShrink: 0 }} />
                              <span style={{ fontSize: '0.92rem', fontWeight: 600 }}>{issue}</span>
                            </div>
                          ))}

                          {analysis.corrected_sentence && analysis.corrected_sentence !== inputText && (
                            <div className="mt-3 p-4 rounded-xl" style={{ background: 'var(--bg-main)', border: '1px solid var(--border-soft)' }}>
                               <h5 className="mb-2" style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Suggested Correction</h5>
                               
                               <div className="flex items-center justify-between gap-4 mb-3">
                                  <div className="devanagari" style={{ fontSize: '1.6rem', color: 'var(--text-main)', fontWeight: 700 }}>
                                    {analysis.corrected_sentence}
                                  </div>
                                  <button 
                                     onClick={() => setInputText(analysis.corrected_sentence)}
                                     className="btn-primary"
                                     style={{ padding: '8px 16px', fontSize: '0.78rem' }}
                                  >
                                    <Sparkles size={14} /> Use Fix
                                  </button>
                               </div>

                               {analysis.correction_summary && (
                                   <p style={{ fontSize: '0.88rem', color: 'var(--text-dim)', lineHeight: '1.5', fontStyle: 'italic', borderTop: '1px solid var(--border-soft)', paddingTop: '10px' }}>
                                      {analysis.correction_summary}
                                   </p>
                               )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2" style={{ color: 'var(--accent-green)', fontWeight: '700', fontSize: '0.95rem' }}>
                          <CheckCircle2 size={18} /> Linguistic construction is flawless.
                        </div>
                      )}
                    </div>

                    {/* Word Breakdown */}
                    <div className="mb-4">
                      <h4 className="mb-3" style={{ fontSize: '0.82rem', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 800 }}>Morphological Breakdown</h4>
                      <div className="grid" style={{ gridTemplateColumns: '1fr', gap: '10px' }}>
                        {analysis.breakdown.map((item: any, i: number) => (
                          <div key={i} className="p-4" style={{ background: 'var(--bg-main)', borderRadius: '16px', border: '1px solid var(--border-soft)' }}>
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <div className="devanagari" style={{ fontSize: '1.5rem', color: 'var(--primary)', fontWeight: 800, lineHeight: 1 }}>{item.word}</div>
                                    <div style={{ fontWeight: '700', fontSize: '0.95rem', marginTop: '4px' }}>{item.meaning}</div>
                                </div>
                                <span className="badge badge-primary" style={{ fontSize: '0.68rem' }}>
                                    {item.pos}
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-x-5 gap-y-1.5">
                                {Object.entries(item.analysis).map(([key, value]: [string, any]) => (
                                    <div key={key}>
                                        <span style={{ fontSize: '0.65rem', color: 'var(--text-light)', textTransform: 'uppercase', fontWeight: '800', display: 'block' }}>{key.replace('_', ' ')}</span>
                                        <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-dim)' }}>{String(value)}</span>
                                    </div>
                                ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
}
