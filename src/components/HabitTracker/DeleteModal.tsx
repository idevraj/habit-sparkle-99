import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

interface DeleteModalProps {
  isOpen: boolean;
  habitName?: string;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteModal = ({ isOpen, habitName, onClose, onConfirm }: DeleteModalProps) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className={`fixed inset-0 bg-black/75 flex items-center justify-center z-50 transition-opacity duration-250 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onClick={onClose}
    >
      <div 
        className="glass w-[92%] max-w-sm p-6 text-center animate-scale-in dark:shadow-glow-strong"
        onClick={e => e.stopPropagation()}
      >
        <div className="w-12 h-12 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-6 h-6 text-destructive" />
        </div>
        
        <h3 className="text-lg font-bold text-destructive mb-2">Delete Habit</h3>
        
        {habitName && (
          <p className="text-sm text-muted-foreground mb-1">
            Are you sure you want to delete <span className="font-semibold text-foreground">"{habitName}"</span>?
          </p>
        )}
        
        <p className="text-sm text-muted-foreground mb-5">
          This action cannot be undone.
        </p>
        
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-transparent text-foreground cursor-pointer transition-all duration-150 hover:-translate-y-0.5 hover:shadow-glow active:scale-95"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 rounded-xl border-none bg-destructive text-destructive-foreground font-semibold cursor-pointer transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md active:scale-95"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
