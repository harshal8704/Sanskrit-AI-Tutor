"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutGrid,
  Library,
  Languages,
  ShieldCheck,
  BarChart3,
  Settings,
  LogOut,
  Sun,
  Moon,
  Dice5,
  Sparkles,
  Menu,
  X
} from "lucide-react";

const Sidebar = ({ user }: { user: any }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [theme, setTheme] = useState('light');
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const navItems = [
    { label: "Overview", path: "/dashboard", icon: LayoutGrid },
    { label: "Lessons", path: "/lessons", icon: Library },
    { label: "Translator", path: "/translation", icon: Languages },
    { label: "Grammar Checker", path: "/grammar", icon: ShieldCheck },
    { label: "Insights", path: "/progress", icon: BarChart3 },
    { label: "Play", path: "/game/menu", icon: Dice5 },
  ];

  if (user?.role === 'admin') {
    navItems.push({ label: "Admin", path: "/admin", icon: Settings });
  }

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/');
  };

  return (
    <>
      {/* Mobile Top Header */}
      <div className="mobile-header-bar flex items-center justify-between p-4 bg-glass border-b border-soft md:hidden" style={{ display: 'none' }}>
        <div className="flex items-center gap-3">
          <div className="logo-box">🕉️</div>
          <span className="logo-text">Sanskrita</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle Theme">
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="theme-toggle" aria-label="Toggle Menu">
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <motion.aside
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={`sidebar-container ${mobileOpen ? 'mobile-show' : ''}`}
      >
        <div className="sidebar-top">
          <div className="sidebar-header flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-3" style={{ textDecoration: 'none' }}>
              <div className="logo-box">🕉️</div>
              <div>
                <span className="logo-text">Sanskrita</span>
                <span style={{ fontSize: '0.65rem', display: 'block', color: 'var(--primary)', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', marginTop: '-2px' }}>AI TUTOR</span>
              </div>
            </Link>
            <button onClick={toggleTheme} className="theme-toggle" title="Toggle Light/Dark Theme" aria-label="Toggle Theme">
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
          </div>

          <nav className="sidebar-nav">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`sidebar-link ${isActive ? 'active' : ''}`}
                >
                  <Icon size={19} className="nav-icon" />
                  <span>{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activePill"
                      style={{ position: 'absolute', right: '12px', width: '6px', height: '6px', borderRadius: '50%', background: 'white' }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="sidebar-bottom">
          <div className="user-info-card">
            <div className="flex items-center gap-3">
              <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: 'var(--primary-light)', border: '1px solid rgba(var(--primary-rgb), 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontWeight: 800, fontSize: '0.9rem' }}>
                {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div className="user-name" style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{user?.username}</div>
                <div className="user-level flex items-center gap-1">
                  <Sparkles size={12} /> {user?.level || 'Beginner'} Path
                </div>
              </div>
            </div>
          </div>
          <button className="logout-btn w-full flex items-center justify-center gap-2" onClick={handleLogout}>
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
