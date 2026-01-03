import { Cycle } from '@/hooks/useHabitStore';
import { useMemo } from 'react';

interface CalendarHeatmapProps {
  cycle: Cycle | null;
  days: number;
}

export const CalendarHeatmap = ({ cycle, days }: CalendarHeatmapProps) => {
  const heatmapData = useMemo(() => {
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

  const getWeeks = () => {
    const weeks: number[][] = [];
    for (let i = 0; i < days; i += 7) {
      weeks.push(heatmapData.slice(i, i + 7));
    }
    return weeks;
  };

  if (!cycle) return null;

  const weeks = getWeeks();
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="glass p-4 rounded-2xl animate-fade-in">
      <h3 className="text-sm font-semibold mb-4 dark:text-shadow-neon">
        📅 Completion Heatmap
      </h3>
      
      <div className="flex gap-2">
        {/* Week day labels */}
        <div className="flex flex-col gap-1 text-[10px] text-muted-foreground">
          {weekDays.map(day => (
            <div key={day} className="h-5 flex items-center justify-end pr-1">
              {day}
            </div>
          ))}
        </div>

        {/* Heatmap grid */}
        <div className="flex gap-1 overflow-x-auto">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              <div className="text-[9px] text-muted-foreground text-center mb-0.5">
                W{weekIndex + 1}
              </div>
              {week.map((value, dayIndex) => {
                const globalDayIndex = weekIndex * 7 + dayIndex;
                const completed = cycle.habits.filter(h => h.days[globalDayIndex]).length;
                const total = cycle.habits.length;
                
                return (
                  <div
                    key={dayIndex}
                    className={`w-5 h-5 rounded-sm transition-all hover:scale-110 cursor-pointer ${getIntensityClass(value)}`}
                    title={`Day ${globalDayIndex + 1}: ${completed}/${total} habits completed`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 mt-4 text-[10px] text-muted-foreground">
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
  );
};
