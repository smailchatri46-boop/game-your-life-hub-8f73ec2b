import { useMemo, useRef, useEffect, useState } from "react";

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
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  // Measure the day columns container width
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Create a map of day -> progress for quick lookup
  const progressMap = useMemo(() => {
    const map: Record<number, number> = {};
    data.forEach(d => {
      map[d.day] = d.progress;
    });
    return map;
  }, [data]);

  // Calculate cell width based on container width
  const cellWidth = containerWidth / daysInMonth;

  // Generate smooth SVG path for area chart
  const { linePath, areaPath, points } = useMemo(() => {
    if (containerWidth === 0 || data.length === 0) {
      return { linePath: '', areaPath: '', points: [] };
    }

    const pts: { x: number; y: number; day: number }[] = [];
    
    // Generate points for each day with data
    for (let i = 0; i < data.length; i++) {
      const d = data[i];
      // Center of each day's cell
      const x = (d.day - 1) * cellWidth + cellWidth / 2;
      const y = chartHeight - (d.progress / maxProgress) * (chartHeight - 10);
      pts.push({ x, y, day: d.day });
    }

    if (pts.length === 0) return { linePath: '', areaPath: '', points: [] };

    // Create smooth bezier curve path
    let path = `M ${pts[0].x} ${pts[0].y}`;
    
    for (let i = 1; i < pts.length; i++) {
      const prev = pts[i - 1];
      const curr = pts[i];
      
      // Control points for smooth curve
      const tension = 0.3;
      const cp1x = prev.x + (curr.x - prev.x) * tension;
      const cp1y = prev.y;
      const cp2x = curr.x - (curr.x - prev.x) * tension;
      const cp2y = curr.y;
      
      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
    }

    const linePath = path;
    
    // Close path for area fill
    const lastPoint = pts[pts.length - 1];
    const firstPoint = pts[0];
    const areaPath = `${path} L ${lastPoint.x} ${chartHeight} L ${firstPoint.x} ${chartHeight} Z`;

    return { linePath, areaPath, points: pts };
  }, [data, cellWidth, containerWidth, chartHeight, maxProgress]);

  return (
    <div>
      {/* Title centered at top */}
      <h3 className="font-display text-sm lg:text-base font-semibold text-center mb-4">
        {monthName} Progress
      </h3>
      
      {/* Chart container with same structure as habit table */}
      <div className="flex">
        {/* Left column matching habit name column - contains Y axis */}
        <div 
          className="flex-shrink-0 flex flex-col justify-between text-right pr-3"
          style={{ width: '140px', height: `${chartHeight}px` }}
        >
          <span className="text-[10px] lg:text-xs text-muted-foreground leading-none">100%</span>
          <span className="text-[10px] lg:text-xs text-muted-foreground leading-none">50%</span>
          <span className="text-[10px] lg:text-xs text-muted-foreground leading-none">0%</span>
        </div>
        
        {/* Day columns - chart area (same flex-1 as table day columns) */}
        <div 
          ref={containerRef}
          className="flex-1 relative"
          style={{ height: `${chartHeight}px`, minWidth: 0 }}
        >
          {/* 50% grid line */}
          <div 
            className="absolute w-full border-t border-dashed border-border/40"
            style={{ top: `${chartHeight / 2}px` }}
          />
          
          {/* SVG Area Chart */}
          {containerWidth > 0 && (
            <svg 
              width={containerWidth} 
              height={chartHeight} 
              className="absolute inset-0"
              style={{ overflow: 'visible' }}
            >
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(24, 95%, 53%)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="hsl(38, 100%, 60%)" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              
              {/* Area fill */}
              <path
                d={areaPath}
                fill="url(#areaGradient)"
              />
              
              {/* Line stroke */}
              <path
                d={linePath}
                fill="none"
                stroke="hsl(24, 95%, 53%)"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              
              {/* Data points */}
              {points.map((point, i) => (
                <circle
                  key={i}
                  cx={point.x}
                  cy={point.y}
                  r={4}
                  fill="hsl(24, 95%, 53%)"
                  stroke="white"
                  strokeWidth={2}
                />
              ))}
            </svg>
          )}
        </div>
        
        {/* Right columns matching % and delete columns */}
        <div style={{ width: '84px' }} className="flex-shrink-0"></div>
      </div>
    </div>
  );
}
