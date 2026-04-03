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
  ChevronRight,
  Sparkles
} from "lucide-react";
import GreetingsLesson from "@/components/lessons/GreetingsLesson";
import NumbersLesson from "@/components/lessons/NumbersLesson";

const AlphabetFlashcards = () => {
  const [vowelImages, setVowelImages] = useState<string[]>([]);
  const [consonantImages, setConsonantImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlphabets = async () => {
      try {
        const [vResponse, cResponse] = await Promise.all([
          fetch('/api/alphabets?type=vowels'),
          fetch('/api/alphabets?type=consonants')
        ]);
        const [vData, cData] = await Promise.all([vResponse.json(), cResponse.json()]);
        if (vData.images) setVowelImages(vData.images);
        if (cData.images) setConsonantImages(cData.images);
      } finally {
        setLoading(false);
      }
    };
    fetchAlphabets();
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-40 gap-6">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2 }} className="text-[var(--primary)]">
            <Sparkles size={60} />
        </motion.div>
        <p className="text-[var(--text-dim)] font-medium">Preparing visual aids...</p>
    </div>
  );

  return (
    <div className="flex flex-col gap-12 mt-12 pb-20 max-w-6xl mx-auto">
      <AnimatePresence>
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="zen-card overflow-hidden border border-[var(--border-soft)] shadow-2xl relative"
        >
          {/* Header Strip */}
          <div className="bg-gradient-to-r from-[var(--primary)] to-transparent p-10 flex items-center justify-between border-b border-[var(--border-soft)]">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center text-white font-bold text-4xl shadow-xl ring-1 ring-white/30">अ</div>
              <div>
                <h3 className="text-3xl font-bold text-white tracking-tight">Sanskrit Vowels</h3>
                <p className="text-white/70 text-sm font-semibold tracking-[4px] uppercase mt-1">Swaras (Foundations)</p>
              </div>
            </div>
          </div>
          
          <div className="p-10 bg-[var(--bg-card)]">
            {vowelImages.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {vowelImages.map((src, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="relative group p-4 bg-[var(--bg-main)] rounded-[32px] border border-[var(--border-soft)] shadow-inner"
                  >
                    <img 
                      src={src} 
                      alt="Sanskrit Vowels" 
                      className="w-full h-auto rounded-2xl shadow-lg group-hover:scale-[1.01] transition-transform duration-500" 
                      style={{ maxHeight: '600px', objectFit: 'contain' }} 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[rgba(var(--primary-rgb),0.1)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[32px] pointer-events-none"></div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="p-32 text-center bg-[var(--bg-main)] rounded-[40px] border-4 border-dashed border-[var(--border-soft)]">
                <p className="text-[var(--text-light)] text-xl font-bold italic tracking-wide">Manuscripts for vowels arriving soon...</p>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="zen-card overflow-hidden border border-[var(--border-soft)] shadow-2xl relative"
        >
          {/* Header Strip */}
          <div className="bg-gradient-to-r from-[var(--primary)] to-transparent p-10 flex items-center justify-between border-b border-[var(--border-soft)]">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center text-white font-bold text-4xl shadow-xl ring-1 ring-white/30">क</div>
              <div>
                <h3 className="text-3xl font-bold text-white tracking-tight">Sanskrit Consonants</h3>
                <p className="text-white/70 text-sm font-semibold tracking-[4px] uppercase mt-1">Vyanjanas (Structures)</p>
              </div>
            </div>
          </div>
          
          <div className="p-10 bg-[var(--bg-card)]">
            {consonantImages.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {consonantImages.map((src, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="relative group p-4 bg-[var(--bg-main)] rounded-[32px] border border-[var(--border-soft)] shadow-inner"
                  >
                    <img 
                      src={src} 
                      alt="Sanskrit Consonants" 
                      className="w-full h-auto rounded-2xl shadow-lg group-hover:scale-[1.01] transition-transform duration-500" 
                      style={{ maxHeight: '600px', objectFit: 'contain' }} 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[rgba(var(--primary-rgb),0.1)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[32px] pointer-events-none"></div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="p-32 text-center bg-[var(--bg-main)] rounded-[40px] border-4 border-dashed border-[var(--border-soft)]">
                <p className="text-[var(--text-light)] text-xl font-bold italic tracking-wide">Consonant charts currently being prepared by the acharya...</p>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

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
              {selectedLesson.id !== 1 && selectedLesson.id !== 2 && selectedLesson.id !== 3 && selectedLesson.content}
              
              {selectedLesson.id === 1 ? (
                <AlphabetFlashcards />
              ) : selectedLesson.id === 2 ? (
                <GreetingsLesson onBack={() => setSelectedLesson(null)} />
              ) : selectedLesson.id === 3 ? (
                <NumbersLesson onBack={() => setSelectedLesson(null)} />
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="devanagari" 
                  style={{ fontSize: '3rem', textAlign: 'center', marginTop: '60px', color: 'var(--primary)' }}
                >
                  {"सत्यं वद। धर्मं चर।"}
                </motion.div>
              )}
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
