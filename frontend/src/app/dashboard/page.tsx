"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import Sidebar from "@/components/Sidebar";
import DailyStreak from "@/components/DailyStreak";
import { motion } from "framer-motion";
import { 
  Trophy, 
  Flame, 
  Target, 
  ChevronRight,
  BookOpen,
  History,
  Sparkles,
  Zap
} from "lucide-react";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let userData: any = null;
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        userData = JSON.parse(storedUser);
      }
    } catch (e) {
      console.error("Error reading stored user", e);
    }

    if (!userData) {
      userData = { username: "demo", level: "beginner", role: "student" };
      localStorage.setItem("user", JSON.stringify(userData));
    }

    setUser(userData);

    const fetchData = async () => {
      try {
        const [dashStats, recentActivities] = await Promise.all([
          api.user.getDashboardStats(userData.username).catch(() => null),
          api.user.getActivities(userData.username).catch(() => [])
        ]);
        setStats(dashStats || { words_learned: 0, lessons_completed: 0, points: 450 });
        setActivities(Array.isArray(recentActivities) ? recentActivities : []);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (loading || !user) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-main)' }}>
        <motion.div 
          animate={{ rotate: 360, scale: [1, 1.1, 1] }} 
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }} 
          style={{ fontSize: '2.5rem' }}
        >
          🕉️
        </motion.div>
      </div>
    );
  }

  return (
    <div className="page-layout">
      <Sidebar user={user} />
      
      <main className="main-content">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: '32px' }}
        >
          <div className="flex items-center justify-between flex-wrap gap-4 mb-2">
            <div>
              <div className="badge badge-primary mb-2">
                <Sparkles size={14} /> Sanskrit Learning Space
              </div>
              <h1 className="devanagari" style={{ fontSize: '2.6rem', fontWeight: 700, margin: 0 }}>
                शुभस्य संवर्धनं, {user.username}
              </h1>
            </div>
          </div>
          <p style={{ color: 'var(--text-dim)', fontSize: '1rem', margin: 0 }}>
            Welcome back to your personalized sanctuary for Sanskrit mastery.
          </p>
        </motion.header>

        {/* Daily Streak Section */}
        <div style={{ marginBottom: '32px' }}>
          <DailyStreak />
        </div>

        {/* Stats Grid */}
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', marginBottom: '32px', gap: '20px' }}>
          {[
            { label: "Vocabulary", value: stats?.words_learned || 0, icon: BookOpen, gradient: "linear-gradient(135deg, #3B82F6, #1D4ED8)" },
            { label: "Lessons Completed", value: stats?.lessons_completed || 0, icon: Target, gradient: "linear-gradient(135deg, #E85D04, #FF9100)" },
            { label: "Progression Level", value: user.level === 'beginner' ? '25%' : '60%', icon: Flame, gradient: "linear-gradient(135deg, #EF4444, #DC2626)" },
            { label: "Merits & XP", value: stats?.points || 450, icon: Trophy, gradient: "linear-gradient(135deg, #F59E0B, #D97706)" }
          ].map((stat, i) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="zen-card"
              style={{ padding: '22px', display: 'flex', alignItems: 'center', gap: '18px' }}
            >
              <div style={{ 
                width: '52px', 
                height: '52px', 
                borderRadius: '16px', 
                background: stat.gradient, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                color: '#ffffff',
                boxShadow: '0 8px 18px -4px rgba(0,0,0,0.15)'
              }}>
                <stat.icon size={24} />
              </div>
              <div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.2 }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)', fontWeight: 600, marginTop: '2px' }}>
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Content Layout */}
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {/* Recent Activity */}
          <motion.section 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="zen-card" 
             style={{ padding: '28px' }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div style={{ padding: '8px', background: 'var(--primary-light)', borderRadius: '12px', color: 'var(--primary)' }}>
                <History size={20} />
              </div>
              <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 700 }}>Recent Learning Activity</h3>
            </div>
            
            <div className="flex flex-col gap-3">
              {activities.length > 0 ? (
                activities.map((activity, i) => (
                  <div 
                    key={i} 
                    className="flex justify-between items-center p-3.5" 
                    style={{ 
                      borderRadius: '14px', 
                      background: 'var(--bg-main)', 
                      border: '1px solid var(--border-soft)' 
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div style={{ 
                        fontSize: '0.75rem', 
                        padding: '5px 10px', 
                        borderRadius: '8px', 
                        background: 'var(--primary-light)', 
                        color: 'var(--primary)',
                        fontWeight: 700 
                      }}>
                        {activity.action.split(' ')[0]}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>{activity.action}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{activity.details}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', fontSize: '0.85rem' }}>
                      <div style={{ color: 'var(--primary)', fontWeight: 800 }}>{activity.score}</div>
                      <div style={{ color: 'var(--text-light)', fontSize: '0.75rem' }}>{activity.timestamp}</div>
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>No recent activity logged yet.</p>
              )}
            </div>
          </motion.section>

          {/* Next Recommended Module */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="zen-card" 
            style={{ 
              padding: '28px',
              background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--primary-light) 100%)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div className="flex items-center gap-2 mb-4" style={{ color: 'var(--primary)' }}>
                <Zap size={20} />
                <span style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Recommended Next
                </span>
              </div>
              <h2 className="devanagari" style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '10px', color: 'var(--text-main)' }}>
                Sanskrit Sandhi Rules (सन्धिः)
              </h2>
              <p style={{ color: 'var(--text-dim)', fontSize: '0.92rem', marginBottom: '24px', lineHeight: '1.6' }}>
                Master how Sanskrit sounds combine at word boundaries—essential for reading classical Sanskrit texts fluently.
              </p>
              
              <div className="flex items-center gap-4 mb-6">
                <span className="badge badge-primary">⏱️ 35 mins</span>
                <span className="badge badge-primary">🔱 Intermediate</span>
              </div>
            </div>
            
            <button className="btn-primary w-full" onClick={() => router.push('/lessons')}>
              Continue Learning <ChevronRight size={18} />
            </button>
          </motion.section>
        </div>
      </main>
    </div>
  );
}
