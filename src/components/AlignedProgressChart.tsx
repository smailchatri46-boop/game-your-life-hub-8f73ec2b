import { useMemo } from "react";

interface ChartData {
  day: number;
  progress: number;
}

interface AlignedProgressChartProps {
  data: ChartData[];
  daysInMonth: number;
  currentDay: number;
  monthName: string;
}

export function AlignedProgressChart({ data, daysInMonth, currentDay, monthName }: AlignedProgressChartProps) {
  const chartHeight = 120;
  const maxProgress = 100;

  // Create a map of day -> progress for quick lookup
  const progressMap = useMemo(() => {
    const map: Record<number, number> = {};
    data.forEach(d => {
      map[d.day] = d.progress;
    });
    return map;
  }, [data]);

  return (
    <div>
      {/* Title centered at top */}
      <h3 className="font-display text-sm lg:text-base font-semibold text-center mb-4">
        {monthName} Progress
      </h3>
      
      {/* Chart container */}
      <div className="flex items-end" style={{ height: `${chartHeight}px` }}>
        {/* Left column matching habit name column - contains Y axis */}
        <div style={{ width: '140px' }} className="flex-shrink-0 h-full flex flex-col justify-between text-right pr-3">
          <span className="text-[10px] lg:text-xs text-muted-foreground leading-none">100%</span>
          <span className="text-[10px] lg:text-xs text-muted-foreground leading-none">50%</span>
          <span className="text-[10px] lg:text-xs text-muted-foreground leading-none">0%</span>
        </div>
        
        {/* Day columns - chart area with bars */}
        <div className="flex-1 flex items-end relative" style={{ height: `${chartHeight}px` }}>
          {/* 50% grid line */}
          <div 
            className="absolute w-full border-t border-dashed border-border/40"
            style={{ bottom: `${chartHeight / 2}px` }}
          />
          
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const progress = progressMap[day];
            const hasData = progress !== undefined;
            const isFuture = day > currentDay;
            const barHeight = hasData ? (progress / maxProgress) * chartHeight : 0;
            
            return (
              <div 
                key={i} 
                className="flex-1 flex justify-center items-end relative"
                style={{ minWidth: 0, height: '100%' }}
              >
                {/* Chart bar for this day */}
                <div 
                  className="w-[70%] max-w-[20px] rounded-t-sm transition-all relative"
                  style={{
                    height: `${barHeight}px`,
                    background: hasData 
                      ? 'linear-gradient(to top, hsl(38, 100%, 60%), hsl(24, 95%, 53%))' 
                      : 'transparent',
                    opacity: isFuture ? 0.3 : 0.85,
                  }}
                >
                  {/* Dot at top of bar */}
                  {hasData && !isFuture && (
                    <div 
                      className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary shadow-sm border border-white/50"
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Right columns matching % and delete columns */}
        <div style={{ width: '84px' }} className="flex-shrink-0"></div>
      </div>
    </div>
  );
}
