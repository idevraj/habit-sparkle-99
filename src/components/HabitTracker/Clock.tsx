import { useState, useEffect } from 'react';

export const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center mb-4 text-sm tracking-wide animate-slide-up">
      <span className="font-bold dark:neon-text">
        {time.toLocaleString('default', { weekday: 'long' })}
      </span>
      <span className="mx-2 text-muted-foreground">|</span>
      <span className="text-primary font-semibold dark:neon-text">
        {time.toLocaleTimeString()}
      </span>
      <span className="mx-2 text-muted-foreground">|</span>
      <span className="text-muted-foreground">
        {time.toLocaleDateString()}
      </span>
    </div>
  );
};
