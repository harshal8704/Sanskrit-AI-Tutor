"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import Sidebar from "@/components/Sidebar";
import { motion } from "framer-motion";
import { 
  BarChart3, 
  Target, 
  TrendingUp, 
  History,
  Medal,
  Dna,
  Zap,
<<<<<<< HEAD
  Star
=======
  Star,
  Award
>>>>>>> 07c3d9f08eff2b3ab07b9877857805df5f6a218d
} from "lucide-react";

export default function Progress() {
  const [user, setUser] = useState<any>(null);
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/");
      return;
    }
    const userData = JSON.parse(storedUser);
    setUser(userData);

    const fetchProgress = async () => {
      try {
        const data = await api.user.getProgress(userData.username);
        setProgress(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [router]);

  if (!user || loading) return null;

  const stats = [
    { label: "Current Rank", value: user.level.toUpperCase(), desc: "Moving to Vidvan", icon: Medal, color: "var(--primary)" },
<<<<<<< HEAD
    { label: "Daily Streak", value: `${progress?.streak_days || 0} days`, desc: "Consistency build grit", icon: Target, color: "#3498db" },
    { label: "Accuracy", value: `${progress?.avg_score || 0}%`, desc: "Recitation precision", icon: Zap, color: "var(--accent)" },
=======
    { label: "Daily Streak", value: `${progress?.streak_days || 0} days`, desc: "Consistency builds mastery", icon: Target, color: "#3b82f6" },
    { label: "Accuracy", value: `${progress?.avg_score || 0}%`, desc: "Recitation precision", icon: Zap, color: "var(--accent-green)" },
>>>>>>> 07c3d9f08eff2b3ab07b9877857805df5f6a218d
  ];

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
          <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Learning Insights</h1>
          <p style={{ color: 'var(--text-dim)' }}>Visualizing your evolution through the linguistic matrix.</p>
        </motion.header>

        <section className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px', marginBottom: '40px' }}>
=======
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: '32px' }}
        >
          <div className="badge badge-primary mb-2" style={{ padding: '6px 14px', fontSize: '0.78rem' }}>
            <BarChart3 size={14} /> Analytics & Mastery
          </div>
          <h1 style={{ fontSize: '2.6rem', marginBottom: '6px' }}>Learning Insights</h1>
          <p style={{ color: 'var(--text-dim)', fontSize: '1.05rem', fontWeight: 500 }}>
            Visualizing your evolution through the linguistic matrix and skill progression.
          </p>
        </motion.header>

        {/* Top Cards */}
        <section className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '32px' }}>
>>>>>>> 07c3d9f08eff2b3ab07b9877857805df5f6a218d
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div 
                key={stat.label}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
<<<<<<< HEAD
                transition={{ delay: i * 0.1 }}
                className="zen-card"
                style={{ padding: '40px', textAlign: 'center' }}
              >
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--bg-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: stat.color }}>
                  <Icon size={28} />
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>{stat.label}</div>
                <div style={{ fontSize: '2rem', fontWeight: '800', margin: '8px 0' }}>{stat.value}</div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>{stat.desc}</p>
=======
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="zen-card"
                style={{ padding: '28px 24px', textAlign: 'center' }}
              >
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--bg-main)', border: '1px solid var(--border-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: stat.color, boxShadow: 'var(--shadow-sm)' }}>
                  <Icon size={26} />
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1.5px' }}>{stat.label}</div>
                <div style={{ fontSize: '2.1rem', fontWeight: '900', margin: '6px 0 4px 0', color: 'var(--text-main)' }}>{stat.value}</div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-light)', fontWeight: 500 }}>{stat.desc}</p>
>>>>>>> 07c3d9f08eff2b3ab07b9877857805df5f6a218d
              </motion.div>
            );
          })}
        </section>

<<<<<<< HEAD
        <div className="grid" style={{ gridTemplateColumns: '1.5fr 1fr', gap: '30px' }}>
          
          <motion.section 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="zen-card"
            style={{ padding: '40px' }}
          >
            <div className="flex items-center gap-3 mb-10">
              <TrendingUp size={20} color="var(--primary)" />
              <h3 style={{ margin: 0 }}>Progress Streams</h3>
            </div>
            
            <div className="flex flex-col gap-10">
              {[
                { label: "Foundations", sub: "Alphabet & Basics", val: Math.round((progress?.completed || 0) / (progress?.total_lessons || 10) * 100) },
                { label: "Morphology", sub: "Noun & Verb Forms", val: 42 },
                { label: "Syntax", sub: "Sentence Building", val: 18 }
              ].map((item, i) => (
                <div key={item.label}>
                  <div className="flex justify-between items-end mb-3">
                    <div>
                      <h4 style={{ fontSize: '1rem', color: 'var(--text-main)', marginBottom: '2px' }}>{item.label}</h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{item.sub}</p>
                    </div>
                    <span style={{ fontWeight: '700', color: 'var(--primary)' }}>{item.val}%</span>
                  </div>
                  <div style={{ height: '8px', background: 'var(--bg-main)', borderRadius: '10px', overflow: 'hidden' }}>
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${item.val}%` }}
                      transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                      style={{ height: '100%', background: 'var(--primary)', borderRadius: '10px' }}
=======
        {/* Main Section Dual Grid */}
        <div className="grid" style={{ gridTemplateColumns: '1.5fr 1fr', gap: '28px' }}>
          
          {/* Progress Streams */}
          <motion.section 
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="zen-card"
            style={{ padding: '32px' }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TrendingUp size={18} />
              </div>
              <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Progress Streams</h3>
            </div>
            
            <div className="flex flex-col gap-8">
              {[
                { label: "Foundations", sub: "Alphabet, Vowels & Pronouns", val: Math.round((progress?.completed || 0) / (progress?.total_lessons || 10) * 100) },
                { label: "Morphology", sub: "Noun Declensions & Verb Forms", val: 42 },
                { label: "Syntax & Sandhi", sub: "Sentence Building & Word Joining", val: 18 }
              ].map((item, i) => (
                <div key={item.label}>
                  <div className="flex justify-between items-end mb-2.5">
                    <div>
                      <h4 style={{ fontSize: '1.02rem', color: 'var(--text-main)', marginBottom: '2px', fontWeight: 700 }}>{item.label}</h4>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>{item.sub}</p>
                    </div>
                    <span style={{ fontWeight: '800', color: 'var(--primary)', fontSize: '1.05rem' }}>{item.val}%</span>
                  </div>
                  <div style={{ height: '9px', background: 'var(--bg-main)', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border-soft)' }}>
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${item.val}%` }}
                      transition={{ duration: 1, delay: 0.3 + i * 0.1 }}
                      style={{ height: '100%', background: 'linear-gradient(90deg, var(--primary) 0%, var(--primary-hover) 100%)', borderRadius: '10px' }}
>>>>>>> 07c3d9f08eff2b3ab07b9877857805df5f6a218d
                    ></motion.div>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

<<<<<<< HEAD
          <motion.section 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="zen-card"
            style={{ padding: '40px' }}
          >
            <div className="flex items-center gap-3 mb-8">
              <Dna size={20} color="var(--primary)" />
              <h3 style={{ margin: 0 }}>Skill Mastery</h3>
            </div>
            
            <div className="flex flex-col gap-5">
=======
          {/* Skill Mastery */}
          <motion.section 
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="zen-card"
            style={{ padding: '32px' }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Dna size={18} />
              </div>
              <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Skill Mastery</h3>
            </div>
            
            <div className="flex flex-col gap-3">
>>>>>>> 07c3d9f08eff2b3ab07b9877857805df5f6a218d
              {[
                { label: "Reading", stars: 4, icon: "📖" },
                { label: "Writing", stars: 3, icon: "✍️" },
                { label: "Speaking", stars: 2, icon: "🗣️" },
                { label: "Prosody", stars: 1, icon: "💎" }
<<<<<<< HEAD
              ].map((skill, i) => (
                <div key={skill.label} className="flex items-center justify-between p-4" style={{ background: 'var(--bg-main)', borderRadius: '14px' }}>
                  <div className="flex items-center gap-4">
                    <span style={{ fontSize: '1.2rem' }}>{skill.icon}</span>
                    <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{skill.label}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} size={14} fill={s <= skill.stars ? 'var(--primary)' : 'none'} color={s <= skill.stars ? 'var(--primary)' : 'var(--text-light)'} />
=======
              ].map((skill) => (
                <div key={skill.label} className="flex items-center justify-between p-3.5" style={{ background: 'var(--bg-main)', borderRadius: '14px', border: '1px solid var(--border-soft)' }}>
                  <div className="flex items-center gap-3">
                    <span style={{ fontSize: '1.15rem' }}>{skill.icon}</span>
                    <span style={{ fontWeight: '700', fontSize: '0.92rem', color: 'var(--text-main)' }}>{skill.label}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '3px' }}>
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} size={15} fill={s <= skill.stars ? 'var(--primary)' : 'none'} color={s <= skill.stars ? 'var(--primary)' : 'var(--text-light)'} />
>>>>>>> 07c3d9f08eff2b3ab07b9877857805df5f6a218d
                    ))}
                  </div>
                </div>
              ))}
            </div>

<<<<<<< HEAD
            <div style={{ marginTop: '40px', padding: '20px', background: 'rgba(192, 90, 43, 0.05)', borderRadius: '16px', textAlign: 'center' }}>
               <History size={20} style={{ color: 'var(--primary)', marginBottom: '8px' }} />
               <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Next session: <strong>Tomorrow, 8 AM</strong></p>
=======
            <div style={{ marginTop: '28px', padding: '16px', background: 'var(--primary-light)', borderRadius: '16px', textAlign: 'center', border: '1px solid rgba(var(--primary-rgb),0.15)' }}>
               <History size={18} style={{ color: 'var(--primary)', marginBottom: '6px' }} />
               <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', margin: 0 }}>Next Scheduled Practice: <strong>Tomorrow, 8:00 AM</strong></p>
>>>>>>> 07c3d9f08eff2b3ab07b9877857805df5f6a218d
            </div>
          </motion.section>
        </div>
      </main>
    </div>
  );
}
