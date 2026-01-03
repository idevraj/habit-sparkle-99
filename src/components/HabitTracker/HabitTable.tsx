import { Trash2, GripVertical } from 'lucide-react';
import { Cycle } from '@/hooks/useHabitStore';
import { useState, useRef } from 'react';

interface HabitTableProps {
  cycle: Cycle | null;
  days: number;
  onToggleDay: (habitIndex: number, dayIndex: number) => void;
  onDelete: (index: number) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
  getStreak: (days: boolean[]) => { cur: number; best: number };
}

export const HabitTable = ({ cycle, days, onToggleDay, onDelete, onReorder, getStreak }: HabitTableProps) => {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  if (!cycle) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const editable = !cycle.archived;

  const handleDragStart = (index: number) => {
    setDragIndex(index);
  };

  const handleDrop = (toIndex: number) => {
    if (dragIndex !== null && dragIndex !== toIndex) {
      onReorder(dragIndex, toIndex);
    }
    setDragIndex(null);
  };

  return (
    <div ref={tableRef} className="glass overflow-x-auto rounded-2xl">
      <table className="w-full border-collapse text-xs">
        <thead>
          <tr className="border-b border-border">
            <th className="p-2 text-left font-semibold sticky left-0 bg-card/90 backdrop-blur z-10 min-w-[180px]">
              Habit
            </th>
            {Array.from({ length: days }, (_, i) => (
              <th key={i} className="p-2 text-center font-medium text-muted-foreground min-w-[32px]">
                {i + 1}
              </th>
            ))}
            <th className="p-2 text-center font-semibold min-w-[80px]">Actions</th>
          </tr>
        </thead>
        <tbody>
          {cycle.habits.map((habit, habitIndex) => {
            const streak = getStreak(habit.days);
            
            return (
              <tr 
                key={habitIndex}
                draggable
                onDragStart={() => handleDragStart(habitIndex)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(habitIndex)}
                className="border-b border-border cursor-grab hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors"
              >
                <td className="p-2 sticky left-0 bg-card/90 backdrop-blur z-10">
                  <div className="flex items-center gap-2">
                    <GripVertical className="w-3 h-3 text-muted-foreground opacity-50" />
                    <span 
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ 
                        backgroundColor: habit.color,
                        boxShadow: `0 0 8px ${habit.color}`
                      }}
                    />
                    <span className="font-medium truncate max-w-[100px]">{habit.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-primary/20 dark:shadow-glow whitespace-nowrap">
                      🔥 {streak.cur}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-accent/20 whitespace-nowrap">
                      🏆 {streak.best}
                    </span>
                  </div>
                </td>
                
                {habit.days.map((checked, dayIndex) => {
                  const checkDate = new Date(today.getFullYear(), today.getMonth(), dayIndex + 1);
                  const isToday = editable && checkDate.getTime() === today.getTime();
                  
                  return (
                    <td key={dayIndex} className="p-1 text-center">
                      <input
                        type="checkbox"
                        checked={checked}
                        disabled={!isToday}
                        onChange={() => onToggleDay(habitIndex, dayIndex)}
                        className="w-4 h-4 accent-primary cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                      />
                    </td>
                  );
                })}
                
                <td className="p-2 text-center">
                  <button
                    onClick={() => onDelete(habitIndex)}
                    className="p-1.5 rounded-lg bg-transparent border-none text-destructive cursor-pointer hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            );
          })}
          
          {cycle.habits.length === 0 && (
            <tr>
              <td colSpan={days + 2} className="p-8 text-center text-muted-foreground">
                No habits yet. Click "Add Habit" to get started!
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
