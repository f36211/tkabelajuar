import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

const defaultState = {
  darkMode: false,
  xp: 0,
  level: 1,
  completedTopics: [],
  latihanHistory: [],
  ujianHistory: [],
  bookmarks: [],
  markedDifficult: [],
  wrongAnswers: [],
  topicProgress: {},
};

function loadState() {
  try {
    const saved = localStorage.getItem('mathlearn_state');
    return saved ? { ...defaultState, ...JSON.parse(saved) } : defaultState;
  } catch {
    return defaultState;
  }
}

export function AppProvider({ children }) {
  const [state, setState] = useState(loadState);

  useEffect(() => {
    localStorage.setItem('mathlearn_state', JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.darkMode ? 'dark' : 'light');
  }, [state.darkMode]);

  const toggleDarkMode = () => setState(s => ({ ...s, darkMode: !s.darkMode }));

  const addXP = (amount) => {
    setState(s => {
      const newXP = s.xp + amount;
      const newLevel = Math.floor(newXP / 100) + 1;
      return { ...s, xp: newXP, level: newLevel };
    });
  };

  const addLatihanResult = (result) => {
    setState(s => ({
      ...s,
      latihanHistory: [...s.latihanHistory, { ...result, date: new Date().toISOString() }],
    }));
  };

  const addUjianResult = (result) => {
    setState(s => ({
      ...s,
      ujianHistory: [...s.ujianHistory, { ...result, date: new Date().toISOString() }],
    }));
  };

  const toggleBookmark = (questionId) => {
    setState(s => ({
      ...s,
      bookmarks: s.bookmarks.includes(questionId)
        ? s.bookmarks.filter(id => id !== questionId)
        : [...s.bookmarks, questionId],
    }));
  };

  const toggleDifficult = (questionId) => {
    setState(s => ({
      ...s,
      markedDifficult: s.markedDifficult.includes(questionId)
        ? s.markedDifficult.filter(id => id !== questionId)
        : [...s.markedDifficult, questionId],
    }));
  };

  const addWrongAnswer = (questionId) => {
    setState(s => ({
      ...s,
      wrongAnswers: s.wrongAnswers.includes(questionId)
        ? s.wrongAnswers
        : [...s.wrongAnswers, questionId],
    }));
  };

  const removeWrongAnswer = (questionId) => {
    setState(s => ({
      ...s,
      wrongAnswers: s.wrongAnswers.filter(id => id !== questionId),
    }));
  };

  const updateTopicProgress = (topicId, correct, total) => {
    setState(s => ({
      ...s,
      topicProgress: {
        ...s.topicProgress,
        [topicId]: {
          correct: (s.topicProgress[topicId]?.correct || 0) + correct,
          total: (s.topicProgress[topicId]?.total || 0) + total,
        },
      },
    }));
  };

  const markTopicCompleted = (topicId) => {
    setState(s => ({
      ...s,
      completedTopics: s.completedTopics.includes(topicId)
        ? s.completedTopics
        : [...s.completedTopics, topicId],
    }));
  };

  const resetProgress = () => setState(defaultState);

  const value = {
    ...state,
    toggleDarkMode,
    addXP,
    addLatihanResult,
    addUjianResult,
    toggleBookmark,
    toggleDifficult,
    addWrongAnswer,
    removeWrongAnswer,
    updateTopicProgress,
    markTopicCompleted,
    resetProgress,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
