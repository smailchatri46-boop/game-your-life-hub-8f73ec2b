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

interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  day: number;
  progress: number;
}

export function AlignedProgressChart({ data, daysInMonth, currentDay, monthName }: AlignedProgressChartProps) {
  const chartHeight = 120;
  const maxProgress = 100;
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [tooltip, setTooltip] = useState<TooltipState>({ visible: false, x: 0, y: 0, day: 0, progress: 0 });

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

  // Calculate cell width based on container width - reduced padding
  const cellWidth = containerWidth / daysInMonth;
  const edgePadding = cellWidth * 0.1; // Minimal edge padding

  // Generate smooth SVG path for area chart
  const { linePath, areaPath, points } = useMemo(() => {
    if (containerWidth === 0 || data.length === 0) {
      return { linePath: '', areaPath: '', points: [] };
    }

    const pts: { x: number; y: number; day: number; progress: number }[] = [];
    
    // Generate points for each day with data - closer to edges
    for (let i = 0; i < data.length; i++) {
      const d = data[i];
      // Position points closer to edges
      const x = edgePadding + (d.day - 1) * ((containerWidth - edgePadding * 2) / (daysInMonth - 1));
      const y = chartHeight - (d.progress / maxProgress) * (chartHeight - 10);
      pts.push({ x, y, day: d.day, progress: d.progress });
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
  }, [data, cellWidth, containerWidth, chartHeight, maxProgress, daysInMonth, edgePadding]);

  const handleMouseMove = (e: React.MouseEvent<SVGElement>, point: { x: number; y: number; day: number; progress: number }) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      setTooltip({
        visible: true,
        x: e.clientX - rect.left,
        y: e.clientY - rect.top - 50,
        day: point.day,
        progress: point.progress
      });
    }
  };

  const handleMouseLeave = () => {
    setTooltip(prev => ({ ...prev, visible: false }));
  };

  const yAxisLabels = [
    { value: 100, label: '100%' },
    { value: 75, label: '75%' },
    { value: 50, label: '50%' },
    { value: 25, label: '25%' },
    { value: 0, label: '0%' },
  ];

  return (
    <div>
      {/* Chart container with same structure as habit table */}
      <div className="flex">
        {/* Left column matching habit name column - contains Y axis */}
        <div 
          className="flex-shrink-0 flex flex-col justify-between text-right pr-3"
          style={{ width: '140px', height: `${chartHeight}px` }}
        >
          {yAxisLabels.map(({ label }) => (
            <span key={label} className="text-[10px] lg:text-xs text-foreground/70 font-medium leading-none">
              {label}
            </span>
          ))}
        </div>
        
        {/* Day columns - chart area (same flex-1 as table day columns) */}
        <div 
          ref={containerRef}
          className="flex-1 relative"
          style={{ height: `${chartHeight}px`, minWidth: 0 }}
        >
          {/* Grid lines for 25%, 50%, 75% */}
          {[25, 50, 75].map(percent => (
            <div 
              key={percent}
              className="absolute w-full border-t border-dashed border-border/30"
              style={{ top: `${chartHeight - (percent / 100) * (chartHeight - 10)}px` }}
            />
          ))}
          
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
              
              {/* Data points with hover */}
              {points.map((point, i) => (
                <circle
                  key={i}
                  cx={point.x}
                  cy={point.y}
                  r={6}
                  fill="hsl(24, 95%, 53%)"
                  stroke="white"
                  strokeWidth={2}
                  className="cursor-pointer transition-all hover:r-8"
                  style={{ transition: 'r 0.2s' }}
                  onMouseEnter={(e) => handleMouseMove(e, point)}
                  onMouseMove={(e) => handleMouseMove(e, point)}
                  onMouseLeave={handleMouseLeave}
                />
              ))}
            </svg>
          )}

          {/* Tooltip */}
          {tooltip.visible && (
            <div 
              className="absolute z-50 pointer-events-none bg-background border border-border rounded-lg shadow-lg px-3 py-2 text-sm"
              style={{ 
                left: tooltip.x, 
                top: tooltip.y,
                transform: 'translateX(-50%)'
              }}
            >
              <div className="font-semibold text-foreground">Day {tooltip.day}</div>
              <div className="text-muted-foreground">{Math.round(tooltip.progress)}% completed</div>
            </div>
          )}
        </div>
        
        {/* Right columns matching % and delete columns */}
        <div style={{ width: '84px' }} className="flex-shrink-0"></div>
      </div>
    </div>
  );
}