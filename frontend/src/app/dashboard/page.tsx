"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import Sidebar from "@/components/Sidebar";
import { motion } from "framer-motion";
import { 
  Trophy, 
  Flame, 
  Target, 
  ChevronRight,
  BookOpen,
  History
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
    return <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} style={{ fontSize: '2rem' }}>🕉️</motion.div>
    </div>;
  }

  return (
    <div className="page-layout">
      <Sidebar user={user} />
      
      <main className="main-content">
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
          ].map((stat, i) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
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
              </div>
            </motion.div>
          ))}
        </div>

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
              </div>
            </div>
            
            <button className="btn-primary w-full" onClick={() => router.push('/lessons')}>
              Start Learning Now <ChevronRight size={18} />
            </button>
          </motion.section>
        </div>
      </main>
    </div>
  );
}
