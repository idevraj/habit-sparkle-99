interface ProgressBarProps {
  percentage: number;
}

export const ProgressBar = ({ percentage }: ProgressBarProps) => {
  return (
    <div className="h-2.5 bg-secondary/30 rounded-lg overflow-hidden">
      <div 
        className="h-full gradient-primary progress-glow transition-all duration-300"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};
