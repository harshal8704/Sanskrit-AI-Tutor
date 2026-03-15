"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import Sidebar from "@/components/Sidebar";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, 
  Clock, 
  ArrowLeft,
  Play,
  CheckCircle2,
  Lock,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

export default function Lessons() {
  const [user, setUser] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/");
      return;
    }
    const userData = JSON.parse(storedUser);
    setUser(userData);

    const fetchLessons = async () => {
      try {
        const data = await api.lessons.getAll();
        setLessons(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, [router]);

  const handleNext = () => {
    const currentIndex = lessons.findIndex(l => l.id === selectedLesson.id);
    if (currentIndex < lessons.length - 1) {
      setSelectedLesson(lessons[currentIndex + 1]);
    }
  };

  const handlePrev = () => {
    const currentIndex = lessons.findIndex(l => l.id === selectedLesson.id);
    if (currentIndex > 0) {
      setSelectedLesson(lessons[currentIndex - 1]);
    }
  };

  if (!user || loading) return <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
    <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} style={{ fontSize: '1.2rem' }}>Preparing Curriculum...</motion.div>
  </div>;

  if (selectedLesson) {
    return (
      <div className="page-layout">
        <Sidebar user={user} />
        <main className="main-content">
          <button className="flex items-center gap-2 mb-8" style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', fontWeight: '600' }} onClick={() => setSelectedLesson(null)}>
            <ArrowLeft size={18} /> Back to Modules
          </button>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="zen-card"
            style={{ padding: '60px', maxWidth: '1000px', margin: '0 auto' }}
          >
            <span style={{ background: 'rgba(192, 90, 43, 0.08)', color: 'var(--primary)', padding: '6px 14px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {selectedLesson.level} Path
            </span>
            <h1 style={{ fontSize: '3rem', marginTop: '1.5rem', marginBottom: '1rem' }}>{selectedLesson.title}</h1>
            <div className="flex" style={{ gap: '20px', color: 'var(--text-light)', marginBottom: '40px' }}>
              <div className="flex items-center gap-1"><Clock size={16} /> {selectedLesson.duration} minutes remaining</div>
              <div className="flex items-center gap-1"><BookOpen size={16} /> Concept Study</div>
            </div>

            <div style={{ fontSize: '1.2rem', lineHeight: '2', color: 'var(--text-main)', padding: '40px', background: 'var(--bg-main)', borderRadius: '24px', marginBottom: '40px' }}>
              {selectedLesson.content}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="devanagari" 
                style={{ fontSize: '3rem', textAlign: 'center', marginTop: '60px', color: 'var(--primary)' }}
              >
                {selectedLesson.id === 1 ? "अ आ इ ई उ ऊ ऋ ऌ ए ऐ ओ औ" : selectedLesson.id === 2 ? "नमस्ते! सुप्रभातम्।" : "सत्यं वद। धर्मं चर।"}
              </motion.div>
            </div>

            <div className="flex justify-between items-center mt-12">
              <div className="flex gap-3">
                <button 
                  className="btn-secondary" 
                  onClick={handlePrev}
                  disabled={lessons.findIndex(l => l.id === selectedLesson.id) === 0}
                  style={{ opacity: lessons.findIndex(l => l.id === selectedLesson.id) === 0 ? 0.5 : 1 }}
                >
                  <ChevronLeft size={18} /> Previous
                </button>
                <button 
                  className="btn-secondary" 
                  onClick={handleNext}
                  disabled={lessons.findIndex(l => l.id === selectedLesson.id) === lessons.length - 1}
                  style={{ opacity: lessons.findIndex(l => l.id === selectedLesson.id) === lessons.length - 1 ? 0.5 : 1 }}
                >
                  Next <ChevronRight size={18} />
                </button>
              </div>

              <div className="flex gap-4">
                <button className="btn-secondary">Download PDF</button>
                <button className="btn-primary" onClick={() => alert("Quiz manifest arriving soon!")}>
                  Mark as Complete <CheckCircle2 size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="page-layout">
      <Sidebar user={user} />
      
      <main className="main-content">
        <header style={{ marginBottom: '48px' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Learning Modules</h1>
          <p style={{ color: 'var(--text-dim)' }}>Select a step in your journey. We recommend starting with the foundations.</p>
        </header>

        <div className="grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '30px' }}>
          {lessons.map((lesson, i) => (
            <motion.div 
              key={lesson.id} 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className="zen-card"
              style={{ padding: '34px', cursor: 'pointer' }}
              onClick={() => setSelectedLesson(lesson)}
            >
              <div className="flex justify-between items-start mb-6">
                <span style={{ 
                  fontSize: '0.75rem', 
                  padding: '5px 12px', 
                  borderRadius: '10px', 
                  backgroundColor: lesson.level === 'beginner' ? 'rgba(39, 174, 96, 0.08)' : 'rgba(192, 90, 43, 0.08)',
                  color: lesson.level === 'beginner' ? '#27ae60' : 'var(--primary)',
                  fontWeight: '700',
                  textTransform: 'uppercase'
                }}>
                  {lesson.level}
                </span>
                <span style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>⏱️ {lesson.duration}m</span>
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>{lesson.title}</h3>
              <p style={{ color: 'var(--text-dim)', marginBottom: '30px', fontSize: '0.95rem', height: '4.8em', overflow: 'hidden' }}>{lesson.description}</p>
              
              <div className="flex items-center gap-2" style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '0.9rem' }}>
                <Play size={16} fill="var(--primary)" /> Resume Lesson
              </div>
            </motion.div>
          ))}

          <div 
            className="zen-card flex items-center justify-center" 
            style={{ border: '2px dashed var(--border-soft)', background: 'transparent', opacity: 0.6 }}
          >
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <Lock size={24} style={{ marginBottom: '16px', color: 'var(--text-light)' }} />
              <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>Advanced modules unlocking as you progress...</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
