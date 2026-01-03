import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { COLORS } from '@/hooks/useHabitStore';

interface AddHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, color: string) => void;
}

export const AddHabitModal = ({ isOpen, onClose, onSave }: AddHabitModalProps) => {
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [shuffledColors, setShuffledColors] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      setName('');
      setSelectedColor(COLORS[0]);
      setShuffledColors([...COLORS].sort(() => Math.random() - 0.5));
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim(), selectedColor);
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className={`fixed inset-0 bg-black/75 flex items-center justify-center z-50 transition-opacity duration-250 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onClick={onClose}
    >
      <div 
        className="glass w-[92%] max-w-md p-6 text-center animate-scale-in dark:shadow-glow-strong"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold m-0">Add Habit</h3>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg bg-transparent border-none text-muted-foreground cursor-pointer hover:bg-secondary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Habit name"
          autoFocus
          className="w-full p-3 mb-4 rounded-xl border border-border bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        
        <div className="grid grid-cols-6 gap-3 mb-5">
          {shuffledColors.map(color => (
            <div
              key={color}
              onClick={() => setSelectedColor(color)}
              className={`w-10 h-10 rounded-xl cursor-pointer transition-all duration-150 hover:scale-110 ${
                color === selectedColor 
                  ? 'ring-3 ring-primary ring-offset-2 ring-offset-background' 
                  : 'border-3 border-transparent'
              }`}
              style={{ 
                backgroundColor: color,
                boxShadow: color === selectedColor ? `0 0 12px ${color}` : undefined
              }}
            />
          ))}
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-transparent text-foreground cursor-pointer transition-all duration-150 hover:-translate-y-0.5 hover:shadow-glow active:scale-95"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2.5 rounded-xl border-none gradient-primary text-primary-foreground font-semibold cursor-pointer transition-all duration-150 hover:-translate-y-0.5 shadow-glow-strong hover:shadow-glow active:scale-95"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
