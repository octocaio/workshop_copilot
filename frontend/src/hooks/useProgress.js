import { useCallback } from 'react';

const STORAGE_KEY = 'learnhub_progress';

function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch (err) {
    console.warn('Failed to load progress data:', err);
    return {};
  }
}

function saveProgress(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function useProgress() {
  const getProgress = useCallback((courseId) => {
    const all = loadProgress();
    return all[courseId] || { completed: false, lastWatched: null };
  }, []);

  const markComplete = useCallback((courseId) => {
    const all = loadProgress();
    all[courseId] = {
      ...all[courseId],
      completed: true,
      completedAt: new Date().toISOString(),
      lastWatched: new Date().toISOString(),
    };
    saveProgress(all);
  }, []);

  const updateLastWatched = useCallback((courseId) => {
    const all = loadProgress();
    all[courseId] = {
      ...all[courseId],
      lastWatched: new Date().toISOString(),
    };
    saveProgress(all);
  }, []);

  const isCompleted = useCallback((courseId) => {
    return loadProgress()[courseId]?.completed === true;
  }, []);

  const getLastWatchedCourseId = useCallback((courseIds) => {
    const all = loadProgress();
    return courseIds
      .filter((id) => all[id]?.lastWatched)
      .sort((a, b) => {
        const dateA = new Date(all[a].lastWatched);
        const dateB = new Date(all[b].lastWatched);
        return dateB - dateA;
      })[0] || null;
  }, []);

  return { getProgress, markComplete, updateLastWatched, isCompleted, getLastWatchedCourseId };
}
