import { Moon, Sun, Calendar, Plus } from 'lucide-react';

interface HeaderProps {
  onOpenMonth: () => void;
  onAddHabit: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const Header = ({ onOpenMonth, onAddHabit, isDark, onToggleTheme }: HeaderProps) => {
  return (
    <header className="glass flex items-center gap-3 p-4 mb-4 animate-slide-up">
      <h1 className="text-base font-bold tracking-wide dark:neon-text m-0">
        Habit Tracker
      </h1>
      <div className="flex-1" />
      
      <button
        onClick={onOpenMonth}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-transparent text-foreground cursor-pointer transition-all duration-150 hover:-translate-y-0.5 hover:shadow-glow active:scale-95"
      >
        <Calendar className="w-4 h-4" />
        <span className="hidden sm:inline">Select Month</span>
      </button>
      
      <button
        onClick={onAddHabit}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-none gradient-primary text-primary-foreground font-semibold cursor-pointer transition-all duration-150 hover:-translate-y-0.5 shadow-glow-strong hover:shadow-glow active:scale-95"
      >
        <Plus className="w-4 h-4" />
        <span>Add Habit</span>
      </button>
      
      <button
        onClick={onToggleTheme}
        className="p-2.5 rounded-xl border border-border bg-transparent text-foreground cursor-pointer transition-all duration-150 hover:-translate-y-0.5 hover:shadow-glow active:scale-95"
      >
        {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </button>
      
      <span className="text-xs text-muted-foreground hidden sm:inline">
        REBUILD v2.2.7
      </span>
    </header>
  );
};
