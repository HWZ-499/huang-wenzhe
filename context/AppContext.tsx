import React, { createContext, useContext, useEffect, useState } from 'react';
import { AppData, DailyStats, Goal, Idea, JournalEntry } from '../types';

interface AppContextType {
  data: AppData;
  addJournalEntry: (entry: Omit<JournalEntry, 'id'>) => void;
  deleteJournalEntry: (id: string) => void;
  addIdea: (idea: Omit<Idea, 'id'>) => void;
  deleteIdea: (id: string) => void;
  addGoal: (goal: Omit<Goal, 'id' | 'completed' | 'progress' | 'completedDates'>) => void;
  toggleGoal: (id: string) => void;
  checkInGoal: (id: string) => void;
  deleteGoal: (id: string) => void;
  performDailyCheckIn: () => void;
  updateTheme: (color: string) => void;
  updateUserName: (name: string) => void;
  isCheckedInToday: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_DATA: AppData = {
  userProfile: { name: '朋友' },
  settings: { themeColor: '#FDFBF7' },
  journal: [],
  ideas: [],
  goals: [],
  stats: [],
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<AppData>(() => {
    const saved = localStorage.getItem('bloom_app_data');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Ensure settings exists for older data versions
      if (!parsed.settings) {
        parsed.settings = { themeColor: '#FDFBF7' };
      }
      return parsed;
    }
    return INITIAL_DATA;
  });

  useEffect(() => {
    localStorage.setItem('bloom_app_data', JSON.stringify(data));
  }, [data]);

  const todayStr = new Date().toISOString().split('T')[0];
  const isCheckedInToday = data.stats.some(s => s.date === todayStr && s.checkedIn);

  const addJournalEntry = (entry: Omit<JournalEntry, 'id'>) => {
    const newEntry: JournalEntry = { ...entry, id: crypto.randomUUID() };
    setData(prev => ({ ...prev, journal: [newEntry, ...prev.journal] }));
  };

  const deleteJournalEntry = (id: string) => {
    setData(prev => ({ ...prev, journal: prev.journal.filter(j => j.id !== id) }));
  };

  const addIdea = (idea: Omit<Idea, 'id'>) => {
    const newIdea: Idea = { ...idea, id: crypto.randomUUID() };
    setData(prev => ({ ...prev, ideas: [newIdea, ...prev.ideas] }));
  };

  const deleteIdea = (id: string) => {
    setData(prev => ({ ...prev, ideas: prev.ideas.filter(i => i.id !== id) }));
  };

  const addGoal = (goal: Omit<Goal, 'id' | 'completed' | 'progress' | 'completedDates'>) => {
    const newGoal: Goal = { 
      ...goal, 
      id: crypto.randomUUID(), 
      completed: false, 
      progress: 0,
      completedDates: [] 
    };
    setData(prev => ({ ...prev, goals: [...prev.goals, newGoal] }));
  };

  // Toggles "Archived/Completed" state for the entire goal
  const toggleGoal = (id: string) => {
    setData(prev => ({
      ...prev,
      goals: prev.goals.map(g => g.id === id ? { ...g, completed: !g.completed, progress: !g.completed ? 100 : 0 } : g)
    }));
  };

  // Toggles daily check-in for short-term goals
  const checkInGoal = (id: string) => {
    setData(prev => ({
      ...prev,
      goals: prev.goals.map(g => {
        if (g.id !== id) return g;

        const isCheckedToday = g.completedDates?.includes(todayStr);
        let newDates = g.completedDates || [];

        if (isCheckedToday) {
          newDates = newDates.filter(d => d !== todayStr);
        } else {
          newDates = [...newDates, todayStr];
        }

        // Auto-calculate progress for short-term goals based on targetDays
        let newProgress = g.progress;
        if (g.type === 'short-term' && g.targetDays) {
          newProgress = Math.min(100, (newDates.length / g.targetDays) * 100);
        }

        return { ...g, completedDates: newDates, progress: newProgress };
      })
    }));
  };

  const deleteGoal = (id: string) => {
    setData(prev => ({ ...prev, goals: prev.goals.filter(g => g.id !== id) }));
  };

  const performDailyCheckIn = () => {
    if (isCheckedInToday) return;
    
    setData(prev => {
      const existingStatIndex = prev.stats.findIndex(s => s.date === todayStr);
      let newStats = [...prev.stats];
      
      if (existingStatIndex >= 0) {
        newStats[existingStatIndex] = { ...newStats[existingStatIndex], checkedIn: true };
      } else {
        newStats.push({ date: todayStr, checkedIn: true, tasksCompleted: 0 });
      }
      return { ...prev, stats: newStats };
    });
  };

  const updateTheme = (color: string) => {
    setData(prev => ({
      ...prev,
      settings: { ...prev.settings, themeColor: color }
    }));
  };

  const updateUserName = (name: string) => {
    setData(prev => ({
      ...prev,
      userProfile: { ...prev.userProfile, name }
    }));
  };

  return (
    <AppContext.Provider value={{
      data,
      addJournalEntry,
      deleteJournalEntry,
      addIdea,
      deleteIdea,
      addGoal,
      toggleGoal,
      checkInGoal,
      deleteGoal,
      performDailyCheckIn,
      updateTheme,
      updateUserName,
      isCheckedInToday
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};