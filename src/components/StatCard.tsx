import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  subtitle?: ReactNode;
  value: number | string;
  suffix?: string;
  icon: LucideIcon;
  iconColor?: string;
  progress?: number;
}

export function StatCard({ 
  title, 
  subtitle, 
  value, 
  suffix = "%", 
  icon: Icon,
  iconColor = "text-primary",
  progress 
}: StatCardProps) {
  return (
    <div className="glass-card p-5 min-w-[180px] hover:shadow-large transition-all duration-300">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
          )}
        </div>
        <div className={cn("p-2 rounded-xl bg-secondary", iconColor)}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      
      <div className="flex items-baseline gap-0.5 mb-3">
        <span className="text-3xl font-bold gradient-text">{value}</span>
        <span className="text-lg font-medium text-primary/70">{suffix}</span>
      </div>
      
      {progress !== undefined && (
        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
          <div 
            className="h-full progress-bar-orange rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}
