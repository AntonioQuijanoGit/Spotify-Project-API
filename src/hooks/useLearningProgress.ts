import { useState, useEffect } from 'react';

interface LearningProgress {
  completedLessons: string[];
  quizScores: Record<string, number>;
  totalTimeSpent: number;
  lastActivity: number;
  badges: string[];
}

const LEARNING_PROGRESS_KEY = 'music-explorer-learning-progress';

const DEFAULT_PROGRESS: LearningProgress = {
  completedLessons: [],
  quizScores: {},
  totalTimeSpent: 0,
  lastActivity: Date.now(),
  badges: [],
};

export function useLearningProgress() {
  const [progress, setProgress] = useState<LearningProgress>(() => {
    try {
      const stored = localStorage.getItem(LEARNING_PROGRESS_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_PROGRESS;
    } catch {
      return DEFAULT_PROGRESS;
    }
  });

  useEffect(() => {
    localStorage.setItem(LEARNING_PROGRESS_KEY, JSON.stringify(progress));
  }, [progress]);

  const completeLesson = (lessonId: string) => {
    setProgress(prev => {
      if (prev.completedLessons.includes(lessonId)) {
        return prev;
      }
      return {
        ...prev,
        completedLessons: [...prev.completedLessons, lessonId],
        lastActivity: Date.now(),
      };
    });
  };

  const addQuizScore = (quizId: string, score: number) => {
    setProgress(prev => ({
      ...prev,
      quizScores: {
        ...prev.quizScores,
        [quizId]: Math.max(prev.quizScores[quizId] || 0, score),
      },
      lastActivity: Date.now(),
    }));
  };

  const addTimeSpent = (minutes: number) => {
    setProgress(prev => ({
      ...prev,
      totalTimeSpent: prev.totalTimeSpent + minutes,
      lastActivity: Date.now(),
    }));
  };

  const unlockBadge = (badgeId: string) => {
    setProgress(prev => {
      if (prev.badges.includes(badgeId)) {
        return prev;
      }
      return {
        ...prev,
        badges: [...prev.badges, badgeId],
        lastActivity: Date.now(),
      };
    });
  };

  const isLessonCompleted = (lessonId: string) => {
    return progress.completedLessons.includes(lessonId);
  };

  const getQuizScore = (quizId: string) => {
    return progress.quizScores[quizId] || 0;
  };

  const getProgressPercentage = (totalLessons: number) => {
    return Math.round((progress.completedLessons.length / totalLessons) * 100);
  };

  const resetProgress = () => {
    setProgress(DEFAULT_PROGRESS);
  };

  return {
    progress,
    completeLesson,
    addQuizScore,
    addTimeSpent,
    unlockBadge,
    isLessonCompleted,
    getQuizScore,
    getProgressPercentage,
    resetProgress,
  };
}


