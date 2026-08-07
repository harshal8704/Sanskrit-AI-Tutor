"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { motion } from "framer-motion";
import { 
  Users, 
  Settings, 
  PlusCircle, 
  Trash2, 
  ShieldAlert,
  CheckCircle2
} from "lucide-react";

export default function Admin() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/");
      return;
    }
    const userData = JSON.parse(storedUser);
    if (userData.role !== 'admin') {
      router.push("/dashboard");
      return;
    }
    setUser(userData);
    setLoading(false);
  }, [router]);

  if (loading || !user) return null;

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
            <ShieldAlert size={14} /> System Administration
          </div>
          <h1 style={{ fontSize: '2.6rem', marginBottom: '6px' }}>Management Console</h1>
          <p style={{ color: 'var(--text-dim)', fontSize: '1.05rem', fontWeight: 500 }}>
            Administrator portal for user monitoring, system metrics, and curriculum management.
          </p>
        </motion.header>

        {/* Metric Cards */}
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '32px' }}>
          {[
            { label: "Active Learners", value: "1,240", icon: Users, color: "#3b82f6" },
            { label: "Pending Modules", value: "4", icon: Settings, color: "var(--primary)" },
            { label: "System Status", value: "Optimal", icon: CheckCircle2, color: "var(--accent-green)" }
          ].map((stat, i) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="zen-card"
              style={{ padding: '24px' }}
            >
               <div className="flex justify-between items-center">
                  <div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1.5px' }}>{stat.label}</div>
                    <div style={{ fontSize: '2rem', fontWeight: '900', marginTop: '4px', color: 'var(--text-main)' }}>{stat.value}</div>
                  </div>
                  <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: `${stat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color }}>
                    <stat.icon size={24} />
                  </div>
               </div>
            </motion.div>
          ))}
        </div>

        {/* Main Section */}
        <section className="grid" style={{ gridTemplateColumns: '1.5fr 1fr', gap: '28px' }}>
          <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="zen-card" style={{ padding: '32px' }}>
            <h3 className="mb-6" style={{ fontSize: '1.3rem' }}>Global Learner Registry</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border-soft)' }}>
                    <th style={{ padding: '14px', color: 'var(--text-dim)', fontSize: '0.78rem', fontWeight: '800', letterSpacing: '1px' }}>IDENTIFIER</th>
                    <th style={{ padding: '14px', color: 'var(--text-dim)', fontSize: '0.78rem', fontWeight: '800', letterSpacing: '1px' }}>ROLE</th>
                    <th style={{ padding: '14px', color: 'var(--text-dim)', fontSize: '0.78rem', fontWeight: '800', letterSpacing: '1px' }}>STATUS</th>
                    <th style={{ padding: '14px', color: 'var(--text-dim)', fontSize: '0.78rem', fontWeight: '800', letterSpacing: '1px' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { id: "aryaman_99", role: "Student", status: "Active" },
                    { id: "ved_prakash", role: "Teacher", status: "Idle" },
                    { id: "soma_dev", role: "Student", status: "Active" }
                  ].map((learner) => (
                    <tr key={learner.id} style={{ borderBottom: '1px solid var(--border-soft)' }}>
                      <td style={{ padding: '16px 14px', fontWeight: '700', color: 'var(--text-main)' }}>{learner.id}</td>
                      <td style={{ padding: '16px 14px', fontSize: '0.9rem', color: 'var(--text-dim)' }}>{learner.role}</td>
                      <td style={{ padding: '16px 14px' }}>
                        <span className="badge badge-success" style={{ fontSize: '0.72rem' }}>{learner.status}</span>
                      </td>
                      <td style={{ padding: '16px 14px' }}>
                        <button style={{ background: 'none', border: 'none', color: 'var(--accent-rose)', cursor: 'pointer', padding: '6px' }} title="Remove Learner" aria-label="Remove Learner">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="zen-card" style={{ padding: '32px' }}>
            <h3 className="mb-6" style={{ fontSize: '1.3rem' }}>Module Generator</h3>
            <div className="flex flex-col gap-5">
               <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-dim)', display: 'block', marginBottom: '6px' }}>MODULE TITLE</label>
                  <input type="text" placeholder="e.g. Advaita Philosophy & Sandhi" />
               </div>
               <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-dim)', display: 'block', marginBottom: '6px' }}>TARGET LEVEL</label>
                  <select>
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
               </div>
               <button className="btn-primary w-full mt-2">
                 <PlusCircle size={18} /> Add Module
               </button>
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
}
