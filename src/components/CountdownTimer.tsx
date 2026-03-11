import { useState, useEffect } from "react";

interface CountdownTimerProps {
  targetDate: Date;
  className?: string;
}

export function CountdownTimer({ targetDate, className = "" }: CountdownTimerProps) {
  const [diff, setDiff] = useState(() => Math.max(0, targetDate.getTime() - Date.now()));

  useEffect(() => {
    const interval = setInterval(() => {
      const d = Math.max(0, targetDate.getTime() - Date.now());
      setDiff(d);
      if (d <= 0) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const hours = Math.floor(diff / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className={`flex items-center gap-2 font-mono text-2xl font-bold ${className}`}>
      <div className="flex flex-col items-center">
        <span className="text-3xl">{pad(hours)}</span>
        <span className="text-[10px] uppercase text-muted-foreground font-sans tracking-widest">hrs</span>
      </div>
      <span className="text-muted-foreground">:</span>
      <div className="flex flex-col items-center">
        <span className="text-3xl">{pad(mins)}</span>
        <span className="text-[10px] uppercase text-muted-foreground font-sans tracking-widest">min</span>
      </div>
      <span className="text-muted-foreground">:</span>
      <div className="flex flex-col items-center">
        <span className="text-3xl">{pad(secs)}</span>
        <span className="text-[10px] uppercase text-muted-foreground font-sans tracking-widest">seg</span>
      </div>
    </div>
  );
}
