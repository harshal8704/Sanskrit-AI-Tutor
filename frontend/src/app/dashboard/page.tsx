"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import Sidebar from "@/components/Sidebar";
<<<<<<< HEAD
=======
import DailyStreak from "@/components/DailyStreak";
>>>>>>> 07c3d9f08eff2b3ab07b9877857805df5f6a218d
import { motion } from "framer-motion";
import { 
  Trophy, 
  Flame, 
  Target, 
  ChevronRight,
  BookOpen,
<<<<<<< HEAD
  History
=======
  History,
  Sparkles,
  ArrowUpRight,
  Award
>>>>>>> 07c3d9f08eff2b3ab07b9877857805df5f6a218d
} from "lucide-react";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
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

    const fetchData = async () => {
      try {
        const [dashStats, recentActivities] = await Promise.all([
          api.user.getDashboardStats(userData.username),
          api.user.getActivities(userData.username)
        ]);
        setStats(dashStats);
        setActivities(recentActivities);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (loading || !user) {
<<<<<<< HEAD
    return <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} style={{ fontSize: '2rem' }}>🕉️</motion.div>
    </div>;
=======
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-main)' }}>
        <motion.div 
          animate={{ rotate: 360, scale: [1, 1.15, 1] }} 
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }} 
          style={{ fontSize: '2.5rem' }}
        >
          🕉️
        </motion.div>
      </div>
    );
>>>>>>> 07c3d9f08eff2b3ab07b9877857805df5f6a218d
  }

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
          <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>शुभस्य संवर्धनं, {user.username}</h1>
          <p style={{ color: 'var(--text-dim)' }}>Welcome back. Your quiet space for Sanskrit learning is ready.</p>
        </motion.header>

        {/* Stats Grid */}
        <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '40px' }}>
          {[
            { label: "Vocabulary", value: stats?.words_learned || 0, icon: BookOpen, color: "#3498db" },
            { label: "Lessons", value: stats?.lessons_completed || 0, icon: Target, color: "#e67e22" },
            { label: "Progression", value: user.level === 'beginner' ? '25%' : '60%', icon: Flame, color: "#e74c3c" },
            { label: "Merits", value: stats?.points || 450, icon: Trophy, color: "#f1c40f" }
=======
        {/* Welcome Header */}
        <motion.header 
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: '32px' }}
          className="flex justify-between items-end flex-wrap gap-4"
        >
          <div>
            <div className="devanagari" style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '4px' }}>
              शुभस्य संवर्धनम् • Welcome Back
            </div>
            <h1 style={{ fontSize: '2.6rem', lineHeight: '1.2' }}>Namaste, {user.username}</h1>
            <p style={{ color: 'var(--text-dim)', fontSize: '1.05rem', marginTop: '4px', fontWeight: 500 }}>
              Your serene space for mastering Sanskrit is ready for today's practice.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="badge badge-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
              <Sparkles size={14} /> Level: {user.level || 'Beginner'}
            </div>
          </div>
        </motion.header>

        {/* Daily Streak Challenge */}
        <div style={{ marginBottom: '36px' }}>
          <DailyStreak />
        </div>

        {/* Quick Stats Grid */}
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', marginBottom: '36px' }}>
          {[
            { label: "Vocabulary Learned", value: stats?.words_learned || 0, icon: BookOpen, color: "#3b82f6", unit: "words" },
            { label: "Lessons Completed", value: stats?.lessons_completed || 0, icon: Target, color: "#e67e22", unit: "modules" },
            { label: "Path Progression", value: user.level === 'beginner' ? '25%' : '60%', icon: Flame, color: "#e74c3c", unit: "complete" },
            { label: "Merits Earned", value: stats?.points || 450, icon: Trophy, color: "#f59e0b", unit: "points" }
>>>>>>> 07c3d9f08eff2b3ab07b9877857805df5f6a218d
          ].map((stat, i) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
<<<<<<< HEAD
              transition={{ delay: i * 0.1 }}
              className="zen-card"
              style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}
            >
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${stat.color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color }}>
                <stat.icon size={24} />
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>{stat.value}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: '500' }}>{stat.label}</div>
=======
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="zen-card"
              style={{ padding: '22px 24px', display: 'flex', alignItems: 'center', gap: '18px' }}
            >
              <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: `${stat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color, flexShrink: 0 }}>
                <stat.icon size={26} />
              </div>
              <div>
                <div style={{ fontSize: '1.65rem', fontWeight: '800', lineHeight: '1.2' }}>{stat.value}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)', fontWeight: '600', marginTop: '2px' }}>{stat.label}</div>
>>>>>>> 07c3d9f08eff2b3ab07b9877857805df5f6a218d
              </div>
            </motion.div>
          ))}
        </div>

<<<<<<< HEAD
        <div className="grid" style={{ gridTemplateColumns: '1.6fr 1fr', gap: '30px' }}>
          
          <motion.section 
             initial={{ opacity: 0, scale: 0.98 }}
             animate={{ opacity: 1, scale: 1 }}
             className="zen-card" 
             style={{ padding: '30px' }}
          >
            <div className="flex items-center gap-3 mb-8">
              <History size={20} color="var(--primary)" />
              <h3 style={{ margin: 0 }}>Recent Learning Path</h3>
            </div>
            
            <div className="flex flex-col gap-4">
              {activities.map((activity, i) => (
                <div key={i} className="flex justify-between items-center p-4" style={{ borderBottom: '1px solid var(--border-soft)' }}>
                  <div className="flex items-center gap-4">
                    <div style={{ fontSize: '0.8rem', padding: '6px 12px', borderRadius: '8px', background: 'var(--bg-main)', color: 'var(--text-dim)' }}>
                      {activity.action.split(' ')[0]}
                    </div>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{activity.action}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{activity.details}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '0.85rem' }}>
                    <div style={{ color: 'var(--primary)', fontWeight: '600' }}>{activity.score}</div>
                    <div style={{ color: 'var(--text-light)' }}>{activity.timestamp}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          <motion.section 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="zen-card" 
            style={{ 
              padding: '34px',
              background: 'linear-gradient(135deg, var(--bg-card) 0%, #fffcf5 100%)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div className="flex items-center gap-2 mb-4" style={{ color: 'var(--primary)' }}>
                <BookOpen size={20} />
                <h4 style={{ margin: 0 }}>Next Module</h4>
              </div>
              <h2 style={{ marginBottom: '12px' }}>Sanskrit Sandhi Rules</h2>
              <p style={{ color: 'var(--text-dim)', fontSize: '0.95rem', marginBottom: '24px', lineHeight: '1.6' }}>Master the intricate rules of word joining—essential for advanced Sanskrit text comprehension.</p>
              
              <div className="flex" style={{ gap: '20px', marginBottom: '30px' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>⏱️ 20 min</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>🔱 Intermediate</div>
=======
        {/* Main Content Dual Grid */}
        <div className="grid" style={{ gridTemplateColumns: '1.6fr 1fr', gap: '28px' }}>
          
          {/* Recent Activity List */}
          <motion.section 
             initial={{ opacity: 0, scale: 0.98 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 0.6 }}
             className="zen-card" 
             style={{ padding: '28px' }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <History size={18} />
                </div>
                <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Recent Learning Path</h3>
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: 600 }}>Last 5 Activity Entries</span>
            </div>
            
            <div className="flex flex-col gap-3">
              {activities.length > 0 ? (
                activities.map((activity, i) => (
                  <div key={i} className="flex justify-between items-center p-3.5" style={{ borderRadius: '16px', background: 'var(--bg-main)', border: '1px solid var(--border-soft)', transition: 'border-color 0.2s' }}>
                    <div className="flex items-center gap-3.5">
                      <div className="badge badge-primary" style={{ fontSize: '0.75rem', padding: '4px 10px' }}>
                        {activity.action.split(' ')[0]}
                      </div>
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--text-main)' }}>{activity.action}</div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>{activity.details}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', fontSize: '0.85rem' }}>
                      <div style={{ color: 'var(--primary)', fontWeight: '700' }}>{activity.score}</div>
                      <div style={{ color: 'var(--text-light)', fontSize: '0.75rem' }}>{activity.timestamp}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-light)' }}>
                  No recent activities recorded yet. Start a lesson below!
                </div>
              )}
            </div>
          </motion.section>

          {/* Next Recommended Module */}
          <motion.section 
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="zen-card" 
            style={{ 
              padding: '30px',
              background: 'linear-gradient(145deg, var(--bg-card) 0%, var(--bg-subtle) 100%)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{ position: 'absolute', right: '-20px', top: '-20px', fontSize: '8rem', opacity: 0.04, color: 'var(--primary)', fontFamily: 'serif', pointerEvents: 'none' }}>
              📖
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4" style={{ color: 'var(--primary)' }}>
                <Award size={20} />
                <span style={{ fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>RECOMMENDED PATH</span>
              </div>

              <h2 style={{ marginBottom: '12px', fontSize: '1.65rem' }}>Sanskrit Sandhi Rules</h2>
              <p style={{ color: 'var(--text-dim)', fontSize: '0.95rem', marginBottom: '24px', lineHeight: '1.65' }}>
                Master the intricate rules of word joining (संधि)—the cornerstone of fluent classical Sanskrit comprehension.
              </p>
              
              <div className="flex items-center gap-4" style={{ marginBottom: '28px' }}>
                <div className="badge" style={{ background: 'rgba(0,0,0,0.04)', color: 'var(--text-dim)', border: '1px solid var(--border-soft)' }}>
                  ⏱️ 20 mins
                </div>
                <div className="badge" style={{ background: 'var(--primary-light)', color: 'var(--primary)', border: '1px solid rgba(var(--primary-rgb),0.2)' }}>
                  🔱 Intermediate
                </div>
>>>>>>> 07c3d9f08eff2b3ab07b9877857805df5f6a218d
              </div>
            </div>
            
            <button className="btn-primary w-full" onClick={() => router.push('/lessons')}>
              Start Learning Now <ChevronRight size={18} />
            </button>
          </motion.section>
<<<<<<< HEAD
=======

>>>>>>> 07c3d9f08eff2b3ab07b9877857805df5f6a218d
        </div>
      </main>
    </div>
  );
}
