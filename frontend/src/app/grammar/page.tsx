<<<<<<< HEAD
﻿"use client";
=======
"use client";
>>>>>>> 07c3d9f08eff2b3ab07b9877857805df5f6a218d
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
<<<<<<< HEAD
  Globe
=======
  CheckCircle2,
  BookOpen
>>>>>>> 07c3d9f08eff2b3ab07b9877857805df5f6a218d
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
<<<<<<< HEAD
        <motion.header 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: '40px' }}
        >
          <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Vyakaraņa Check</h1>
          <p style={{ color: 'var(--text-dim)' }}>Precision analysis of your Sanskrit construction and syntax.</p>
        </motion.header>

        <section className="grid" style={{ gridTemplateColumns: '1fr 1.2fr', gap: '30px' }}>
          
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
            <div className="zen-card" style={{ padding: '30px', marginBottom: '30px' }}>
              <div className="flex items-center gap-2 mb-6" style={{ color: 'var(--primary)' }}>
                <FileText size={20} />
                <h3 style={{ margin: 0 }}>Input Sentence</h3>
              </div>
              <div style={{ position: 'relative', width: '100%', minHeight: '200px', marginBottom: '24px' }}>
=======
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
>>>>>>> 07c3d9f08eff2b3ab07b9877857805df5f6a218d
                <SanskritInput
                  value={inputText}
                  onChange={(val) => setInputText(val)}
                  placeholder="रामः वनं गच्छति..."
                  showLabel={false}
                  style={{
<<<<<<< HEAD
                    fontSize: '2rem',
                    lineHeight: '1.5',
                    background: 'var(--bg-main)',
                    border: 'none',
                    padding: '30px',
                    color: 'var(--text-main)',
                    minHeight: '200px'
=======
                    fontSize: '1.8rem',
                    lineHeight: '1.5',
                    background: 'var(--bg-main)',
                    border: '1.5px solid var(--border-soft)',
                    padding: '24px',
                    color: 'var(--text-main)',
                    minHeight: '180px',
                    borderRadius: '20px'
>>>>>>> 07c3d9f08eff2b3ab07b9877857805df5f6a218d
                  }}
                  className="devanagari"
                />
              </div>
<<<<<<< HEAD
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div className="relative flex items-center">
                      <input 
                        type="checkbox" 
                        className="sr-only"
                        checked={useAi} 
                        onChange={(e) => setUseAi(e.target.checked)}
                      />
                      <div className={`w-10 h-5 rounded-full transition-colors ${useAi ? 'bg-primary' : 'bg-gray-300'}`} style={{ backgroundColor: useAi ? 'var(--primary)' : 'var(--border-soft)' }}></div>
                      <div className={`absolute w-3 h-3 bg-white rounded-full transition-transform ${useAi ? 'translate-x-6' : 'translate-x-1'}`}></div>
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-dim)' }} className="group-hover:text-primary transition-colors">AI VERIFICATION (GROK)</span>
                  </label>
                </div>
                <button className="btn-primary" onClick={handleCheck} disabled={loading || !inputText} style={{ padding: '12px 30px' }}>
=======

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
>>>>>>> 07c3d9f08eff2b3ab07b9877857805df5f6a218d
                  {loading ? <Loader2 className="animate-spin" size={18} /> : useAi ? <Zap size={18} fill="currentColor" /> : <ShieldCheck size={18} />}
                  <span>{loading ? "Analyzing..." : useAi ? "AI Deep Scan" : "Verify Syntax"}</span>
                </button>
              </div>
            </div>

<<<<<<< HEAD
            <div className="zen-card" style={{ padding: '24px' }}>
              <h4 style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>Quick Practice</h4>
              <div className="flex flex-col gap-3" style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '10px' }}>
=======
            {/* Quick Practice Pills */}
            <div className="zen-card" style={{ padding: '24px' }}>
              <div className="flex items-center gap-2 mb-4">
                <BookOpen size={16} color="var(--primary)" />
                <h4 style={{ fontSize: '0.85rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 800 }}>Quick Practice Sentences</h4>
              </div>
              <div className="flex flex-col gap-2.5" style={{ maxHeight: '350px', overflowY: 'auto', paddingRight: '6px' }}>
>>>>>>> 07c3d9f08eff2b3ab07b9877857805df5f6a218d
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
<<<<<<< HEAD
                  "शिक्षकः विद्यार्थिभ्यः ज्ञानं ददाति।",
                  "अहं गृहकार्यं समाप्त्वा विश्रामं करोमि।",
                  "यः सत्यम् वदति सः सर्वेषां विश्वासं लभते।",
                  "अहं विद्यालयः गच्छामि।",
                  "सा पुस्तकं पठन्ति।",
                  "वयं उद्यानं क्रीडामि।",
                  "बालकः फलानि खादन्ति।",
                  "शिक्षकाः पाठं पठति।",
                  "मम मित्रः विद्यालये गच्छन्ति।",
                  "अहं जलं पिबसि।",
                  "ते गृहं गच्छामि।",
                  "छात्राः पुस्तकम् पठति।",
                  "यदा अहं पठामि तदा सः खेलति अस्ति।"
=======
                  "अहं विद्यालयः गच्छामि।",
                  "सा पुस्तकं पठन्ति।",
                  "बालकः फलानि खादन्ति।"
>>>>>>> 07c3d9f08eff2b3ab07b9877857805df5f6a218d
                ].map(t => (
                  <button 
                    key={t} 
                    className="btn-secondary" 
<<<<<<< HEAD
                    style={{ fontSize: '0.85rem', padding: '8px 16px', border: '1px solid var(--border-soft)', color: 'var(--text-dim)' }} 
                    onClick={() => setInputText(t)}
                  >
                    {t}
=======
                    style={{ fontSize: '0.9rem', padding: '10px 16px', border: '1px solid var(--border-soft)', justifyContent: 'flex-start', color: 'var(--text-main)', borderRadius: '14px' }} 
                    onClick={() => setInputText(t)}
                  >
                    <span className="devanagari">{t}</span>
>>>>>>> 07c3d9f08eff2b3ab07b9877857805df5f6a218d
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

<<<<<<< HEAD
          {/* Result Area */}
          <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
            <div className="zen-card" style={{ padding: '40px', minHeight: '100%' }}>
              <h3 className="mb-8">Verification Result</h3>
              
              <AnimatePresence mode="wait">
                {!analysis ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px', color: 'var(--text-light)', textAlign: 'center' }}>
                    <Sparkles size={40} style={{ opacity: 0.1, marginBottom: '20px' }} />
                    <p>Enter a sentence and verify to see linguistic breakdown.</p>
                  </div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="flex items-center justify-between p-6 mb-10" style={{ background: 'var(--bg-main)', borderRadius: '20px' }}>
                      <div className="flex items-center gap-8">
                        <div style={{ fontSize: '2.5rem', fontWeight: '800', color: analysis.score >= 80 ? '#27ae60' : 'var(--primary)' }}>
                          {analysis.score}%
                        </div>
                        <div>
                          <h4 style={{ margin: 0 }}>Accuracy Score</h4>
                          <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>
                            {analysis.issues.length === 0 ? "Perfect formation." : `${analysis.issues.length} linguistic note${analysis.issues.length === 1 ? '' : 's'}.`}
=======
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
>>>>>>> 07c3d9f08eff2b3ab07b9877857805df5f6a218d
                          </p>
                        </div>
                      </div>
                      {analysis.ai_verified && (
<<<<<<< HEAD
                        <div className="flex items-center gap-2" style={{ color: 'var(--primary)', padding: '6px 12px', background: 'rgba(var(--primary-rgb), 0.1)', borderRadius: '10px', fontSize: '0.7rem', fontWeight: '800' }}>
=======
                        <div className="badge badge-primary" style={{ padding: '6px 12px', fontSize: '0.72rem' }}>
>>>>>>> 07c3d9f08eff2b3ab07b9877857805df5f6a218d
                          <Zap size={14} fill="currentColor" /> GROK VERIFIED
                        </div>
                      )}
                    </div>

<<<<<<< HEAD
                    <div className="mb-10">
                      <h4 className="mb-4" style={{ fontSize: '0.9rem', color: 'var(--text-light)', textTransform: 'uppercase' }}>Detailed Issues</h4>
                      {analysis.issues.length > 0 ? (
                        <div className="flex flex-col gap-3">
                          {analysis.issues.map((issue: string, i: number) => (
                            <div key={i} className="flex items-center gap-3 p-4 rounded-xl" style={{ border: '1.5px solid rgba(192, 90, 43, 0.1)', color: 'var(--primary)', background: 'rgba(192, 90, 43, 0.02)' }}>
                              <AlertCircle size={18} />
                              <span style={{ fontSize: '0.95rem' }}>{issue}</span>
=======
                    {/* Detailed Issues */}
                    <div className="mb-8">
                      <h4 className="mb-3" style={{ fontSize: '0.82rem', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 800 }}>Syntax Notes</h4>
                      {analysis.issues.length > 0 ? (
                        <div className="flex flex-col gap-3">
                          {analysis.issues.map((issue: string, i: number) => (
                            <div key={i} className="flex items-center gap-3 p-3.5 rounded-xl" style={{ border: '1px solid rgba(var(--primary-rgb), 0.2)', color: 'var(--primary)', background: 'var(--primary-light)' }}>
                              <AlertCircle size={18} style={{ flexShrink: 0 }} />
                              <span style={{ fontSize: '0.92rem', fontWeight: 600 }}>{issue}</span>
>>>>>>> 07c3d9f08eff2b3ab07b9877857805df5f6a218d
                            </div>
                          ))}

                          {analysis.corrected_sentence && analysis.corrected_sentence !== inputText && (
<<<<<<< HEAD
                            <div className="mt-4 p-5 rounded-xl" style={{ background: 'var(--bg-main)', border: '1px solid var(--border-soft)' }}>
                               <h5 className="mb-3" style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '800', textTransform: 'uppercase' }}>Suggested Correction</h5>
                               
                               <div className="flex items-center justify-between gap-4 mb-4">
                                  <div className="devanagari" style={{ fontSize: '1.8rem', color: 'var(--text-main)' }}>
=======
                            <div className="mt-3 p-4 rounded-xl" style={{ background: 'var(--bg-main)', border: '1px solid var(--border-soft)' }}>
                               <h5 className="mb-2" style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Suggested Correction</h5>
                               
                               <div className="flex items-center justify-between gap-4 mb-3">
                                  <div className="devanagari" style={{ fontSize: '1.6rem', color: 'var(--text-main)', fontWeight: 700 }}>
>>>>>>> 07c3d9f08eff2b3ab07b9877857805df5f6a218d
                                    {analysis.corrected_sentence}
                                  </div>
                                  <button 
                                     onClick={() => setInputText(analysis.corrected_sentence)}
<<<<<<< HEAD
                                     style={{ 
                                        padding: '8px 16px', 
                                        background: 'var(--primary)', 
                                        color: 'white', 
                                        border: 'none', 
                                        borderRadius: '10px', 
                                        cursor: 'pointer',
                                        fontWeight: '700',
                                        fontSize: '0.75rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px'
                                     }}
                                  >
                                    <Sparkles size={14} /> USE THIS
=======
                                     className="btn-primary"
                                     style={{ padding: '8px 16px', fontSize: '0.78rem' }}
                                  >
                                    <Sparkles size={14} /> Use Fix
>>>>>>> 07c3d9f08eff2b3ab07b9877857805df5f6a218d
                                  </button>
                               </div>

                               {analysis.correction_summary && (
<<<<<<< HEAD
                                   <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', lineHeight: '1.5', fontStyle: 'italic', borderTop: '1px solid var(--border-soft)', paddingTop: '12px' }}>
=======
                                   <p style={{ fontSize: '0.88rem', color: 'var(--text-dim)', lineHeight: '1.5', fontStyle: 'italic', borderTop: '1px solid var(--border-soft)', paddingTop: '10px' }}>
>>>>>>> 07c3d9f08eff2b3ab07b9877857805df5f6a218d
                                      {analysis.correction_summary}
                                   </p>
                               )}
                            </div>
                          )}
                        </div>
                      ) : (
<<<<<<< HEAD
                        <div style={{ color: '#27ae60', fontWeight: '700', fontSize: '0.95rem' }}>
                          ✨ Linguistic structure is impeccable.
=======
                        <div className="flex items-center gap-2" style={{ color: 'var(--accent-green)', fontWeight: '700', fontSize: '0.95rem' }}>
                          <CheckCircle2 size={18} /> Linguistic construction is flawless.
>>>>>>> 07c3d9f08eff2b3ab07b9877857805df5f6a218d
                        </div>
                      )}
                    </div>

<<<<<<< HEAD
                    <div className="mb-10">
                      <h4 className="mb-4" style={{ fontSize: '0.9rem', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '1px' }}>Linguistic Breakdown</h4>
                      <div className="grid" style={{ gridTemplateColumns: '1fr', gap: '12px' }}>
                        {analysis.breakdown.map((item: any, i: number) => (
                          <div key={i} className="p-5" style={{ background: 'var(--bg-main)', borderRadius: '18px', border: '1px solid var(--border-soft)' }}>
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="devanagari" style={{ fontSize: '1.6rem', color: 'var(--primary)', lineHeight: 1 }}>{item.word}</div>
                                    <div style={{ fontWeight: '700', fontSize: '1rem', marginTop: '6px' }}>{item.meaning}</div>
                                </div>
                                <span style={{ padding: '4px 10px', background: 'rgba(var(--primary-rgb), 0.08)', borderRadius: '8px', fontSize: '0.65rem', fontWeight: '900', color: 'var(--primary)', textTransform: 'uppercase' }}>
                                    {item.pos}
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-x-6 gap-y-2">
                                {Object.entries(item.analysis).map(([key, value]: [string, any]) => (
                                    <div key={key}>
                                        <span style={{ fontSize: '0.65rem', color: 'var(--text-light)', textTransform: 'uppercase', fontWeight: '800', display: 'block', marginBottom: '2px' }}>{key.replace('_', ' ')}</span>
=======
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
>>>>>>> 07c3d9f08eff2b3ab07b9877857805df5f6a218d
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
