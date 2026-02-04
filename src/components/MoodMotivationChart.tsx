import { useMemo, useRef, useEffect, useState } from "react";

interface MoodMotivationData {
  day: number;
  mood?: number;
  motivation?: number;
}

interface MoodMotivationChartProps {
  data: MoodMotivationData[];
  daysInMonth: number;
  currentDay: number;
}

interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  day: number;
  mood?: number;
  motivation?: number;
}

export function MoodMotivationChart({ data, daysInMonth, currentDay }: MoodMotivationChartProps) {
  const chartHeight = 120;
  const maxProgress = 100;
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [tooltip, setTooltip] = useState<TooltipState>({ visible: false, x: 0, y: 0, day: 0 });

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

  const cellWidth = containerWidth / daysInMonth;

  const { moodPath, moodAreaPath, moodPoints } = useMemo(() => {
    if (containerWidth === 0 || data.length === 0) {
      return { moodPath: '', moodAreaPath: '', moodPoints: [] };
    }

    const pts: { x: number; y: number; day: number; value: number }[] = [];
    
    for (let i = 0; i < data.length; i++) {
      const d = data[i];
      const value = d.mood;
      if (value !== undefined) {
        const x = (d.day - 1) * cellWidth + cellWidth / 2;
        const y = chartHeight - (value / maxProgress) * (chartHeight - 10);
        pts.push({ x, y, day: d.day, value });
      }
    }

    if (pts.length === 0) return { moodPath: '', moodAreaPath: '', moodPoints: [] };

    let path = `M ${pts[0].x} ${pts[0].y}`;
    
    for (let i = 1; i < pts.length; i++) {
      const prev = pts[i - 1];
      const curr = pts[i];
      const tension = 0.3;
      const cp1x = prev.x + (curr.x - prev.x) * tension;
      const cp1y = prev.y;
      const cp2x = curr.x - (curr.x - prev.x) * tension;
      const cp2y = curr.y;
      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
    }

    const linePath = path;
    const lastPoint = pts[pts.length - 1];
    const firstPoint = pts[0];
    const areaPath = `${path} L ${lastPoint.x} ${chartHeight} L ${firstPoint.x} ${chartHeight} Z`;

    return {
      moodPath: linePath,
      moodAreaPath: areaPath,
      moodPoints: pts,
    };
  }, [data, cellWidth, containerWidth, chartHeight, maxProgress]);

  const handleChartMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (moodPoints.length === 0) return;
    
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const mouseX = e.clientX - rect.left;
    
    // Find the day closest to mouse X
    const dayAtMouse = Math.round(mouseX / cellWidth) + 1;
    const dayData = data.find(d => d.day === dayAtMouse);
    
    if (dayData && dayAtMouse <= currentDay) {
      const x = (dayAtMouse - 1) * cellWidth + cellWidth / 2;
      const moodY = dayData.mood !== undefined ? chartHeight - (dayData.mood / maxProgress) * (chartHeight - 10) : 50;
      
      setTooltip({
        visible: true,
        x,
        y: moodY - 60,
        day: dayAtMouse,
        mood: dayData.mood,
        motivation: dayData.motivation,
      });
    } else {
      setTooltip(prev => ({ ...prev, visible: false }));
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
      <div className="flex">
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
        
        <div 
          ref={containerRef}
          className="flex-1 relative"
          style={{ height: `${chartHeight}px`, minWidth: 0 }}
        >
          {[25, 50, 75].map(percent => (
            <div 
              key={percent}
              className="absolute w-full border-t border-dashed border-border/30"
              style={{ top: `${chartHeight - (percent / 100) * (chartHeight - 10)}px` }}
            />
          ))}
          
          {containerWidth > 0 && (
            <svg 
              width={containerWidth} 
              height={chartHeight} 
              className="absolute inset-0 cursor-default"
              style={{ overflow: 'visible' }}
              onMouseMove={handleChartMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <defs>
                <linearGradient id="moodAreaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(24, 95%, 53%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(38, 100%, 60%)" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              
              <rect x={0} y={0} width={containerWidth} height={chartHeight} fill="transparent" />
              
              {/* Mood Area and Line */}
              {moodAreaPath && (
                <path d={moodAreaPath} fill="url(#moodAreaGradient)" />
              )}
              {moodPath && (
                <path
                  d={moodPath}
                  fill="none"
                  stroke="hsl(24, 95%, 53%)"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
              
              {/* Mood Points */}
              {moodPoints.map((point, i) => (
                <circle
                  key={`mood-${i}`}
                  cx={point.x}
                  cy={point.y}
                  r={5}
                  fill="hsl(24, 95%, 53%)"
                  stroke="white"
                  strokeWidth={2}
                  className="pointer-events-none"
                />
              ))}
            </svg>
          )}

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
              {tooltip.mood !== undefined && (
                <div className="text-muted-foreground flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'hsl(24, 95%, 53%)' }} />
                  Mood: {tooltip.mood}%
                </div>
              )}
              {tooltip.motivation !== undefined && (
                <div className="text-muted-foreground flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'hsl(280, 70%, 55%)' }} />
                  Motivation: {tooltip.motivation}%
                </div>
              )}
            </div>
          )}
        </div>
        
        <div style={{ width: '84px' }} className="flex-shrink-0"></div>
      </div>
      
      {/* Legend - Mood only */}
      <div className="flex justify-center mt-3">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: 'hsl(24, 95%, 53%)' }} />
          <span className="text-xs text-muted-foreground">Mood</span>
        </div>
      </div>
    </div>
  );
}
