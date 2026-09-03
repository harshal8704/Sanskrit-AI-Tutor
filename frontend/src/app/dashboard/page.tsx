"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api, DashboardResponse } from "@/lib/api";
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
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
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
        setDashboard(await api.user.getDashboard(userData.username));
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
            { label: "Lessons completed", value: dashboard?.statistics.lessons_completed || 0, icon: BookOpen, color: "#3498db" },
            { label: "Quiz attempts", value: dashboard?.statistics.quiz_attempts || 0, icon: Target, color: "#e67e22" },
            { label: "Grammar activities", value: dashboard?.statistics.grammar_activity_count || 0, icon: Flame, color: "#e74c3c" },
            { label: "Active learning days", value: dashboard?.statistics.active_learning_days || 0, icon: Trophy, color: "#f1c40f" }
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
              {(dashboard?.recent_activity || []).map((activity, i) => (
                <div key={i} className="flex justify-between items-center p-4" style={{ borderBottom: '1px solid var(--border-soft)' }}>
                  <div className="flex items-center gap-4">
                    <div style={{ fontSize: '0.8rem', padding: '6px 12px', borderRadius: '8px', background: 'var(--bg-main)', color: 'var(--text-dim)' }}>
                      {activity.type}
                    </div>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{activity.detail}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{activity.type} activity</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '0.85rem' }}>
                    <div style={{ color: 'var(--primary)', fontWeight: '600' }}>{activity.score_percent ?? 'Completed'}</div>
                    <div style={{ color: 'var(--text-light)' }}>{activity.occurred_at}</div>
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
              <h2 style={{ marginBottom: '12px' }}>{dashboard?.recommendation.status === 'all_lessons_completed' ? 'Curriculum complete' : dashboard?.recommendation.title || 'Sanskrit curriculum pathway'}</h2>
              <p style={{ color: 'var(--text-dim)', fontSize: '0.95rem', marginBottom: '24px', lineHeight: '1.6' }}>{dashboard?.recommendation.description || 'Continue along the structured Sanskrit curriculum with the next lesson that matches your completed progress.'}</p>
              
              <div className="flex" style={{ gap: '20px', marginBottom: '30px' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>⏱️ {dashboard?.recommendation.estimated_time ? `${dashboard.recommendation.estimated_time} min` : '15 min'}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>🔱 {dashboard?.recommendation.level || 'beginner'}</div>
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
