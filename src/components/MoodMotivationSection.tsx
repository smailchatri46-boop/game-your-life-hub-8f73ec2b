import { useState, useMemo } from "react";
import { GlassCard } from "@/components/GlassCard";

interface MoodMotivationSectionProps {
  daysInMonth: number;
  currentDay: number;
  year: number;
  month: number;
}

const getMoodEmoji = (value: number) => {
  if (value <= 2) return "😢";
  if (value <= 4) return "😕";
  if (value <= 6) return "🙂";
  if (value <= 8) return "😄";
  return "🤩";
};

const getMotivationEmoji = (value: number) => {
  if (value <= 2) return "💤";
  if (value <= 4) return "😴";
  if (value <= 6) return "🙂";
  if (value <= 8) return "💪";
  return "🔥";
};

export function MoodMotivationSection({ daysInMonth, currentDay, year, month }: MoodMotivationSectionProps) {
  const [mood, setMood] = useState(7);
  const [motivation, setMotivation] = useState(6);

  // Generate sample historical data for the chart
  const chartData = useMemo(() => {
    const data: { day: number; mood: number; motivation: number }[] = [];
    for (let day = 1; day <= currentDay; day++) {
      data.push({
        day,
        mood: Math.max(1, Math.min(10, Math.round(5 + Math.sin(day / 3) * 3 + Math.random() * 2))),
        motivation: Math.max(1, Math.min(10, Math.round(6 + Math.cos(day / 4) * 2 + Math.random() * 2))),
      });
    }
    // Override today with current selection
    if (data.length > 0) {
      data[data.length - 1] = { day: currentDay, mood, motivation };
    }
    return data;
  }, [currentDay, mood, motivation, month, year]);

  // SVG Chart generation
  const chartHeight = 100;
  const chartWidth = 100; // percentage-based viewBox

  const { moodPath, motivationPath, moodArea, motivationArea, moodPoints, motivationPoints } = useMemo(() => {
    if (chartData.length === 0) return { moodPath: '', motivationPath: '', moodArea: '', motivationArea: '', moodPoints: [], motivationPoints: [] };

    const padding = 2;
    const getX = (day: number) => padding + ((day - 1) / (daysInMonth - 1)) * (chartWidth - padding * 2);
    const getY = (value: number) => chartHeight - 8 - ((value - 1) / 9) * (chartHeight - 16);

    const moodPts: { x: number; y: number }[] = [];
    const motivationPts: { x: number; y: number }[] = [];

    chartData.forEach(d => {
      moodPts.push({ x: getX(d.day), y: getY(d.mood) });
      motivationPts.push({ x: getX(d.day), y: getY(d.motivation) });
    });

    const createPath = (points: { x: number; y: number }[]) => {
      if (points.length === 0) return '';
      let path = `M ${points[0].x} ${points[0].y}`;
      for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1];
        const curr = points[i];
        const cpx1 = prev.x + (curr.x - prev.x) * 0.3;
        const cpx2 = curr.x - (curr.x - prev.x) * 0.3;
        path += ` C ${cpx1} ${prev.y}, ${cpx2} ${curr.y}, ${curr.x} ${curr.y}`;
      }
      return path;
    };

    const createArea = (points: { x: number; y: number }[]) => {
      if (points.length === 0) return '';
      const path = createPath(points);
      const lastX = points[points.length - 1].x;
      const firstX = points[0].x;
      return `${path} L ${lastX} ${chartHeight - 4} L ${firstX} ${chartHeight - 4} Z`;
    };

    return {
      moodPath: createPath(moodPts),
      motivationPath: createPath(motivationPts),
      moodArea: createArea(moodPts),
      motivationArea: createArea(motivationPts),
      moodPoints: moodPts,
      motivationPoints: motivationPts,
    };
  }, [chartData, daysInMonth, chartHeight, chartWidth]);

  const NumberSelector = ({ 
    value, 
    onChange, 
    emoji,
    color 
  }: { 
    value: number; 
    onChange: (v: number) => void; 
    emoji: string;
    color: string;
  }) => (
    <div className="flex items-center gap-3">
      <div className="flex gap-1">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            onClick={() => onChange(num)}
            className={`w-8 h-8 rounded-lg text-sm font-semibold transition-all font-['Inter',sans-serif] ${
              value === num
                ? "text-white shadow-lg scale-105"
                : "bg-secondary/60 text-muted-foreground hover:bg-secondary"
            }`}
            style={{
              backgroundColor: value === num ? color : undefined,
              boxShadow: value === num ? `0 4px 14px ${color}40` : undefined,
            }}
          >
            {num}
          </button>
        ))}
      </div>
      <span className="text-2xl">{emoji}</span>
    </div>
  );

  return (
    <GlassCard className="p-5 font-['Inter',sans-serif]">
      <div className="space-y-5">
        {/* Mood Selector */}
        <div>
          <p className="text-sm font-medium text-foreground/80 mb-3">How are you feeling today?</p>
          <NumberSelector 
            value={mood} 
            onChange={setMood} 
            emoji={getMoodEmoji(mood)}
            color="#F97316"
          />
        </div>

        {/* Motivation Selector */}
        <div>
          <p className="text-sm font-medium text-foreground/80 mb-3">Motivation level</p>
          <NumberSelector 
            value={motivation} 
            onChange={setMotivation} 
            emoji={getMotivationEmoji(motivation)}
            color="#FBBF24"
          />
        </div>

        {/* Trend Chart */}
        <div className="pt-3 border-t border-border/30">
          <p className="text-sm font-medium text-foreground/80 mb-3">Monthly Trend</p>
          <div className="bg-secondary/30 rounded-xl p-3 relative">
            {/* Legend inside chart */}
            <div className="absolute top-2 left-3 flex gap-3 text-xs z-10">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#F97316" }} />
                <span className="text-muted-foreground">Mood</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#FBBF24" }} />
                <span className="text-muted-foreground">Motivation</span>
              </div>
            </div>

            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full"
              style={{ height: "100px" }}
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="moodFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F97316" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#F97316" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="motivationFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FBBF24" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#FBBF24" stopOpacity={0.02} />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              {[2.5, 5, 7.5].map((val) => (
                <line
                  key={val}
                  x1="0"
                  y1={chartHeight - 8 - ((val - 1) / 9) * (chartHeight - 16)}
                  x2={chartWidth}
                  y2={chartHeight - 8 - ((val - 1) / 9) * (chartHeight - 16)}
                  stroke="currentColor"
                  strokeOpacity={0.08}
                  strokeDasharray="2,2"
                />
              ))}

              {/* Area fills */}
              <path d={motivationArea} fill="url(#motivationFill)" />
              <path d={moodArea} fill="url(#moodFill)" />

              {/* Lines */}
              <path
                d={motivationPath}
                fill="none"
                stroke="#FBBF24"
                strokeWidth={0.6}
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
              <path
                d={moodPath}
                fill="none"
                stroke="#F97316"
                strokeWidth={0.6}
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />

              {/* Data points */}
              {moodPoints.map((pt, i) => (
                <circle
                  key={`mood-${i}`}
                  cx={pt.x}
                  cy={pt.y}
                  r={0.8}
                  fill="#F97316"
                  vectorEffect="non-scaling-stroke"
                />
              ))}
              {motivationPoints.map((pt, i) => (
                <circle
                  key={`mot-${i}`}
                  cx={pt.x}
                  cy={pt.y}
                  r={0.8}
                  fill="#FBBF24"
                  vectorEffect="non-scaling-stroke"
                />
              ))}
            </svg>

            {/* X-axis labels */}
            <div className="flex justify-between mt-1 text-[10px] text-muted-foreground px-0.5">
              <span>1</span>
              <span>{Math.round(daysInMonth / 2)}</span>
              <span>{daysInMonth}</span>
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
