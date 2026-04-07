import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { Flame, Star, CheckCircle, AlertCircle, XCircle, Trophy, Sparkles, Calculator } from 'lucide-react';
import { api } from '@/lib/api';

export default function DailyStreak() {
    const [questions, setQuestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [streak, setStreak] = useState(0);
    const [currentDay, setCurrentDay] = useState(1);
    const [currentDayStr, setCurrentDayStr] = useState('');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    const [status, setStatus] = useState<'loading' | 'played_today' | 'playing' | 'failed' | 'completed'>('loading');
    const [shake, setShake] = useState(false);
    const [attempts, setAttempts] = useState(0);
    const [showHint, setShowHint] = useState(false);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const data = await api.lessons.getDailyQuestions();
                setQuestions(data);
                initializeStreak(data);
            } catch (err) {
                console.error("Failed to load daily questions", err);
            } finally {
                setTimeout(() => setLoading(false), 800);
            }
        };
        fetchQuestions();
    }, []);

    const initializeStreak = (allQs: any[]) => {
        if (!allQs || allQs.length === 0) return;

        const storedStreak = parseInt(localStorage.getItem('sanskrit_streak') || '0', 10);
        const storedLastPlayed = localStorage.getItem('sanskrit_last_played');
        const storedCurrentDay = parseInt(localStorage.getItem('sanskrit_current_day') || '1', 10);

        setStreak(storedStreak);
        setCurrentDay(storedCurrentDay);
        
        let qIndex = allQs.findIndex(q => q.day === storedCurrentDay);
        if (qIndex === -1) qIndex = 0;
        setCurrentQuestionIndex(qIndex);

        const today = new Date().toISOString().split('T')[0];
        setCurrentDayStr(today);

        if (storedLastPlayed === today) {
            setStatus('played_today');
        } else if (storedLastPlayed) {
            const yesterdayDate = new Date();
            yesterdayDate.setDate(yesterdayDate.getDate() - 1);
            const yesterday = yesterdayDate.toISOString().split('T')[0];

            if (storedLastPlayed === yesterday) {
                setStatus('playing');
            } else {
                setStreak(0);
                localStorage.setItem('sanskrit_streak', '0');
                setStatus('playing');
            }
        } else {
            setStatus('playing');
        }
    };

    const handleAnswer = (option: string) => {
        if (status !== 'playing') return;
        setSelectedOption(option);

        const currentQ = questions[currentQuestionIndex];
        
        if (option === currentQ.answer) {
            const newStreak = streak + 1;
            setStreak(newStreak);
            localStorage.setItem('sanskrit_streak', newStreak.toString());
            localStorage.setItem('sanskrit_last_played', currentDayStr);
            
            const nextDay = Math.min(currentQ.day + 1, questions.length);
            localStorage.setItem('sanskrit_current_day', nextDay.toString());
            
            setTimeout(() => setStatus('completed'), 800);
        } else {
            if (attempts === 0) {
                setAttempts(1);
                setShake(true);
                setTimeout(() => {
                    setShake(false);
                    setSelectedOption(null);
                    setShowHint(true);
                }, 600);
            } else {
                setStreak(0);
                localStorage.setItem('sanskrit_streak', '0');
                localStorage.setItem('sanskrit_last_played', currentDayStr);
                setTimeout(() => setStatus('failed'), 800);
            }
        }
    };

    if (loading) {
        return (
            <div className="daily-loading-card">
                <motion.div 
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }} 
                    transition={{ repeat: Infinity, duration: 2 }} 
                    className="loading-icon"
                >
                    <Flame size={48} fill="var(--primary)" />
                </motion.div>
                <div className="loading-text">Preparing Daily Mantra...</div>
                <style jsx>{`
                    .daily-loading-card {
                        background: var(--bg-card);
                        border-radius: 32px;
                        padding: 80px;
                        display: flex;
                        flex-direction: column;
                        alignItems: center;
                        justifyContent: center;
                        gap: 24px;
                        border: 1px solid var(--border-soft);
                        text-align: center;
                    }
                    .loading-icon { color: var(--primary); margin: 0 auto; }
                    .loading-text { font-size: 0.9rem; color: var(--text-dim); font-weight: 700; letter-spacing: 3px; text-transform: uppercase; }
                `}</style>
            </div>
        );
    }

    return (
        <LayoutGroup>
            <AnimatePresence mode="wait">
                {status === 'played_today' ? (
                    <motion.div 
                        key="played"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="played-today-card" 
                    >
                        <div className="card-inner">
                            <div className="info-side">
                                <div className="badge-row">
                                    <div className="success-badge">
                                        <CheckCircle size={18} /> Daily Goal Met
                                    </div>
                                    <div className="topic-tag">Reflections</div>
                                </div>
                                <h3 className="card-title">Wisdom Absorbed</h3>
                                <p className="card-desc">
                                    Your path remains clear. You have completed today's sacred challenge. The flame of knowledge burns brighter.
                                </p>
                                <div className="next-time">Next Mantra in ~14 Hours</div>
                            </div>

                            <div className="stats-side">
                                <div className="streak-orb">
                                    <div className="orb-bg"></div>
                                    <div className="orb-content">
                                        <div className="streak-val">{streak}</div>
                                        <div className="streak-sub">Day Streak</div>
                                        <Flame size={24} fill="var(--primary)" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <style jsx>{`
                            .played-today-card {
                                background: var(--bg-card);
                                border-radius: 32px;
                                border: 1px solid var(--border-soft);
                                overflow: hidden;
                                position: relative;
                            }
                            .card-inner { padding: 48px; display: flex; flex-direction: column; md-flex-direction: row; gap: 40px; align-items: center; position: relative; z-index: 2; }
                            @media (min-width: 768px) { .card-inner { flex-direction: row; } }
                            .info-side { flex: 1; }
                            .badge-row { display: flex; gap: 12px; margin-bottom: 24px; }
                            .success-badge { background: #d4edda; color: #155724; padding: 6px 16px; border-radius: 12px; font-size: 0.8rem; font-weight: 800; display: flex; align-items: center; gap: 8px; }
                            .topic-tag { background: var(--bg-main); color: var(--text-dim); padding: 6px 16px; border-radius: 12px; font-size: 0.8rem; font-weight: 700; border: 1px solid var(--border-soft); }
                            .card-title { font-size: 2.2rem; margin-bottom: 16px; letter-spacing: -1px; }
                            .card-desc { color: var(--text-dim); font-size: 1.1rem; line-height: 1.6; margin-bottom: 24px; }
                            .next-time { color: var(--primary); font-size: 0.85rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; }
                            .stats-side { flex-shrink: 0; }
                            .streak-orb { width: 180px; height: 180px; position: relative; display: flex; align-items: center; justify-content: center; }
                            .orb-bg { position: absolute; inset: 0; background: var(--primary); opacity: 0.08; border-radius: 50%; filter: blur(20px); }
                            .orb-content { position: relative; z-index: 2; text-align: center; }
                            .streak-val { font-size: 4rem; font-weight: 950; font-family: 'Marcellus', serif; line-height: 1; margin-bottom: -5px; }
                            .streak-sub { font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; color: var(--text-dim); margin-bottom: 8px; }
                        `}</style>
                    </motion.div>
                ) : status === 'completed' ? (
                    <motion.div 
                        key="completed"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="success-overlay-card"
                    >
                        <motion.div 
                            initial={{ y: 20 }} animate={{ y: 0 }}
                            className="success-content"
                        >
                            <div className="trophy-wrap">
                                <Trophy size={60} />
                                <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="trophy-glow"></motion.div>
                            </div>
                            <h2 className="success-title">Uttamam! (Excellent)</h2>
                            <p className="success-msg">Your wisdom is true. Your streak has advanced to <strong>{streak} days</strong>.</p>
                            
                            <div className="reward-badges">
                                <div className="reward-pill">+25 Karma Points</div>
                                <div className="reward-pill">Level 2 Progress</div>
                            </div>
                            
                            <button onClick={() => window.location.reload()} className="dismiss-btn">Continue Journey</button>
                        </motion.div>
                        <style jsx>{`
                            .success-overlay-card {
                                background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
                                border-radius: 32px;
                                padding: 60px 40px;
                                color: white;
                                text-align: center;
                                position: relative;
                                overflow: hidden;
                            }
                            .success-content { position: relative; z-index: 10; }
                            .trophy-wrap { position: relative; width: 60px; height: 60px; margin: 0 auto 32px auto; }
                            .trophy-glow { position: absolute; inset: -20px; background: white; border-radius: 50%; filter: blur(30px); z-index: -1; }
                            .success-title { font-size: 3rem; font-weight: 900; margin-bottom: 12px; color: #fff; }
                            .success-msg { font-size: 1.25rem; opacity: 0.95; margin-bottom: 32px; }
                            .reward-badges { display: flex; justify-content: center; gap: 16px; margin-bottom: 40px; }
                            .reward-pill { background: rgba(255,255,255,0.25); backdrop-filter: blur(8px); padding: 10px 24px; border-radius: 12px; font-weight: 800; font-size: 0.9rem; }
                            .dismiss-btn { background: white; color: #11998e; padding: 16px 40px; border-radius: 16px; border: none; font-weight: 800; font-size: 1rem; cursor: pointer; transition: all 0.3s; }
                            .dismiss-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
                        `}</style>
                    </motion.div>
                ) : status === 'failed' ? (
                    <motion.div 
                        key="failed"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="failure-overlay-card"
                    >
                        <XCircle size={64} style={{ marginBottom: '24px' }} />
                        <h2>The Path Recedes</h2>
                        <p>A momentary lapse in focus. Your streak has been reset to zero, but your progress through the 50 days remains.</p>
                        <button onClick={() => window.location.reload()} className="btn-primary" style={{ background: '#fff', color: '#eb3349', fontWeight: 800 }}>Return to Practice</button>
                        <style jsx>{`
                            .failure-overlay-card {
                                background: linear-gradient(135deg, #eb3349 0%, #f45c43 100%);
                                border-radius: 32px;
                                padding: 60px 40px;
                                color: white;
                                text-align: center;
                                display: flex;
                                flex-direction: column;
                                align-items: center;
                                justify-content: center;
                            }
                            h2 { font-size: 2.5rem; color: #fff; margin-bottom: 16px; }
                            p { font-size: 1.1rem; opacity: 0.9; max-width: 500px; margin-bottom: 32px; line-height: 1.6; }
                        `}</style>
                    </motion.div>
                ) : (
                    <motion.div 
                        key="playing"
                        layout
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={shake ? { x: [-10, 10, -10, 10, 0], opacity: 1 } : { x: 0, opacity: 1 }}
                        transition={shake ? { duration: 0.4 } : { duration: 0.6 }}
                        className="quest-card"
                    >
                        <div className="quest-header">
                            <div className="header-meta">
                                <div className="day-badge">Day <strong>{currentDay}</strong> of 50</div>
                                <div className="topic-label"><Sparkles size={14} /> {questions[currentQuestionIndex].topic}</div>
                            </div>
                            <div className="header-streak">
                                <Flame size={18} fill="currentColor" />
                                <span>{streak}</span>
                            </div>
                        </div>

                        <div className="quest-body">
                            <h2 className="quest-question">{questions[currentQuestionIndex].question}</h2>

                            <div className="options-grid">
                                {questions[currentQuestionIndex].options.map((opt: string, i: number) => {
                                    const isSelected = selectedOption === opt;
                                    return (
                                        <motion.button
                                            key={i}
                                            whileHover={{ y: -5, borderColor: 'var(--primary)' }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => handleAnswer(opt)}
                                            className={`option-btn ${isSelected ? 'selected' : ''}`}
                                            disabled={selectedOption !== null}
                                        >
                                            <div className="option-index">{String.fromCharCode(65 + i)}</div>
                                            <div className="option-text">{opt}</div>
                                            {isSelected && (
                                                <motion.div layoutId="highlight" className="option-glow" />
                                            )}
                                        </motion.button>
                                    );
                                })}
                            </div>

                            <AnimatePresence>
                                {showHint && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="hint-container"
                                    >
                                        <div className="hint-icon">
                                            <AlertCircle size={20} />
                                        </div>
                                        <div className="hint-content">
                                            <div className="hint-label">Divine Guidance</div>
                                            <p className="hint-text">{questions[currentQuestionIndex].hint}</p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="quest-footer">
                            <div className="progress-bar-wrap">
                                <motion.div 
                                    className="progress-fill"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(currentDay / 50) * 100}%` }}
                                />
                            </div>
                        </div>

                        <style jsx>{`
                            .quest-card {
                                background: var(--bg-card);
                                border-radius: 32px;
                                border: 1px solid var(--border-soft);
                                overflow: hidden;
                                box-shadow: 0 30px 60px rgba(0,0,0,0.04);
                            }
                            .quest-header {
                                background: linear-gradient(90deg, #2d3436 0%, #000 100%);
                                padding: 24px 40px;
                                display: flex;
                                justify-content: space-between;
                                align-items: center;
                                color: #fff;
                            }
                            [data-theme='dark'] .quest-header { background: linear-gradient(90deg, #161b22 0%, #000 100%); }
                            .header-meta { display: flex; gap: 16px; align-items: center; }
                            .day-badge { background: rgba(255,255,255,0.1); padding: 6px 16px; border-radius: 10px; font-size: 0.85rem; letter-spacing: 0.5px; }
                            .topic-label { font-size: 0.85rem; font-weight: 700; color: rgba(255,255,255,0.6); display: flex; align-items: center; gap: 6px; text-transform: uppercase; letter-spacing: 1.5px; }
                            .header-streak { display: flex; items-center: center; gap: 8px; color: #ff8c00; font-weight: 900; font-size: 1.2rem; }
                            
                            .quest-body { padding: 48px; }
                            .quest-question { font-size: 1.8rem; font-weight: 800; color: var(--text-main); margin-bottom: 40px; line-height: 1.35; letter-spacing: -0.5px; }
                            
                            .options-grid { display: grid; grid-template-columns: 1fr; gap: 20px; }
                            @media (min-width: 768px) { .options-grid { grid-template-columns: repeat(3, 1fr); } }
                            
                            .option-btn {
                                background: var(--bg-main);
                                border: 2px solid var(--border-soft);
                                border-radius: 24px;
                                padding: 28px 24px;
                                text-align: left;
                                cursor: pointer;
                                transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                                display: flex;
                                flex-direction: column;
                                gap: 16px;
                                position: relative;
                                color: var(--text-main);
                                box-shadow: 0 4px 12px rgba(0,0,0,0.02);
                            }
                            .option-btn:hover:not(.selected) { border-color: var(--primary); transform: translateY(-4px); box-shadow: 0 12px 24px rgba(0,0,0,0.05); }
                            .option-btn.selected { 
                                background: var(--primary); 
                                border-color: var(--primary); 
                                color: #ffffff !important;
                                transform: scale(1.02);
                                box-shadow: 0 15px 30px rgba(var(--primary-rgb), 0.25); 
                            }
                            .option-index { 
                                width: 32px; 
                                height: 32px; 
                                background: rgba(var(--primary-rgb), 0.12); 
                                border-radius: 10px; 
                                color: var(--primary); 
                                font-weight: 800; 
                                font-size: 0.8rem; 
                                display: flex; 
                                align-items: center; 
                                justify-content: center;
                                transition: all 0.3s;
                            }
                            .option-btn.selected .option-index { background: rgba(255,255,255,0.25); color: #fff; }
                            .option-text { font-size: 1.15rem; font-weight: 700; color: inherit; transition: color 0.2s; }
                            .option-glow { position: absolute; inset: 0; background: rgba(255,255,255,0.05); border-radius: 24px; }

                            .hint-container { margin-top: 40px; display: flex; gap: 20px; background: var(--bg-main); padding: 24px; border-radius: 24px; border: 1px solid var(--border-soft); }
                            .hint-icon { width: 44px; height: 44px; background: #fff3cd; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #856404; flex-shrink: 0; }
                            .hint-label { font-size: 0.75rem; font-weight: 800; text-transform: uppercase; color: #856404; letter-spacing: 1px; margin-bottom: 4px; }
                            .hint-text { margin: 0; color: var(--text-dim); line-height: 1.5; font-size: 0.95rem; }
                            
                            .quest-footer { background: var(--bg-main); padding: 12px 0; }
                            .progress-bar-wrap { height: 6px; background: var(--border-soft); width: 100%; position: relative; }
                            .progress-fill { height: 100%; background: var(--primary); position: absolute; left: 0; top: 0; border-radius: 0 3px 3px 0; }
                        `}</style>
                    </motion.div>
                )}
            </AnimatePresence>
        </LayoutGroup>
    );
}
