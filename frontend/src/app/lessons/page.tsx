'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import Sidebar from '@/components/Sidebar';
import { motion } from 'framer-motion';
import {
  BookOpen,
  CheckCircle,
  ChevronRight,
  Clock,
  Lock,
  Star,
  TrendingUp,
  Unlock,
} from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  description: string;
  level: string;
  module: string;
  difficulty: number;
  prerequisites: string[];
  estimated_time: number;
}

interface ProgressState {
  completed_lessons: string[];
  concept_mastery: Record<string, number>;
}

const MODULE_ORDER = [
  'module_1_foundations',
  'module_2_building',
  'module_3_nouns',
  'module_4_tenses',
  'module_5_grammar',
  'module_6_syntax',
  'module_7_advanced',
];

const MODULE_LABELS: Record<string, string> = {
  module_1_foundations: '🌟 Foundations',
  module_2_building: '🏗️ Building Blocks',
  module_3_nouns: '📖 Nouns & Grammar',
  module_4_tenses: '⏰ Tenses',
  module_5_grammar: '🔍 Grammar Deep Dive',
  module_6_syntax: '📝 Syntax',
  module_7_advanced: '🚀 Advanced',
};

const MODULE_DESCRIPTIONS: Record<string, string> = {
  module_1_foundations: 'Core essentials and first Sanskrit foundations.',
  module_2_building: 'Build confidence through everyday language patterns.',
  module_3_nouns: 'Learn nouns, cases, and their practical usage.',
  module_4_tenses: 'Master time, actions, and sentence structure.',
  module_5_grammar: 'Deepen grammar accuracy and comprehension.',
  module_6_syntax: 'Arrange words correctly in meaningful Sanskrit sentences.',
  module_7_advanced: 'Reach advanced fluency with nuanced expression.',
};

const EMPTY_PROGRESS: ProgressState = {
  completed_lessons: [],
  concept_mastery: {},
};

function normalizeProgress(raw: any): ProgressState {
  if (!raw) return EMPTY_PROGRESS;

  if (Array.isArray(raw.completed_lessons)) {
    return {
      completed_lessons: raw.completed_lessons,
      concept_mastery: raw.concept_mastery || {},
    };
  }

  if (raw.status === 'success') {
    return {
      completed_lessons: raw.lessons_completed || raw.completed_lessons || [],
      concept_mastery: raw.progress?.concept_mastery || raw.concept_mastery || {},
    };
  }

  return {
    completed_lessons: raw.lessons_completed || raw.completed_lessons || [],
    concept_mastery: raw.progress?.concept_mastery || raw.concept_mastery || {},
  };
}

function isLessonAvailable(lesson: Lesson, completed: string[]) {
  if (!lesson.prerequisites || lesson.prerequisites.length === 0) return true;
  return lesson.prerequisites.every((prereq) => completed.includes(prereq));
}

function getMissingPrerequisites(lesson: Lesson, completed: string[]) {
  if (!lesson.prerequisites || lesson.prerequisites.length === 0) return [];
  return lesson.prerequisites.filter((prereq) => !completed.includes(prereq));
}

function getLevelColor(level: string) {
  switch (level) {
    case 'beginner':
      return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
    case 'intermediate':
      return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300';
    case 'advanced':
      return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
    default:
      return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
  }
}

export default function LessonsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [progress, setProgress] = useState<ProgressState>(EMPTY_PROGRESS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/');
      return;
    }

    const currentUser = JSON.parse(storedUser);
    setUser(currentUser);

    const fetchData = async () => {
      try {
        const [lessonsResponse, progressResponse] = await Promise.all([
          api.lessons.getAll(),
          api.bkt.getProgress(currentUser.username).catch(() => ({ status: 'error' })),
        ]);

        if (lessonsResponse?.success) {
          setLessons(lessonsResponse.data || []);
        }

        setProgress(normalizeProgress(progressResponse));
      } catch (error) {
        console.error('Failed to load lessons:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const groupedLessons = useMemo(() => {
    const groups: Record<string, Lesson[]> = {};

    for (const module of MODULE_ORDER) {
      groups[module] = lessons.filter((lesson) => (lesson.module || 'uncategorized') === module);
    }

    return groups;
  }, [lessons]);

  const nextLesson = useMemo(() => {
    return lessons.find((lesson) => {
      const completed = progress.completed_lessons.includes(lesson.id);
      return !completed && isLessonAvailable(lesson, progress.completed_lessons);
    });
  }, [lessons, progress]);

  const completedCount = progress.completed_lessons.length;
  const totalLessons = lessons.length;
  const overallProgress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  if (loading) {
    return (
      <div className="page-layout">
        <Sidebar user={user} />
        <main className="main-content">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-4xl mb-4 animate-pulse">🕉️</div>
              <p className="text-gray-500 dark:text-gray-400">Loading lessons...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="page-layout">
      <Sidebar user={user} />
      <main className="main-content">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
                📚 Sanskrit Lessons
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                {lessons.length} lessons across 7 modules
              </p>
            </div>

            <div className="min-w-[220px] rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 shadow-sm">
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
                <span>Overall progress</span>
                <span className="font-semibold text-terracotta">{overallProgress}%</span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  className="h-full rounded-full bg-terracotta transition-all duration-500"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
            </div>
          </div>

          {nextLesson && (
            <div className="mb-6 flex items-center gap-2 rounded-xl border border-terracotta/30 bg-orange-50 px-4 py-3 text-sm text-terracotta dark:bg-orange-900/20 dark:text-orange-200">
              <TrendingUp className="h-4 w-4" />
              <span>Next up:</span>
              <span className="font-semibold">{nextLesson.title}</span>
            </div>
          )}
        </motion.div>

        {MODULE_ORDER.map((moduleKey) => {
          const moduleLessons = groupedLessons[moduleKey] || [];
          if (!moduleLessons.length) return null;

          const completedInModule = moduleLessons.filter((lesson) =>
            progress.completed_lessons.includes(lesson.id)
          ).length;

          return (
            <motion.section
              key={moduleKey}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="mb-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                    {MODULE_LABELS[moduleKey] || moduleKey}
                  </h2>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {completedInModule}/{moduleLessons.length} complete
                  </span>
                </div>

                <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">
                  {MODULE_DESCRIPTIONS[moduleKey] || 'Complete the module journey.'}
                </p>

                <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className="h-full rounded-full bg-terracotta transition-all duration-500"
                    style={{ width: `${moduleLessons.length ? (completedInModule / moduleLessons.length) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {moduleLessons.map((lesson) => {
                  const completed = progress.completed_lessons.includes(lesson.id);
                  const available = isLessonAvailable(lesson, progress.completed_lessons);
                  const isNext = nextLesson?.id === lesson.id;
                  const missingPrereqs = getMissingPrerequisites(lesson, progress.completed_lessons);
                  const mastery = progress.concept_mastery?.[lesson.id] ?? (completed ? 100 : 0);

                  return (
                    <motion.div
                      key={lesson.id}
                      whileHover={{ scale: 1.01 }}
                      className={`rounded-2xl border p-5 shadow-sm transition-all duration-200 ${
                        completed
                          ? 'border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-900/10'
                          : available
                            ? 'border-gray-200 bg-white hover:border-terracotta/40 hover:shadow-md dark:border-gray-700 dark:bg-gray-800'
                            : 'border-gray-200 bg-gray-100 opacity-80 dark:border-gray-700 dark:bg-gray-800/80'
                      }`}
                    >
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="mb-2 flex flex-wrap items-center gap-2">
                            <span className={`rounded-full px-2 py-1 text-[10px] font-medium uppercase tracking-wide ${getLevelColor(lesson.level)}`}>
                              {lesson.level}
                            </span>
                            {completed && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-[10px] font-medium text-green-700 dark:bg-green-900/30 dark:text-green-300">
                                <CheckCircle className="h-3.5 w-3.5" />
                                Complete
                              </span>
                            )}
                            {!completed && available && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1 text-[10px] font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                <Unlock className="h-3.5 w-3.5" />
                                Available
                              </span>
                            )}
                            {!completed && !available && (
                              <span
                                className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-[10px] font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                                title={missingPrereqs.length ? `Missing prerequisites: ${missingPrereqs.join(', ')}` : 'Locked'}
                              >
                                <Lock className="h-3.5 w-3.5" />
                                Locked
                              </span>
                            )}
                            {isNext && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-terracotta/10 px-2 py-1 text-[10px] font-medium text-terracotta dark:bg-terracotta/20 dark:text-orange-200">
                                <BookOpen className="h-3.5 w-3.5" />
                                Next
                              </span>
                            )}
                          </div>

                          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                            {lesson.title}
                          </h3>
                          <p className="mt-2 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
                            {lesson.description}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => router.push(`/lessons/${lesson.id}`)}
                          className="rounded-full border border-gray-200 bg-white p-2 text-gray-500 transition-colors hover:border-terracotta/50 hover:text-terracotta dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300"
                          aria-label={`Open ${lesson.title}`}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                        <span className="inline-flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          {lesson.estimated_time || 20} min
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Star className="h-3.5 w-3.5" />
                          {lesson.difficulty || 1}/5
                        </span>
                        {completed && (
                          <span className="inline-flex items-center gap-1.5 text-green-700 dark:text-green-300">
                            <CheckCircle className="h-3.5 w-3.5" />
                            {mastery}% mastery
                          </span>
                        )}
                      </div>

                      {missingPrereqs.length > 0 && !completed && (
                        <div className="mb-3 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-2 text-[11px] text-amber-700 dark:border-amber-900 dark:bg-amber-900/20 dark:text-amber-200">
                          Locked by: {missingPrereqs.join(', ')}
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => router.push(`/lessons/${lesson.id}`)}
                        className={`w-full rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                          completed
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : available
                              ? 'bg-terracotta text-white hover:bg-terracotta-dark'
                              : 'cursor-not-allowed bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-300'
                        }`}
                        disabled={!available && !completed}
                      >
                        {completed ? 'Review Lesson' : available ? 'Start Lesson' : 'Locked'}
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            </motion.section>
          );
        })}
      </main>
    </div>
  );
}