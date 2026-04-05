"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import Sidebar from "@/components/Sidebar";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dice5,
  Trophy,
  Zap,
  Heart,
  ArrowUp,
  ArrowDown,
  Sparkles,
  RotateCcw,
  Lightbulb,
  Send,
  CheckCircle2,
  XCircle,
  Info,
  Sparkle,
  CircleDot,
  Grid3X3
} from "lucide-react";

// Floating Particle Component
const FloatingEmoji = ({ emoji, color }: { emoji: string; color: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 0, x: 0, scale: 0.5 }}
    animate={{
      opacity: [0, 1, 1, 0],
      y: -150,
      x: Math.random() * 100 - 50,
      scale: [0.5, 1.5, 1]
    }}
    transition={{ duration: 2, ease: "easeOut" }}
    style={{
      position: 'absolute',
      fontSize: '2rem',
      pointerEvents: 'none',
      zIndex: 50,
      color: color,
      textShadow: '0 0 20px rgba(0,0,0,0.1)'
    }}
  >
    {emoji}
  </motion.div>
);

const TOTAL_CELLS = 50;
const GRID_COLS = 10;
const GRID_ROWS = 5;

// Visual Board Component
const GameBoard = ({ currentPosition }: { currentPosition: number }) => {
  const cells = Array.from({ length: TOTAL_CELLS }, (_, i) => i + 1);

  const getCellCoords = (cellNum: number) => {
    const row = Math.floor((cellNum - 1) / GRID_COLS);
    const colInRow = (cellNum - 1) % GRID_COLS;
    // User logic: Row 0 (bottom) is Right-to-Left (1 is right, 10 is left)
    // Row 1 (above) is Left-to-Right (11 is left, 20 is right)
    const x = row % 2 === 0 ? (GRID_COLS - 1) - colInRow : colInRow;
    const y = (GRID_ROWS - 1) - row;
    return { x, y };
  };

  // Fixed Board Elements (Matched to Backend)
  const ladderData = [
    { start: 2, end: 11 }, { start: 4, end: 14 },
    { start: 9, end: 31 }, { start: 16, end: 26 },
    { start: 20, end: 38 }, { start: 28, end: 47 },
    { start: 35, end: 45 }
  ];
  const snakeData = [
    { start: 12, end: 2 }, { start: 17, end: 7 },
    { start: 25, end: 11 }, { start: 32, end: 15 },
    { start: 38, end: 24 }, { start: 44, end: 31 },
    { start: 49, end: 38 }
  ];

  return (
    <div className="board-outer-container" style={{ position: 'relative' }}>
      <div className="zen-card" style={{
        padding: '24px',
        background: 'var(--bg-card)',
        position: 'relative',
        aspectRatio: '2/1',
        border: '6px solid #5d3f9b',
        borderRadius: '32px',
        boxShadow: '0 30px 60px rgba(0,0,0,0.15)',
        zIndex: 1,
        overflow: 'hidden'
      }}>
        <div className="board-grid" style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_ROWS}, 1fr)`,
          gap: '6px',
        }}>
          {/* SVG Layer for Connections */}
          <svg 
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            style={{
              position: 'absolute',
              top: 0, left: 0,
              width: '100%', height: '100%',
              pointerEvents: 'none',
              zIndex: 5
            }}
          >
            <defs>
              <linearGradient id="snakeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2ecc71" />
                <stop offset="100%" stopColor="#27ae60" />
              </linearGradient>
              <linearGradient id="ladderGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#d35400" />
                <stop offset="100%" stopColor="#e67e22" />
              </linearGradient>
            </defs>

            {/* Draw Ladders */}
            {ladderData.map((l, i) => {
              const start = getCellCoords(l.start);
              const end = getCellCoords(l.end);
              const x1 = (start.x + 0.5) * 10;
              const y1 = (start.y + 0.5) * 20;
              const x2 = (end.x + 0.5) * 10;
              const y2 = (end.y + 0.5) * 20;
              return (
                <g key={`l-${i}`}>
                  <line
                    x1={x1} y1={y1} x2={x2} y2={y2}
                    stroke="url(#ladderGrad)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    opacity="0.2"
                  />
                  <line
                    x1={x1} y1={y1} x2={x2} y2={y2}
                    stroke="url(#ladderGrad)"
                    strokeWidth="1"
                    strokeDasharray="1,4"
                    className="ladder-step-anim"
                  />
                  {/* Rungs of the ladder */}
                  {[0.2, 0.4, 0.6, 0.8].map((prog, j) => {
                    const rx1 = x1 + (x2 - x1) * prog - 1.5;
                    const ry1 = y1 + (y2 - y1) * prog;
                    const rx2 = x1 + (x2 - x1) * prog + 1.5;
                    const ry2 = y1 + (y2 - y1) * prog;
                    return (
                      <line
                        key={j}
                        x1={rx1} y1={ry1} x2={rx2} y2={ry2}
                        stroke="#d35400"
                        strokeWidth="1"
                        strokeLinecap="round"
                      />
                    );
                  })}
                </g>
              );
            })}

            {/* Draw Snakes */}
            {snakeData.map((s, i) => {
              const start = getCellCoords(s.start);
              const end = getCellCoords(s.end);
              const x1 = (start.x + 0.5) * 10;
              const y1 = (start.y + 0.5) * 20;
              const x2 = (end.x + 0.5) * 10;
              const y2 = (end.y + 0.5) * 20;
              // Stable mid points to avoid jitter
              const midX = (x1 + x2) / 2 + (i % 2 === 0 ? 5 : -5);
              const midY = (y1 + y2) / 2;
              const d = `M ${x1} ${y1} Q ${midX} ${y1} ${midX} ${midY} T ${x2} ${y2}`;
              return (
                <path
                  key={`s-${i}`}
                  d={d}
                  className="cobra-path"
                  stroke="url(#snakeGrad)"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  opacity="0.8"
                  style={{ filter: 'drop-shadow(0 0.5px 1px rgba(0,0,0,0.3))' }}
                />
              );
            })}
          </svg>

          {cells.map((cellNum) => {
            const coords = getCellCoords(cellNum);
            const isDark = (Math.floor((cellNum - 1) / 10) + (cellNum - 1) % 10) % 2 === 1;
            return (
              <div
                key={cellNum}
                style={{
                  gridColumnStart: coords.x + 1,
                  gridRowStart: coords.y + 1,
                  background: isDark ? 'rgba(136,84,208,0.08)' : 'rgba(136,84,208,0.02)',
                  border: '1px solid var(--border-soft)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  fontWeight: '900',
                  color: isDark ? 'var(--text-dim)' : 'var(--text-light)',
                  position: 'relative',
                  transition: 'all 0.3s'
                }}
              >
                <span style={{ position: 'relative', zIndex: 2 }}>
                  {cellNum === 50 ? '🏆' : cellNum === 1 ? '🏁' : cellNum}
                </span>
              </div>
            );
          })}

          {/* The Player Pawn */}
          <motion.div
            animate={{
              left: `${(getCellCoords(currentPosition).x * 10) + 5}%`,
              top: `${(getCellCoords(currentPosition).y * 20) + 10}%`,
            }}
            transition={{ type: "spring", stiffness: 80, damping: 15 }}
            style={{
              position: 'absolute',
              width: '40px',
              height: '40px',
              transform: 'translate(-50%, -50%)',
              zIndex: 100,
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <motion.div
              animate={{ y: [0, -8, 0], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                width: '32px',
                height: '32px',
                background: '#8854d0',
                borderRadius: '50% 50% 20% 20%',
                boxShadow: '0 8px 20px rgba(136,84,208,0.4)',
                border: '3px solid white',
                position: 'relative'
              }}
            >
              <div style={{ position: 'absolute', top: '4px', left: '50%', transform: 'translateX(-50%)', width: '6px', height: '6px', background: 'white', borderRadius: '50%', opacity: 0.6 }} />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default function GamePage() {
  const [user, setUser] = useState<any>(null);
  const [position, setPosition] = useState(1);
  const [currentWord, setCurrentWord] = useState<any>(null);
  const [allWords, setAllWords] = useState<any[]>([]);
  const [currentOptions, setCurrentOptions] = useState<string[]>([]);
  const [diceValue, setDiceValue] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [streak, setStreak] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [totalWrong, setTotalWrong] = useState(0);
  const [animationState, setAnimationState] = useState<"idle" | "correct" | "wrong">("idle");
  const [particles, setParticles] = useState<{ id: number; emoji: string; color: string }[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Game Selector
  const [activeGame, setActiveGame] = useState<"snake" | "odd">("snake");

  // Odd One Out State
  const [oddQuestion, setOddQuestion] = useState<any>(null);
  const [oddFeedback, setOddFeedback] = useState<any>(null);
  const [oddScore, setOddScore] = useState(0);
  const [oddTotal, setOddTotal] = useState(0);
  const [oddLoading, setOddLoading] = useState(false);
  const [oddStarted, setOddStarted] = useState(false);
  const [oddSelected, setOddSelected] = useState<number | null>(null);
  const [oddHistory, setOddHistory] = useState<any[]>([]);
  const [oddWordsDb, setOddWordsDb] = useState<any[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/");
      return;
    }
    setUser(JSON.parse(storedUser));

    // AUTO-SELECT GAME FROM MENU
    const preferredGame = localStorage.getItem("preferredGame");
    if (preferredGame === "odd") {
      setActiveGame("odd");
    } else {
      setActiveGame("snake");
    }
  }, [router]);

  // ── Odd One Out Functions ──
  const generateOddTurn = (db: any[]) => {
    const categories = Array.from(new Set(db.map(w => w.category)));
    const targetCategory = categories[Math.floor(Math.random() * categories.length)];
    
    const categoryWords = db.filter(w => w.category === targetCategory);
    const otherWords = db.filter(w => w.category !== targetCategory);
    
    // Pick 3 from categoryWords
    const normalWords: any[] = [];
    const tempCat = [...categoryWords];
    for (let i = 0; i < 3 && tempCat.length > 0; i++) {
        const idx = Math.floor(Math.random() * tempCat.length);
        normalWords.push(tempCat[idx]);
        tempCat.splice(idx, 1);
    }
    
    // Pick 1 from otherWords
    const oddWord = otherWords[Math.floor(Math.random() * otherWords.length)];
    
    const options = [...normalWords, oddWord];
    // Shuffle options
    for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
    }
    
    const correctIndex = options.findIndex(o => o.id === oddWord.id);

    setOddQuestion({
        category: targetCategory,
        options: options,          // objects {id, sanskrit, english, category}
        oddWord: oddWord,          // The correct answer
        correct_index: correctIndex
    });
  };

  const startOddGame = async () => {
    try {
      const res = await api.game.getOddOneOutWords();
      setOddWordsDb(res);
      setOddStarted(true);
      setOddFeedback(null);
      setOddScore(0);
      setOddTotal(0);
      setOddSelected(null);
      setOddHistory([]);
      generateOddTurn(res);
    } catch (err) {
      console.error("Failed to start Odd One Out:", err);
    }
  };

  const submitOddAnswer = async (choiceIndex: number) => {
    if (oddLoading || !oddQuestion) return;
    setOddLoading(true);
    setOddSelected(choiceIndex);

    const isCorrect = choiceIndex === oddQuestion.correct_index;
    const selectedOption = oddQuestion.options[choiceIndex];

    const feedbackStr = `You chose ${selectedOption.english} (${selectedOption.sanskrit}). ${selectedOption.english} is a ${selectedOption.category}. The other 3 are ${oddQuestion.category}. The correct odd one out was ${oddQuestion.oddWord.english}!`;
    
    const newFeedback = {
        is_correct: isCorrect,
        correct_index: oddQuestion.correct_index,
        message: feedbackStr,
        correct_word: oddQuestion.oddWord
    };

    setOddFeedback(newFeedback);
    setOddTotal((t) => t + 1);
    if (isCorrect) setOddScore((s) => s + 1);

    setOddHistory((prev) => [
        {
          category: oddQuestion.category,
          correct: isCorrect,
          correctWord: oddQuestion.oddWord.sanskrit,
        },
        ...prev,
    ]);

    setTimeout(async () => {
        generateOddTurn(oddWordsDb);
        setOddFeedback(null);
        setOddSelected(null);
        setOddLoading(false);
    }, 4000);
  };

  const checkBoard = (pos: number) => {
    let finalPos = pos;
    let event = "correct";
    const ladderData = [
      { start: 2, end: 11 }, { start: 4, end: 14 },
      { start: 9, end: 31 }, { start: 16, end: 26 },
      { start: 20, end: 38 }, { start: 28, end: 47 },
      { start: 35, end: 45 }
    ];
    const snakeData = [
      { start: 12, end: 2 }, { start: 17, end: 7 },
      { start: 25, end: 11 }, { start: 32, end: 15 },
      { start: 38, end: 24 }, { start: 44, end: 31 },
      { start: 49, end: 38 }
    ];

    const ladder = ladderData.find(l => l.start === pos);
    if (ladder) {
      finalPos = ladder.end;
      event = "ladder";
    } else {
      const snake = snakeData.find(s => s.start === pos);
      if (snake) {
        finalPos = snake.end;
        event = "snake";
      }
    }
    return { finalPos, event };
  };

  const generateTurn = (wordsDb: any[]) => {
    const target = wordsDb[Math.floor(Math.random() * wordsDb.length)];
    const distractors = wordsDb.filter(w => w.id !== target.id);
    
    // Pick 3 random distractors
    const chosenDistractors: string[] = [];
    while (chosenDistractors.length < 3 && distractors.length > 0) {
      const idx = Math.floor(Math.random() * distractors.length);
      chosenDistractors.push(distractors[idx].englishMeaning);
      distractors.splice(idx, 1);
    }
    
    const optionsArray = [target.englishMeaning, ...chosenDistractors];
    // Shuffle Array
    for (let i = optionsArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [optionsArray[i], optionsArray[j]] = [optionsArray[j], optionsArray[i]];
    }
    
    setCurrentWord(target);
    setCurrentOptions(optionsArray);
  };

  const startGame = async () => {
    try {
      const res = await api.game.getSnakeLadderWords();
      setAllWords(res);
      setPosition(1);
      setGameStarted(true);
      setFeedback(null);
      setHistory([]);
      setStreak(0);
      setTotalCorrect(0);
      setTotalWrong(0);
      setDiceValue(null);
      generateTurn(res);
    } catch (err) {
      console.error("Failed to start game:", err);
    }
  };

  const submitAnswer = async (selectedOption: string) => {
    if (!currentWord || loading) return;
    setLoading(true);
    setFeedback(null);
    setDiceValue(null);

    const isCorrect = selectedOption === currentWord.englishMeaning;
    
    let roll = 0;
    let targetPos = position;
    let finalPos = position;
    let currentEvent = isCorrect ? "correct" : "wrong";

    if (isCorrect) {
      roll = Math.floor(Math.random() * 6) + 1;
      setDiceValue(roll);
      targetPos = Math.min(50, position + roll);
      const boardRes = checkBoard(targetPos);
      finalPos = boardRes.finalPos;
      currentEvent = boardRes.event;
    } else {
      finalPos = Math.max(1, position - 2);
      currentEvent = "snake"; // visual feedback of sliding down
    }

    const isWin = finalPos === 50;
    if (isWin) currentEvent = "win";

    const res = {
      event: currentEvent,
      position: finalPos,
      correct_answer: currentWord.englishMeaning,
      game_over: isWin
    };

    setFeedback(res);
    setPosition(res.position);

    if (isCorrect) {
      setAnimationState("correct");
      setStreak((s) => s + 1);
      setTotalCorrect((c) => c + 1);
      if (res.event === "ladder") {
        const id = Date.now();
        setParticles(prev => [...prev, { id, emoji: "🪜", color: "#27ae60" }]);
        setTimeout(() => setParticles(prev => prev.filter(p => p.id !== id)), 2000);
      }
    } else {
      setAnimationState("wrong");
      setStreak(0);
      setTotalWrong((w) => w + 1);
      const id = Date.now();
      setParticles(prev => [...prev, { id, emoji: "🐍", color: "#e74c3c" }]);
      setTimeout(() => setParticles(prev => prev.filter(p => p.id !== id)), 2000);
    }

    const entry = {
      word: currentWord.sanskrit,
      answer: selectedOption,
      correct: isCorrect,
      correctAnswer: res.correct_answer,
      event: res.event,
    };
    setHistory((prev) => [entry, ...prev]);

    setTimeout(() => setAnimationState("idle"), 600);

    if (res.game_over) {
      setGameStarted(false);
    } else {
      generateTurn(allWords);
    }

    setLoading(false);
  };

  const progressPercent = Math.min((position / TOTAL_CELLS) * 100, 100);

  if (!user) return null;

  return (
    <div className="page-layout">
      <Sidebar user={user} />

      <main className="main-content">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: "40px" }}
        >
          <div className="flex items-center gap-3 mb-4">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="logo-box"
              style={{ background: activeGame === 'snake' ? "#8854d0" : "#e67e22" }}
            >
              {activeGame === 'snake' ? <Dice5 size={20} /> : <Grid3X3 size={20} />}
            </motion.div>
            <span
              style={{
                color: activeGame === 'snake' ? "#8854d0" : "#e67e22",
                fontWeight: "800",
                textTransform: "uppercase",
                letterSpacing: "2px",
                fontSize: "0.75rem",
              }}
            >
              Sanskrit Arena
            </span>
          </div>
          <h1
            style={{
              fontSize: "3rem",
              marginBottom: "10px",
              letterSpacing: "-2px",
            }}
          >
            {activeGame === 'snake' ? 'Snake & Ladder' : 'Odd One Out'}
          </h1>
          <p
            style={{
              color: "var(--text-dim)",
              fontSize: "1.1rem",
              maxWidth: "600px",
              lineHeight: "1.6",
            }}
          >
            {activeGame === 'snake'
              ? "Master the ancient tongue to navigate a path of destiny. Every correct word elevates your spirit, while shadows await those who falter. Can you reach the summit of wisdom?"
              : "Sharpen your intellect and discern the subtle patterns of the Devas. Among the sacred verses, one remains an outsider. Trust your intuition to find the one that does not resonate with the rest."
            }
          </p>
        </motion.header>

        {/* Game Selector Tabs */}
        <div className="flex gap-4" style={{ marginBottom: '40px' }}>
          {[
            { key: 'snake' as const, label: 'Snake & Ladder', icon: Dice5, color: '#8854d0' },
            { key: 'odd' as const, label: 'Odd One Out', icon: Grid3X3, color: '#e67e22' },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeGame === tab.key;
            return (
              <motion.button
                key={tab.key}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveGame(tab.key)}
                style={{
                  padding: '14px 28px',
                  borderRadius: '18px',
                  border: isActive ? `2px solid ${tab.color}` : '2px solid var(--border-soft)',
                  background: isActive ? tab.color : 'var(--bg-card)',
                  color: isActive ? 'white' : 'var(--text-dim)',
                  fontWeight: '800',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  transition: 'all 0.3s',
                  boxShadow: isActive ? `0 10px 30px ${tab.color}33` : 'none',
                }}
              >
                <Icon size={18} /> {tab.label}
              </motion.button>
            );
          })}
        </div>

        {/* ═══════════════════════════════════════════════════ */}
        {/* SNAKE & LADDER GAME */}
        {/* ═══════════════════════════════════════════════════ */}
        {activeGame === "snake" && (<>

          {/* Game Area */}
          {gameStarted && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ marginBottom: '40px' }}
            >
              <GameBoard currentPosition={position} />
            </motion.div>
          )}

          {/* Game Board (Start Screen / Victory) */}
          {!gameStarted && !feedback?.game_over ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="zen-card"
              style={{
                padding: "80px 60px",
                textAlign: "center",
                maxWidth: "650px",
                margin: "0 auto",
                background: "var(--bg-card)",
                border: "1px solid var(--border-soft)"
              }}
            >
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                style={{ fontSize: "5rem", marginBottom: "30px" }}
              >
                🎲
              </motion.div>
              <h2
                style={{
                  fontSize: "2rem",
                  marginBottom: "16px",
                  letterSpacing: "-1px",
                }}
              >
                Ready to Roll?
              </h2>
              <p
                style={{
                  color: "var(--text-dim)",
                  maxWidth: "400px",
                  margin: "0 auto 40px",
                  fontSize: "1.05rem",
                  lineHeight: "1.7",
                }}
              >
                Test your Sanskrit vocabulary in our enhanced Snake & Ladder trial.
                <br /><br />
                🎲 <strong>Correct:</strong> Roll the dice to move <strong>1-6</strong> steps.
                <br />
                🐍 <strong>Wrong:</strong> Slide back <strong>-2</strong> positions.
                <br />
                🪜 <strong>Ladders:</strong> Divine shortcuts to boost your ascent.
                <br />
                🏆 <strong>Win:</strong> Reach position <strong>50</strong> to achieve mastery!
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary"
                onClick={startGame}
                style={{
                  padding: "18px 50px",
                  fontSize: "1.1rem",
                  borderRadius: "20px",
                  background: "#8854d0",
                  margin: "0 auto",
                  boxShadow: "0 15px 40px rgba(136,84,208,0.25)",
                }}
              >
                <Sparkles size={20} /> Start Game
              </motion.button>
            </motion.div>
          ) : feedback?.game_over ? (
            /* Victory Screen */
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="zen-card"
              style={{
                padding: "80px 60px",
                textAlign: "center",
                maxWidth: "650px",
                margin: "0 auto",
                background: "var(--bg-card)",
                border: "2px solid #27ae60"
              }}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{ fontSize: "5rem", marginBottom: "30px" }}
              >
                🏆
              </motion.div>
              <h2
                style={{
                  fontSize: "2.5rem",
                  marginBottom: "16px",
                  color: "#27ae60",
                }}
              >
                Victory!
              </h2>
              <p
                style={{
                  color: "var(--text-dim)",
                  maxWidth: "420px",
                  margin: "0 auto 20px",
                  fontSize: "1.1rem",
                  lineHeight: "1.7",
                }}
              >
                You have conquered the board! Your Sanskrit knowledge has proven
                worthy. The ancients would be proud.
              </p>
              <div
                className="flex items-center justify-center gap-8"
                style={{ marginBottom: "40px" }}
              >
                <div style={{ textAlign: "center" }}>
                  <span
                    style={{
                      fontSize: "2rem",
                      fontWeight: "900",
                      color: "#27ae60",
                    }}
                  >
                    {totalCorrect}
                  </span>
                  <p
                    style={{
                      fontSize: "0.8rem",
                      color: "var(--text-dim)",
                      fontWeight: "700",
                    }}
                  >
                    CORRECT
                  </p>
                </div>
                <div
                  style={{
                    width: "1px",
                    height: "40px",
                    background: "var(--border-soft)",
                  }}
                ></div>
                <div style={{ textAlign: "center" }}>
                  <span
                    style={{
                      fontSize: "2rem",
                      fontWeight: "900",
                      color: "#e74c3c",
                    }}
                  >
                    {totalWrong}
                  </span>
                  <p
                    style={{
                      fontSize: "0.8rem",
                      color: "var(--text-dim)",
                      fontWeight: "700",
                    }}
                  >
                    WRONG
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary"
                onClick={startGame}
                style={{
                  padding: "18px 50px",
                  fontSize: "1.1rem",
                  borderRadius: "20px",
                  background: "#27ae60",
                  margin: "0 auto",
                  boxShadow: "0 15px 40px rgba(39,174,96,0.25)",
                }}
              >
                <RotateCcw size={20} /> Play Again
              </motion.button>
            </motion.div>
          ) : (
            /* Active Game */
            <div
              className="grid"
              style={{
                gridTemplateColumns: "1.5fr 1fr",
                alignItems: "start",
                gap: "40px",
              }}
            >
              <div className="flex flex-col gap-8">
                {/* Progress Bar */}
                <motion.div
                  layout
                  className="zen-card"
                  style={{ padding: "30px 35px" }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Zap
                        size={18}
                        color="#8854d0"
                        fill="#8854d0"
                        style={{ opacity: 0.6 }}
                      />
                      <span
                        style={{
                          fontWeight: "800",
                          fontSize: "0.8rem",
                          textTransform: "uppercase",
                          letterSpacing: "2px",
                          color: "var(--text-dim)",
                        }}
                      >
                        Board Progress
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: "1.6rem",
                        fontWeight: "900",
                        color: "#8854d0",
                      }}
                    >
                      {position}
                      <span
                        style={{
                          fontSize: "0.9rem",
                          color: "var(--text-light)",
                          fontWeight: "600",
                        }}
                      >
                        /{TOTAL_CELLS}
                      </span>
                    </span>
                  </div>
                  <div
                    style={{
                      height: "12px",
                      background: "var(--bg-main)",
                      borderRadius: "6px",
                      overflow: "hidden",
                    }}
                  >
                    <motion.div
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ type: "spring", stiffness: 100, damping: 15 }}
                      style={{
                        height: "100%",
                        background:
                          "linear-gradient(90deg, #8854d0, #a855f7, #c084fc)",
                        borderRadius: "6px",
                        boxShadow: "0 0 20px rgba(136,84,208,0.3)",
                      }}
                    />
                  </div>
                  {streak >= 3 && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2"
                      style={{
                        marginTop: "12px",
                        color: "#f39c12",
                        fontSize: "0.8rem",
                        fontWeight: "700",
                      }}
                    >
                      <Sparkles size={14} /> {streak} correct in a row! Keep going!
                    </motion.div>
                  )}
                </motion.div>

                {/* Word Challenge Card */}
                <motion.div
                  layout
                  animate={
                    animationState === "wrong"
                      ? { x: [-10, 10, -10, 10, 0], scale: [1, 0.98, 1] }
                      : animationState === "correct"
                        ? { y: [-10, 0], scale: [1, 1.02, 1], boxShadow: "0 25px 50px rgba(39,174,96,0.15)" }
                        : {}
                  }
                  transition={{ duration: 0.4 }}
                  className="zen-card"
                  style={{
                    padding: "0",
                    overflow: "visible", // Changed to show particles
                    border: animationState === "correct" ? "2px solid #27ae60" : animationState === "wrong" ? "2px solid #e74c3c" : "none",
                    boxShadow: "0 25px 50px rgba(0,0,0,0.08)",
                    position: 'relative'
                  }}
                >
                  {/* Particle Container */}
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none' }}>
                    {particles.map(p => (
                      <FloatingEmoji key={p.id} emoji={p.emoji} color={p.color} />
                    ))}
                  </div>

                  <div
                    style={{
                      padding: "40px 40px 20px",
                      background:
                        animationState === "correct"
                          ? "linear-gradient(135deg, rgba(39,174,96,0.06), transparent)"
                          : animationState === "wrong"
                            ? "linear-gradient(135deg, rgba(231,76,60,0.06), transparent)"
                            : "linear-gradient(135deg, rgba(136,84,208,0.06), transparent)",
                    }}
                  >
                    <div
                      className="flex items-center justify-between"
                      style={{ marginBottom: "30px" }}
                    >
                      <span
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: "900",
                          color: "#8854d0",
                          textTransform: "uppercase",
                          letterSpacing: "2px",
                        }}
                      >
                        Translate This Word
                      </span>
                    </div>

                    <motion.div
                      key={currentWord?.sanskrit}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ type: "spring", damping: 15 }}
                      style={{ textAlign: "center", marginBottom: "20px" }}
                    >
                      <h2
                        className="devanagari"
                        style={{
                          fontSize: "5rem",
                          lineHeight: 1.1,
                          marginBottom: "5px",
                        }}
                      >
                        {currentWord?.sanskrit}
                      </h2>
                    </motion.div>

                    <AnimatePresence>
                      {diceValue && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
                          animate={{ opacity: 1, scale: 1, rotate: 0 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                          className="flex justify-center items-center gap-3"
                          style={{
                            background: "rgba(136,84,208,0.1)",
                            padding: "16px 24px",
                            borderRadius: "16px",
                            display: "flex",
                            margin: "0 auto",
                            width: "fit-content",
                            color: "#8854d0",
                            fontWeight: "800",
                            fontSize: "1.2rem"
                          }}
                        >
                          <Dice5 size={28} />
                          Rolled: +{diceValue}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div style={{ padding: "0 40px 40px" }}>
                    <div className="grid grid-cols-2 gap-4">
                      {currentOptions.map((opt, i) => (
                        <motion.button
                          key={i}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => submitAnswer(opt)}
                          disabled={loading}
                          style={{
                            padding: "18px 20px",
                            background: "var(--bg-card)",
                            border: "2px solid var(--border-soft)",
                            borderRadius: "16px",
                            fontSize: "1.1rem",
                            fontWeight: "700",
                            color: "var(--text-main)",
                            cursor: loading ? "not-allowed" : "pointer",
                            transition: "all 0.2s"
                          }}
                          className={`${loading ? 'opacity-50' : 'hover:border-[#8854d0] hover:text-[#8854d0]'}`}
                        >
                          {opt}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Feedback Toast */}
                <AnimatePresence>
                  {feedback && !feedback.game_over && (
                    <motion.div
                      initial={{ opacity: 0, y: 30, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ type: "spring", damping: 20 }}
                      className="zen-card"
                      style={{
                        padding: "30px 35px",
                        borderLeft: `6px solid ${feedback.event === "ladder" ? "#27ae60" : "#e74c3c"
                          }`,
                      }}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          style={{
                            width: "48px",
                            height: "48px",
                            borderRadius: "14px",
                            background:
                              feedback.event === "ladder"
                                ? "rgba(39,174,96,0.1)"
                                : "rgba(231,76,60,0.1)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          {(feedback.event === "ladder" || feedback.event === "correct" || feedback.event === "win") ? (
                            <ArrowUp size={24} color="#27ae60" />
                          ) : (
                            <ArrowDown size={24} color="#e74c3c" />
                          )}
                        </div>
                        <div>
                          <h4
                            style={{
                              fontSize: "1.1rem",
                              marginBottom: "6px",
                              color:
                                (feedback.event === "ladder" || feedback.event === "correct" || feedback.event === "win")
                                  ? "#27ae60"
                                  : "#e74c3c",
                            }}
                          >
                            {feedback.event === "ladder"
                              ? "🪜 Ladder Up!"
                              : (feedback.event === "win" || feedback.event === "correct")
                                ? "✅ Correct!"
                                : feedback.event === "snake"
                                  ? "🐍 Snake Bite!"
                                  : "❌ Trial Failed"}
                          </h4>
                          <p
                            style={{
                              color: "var(--text-dim)",
                              fontSize: "0.95rem",
                              lineHeight: "1.6",
                            }}
                          >
                            {feedback.message}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Right Panel */}
              <div className="flex flex-col gap-8">
                {/* Stats Card */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="zen-card"
                  style={{ padding: "35px" }}
                >
                  <h4
                    style={{
                      fontSize: "0.8rem",
                      fontWeight: "900",
                      textTransform: "uppercase",
                      letterSpacing: "2px",
                      marginBottom: "28px",
                    }}
                  >
                    Game Stats
                  </h4>
                  <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 size={18} color="#27ae60" />
                        <span
                          style={{
                            fontSize: "0.9rem",
                            fontWeight: "600",
                            color: "var(--text-dim)",
                          }}
                        >
                          Correct
                        </span>
                      </div>
                      <span
                        style={{
                          fontWeight: "900",
                          fontSize: "1.3rem",
                          color: "#27ae60",
                        }}
                      >
                        {totalCorrect}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <XCircle size={18} color="#e74c3c" />
                        <span
                          style={{
                            fontSize: "0.9rem",
                            fontWeight: "600",
                            color: "var(--text-dim)",
                          }}
                        >
                          Wrong
                        </span>
                      </div>
                      <span
                        style={{
                          fontWeight: "900",
                          fontSize: "1.3rem",
                          color: "#e74c3c",
                        }}
                      >
                        {totalWrong}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Sparkles size={18} color="#f39c12" />
                        <span
                          style={{
                            fontSize: "0.9rem",
                            fontWeight: "600",
                            color: "var(--text-dim)",
                          }}
                        >
                          Streak
                        </span>
                      </div>
                      <span
                        style={{
                          fontWeight: "900",
                          fontSize: "1.3rem",
                          color: "#f39c12",
                        }}
                      >
                        {streak}
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Rules Card */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="zen-card"
                  style={{
                    padding: "35px",
                    background: "#8854d0", // Solid brand color
                    color: "white",
                    boxShadow: "0 20px 40px rgba(136,84,208,0.2)"
                  }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div
                      style={{
                        padding: "8px",
                        background: "rgba(255,255,255,0.1)",
                        borderRadius: "10px",
                      }}
                    >
                      <Info size={18} />
                    </div>
                    <h4
                      style={{
                        fontSize: "0.8rem",
                        fontWeight: "900",
                        textTransform: "uppercase",
                        letterSpacing: "2px",
                      }}
                    >
                      Rules
                    </h4>
                  </div>
                  <div className="flex flex-col gap-5">
                    <div className="flex gap-4 items-start">
                      <span style={{ fontSize: "1.2rem" }}>🎲</span>
                      <p
                        style={{
                          fontSize: "0.85rem",
                          color: "rgba(255,255,255,0.7)",
                          lineHeight: "1.5",
                        }}
                      >
                        Correct answer = Roll dice and advance <strong>1-6</strong> steps
                      </p>
                    </div>
                    <div className="flex gap-4 items-start">
                      <span style={{ fontSize: "1.2rem" }}>🐍</span>
                      <p
                        style={{
                          fontSize: "0.85rem",
                          color: "rgba(255,255,255,0.7)",
                          lineHeight: "1.5",
                        }}
                      >
                        Wrong answer = Slide back <strong>-2</strong> positions
                      </p>
                    </div>
                    <div className="flex gap-4 items-start">
                      <span style={{ fontSize: "1.2rem" }}>🏆</span>
                      <p
                        style={{
                          fontSize: "0.85rem",
                          color: "rgba(255,255,255,0.7)",
                          lineHeight: "1.5",
                        }}
                      >
                        Reach position <strong>50</strong> to achieve victory
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* History */}
                {history.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="zen-card"
                    style={{ padding: "35px", maxHeight: "360px", overflow: "auto" }}
                  >
                    <h4
                      style={{
                        fontSize: "0.8rem",
                        fontWeight: "900",
                        textTransform: "uppercase",
                        letterSpacing: "2px",
                        marginBottom: "20px",
                      }}
                    >
                      Recent Moves
                    </h4>
                    <div className="flex flex-col gap-4">
                      {history.slice(0, 8).map((h, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="flex items-center justify-between"
                          style={{
                            padding: "12px 16px",
                            background: "var(--bg-main)",
                            borderRadius: "14px",
                            border: "1px solid var(--border-soft)",
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              style={{
                                fontSize: "1.1rem",
                                width: "28px",
                                textAlign: "center",
                              }}
                            >
                              {h.correct ? "🪜" : "🐍"}
                            </span>
                            <div>
                              <span
                                className="devanagari"
                                style={{
                                  fontSize: "1rem",
                                  display: "block",
                                }}
                              >
                                {h.word}
                              </span>
                              <span
                                style={{
                                  fontSize: "0.75rem",
                                  color: "var(--text-light)",
                                }}
                              >
                                {h.correctAnswer}
                              </span>
                            </div>
                          </div>
                          {h.correct ? (
                            <CheckCircle2 size={18} color="#27ae60" />
                          ) : (
                            <XCircle size={18} color="#e74c3c" />
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          )}
        </>)}

        {/* ═══════════════════════════════════════════════════ */}
        {/* ODD ONE OUT GAME */}
        {/* ═══════════════════════════════════════════════════ */}
        {activeGame === "odd" && (
          <>
            {!oddStarted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="zen-card"
                style={{
                  padding: "80px 60px",
                  textAlign: "center",
                  maxWidth: "650px",
                  margin: "0 auto",
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-soft)",
                }}
              >
                <motion.div
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  style={{ fontSize: "5rem", marginBottom: "30px" }}
                >
                  🧩
                </motion.div>
                <h2 style={{ fontSize: "2rem", marginBottom: "16px", letterSpacing: "-1px" }}>
                  Odd One Out
                </h2>
                <p style={{ color: "var(--text-dim)", maxWidth: "400px", margin: "0 auto 40px", fontSize: "1.05rem", lineHeight: "1.7" }}>
                  Four Sanskrit words. Three belong to the same category. Find the one that doesn't fit!
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary"
                  onClick={startOddGame}
                  style={{
                    padding: "18px 50px",
                    fontSize: "1.1rem",
                    borderRadius: "20px",
                    background: "#e67e22",
                    margin: "0 auto",
                    boxShadow: "0 15px 40px rgba(230,126,34,0.25)",
                  }}
                >
                  <Sparkles size={20} /> Start Game
                </motion.button>
              </motion.div>
            ) : (
              <div
                className="grid"
                style={{
                  gridTemplateColumns: "1.5fr 1fr",
                  alignItems: "start",
                  gap: "40px",
                }}
              >
                <div className="flex flex-col gap-8">
                  {/* Question Card */}
                  <motion.div
                    layout
                    className="zen-card"
                    style={{
                      padding: "0",
                      overflow: "hidden",
                      boxShadow: "0 25px 50px rgba(0,0,0,0.08)",
                      border: oddFeedback
                        ? oddFeedback.is_correct
                          ? "2px solid #27ae60"
                          : "2px solid #e74c3c"
                        : "none",
                    }}
                  >
                    <div
                      style={{
                        padding: "35px 40px 15px",
                        background: "linear-gradient(135deg, rgba(230,126,34,0.06), transparent)",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: "900",
                          color: "#e67e22",
                          textTransform: "uppercase",
                          letterSpacing: "2px",
                        }}
                      >
                        Find The Odd One Out
                      </span>
                      <h3
                        style={{
                          fontSize: "1.8rem",
                          marginTop: "10px",
                          letterSpacing: "-1px",
                        }}
                      >
                        Category: {oddQuestion?.category}
                      </h3>
                      <p
                        style={{
                          color: "var(--text-dim)",
                          fontSize: "0.95rem",
                          marginTop: "8px",
                        }}
                      >
                        Pick the word that does NOT belong.
                      </p>
                    </div>

                    <div
                      style={{ padding: "25px 40px 40px" }}
                    >
                      <div
                        className="grid"
                        style={{
                          gridTemplateColumns: "1fr 1fr",
                          gap: "16px",
                        }}
                      >
                        {oddQuestion?.options?.map((opt: any, idx: number) => {
                          const isSelected = oddSelected === idx;
                          const isCorrectAnswer = oddFeedback && idx === oddFeedback.correct_index;
                          const isWrongPick = oddFeedback && isSelected && !oddFeedback.is_correct;

                          let bg = "var(--bg-main)";
                          let borderColor = "var(--border-soft)";
                          let textColor = "var(--text-main)";
                          if (oddFeedback) {
                            if (isCorrectAnswer) {
                              bg = "rgba(39,174,96,0.1)";
                              borderColor = "#27ae60";
                              textColor = "#27ae60";
                            } else if (isWrongPick) {
                              bg = "rgba(231,76,60,0.1)";
                              borderColor = "#e74c3c";
                              textColor = "#e74c3c";
                            }
                          }

                          return (
                            <motion.button
                              key={idx}
                              whileHover={!oddFeedback ? { scale: 1.03, y: -3 } : {}}
                              whileTap={!oddFeedback ? { scale: 0.97 } : {}}
                              onClick={() => !oddFeedback && submitOddAnswer(idx)}
                              disabled={!!oddFeedback}
                              style={{
                                padding: "24px 20px",
                                borderRadius: "20px",
                                border: `2px solid ${borderColor}`,
                                background: bg,
                                cursor: oddFeedback ? "default" : "pointer",
                                textAlign: "center",
                                transition: "all 0.3s",
                                boxShadow: isSelected && !oddFeedback ? "0 10px 30px rgba(0,0,0,0.08)" : "none",
                              }}
                            >
                              <div
                                className="devanagari"
                                style={{
                                  fontSize: "2rem",
                                  color: textColor,
                                }}
                              >
                                {opt.sanskrit}
                              </div>
                              {oddFeedback && isCorrectAnswer && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.5 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  style={{ marginTop: "8px", color: "#27ae60", fontWeight: "900", fontSize: "0.75rem" }}
                                >
                                  ✓ ODD ONE
                                </motion.div>
                              )}
                              {isWrongPick && (
                                <motion.div
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  style={{ marginTop: "8px", color: "#e74c3c", fontWeight: "900", fontSize: "0.75rem" }}
                                >
                                  ✗ Wrong
                                </motion.div>
                              )}
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>

                  {/* Feedback Toast */}
                  <AnimatePresence>
                    {oddFeedback && (
                      <motion.div
                        initial={{ opacity: 0, y: 30, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ type: "spring", damping: 20 }}
                        className="zen-card"
                        style={{
                          padding: "25px 30px",
                          borderLeft: `6px solid ${oddFeedback.is_correct ? "#27ae60" : "#e74c3c"}`,
                        }}
                      >
                        <p style={{ fontSize: "1rem", lineHeight: "1.6", color: "var(--text-dim)" }}>
                          {oddFeedback.message}
                        </p>
                        <p style={{ fontSize: "0.8rem", color: "var(--text-light)", marginTop: "8px" }}>
                          Loading next question...
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Right Panel */}
                <div className="flex flex-col gap-8">
                  {/* Score Card */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="zen-card"
                    style={{ padding: "35px" }}
                  >
                    <h4 style={{ fontSize: "0.8rem", fontWeight: "900", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "28px" }}>
                      Score
                    </h4>
                    <div className="flex flex-col gap-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 size={18} color="#27ae60" />
                          <span style={{ fontSize: "0.9rem", fontWeight: "600", color: "var(--text-dim)" }}>Correct</span>
                        </div>
                        <span style={{ fontWeight: "900", fontSize: "1.3rem", color: "#27ae60" }}>{oddScore}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <XCircle size={18} color="#e74c3c" />
                          <span style={{ fontSize: "0.9rem", fontWeight: "600", color: "var(--text-dim)" }}>Wrong</span>
                        </div>
                        <span style={{ fontWeight: "900", fontSize: "1.3rem", color: "#e74c3c" }}>{oddTotal - oddScore}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Trophy size={18} color="#f39c12" />
                          <span style={{ fontSize: "0.9rem", fontWeight: "600", color: "var(--text-dim)" }}>Accuracy</span>
                        </div>
                        <span style={{ fontWeight: "900", fontSize: "1.3rem", color: "#f39c12" }}>
                          {oddTotal > 0 ? Math.round((oddScore / oddTotal) * 100) : 0}%
                        </span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Rules Card */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="zen-card"
                    style={{ padding: "35px", background: "#e67e22", color: "white", boxShadow: "0 20px 40px rgba(230,126,34,0.2)" }}
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div style={{ padding: "8px", background: "rgba(255,255,255,0.1)", borderRadius: "10px" }}>
                        <Info size={18} />
                      </div>
                      <h4 style={{ fontSize: "0.8rem", fontWeight: "900", textTransform: "uppercase", letterSpacing: "2px" }}>How To Play</h4>
                    </div>
                    <div className="flex flex-col gap-5">
                      <div className="flex gap-4 items-start">
                        <span style={{ fontSize: "1.2rem" }}>🧩</span>
                        <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.7)", lineHeight: "1.5" }}>
                          4 Sanskrit words are shown from a category
                        </p>
                      </div>
                      <div className="flex gap-4 items-start">
                        <span style={{ fontSize: "1.2rem" }}>🔍</span>
                        <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.7)", lineHeight: "1.5" }}>
                          <strong>One</strong> does NOT belong — find it!
                        </p>
                      </div>
                      <div className="flex gap-4 items-start">
                        <span style={{ fontSize: "1.2rem" }}>⚡</span>
                        <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.7)", lineHeight: "1.5" }}>
                          Auto-advances to the next question
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* History */}
                  {oddHistory.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      className="zen-card"
                      style={{ padding: "35px", maxHeight: "300px", overflow: "auto" }}
                    >
                      <h4 style={{ fontSize: "0.8rem", fontWeight: "900", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "20px" }}>
                        History
                      </h4>
                      <div className="flex flex-col gap-4">
                        {oddHistory.slice(0, 8).map((h: any, i: number) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="flex items-center justify-between"
                            style={{
                              padding: "12px 16px",
                              background: "var(--bg-main)",
                              borderRadius: "14px",
                              border: "1px solid var(--border-soft)",
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <span style={{ fontSize: "1rem" }}>{h.correct ? "✅" : "❌"}</span>
                              <div>
                                <span style={{ fontSize: "0.85rem", fontWeight: "700" }}>{h.category}</span>
                                <span className="devanagari" style={{ fontSize: "0.75rem", color: "var(--text-light)", display: "block" }}>
                                  Odd: {h.correctWord}
                                </span>
                              </div>
                            </div>
                            {h.correct ? <CheckCircle2 size={18} color="#27ae60" /> : <XCircle size={18} color="#e74c3c" />}
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
