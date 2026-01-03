import { useEffect } from 'react';
import { X, Archive } from 'lucide-react';
import { Store } from '@/hooks/useHabitStore';

interface MonthModalProps {
  isOpen: boolean;
  store: Store;
  activeKey: string | null;
  onClose: () => void;
  onSelect: (key: string) => void;
}

export const MonthModal = ({ isOpen, store, activeKey, onClose, onSelect }: MonthModalProps) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!isOpen) return null;

  const monthEntries = Object.entries(store.cycles);

  return (
    <div 
      className={`fixed inset-0 bg-black/75 flex items-center justify-center z-50 transition-opacity duration-250 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onClick={onClose}
    >
      <div 
        className="glass w-[92%] max-w-md p-6 animate-scale-in dark:shadow-glow-strong max-h-[80vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold m-0">Select Month</h3>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg bg-transparent border-none text-muted-foreground cursor-pointer hover:bg-secondary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-2 mb-4">
          {monthEntries.map(([key, cycle]) => (
            <div
              key={key}
              onClick={() => {
                onSelect(key);
                onClose();
              }}
              className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-150 hover:-translate-y-0.5 ${
                key === activeKey
                  ? 'bg-primary text-primary-foreground border-primary shadow-glow-strong'
                  : 'border-border hover:shadow-glow'
              } ${cycle.archived ? 'opacity-60' : ''}`}
            >
              <span className="font-medium">{cycle.label}</span>
              {cycle.archived && (
                <Archive className="w-4 h-4 ml-auto opacity-60" />
              )}
              {key === activeKey && !cycle.archived && (
                <span className="ml-auto text-xs opacity-80">Current</span>
              )}
            </div>
          ))}
          
          {monthEntries.length === 0 && (
            <p className="text-center text-muted-foreground py-4">
              No months available
            </p>
          )}
        </div>
        
        <button
          onClick={onClose}
          className="w-full px-4 py-2.5 rounded-xl border border-border bg-transparent text-foreground cursor-pointer transition-all duration-150 hover:-translate-y-0.5 hover:shadow-glow active:scale-95"
        >
          Close
        </button>
      </div>
    </div>
  );
};
