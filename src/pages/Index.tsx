import { useState, useEffect } from 'react';
import {
  Clock,
  Header,
  Tabs,
  Summary,
  PerHabitSummary,
  HabitTable,
  CalendarHeatmap,
  AddHabitModal,
  DeleteModal,
  MonthModal,
} from '@/components/HabitTracker';
import { useHabitStore } from '@/hooks/useHabitStore';

const THEME_KEY = 'habit_theme';

const Index = () => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem(THEME_KEY);
    return saved ? saved === 'dark' : true;
  });
  
  const [activeTab, setActiveTab] = useState<'monthly' | 'weekly'>('monthly');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showMonthModal, setShowMonthModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  
  const {
    store,
    activeCycle,
    activeKey,
    addHabit,
    deleteHabit,
    toggleDay,
    reorderHabits,
    setActiveMonth,
    getStreak,
    DAYS
  } = useHabitStore();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
  }, [isDark]);

  const handleDelete = (index: number) => {
    setDeleteIndex(index);
  };

  const confirmDelete = () => {
    if (deleteIndex !== null) {
      deleteHabit(deleteIndex);
      setDeleteIndex(null);
    }
  };

  const habitToDelete = deleteIndex !== null && activeCycle 
    ? activeCycle.habits[deleteIndex]?.name 
    : undefined;

  return (
    <div className="min-h-screen p-4 md:p-6 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <Clock />
        
        <Header
          onOpenMonth={() => setShowMonthModal(true)}
          onAddHabit={() => setShowAddModal(true)}
          isDark={isDark}
          onToggleTheme={() => setIsDark(!isDark)}
        />
        
        <Tabs activeTab={activeTab} onTabChange={setActiveTab} />
        
        <Summary cycle={activeCycle} activeTab={activeTab} days={DAYS} />
        
        <PerHabitSummary cycle={activeCycle} activeTab={activeTab} days={DAYS} />
        
        <CalendarHeatmap cycle={activeCycle} days={DAYS} />
        
        <HabitTable
          cycle={activeCycle}
          days={DAYS}
          onToggleDay={toggleDay}
          onDelete={handleDelete}
          onReorder={reorderHabits}
          getStreak={getStreak}
        />
        
        <AddHabitModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSave={addHabit}
        />
        
        <DeleteModal
          isOpen={deleteIndex !== null}
          habitName={habitToDelete}
          onClose={() => setDeleteIndex(null)}
          onConfirm={confirmDelete}
        />
        
        <MonthModal
          isOpen={showMonthModal}
          store={store}
          activeKey={activeKey}
          onClose={() => setShowMonthModal(false)}
          onSelect={setActiveMonth}
        />
      </div>
    </div>
  );
};

export default Index;
