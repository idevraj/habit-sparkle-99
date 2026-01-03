import { Cycle } from '@/hooks/useHabitStore';
import { useMemo } from 'react';

interface CalendarHeatmapProps {
  cycle: Cycle | null;
  days: number;
}

export const CalendarHeatmap = ({ cycle, days }: CalendarHeatmapProps) => {
  // Overall heatmap data
  const overallData = useMemo(() => {
    if (!cycle || cycle.habits.length === 0) {
      return Array(days).fill(0);
    }

    return Array.from({ length: days }, (_, dayIndex) => {
      const completed = cycle.habits.filter(h => h.days[dayIndex]).length;
      return completed / cycle.habits.length;
    });
  }, [cycle, days]);

  const getIntensityClass = (value: number) => {
    if (value === 0) return 'bg-muted/30';
    if (value <= 0.25) return 'bg-primary/25';
    if (value <= 0.5) return 'bg-primary/50';
    if (value <= 0.75) return 'bg-primary/75';
    return 'bg-primary shadow-glow';
  };

  const getHabitIntensityStyle = (completed: boolean, color: string) => {
    if (!completed) return { backgroundColor: 'hsl(var(--muted) / 0.3)' };
    return { 
      backgroundColor: color,
      boxShadow: `0 0 6px ${color}`
    };
  };

  if (!cycle) return null;

  return (
    <div className="glass p-4 rounded-2xl animate-fade-in space-y-6">
      {/* Overall Heatmap */}
      <div>
        <h3 className="text-sm font-semibold mb-3 dark:text-shadow-neon">
          📅 Overall Completion Heatmap
        </h3>
        
        <div className="flex flex-wrap gap-1">
          {overallData.map((value, dayIndex) => {
            const completed = cycle.habits.filter(h => h.days[dayIndex]).length;
            const total = cycle.habits.length;
            
            return (
              <div
                key={dayIndex}
                className={`w-6 h-6 rounded-sm transition-all hover:scale-125 cursor-pointer flex items-center justify-center text-[8px] font-medium ${getIntensityClass(value)}`}
                title={`Day ${dayIndex + 1}: ${completed}/${total} habits completed`}
              >
                {dayIndex + 1}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 mt-3 text-[10px] text-muted-foreground">
          <span>Less</span>
          <div className="flex gap-0.5">
            <div className="w-3 h-3 rounded-sm bg-muted/30" />
            <div className="w-3 h-3 rounded-sm bg-primary/25" />
            <div className="w-3 h-3 rounded-sm bg-primary/50" />
            <div className="w-3 h-3 rounded-sm bg-primary/75" />
            <div className="w-3 h-3 rounded-sm bg-primary shadow-glow" />
          </div>
          <span>More</span>
        </div>
      </div>

      {/* Per-Habit Heatmaps */}
      {cycle.habits.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-3 dark:text-shadow-neon">
            🎯 Per-Habit Heatmaps
          </h3>
          
          <div className="space-y-3">
            {cycle.habits.map((habit, habitIndex) => {
              const completedDays = habit.days.filter(Boolean).length;
              const pct = Math.round((completedDays / days) * 100);
              
              return (
                <div key={habitIndex} className="p-3 rounded-xl bg-card/50 border border-border/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span 
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ 
                          backgroundColor: habit.color,
                          boxShadow: `0 0 8px ${habit.color}`
                        }}
                      />
                      <span className="text-xs font-medium">{habit.name}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                      {completedDays}/{days} ({pct}%)
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-0.5">
                    {habit.days.map((completed, dayIndex) => (
                      <div
                        key={dayIndex}
                        className="w-4 h-4 rounded-[3px] transition-all hover:scale-150 cursor-pointer flex items-center justify-center text-[6px]"
                        style={getHabitIntensityStyle(completed, habit.color)}
                        title={`Day ${dayIndex + 1}: ${completed ? '✓ Completed' : '✗ Not completed'}`}
                      >
                        {dayIndex + 1}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
