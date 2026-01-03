interface TabsProps {
  activeTab: 'monthly' | 'weekly';
  onTabChange: (tab: 'monthly' | 'weekly') => void;
}

export const Tabs = ({ activeTab, onTabChange }: TabsProps) => {
  return (
    <div className="flex gap-3 mb-3">
      <button
        onClick={() => onTabChange('monthly')}
        className={`flex-1 px-4 py-2.5 rounded-xl border font-semibold cursor-pointer transition-all duration-150 hover:-translate-y-0.5 active:scale-95 ${
          activeTab === 'monthly'
            ? 'bg-primary text-primary-foreground border-primary shadow-glow-strong'
            : 'bg-transparent text-foreground border-border hover:shadow-glow'
        }`}
      >
        Monthly
      </button>
      <button
        onClick={() => onTabChange('weekly')}
        className={`flex-1 px-4 py-2.5 rounded-xl border font-semibold cursor-pointer transition-all duration-150 hover:-translate-y-0.5 active:scale-95 ${
          activeTab === 'weekly'
            ? 'bg-primary text-primary-foreground border-primary shadow-glow-strong'
            : 'bg-transparent text-foreground border-border hover:shadow-glow'
        }`}
      >
        Weekly
      </button>
    </div>
  );
};
