"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
<<<<<<< HEAD
import { LogIn, UserPlus, Sparkles, BookOpen, Globe } from "lucide-react";
=======
import { LogIn, UserPlus, Sparkles, BookOpen, Globe, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
>>>>>>> 07c3d9f08eff2b3ab07b9877857805df5f6a218d

export default function Home() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        const user = await api.auth.login({ username, password });
        localStorage.setItem("user", JSON.stringify(user));
        router.push("/dashboard");
      } else {
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match");
        }
        await api.auth.signup({ username, password, role });
        setIsLogin(true);
        setError("Account created! Please login.");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
<<<<<<< HEAD
      padding: '2rem', 
      background: 'var(--bg-main)',
      transition: 'background 0.4s ease'
    }}>
      
      {/* Minimal Header */}
      <header className="container flex justify-between items-center" style={{ padding: '2rem 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '40px', height: '40px', background: 'var(--primary)', borderRadius: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#fff', fontSize: '1.2rem' }}>🕉️</div>
          <h2 style={{ fontSize: '1.5rem', margin: 0, color: 'var(--text-main)' }}>SanskritaAI</h2>
        </div>
        <div className="flex" style={{ gap: '2rem' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-dim)', cursor: 'pointer' }}>About</span>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-dim)', cursor: 'pointer' }}>Curriculum</span>
        </div>
      </header>

      <div className="container flex items-center justify-between" style={{ flex: 1, gap: '4rem' }}>
        
        {/* Left Side: Minimal Content */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          style={{ maxWidth: '550px' }}
        >
          <div className="devanagari" style={{ fontSize: '1.2rem', marginBottom: '1rem', letterSpacing: '0.1em' }}>
            नमस्ते • Welcome to the Future of Sanskrit
          </div>
          <h1 style={{ fontSize: '3.5rem', lineHeight: '1.1', marginBottom: '1.5rem', color: '#1a1a1a' }}>
            Unlock Ancient Wisdom with Modern Ease.
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-dim)', marginBottom: '2.5rem', lineHeight: '1.8' }}>
            A distraction-free, intelligent environment designed for the modern learner. Master Sanskrit grammar and vocabulary through adaptive paths that evolve with you.
          </p>
          
          <div className="flex" style={{ gap: '1rem' }}>
            <div className="flex items-center gap-2" style={{ color: 'var(--accent)', fontWeight: '600', fontSize: '0.9rem' }}>
              <Sparkles size={18} /> AI Guided
            </div>
            <div className="flex items-center gap-2" style={{ color: 'var(--secondary)', fontWeight: '600', fontSize: '0.9rem' }}>
              <BookOpen size={18} /> Modular Lessons
            </div>
            <div className="flex items-center gap-2" style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '0.9rem' }}>
              <Globe size={18} /> Global Access
=======
      padding: '1.5rem 2rem', 
      background: 'var(--bg-main)',
      transition: 'background 0.4s ease',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Decorative Ambient Glows */}
      <div style={{ position: 'absolute', top: '-120px', left: '-120px', width: '450px', height: '450px', background: 'var(--primary)', opacity: 0.08, borderRadius: '50%', filter: 'blur(100px)', pointerEvents: 'none' }}></div>
      <div style={{ position: 'absolute', bottom: '-150px', right: '-150px', width: '500px', height: '500px', background: 'var(--accent-green)', opacity: 0.06, borderRadius: '50%', filter: 'blur(120px)', pointerEvents: 'none' }}></div>
      
      {/* Sanskrit Watermark Background Motif */}
      <div style={{ position: 'absolute', right: '5%', top: '20%', fontSize: '28rem', opacity: 0.02, fontFamily: "'Noto Sans Devanagari', serif", userSelect: 'none', pointerEvents: 'none', color: 'var(--primary)' }}>
        🕉️
      </div>

      {/* Header */}
      <header className="container flex justify-between items-center" style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '1rem 0' }}>
        <div className="flex items-center gap-3">
          <div className="logo-box">🕉️</div>
          <div>
            <span className="logo-text" style={{ fontSize: '1.5rem' }}>Sanskrita</span>
            <span style={{ fontSize: '0.65rem', display: 'block', color: 'var(--primary)', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', marginTop: '-2px' }}>DIVINE ARCHITECTURE</span>
          </div>
        </div>
        <div className="flex items-center gap-8">
          <span style={{ fontSize: '0.95rem', color: 'var(--text-dim)', fontWeight: 600, cursor: 'pointer', transition: 'color 0.2s' }} className="hover:text-primary">About</span>
          <span style={{ fontSize: '0.95rem', color: 'var(--text-dim)', fontWeight: 600, cursor: 'pointer', transition: 'color 0.2s' }} className="hover:text-primary">Curriculum</span>
        </div>
      </header>

      {/* Hero Body */}
      <div className="container flex items-center justify-between" style={{ width: '100%', maxWidth: '1200px', margin: 'auto', padding: '3rem 0', gap: '4rem', flexWrap: 'wrap' }}>
        
        {/* Left Side: Content */}
        <motion.div 
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ flex: '1 1 500px', maxWidth: '600px' }}
        >
          <div className="devanagari flex items-center gap-2 mb-4" style={{ fontSize: '1.25rem', letterSpacing: '0.05em', fontWeight: 600 }}>
            <span>नमस्ते</span> • <span>Welcome to SanskritaAI</span>
          </div>

          <h1 style={{ fontSize: '3.6rem', lineHeight: '1.12', marginBottom: '1.5rem', color: 'var(--text-main)', letterSpacing: '-1.5px' }}>
            Unlock Ancient Wisdom with Modern AI Ease.
          </h1>

          <p style={{ fontSize: '1.15rem', color: 'var(--text-dim)', marginBottom: '2.5rem', lineHeight: '1.8', fontWeight: 450 }}>
            A distraction-free, intelligent environment designed for the modern learner. Master Sanskrit grammar, sandhi rules, and vocabulary through adaptive paths that evolve with you.
          </p>
          
          <div className="flex flex-wrap gap-4" style={{ marginTop: '1rem' }}>
            <div className="badge badge-primary flex items-center gap-2" style={{ padding: '10px 18px', fontSize: '0.85rem' }}>
              <Sparkles size={16} /> AI Guided Paths
            </div>
            <div className="badge badge-success flex items-center gap-2" style={{ padding: '10px 18px', fontSize: '0.85rem' }}>
              <BookOpen size={16} /> Modular Curriculum
            </div>
            <div className="badge flex items-center gap-2" style={{ padding: '10px 18px', fontSize: '0.85rem', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-blue)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
              <Globe size={16} /> Global Access
>>>>>>> 07c3d9f08eff2b3ab07b9877857805df5f6a218d
            </div>
          </div>
        </motion.div>

<<<<<<< HEAD
        {/* Right Side: Minimal Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="zen-card"
          style={{ width: '100%', maxWidth: '420px', padding: '3rem' }}
        >
          <div className="flex mb-8" style={{ borderBottom: '1px solid var(--border-soft)', gap: 0 }}>
            <button 
              onClick={() => setIsLogin(true)} 
              style={{ flex: 1, background: 'none', color: isLogin ? 'var(--primary)' : 'var(--text-light)', borderBottom: isLogin ? '2px solid var(--primary)' : 'none', padding: '15px', fontSize: '1rem', cursor: 'pointer', transition: 'all 0.3s', fontWeight: isLogin ? '600' : '400' }}
=======
        {/* Right Side: Auth Glass Card */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="zen-card-glass"
          style={{ flex: '1 1 380px', maxWidth: '440px', padding: '2.5rem', borderRadius: '32px' }}
        >
          <div className="flex mb-8" style={{ borderBottom: '1px solid var(--border-soft)', position: 'relative' }}>
            <button 
              onClick={() => setIsLogin(true)} 
              style={{ flex: 1, background: 'none', color: isLogin ? 'var(--primary)' : 'var(--text-light)', borderBottom: isLogin ? '2.5px solid var(--primary)' : 'none', padding: '14px', fontSize: '1.05rem', cursor: 'pointer', transition: 'all 0.3s', fontWeight: isLogin ? '700' : '500', borderTop: 'none', borderLeft: 'none', borderRight: 'none' }}
>>>>>>> 07c3d9f08eff2b3ab07b9877857805df5f6a218d
            >
              Sign In
            </button>
            <button 
              onClick={() => setIsLogin(false)} 
<<<<<<< HEAD
              style={{ flex: 1, background: 'none', color: !isLogin ? 'var(--primary)' : 'var(--text-light)', borderBottom: !isLogin ? '2px solid var(--primary)' : 'none', padding: '15px', fontSize: '1rem', cursor: 'pointer', transition: 'all 0.3s', fontWeight: !isLogin ? '600' : '400' }}
=======
              style={{ flex: 1, background: 'none', color: !isLogin ? 'var(--primary)' : 'var(--text-light)', borderBottom: !isLogin ? '2.5px solid var(--primary)' : 'none', padding: '14px', fontSize: '1.05rem', cursor: 'pointer', transition: 'all 0.3s', fontWeight: !isLogin ? '700' : '500', borderTop: 'none', borderLeft: 'none', borderRight: 'none' }}
>>>>>>> 07c3d9f08eff2b3ab07b9877857805df5f6a218d
            >
              Register
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.form 
              key={isLogin ? 'login' : 'signup'}
<<<<<<< HEAD
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              onSubmit={handleSubmit} 
              className="flex flex-col gap-6"
            >
              <div className="flex flex-col gap-2">
=======
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleSubmit} 
              className="flex flex-col gap-5"
            >
              <div className="flex flex-col gap-1.5">
                <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-dim)' }}>USERNAME</label>
>>>>>>> 07c3d9f08eff2b3ab07b9877857805df5f6a218d
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
<<<<<<< HEAD
                  placeholder="Username"
=======
                  placeholder="Enter your username"
>>>>>>> 07c3d9f08eff2b3ab07b9877857805df5f6a218d
                  required
                />
              </div>

<<<<<<< HEAD
              <div className="flex flex-col gap-2">
=======
              <div className="flex flex-col gap-1.5">
                <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-dim)' }}>PASSWORD</label>
>>>>>>> 07c3d9f08eff2b3ab07b9877857805df5f6a218d
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
<<<<<<< HEAD
                  placeholder="Password"
=======
                  placeholder="••••••••"
>>>>>>> 07c3d9f08eff2b3ab07b9877857805df5f6a218d
                  required
                />
              </div>

              {!isLogin && (
                <>
<<<<<<< HEAD
                  <input 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password"
                    required
                  />
                  <select value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="student">Learning Path: Student</option>
                    <option value="teacher">Learning Path: Educator</option>
                  </select>
                </>
              )}

              {error && <p style={{ color: error.includes('created') ? 'var(--success)' : '#e74c3c', fontSize: '0.85rem', textAlign: 'center' }}>{error}</p>}

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? "Please wait..." : isLogin ? "Go to Dashboard" : "Create My Account"}
              </button>

              {isLogin && (
                <div style={{ textAlign: 'center' }}>
                  <button 
                    type="button" 
                    onClick={() => { setUsername("demo"); setPassword("demo123"); }} 
                    style={{ background: 'none', color: 'var(--text-dim)', textDecoration: 'underline', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}
                  >
                    Quick-start as Guest
=======
                  <div className="flex flex-col gap-1.5">
                    <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-dim)' }}>CONFIRM PASSWORD</label>
                    <input 
                      type="password" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-dim)' }}>LEARNING PATH</label>
                    <select value={role} onChange={(e) => setRole(e.target.value)}>
                      <option value="student">Student Path</option>
                      <option value="teacher">Educator Path</option>
                    </select>
                  </div>
                </>
              )}

              {error && (
                <div style={{ 
                  color: error.includes('created') ? 'var(--accent-green)' : 'var(--accent-rose)', 
                  fontSize: '0.88rem', 
                  textAlign: 'center',
                  padding: '10px',
                  background: error.includes('created') ? 'rgba(110, 139, 94, 0.1)' : 'rgba(225, 29, 72, 0.1)',
                  borderRadius: '12px',
                  fontWeight: 600
                }}>
                  {error}
                </div>
              )}

              <button type="submit" className="btn-primary w-full mt-2" disabled={loading}>
                {loading ? "Please wait..." : isLogin ? "Go to Dashboard" : "Create My Account"}
                {!loading && <ArrowRight size={18} />}
              </button>

              {isLogin && (
                <div style={{ textAlign: 'center', marginTop: '6px' }}>
                  <button 
                    type="button" 
                    onClick={() => { setUsername("demo"); setPassword("demo123"); }} 
                    style={{ background: 'none', color: 'var(--text-dim)', textDecoration: 'none', border: 'none', cursor: 'pointer', fontSize: '0.88rem', fontWeight: 600, transition: 'color 0.2s' }}
                    className="hover:text-primary"
                  >
                    ⚡ Quick-start as Guest (demo)
>>>>>>> 07c3d9f08eff2b3ab07b9877857805df5f6a218d
                  </button>
                </div>
              )}
            </motion.form>
          </AnimatePresence>
        </motion.div>

      </div>

<<<<<<< HEAD
      <footer className="container" style={{ padding: '2rem 0', textAlign: 'center', color: 'var(--text-light)', fontSize: '0.8rem' }}>
        🕉️ Pavitram Sanskritam • Designed with serenity in mind
=======
      {/* Footer */}
      <footer className="container" style={{ padding: '1.5rem 0', textAlign: 'center', color: 'var(--text-light)', fontSize: '0.85rem', width: '100%', maxWidth: '1200px', margin: 'auto auto 0 auto' }}>
        🕉️ Pavitram Sanskritam • Designed with serene elegance
>>>>>>> 07c3d9f08eff2b3ab07b9877857805df5f6a218d
      </footer>
    </main>
  );
}
