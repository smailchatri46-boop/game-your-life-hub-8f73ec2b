import { cn } from "@/lib/utils";
import { Emoji } from "@/components/Emoji";

interface LevelProgressProps {
  level: number;
  currentXP: number;
  maxXP: number;
  className?: string;
}

export function LevelProgress({ level, currentXP, maxXP, className }: LevelProgressProps) {
  const progress = (currentXP / maxXP) * 100;

  return (
    <div className={cn("glass-card p-5", className)}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent to-primary flex items-center justify-center text-primary-foreground font-bold text-lg shadow-soft">
            {level}
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Level {level}</h3>
            <p className="text-xs text-muted-foreground flex items-center gap-1">Keep going! <Emoji emoji="🔥" size="sm" /></p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-foreground">{currentXP} XP</p>
          <p className="text-xs text-muted-foreground">/ {maxXP} XP</p>
        </div>
      </div>
      
      <div className="h-3 bg-secondary rounded-full overflow-hidden">
        <div 
          className="h-full progress-bar-orange rounded-full transition-all duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
