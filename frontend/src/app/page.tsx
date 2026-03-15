"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, UserPlus, Sparkles, BookOpen, Globe } from "lucide-react";

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
            </div>
          </div>
        </motion.div>

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
            >
              Sign In
            </button>
            <button 
              onClick={() => setIsLogin(false)} 
              style={{ flex: 1, background: 'none', color: !isLogin ? 'var(--primary)' : 'var(--text-light)', borderBottom: !isLogin ? '2px solid var(--primary)' : 'none', padding: '15px', fontSize: '1rem', cursor: 'pointer', transition: 'all 0.3s', fontWeight: !isLogin ? '600' : '400' }}
            >
              Register
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.form 
              key={isLogin ? 'login' : 'signup'}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              onSubmit={handleSubmit} 
              className="flex flex-col gap-6"
            >
              <div className="flex flex-col gap-2">
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                />
              </div>

              {!isLogin && (
                <>
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
                  </button>
                </div>
              )}
            </motion.form>
          </AnimatePresence>
        </motion.div>

      </div>

      <footer className="container" style={{ padding: '2rem 0', textAlign: 'center', color: 'var(--text-light)', fontSize: '0.8rem' }}>
        🕉️ Pavitram Sanskritam • Designed with serenity in mind
      </footer>
    </main>
  );
}
