"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { motion } from "framer-motion";
import { Dice5, Grid3X3, Trophy, PlayCircle, Star, Sparkles, ChevronRight } from "lucide-react";

export default function GameMenu() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/");
      return;
    }
    setUser(JSON.parse(storedUser));
  }, [router]);

  const games = [
    {
      id: "snake",
      title: "Snake & Ladder",
      description: "Classical board game meets Sanskrit grammar. Climb ladders for correct answers, avoid snakes!",
      icon: Dice5,
<<<<<<< HEAD
      color: "#8854d0",
      accent: "rgba(136, 84, 208, 0.1)",
      emoji: "🎲",
      features: ["Vocabulary Built-in", "Board Progression", "Ladder Boosts"]
=======
      color: "var(--primary)",
      accent: "rgba(192, 90, 43, 0.08)",
      emoji: "🎲",
      features: ["Vocabulary Challenges", "Board Progression", "Ladder Boosts"]
>>>>>>> 07c3d9f08eff2b3ab07b9877857805df5f6a218d
    },
    {
      id: "odd",
      title: "Odd One Out",
      description: "Test your category knowledge. Find the Sanskrit word that doesn't belong in the group.",
      icon: Grid3X3,
<<<<<<< HEAD
      color: "#e67e22",
      accent: "rgba(230, 126, 34, 0.1)",
      emoji: "🧩",
      features: ["Category Focus", "Rapid Fire", "Logic Training"]
=======
      color: "var(--accent-amber)",
      accent: "rgba(217, 119, 6, 0.08)",
      emoji: "🧩",
      features: ["Category Logic", "Rapid Fire", "Retention Training"]
>>>>>>> 07c3d9f08eff2b3ab07b9877857805df5f6a218d
    }
  ];

  if (!user) return null;

  return (
    <div className="page-layout">
      <Sidebar user={user} />

      <main className="main-content">
        <motion.header 
<<<<<<< HEAD
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: '60px' }}
        >
          <div className="flex items-center gap-3 mb-4">
             <div className="logo-box" style={{ background: 'var(--primary)' }}>
               <PlayCircle size={20} />
             </div>
             <span style={{ color: 'var(--primary)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.75rem' }}>
               Games & Arena
             </span>
          </div>
          <h1 style={{ fontSize: '3.5rem', marginBottom: '15px', letterSpacing: '-2px' }}>Choose Your Challenge</h1>
          <p style={{ color: 'var(--text-dim)', fontSize: '1.2rem', maxWidth: '650px', lineHeight: '1.7' }}>
            Interactive Sanskrit games designed to strengthen your retention through competitive play and logic.
          </p>
        </motion.header>

        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '40px' }}>
          {games.map((game, i) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="zen-card"
              style={{ padding: '0', overflow: 'hidden', cursor: 'pointer', background: 'var(--bg-card)' }}
=======
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: '40px' }}
        >
          <div className="badge badge-primary mb-2" style={{ padding: '6px 14px', fontSize: '0.78rem' }}>
            <PlayCircle size={14} /> Interactive Sanskrit Arena
          </div>
          <h1 style={{ fontSize: '2.6rem', marginBottom: '8px' }}>Choose Your Challenge</h1>
          <p style={{ color: 'var(--text-dim)', fontSize: '1.05rem', maxWidth: '650px', lineHeight: '1.6' }}>
            Gamified exercises designed to reinforce retention, vocabulary, and grammar rules through play.
          </p>
        </motion.header>

        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '32px' }}>
          {games.map((game, i) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -5 }}
              className="zen-card overflow-hidden"
              style={{ padding: '0', cursor: 'pointer' }}
>>>>>>> 07c3d9f08eff2b3ab07b9877857805df5f6a218d
              onClick={() => {
                 localStorage.setItem('preferredGame', game.id);
                 router.push('/game');
              }}
            >
<<<<<<< HEAD
              <div style={{ padding: '40px', background: `linear-gradient(135deg, ${game.accent}, var(--bg-card))` }}>
                <div className="flex justify-between items-start mb-8">
                  <div style={{ padding: '16px', borderRadius: '18px', background: game.color, color: 'white', boxShadow: `0 10px 20px ${game.color}33` }}>
                    <game.icon size={32} />
                  </div>
                  <span style={{ fontSize: '2.5rem' }}>{game.emoji}</span>
                </div>
                
                <h2 style={{ fontSize: '2rem', marginBottom: '10px', color: 'var(--text-main)' }}>{game.title}</h2>
                <p style={{ color: 'var(--text-dim)', marginBottom: '30px', fontSize: '1rem', lineHeight: '1.6' }}>{game.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {game.features.map(f => (
                    <span key={f} style={{ padding: '6px 12px', background: 'var(--bg-main)', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-dim)', border: '1px solid var(--border-soft)' }}>
=======
              <div style={{ padding: '36px', background: `linear-gradient(135deg, ${game.accent}, var(--bg-card))` }}>
                <div className="flex justify-between items-start mb-6">
                  <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: game.color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-md)' }}>
                    <game.icon size={28} />
                  </div>
                  <span style={{ fontSize: '2.4rem' }}>{game.emoji}</span>
                </div>
                
                <h2 style={{ fontSize: '1.8rem', marginBottom: '10px', color: 'var(--text-main)' }}>{game.title}</h2>
                <p style={{ color: 'var(--text-dim)', marginBottom: '24px', fontSize: '0.98rem', lineHeight: '1.6' }}>{game.description}</p>
                
                <div className="flex flex-wrap gap-2">
                  {game.features.map(f => (
                    <span key={f} className="badge" style={{ background: 'var(--bg-main)', color: 'var(--text-dim)', border: '1px solid var(--border-soft)', fontSize: '0.75rem' }}>
>>>>>>> 07c3d9f08eff2b3ab07b9877857805df5f6a218d
                      {f}
                    </span>
                  ))}
                </div>
              </div>

<<<<<<< HEAD
              <div style={{ padding: '20px 40px', background: 'var(--bg-card)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-soft)' }}>
                <div className="flex items-center gap-2" style={{ color: '#f39c12' }}>
                   <Star size={16} fill="#f39c12" />
                   <span style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-main)' }}>4.9/5</span>
                </div>
                <button className="btn-primary" style={{ padding: '10px 24px', background: game.color, border: 'none', color: '#fff' }}>
                  Enter Arena <ChevronRight size={18} />
=======
              <div style={{ padding: '18px 36px', background: 'var(--bg-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-soft)' }}>
                <div className="flex items-center gap-1.5" style={{ color: '#f59e0b' }}>
                   <Star size={16} fill="#f59e0b" />
                   <span style={{ fontWeight: '800', fontSize: '0.9rem', color: 'var(--text-main)' }}>4.9 / 5</span>
                </div>
                <button className="btn-primary" style={{ padding: '10px 24px', fontSize: '0.85rem' }}>
                  Enter Arena <ChevronRight size={16} />
>>>>>>> 07c3d9f08eff2b3ab07b9877857805df5f6a218d
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Global Stats Footer */}
        <motion.section 
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
<<<<<<< HEAD
           transition={{ delay: 0.5 }}
           style={{ marginTop: '80px', textAlign: 'center' }}
        >
          <div className="flex justify-center gap-10" style={{ color: 'var(--text-light)' }}>
             <div className="flex flex-col gap-1">
                <span style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main)' }}>1.2k+</span>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase' }}>Active Players</span>
             </div>
             <div className="flex flex-col gap-1">
                <span style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main)' }}>50k+</span>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase' }}>Words Learned</span>
             </div>
             <div className="flex flex-col gap-1">
                <span style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main)' }}>98%</span>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase' }}>Retention Rate</span>
=======
           transition={{ delay: 0.4 }}
           style={{ marginTop: '60px', textAlign: 'center' }}
        >
          <div className="flex justify-center gap-12 flex-wrap" style={{ color: 'var(--text-light)' }}>
             <div className="flex flex-col gap-1">
                <span style={{ fontSize: '1.3rem', fontWeight: '900', color: 'var(--text-main)' }}>1,200+</span>
                <span style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Active Learners</span>
             </div>
             <div className="flex flex-col gap-1">
                <span style={{ fontSize: '1.3rem', fontWeight: '900', color: 'var(--text-main)' }}>50,000+</span>
                <span style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Words Mastered</span>
             </div>
             <div className="flex flex-col gap-1">
                <span style={{ fontSize: '1.3rem', fontWeight: '900', color: 'var(--text-main)' }}>98%</span>
                <span style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Retention Rate</span>
>>>>>>> 07c3d9f08eff2b3ab07b9877857805df5f6a218d
             </div>
          </div>
        </motion.section>
      </main>
    </div>
  );
}
