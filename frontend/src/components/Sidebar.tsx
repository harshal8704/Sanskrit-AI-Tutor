"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from "framer-motion";
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
  Dice5
} from "lucide-react";

const Sidebar = ({ user }: { user: any }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [theme, setTheme] = useState('light');

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
    { label: "Grammar", path: "/grammar", icon: ShieldCheck },
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
    <motion.aside 
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="zen-card sidebar-container" 
    >
      <div className="sidebar-top">
        <div className="sidebar-header flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="logo-box">🕉️</div>
            <span className="logo-text">Sanskrita</span>
          </div>
          <button onClick={toggleTheme} className="theme-toggle">
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
                className={`sidebar-link ${isActive ? 'active' : ''}`}
              >
                <Icon size={18} className="nav-icon" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="sidebar-bottom">
        <div className="user-info-card">
          <div className="user-name">{user?.username}</div>
          <div className="user-level">{user?.level || 'Beginner'} Path</div>
        </div>
        <button className="logout-btn flex items-center gap-2" onClick={handleLogout}>
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
