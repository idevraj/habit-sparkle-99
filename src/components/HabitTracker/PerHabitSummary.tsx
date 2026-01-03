import { Cycle } from '@/hooks/useHabitStore';
import { ProgressBar } from './ProgressBar';

interface PerHabitSummaryProps {
  cycle: Cycle | null;
  activeTab: 'monthly' | 'weekly';
  days: number;
}

export const PerHabitSummary = ({ cycle, activeTab, days }: PerHabitSummaryProps) => {
  if (!cycle || cycle.habits.length === 0) {
    return (
      <div className="glass p-4 mb-3 animate-slide-up">
        <span className="text-xs text-muted-foreground">No habits yet</span>
      </div>
    );
  }

  return (
    <div className="glass p-4 mb-3 animate-slide-up">
      {cycle.habits.map((habit, index) => {
        const done = habit.days.filter(Boolean).length;
        const pct = Math.round((done / days) * 100);

        if (activeTab === 'monthly') {
          return (
            <div 
              key={index} 
              className={`py-2.5 ${index < cycle.habits.length - 1 ? 'border-b border-dashed border-border' : ''}`}
            >
              <div className="flex justify-between text-xs font-medium mb-1.5">
                <span style={{ color: habit.color }}>{habit.name}</span>
                <span className="text-muted-foreground">{done}/{days}</span>
              </div>
              <ProgressBar percentage={pct} />
            </div>
          );
        }

        // Weekly view
        const weeks = [0, 0, 0, 0, 0];
        const weekTotals = [0, 0, 0, 0, 0];
        habit.days.forEach((v, i) => {
          const wi = Math.floor(i / 7);
          if (wi < 5) {
            weekTotals[wi]++;
            if (v) weeks[wi]++;
          }
        });
        const totalDone = weeks.reduce((a, b) => a + b, 0);
        const wpct = Math.round((totalDone / days) * 100);

        return (
          <div 
            key={index} 
            className={`py-2.5 ${index < cycle.habits.length - 1 ? 'border-b border-dashed border-border' : ''}`}
          >
            <div className="flex justify-between text-xs font-medium mb-1.5">
              <span style={{ color: habit.color }}>{habit.name}</span>
              <span className="text-muted-foreground">
                {weeks.map((w, i) => `${w}/${weekTotals[i]}`).join(' | ')}
              </span>
            </div>
            <ProgressBar percentage={wpct} />
          </div>
        );
      })}
    </div>
  );
};
