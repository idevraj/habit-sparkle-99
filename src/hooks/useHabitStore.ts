import { useState, useEffect, useCallback } from 'react';

export interface Habit {
  name: string;
  color: string;
  days: boolean[];
}

export interface Cycle {
  label: string;
  archived: boolean;
  habits: Habit[];
}

export interface Store {
  cycles: Record<string, Cycle>;
  active: string | null;
}

const DAYS = 30;
const KEY = 'habit_rebuild_v221';

const getMonthKey = (date: Date) => `${date.getFullYear()}-${date.getMonth() + 1}`;
const getMonthLabel = (date: Date) => date.toLocaleString('default', { month: 'long', year: 'numeric' });

const getInitialStore = (): Store => {
  const stored = localStorage.getItem(KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // Fall through to create new store
    }
  }
  return { cycles: {}, active: null };
};

export const useHabitStore = () => {
  const [store, setStore] = useState<Store>(getInitialStore);

  // Initialize current month on mount
  useEffect(() => {
    const now = new Date();
    const key = getMonthKey(now);
    
    setStore(prev => {
      const newStore = { ...prev, cycles: { ...prev.cycles } };
      
      if (!newStore.cycles[key]) {
        const prevCycles = Object.values(newStore.cycles);
        const lastCycle = prevCycles[prevCycles.length - 1];
        
        newStore.cycles[key] = {
          label: getMonthLabel(now),
          archived: false,
          habits: lastCycle 
            ? lastCycle.habits.map(h => ({ name: h.name, color: h.color, days: Array(DAYS).fill(false) }))
            : []
        };
      }
      
      newStore.active = key;
      
      // Archive old months
      Object.keys(newStore.cycles).forEach(k => {
        newStore.cycles[k] = { ...newStore.cycles[k], archived: k !== key };
      });
      
      return newStore;
    });
  }, []);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(store));
  }, [store]);

  const activeCycle = store.active ? store.cycles[store.active] : null;

  const addHabit = useCallback((name: string, color: string) => {
    if (!store.active) return;
    
    setStore(prev => ({
      ...prev,
      cycles: {
        ...prev.cycles,
        [prev.active!]: {
          ...prev.cycles[prev.active!],
          habits: [...prev.cycles[prev.active!].habits, { name, color, days: Array(DAYS).fill(false) }]
        }
      }
    }));
  }, [store.active]);

  const deleteHabit = useCallback((index: number) => {
    if (!store.active) return;
    
    setStore(prev => ({
      ...prev,
      cycles: {
        ...prev.cycles,
        [prev.active!]: {
          ...prev.cycles[prev.active!],
          habits: prev.cycles[prev.active!].habits.filter((_, i) => i !== index)
        }
      }
    }));
  }, [store.active]);

  const toggleDay = useCallback((habitIndex: number, dayIndex: number) => {
    if (!store.active) return;
    
    setStore(prev => {
      const habits = [...prev.cycles[prev.active!].habits];
      habits[habitIndex] = {
        ...habits[habitIndex],
        days: habits[habitIndex].days.map((v, i) => i === dayIndex ? !v : v)
      };
      
      return {
        ...prev,
        cycles: {
          ...prev.cycles,
          [prev.active!]: {
            ...prev.cycles[prev.active!],
            habits
          }
        }
      };
    });
  }, [store.active]);

  const reorderHabits = useCallback((fromIndex: number, toIndex: number) => {
    if (!store.active) return;
    
    setStore(prev => {
      const habits = [...prev.cycles[prev.active!].habits];
      const [removed] = habits.splice(fromIndex, 1);
      habits.splice(toIndex, 0, removed);
      
      return {
        ...prev,
        cycles: {
          ...prev.cycles,
          [prev.active!]: {
            ...prev.cycles[prev.active!],
            habits
          }
        }
      };
    });
  }, [store.active]);

  const setActiveMonth = useCallback((key: string) => {
    setStore(prev => ({ ...prev, active: key }));
  }, []);

  const getStreak = useCallback((days: boolean[]) => {
    let best = 0, tmp = 0, cur = 0;
    
    days.forEach(d => {
      if (d) {
        tmp++;
        best = Math.max(best, tmp);
      } else {
        tmp = 0;
      }
    });
    
    for (let i = days.length - 1; i >= 0; i--) {
      if (days[i]) cur++;
      else break;
    }
    
    return { cur, best };
  }, []);

  return {
    store,
    activeCycle,
    activeKey: store.active,
    addHabit,
    deleteHabit,
    toggleDay,
    reorderHabits,
    setActiveMonth,
    getStreak,
    DAYS
  };
};

export const COLORS = [
  '#0ea5a4', '#16a34a', '#7c3aed', '#ea580c', '#e11d48', '#0891b2',
  '#4d7c0f', '#9333ea', '#b45309', '#0f766e', '#be123c', '#1d4ed8'
];
