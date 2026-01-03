import { Cycle } from '@/hooks/useHabitStore';
import { ProgressBar } from './ProgressBar';

interface SummaryProps {
  cycle: Cycle | null;
  activeTab: 'monthly' | 'weekly';
  days: number;
}

export const Summary = ({ cycle, activeTab, days }: SummaryProps) => {
  if (!cycle) return null;

  const calculateMonthlyStats = () => {
    let done = 0, total = 0;
    cycle.habits.forEach(h => {
      h.days.forEach(v => {
        total++;
        if (v) done++;
      });
    });
    const pct = total ? Math.round((done / total) * 100) : 0;
    return { done, total, pct };
  };

  const calculateWeeklyStats = () => {
    const weeks = [0, 0, 0, 0, 0];
    const weekTotals = [0, 0, 0, 0, 0];
    
    cycle.habits.forEach(h => {
      h.days.forEach((v, i) => {
        const weekIndex = Math.floor(i / 7);
        if (weekIndex < 5) {
          weekTotals[weekIndex]++;
          if (v) weeks[weekIndex]++;
        }
      });
    });
    
    return weeks.map((w, i) => ({ done: w, total: weekTotals[i] }));
  };

  if (activeTab === 'monthly') {
    const { done, total, pct } = calculateMonthlyStats();
    return (
      <div className="glass p-4 mb-3 animate-slide-up">
        <div className="mb-2 text-sm">
          <span className="font-bold">{done}/{total}</span>
          <span className="text-muted-foreground ml-1">({pct}%)</span>
        </div>
        <ProgressBar percentage={pct} />
      </div>
    );
  }

  const weeklyStats = calculateWeeklyStats();
  return (
    <div className="glass p-4 mb-3 animate-slide-up">
      <div className="space-y-1 text-sm">
        {weeklyStats.map((week, i) => (
          <div key={i} className="text-muted-foreground">
            Week {i + 1}: <span className="text-foreground font-medium">{week.done}/{week.total}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
