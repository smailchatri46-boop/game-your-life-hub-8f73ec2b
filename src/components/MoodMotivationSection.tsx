import { useState, useMemo } from "react";
import { GlassCard } from "@/components/GlassCard";

interface MoodMotivationSectionProps {
  daysInMonth: number;
  currentDay: number;
  year: number;
  month: number;
}

const MOOD_OPTIONS = [
  { value: 5, emoji: "🥳", label: "Amazing" },
  { value: 4, emoji: "🙂", label: "Happy" },
  { value: 3, emoji: "😐", label: "Okay" },
  { value: 2, emoji: "😕", label: "Low" },
  { value: 1, emoji: "😭", label: "Very Low" },
];

const getMotivationLabel = (value: number) => {
  if (value <= 3) return "Low";
  if (value <= 7) return "Medium";
  return "Very High";
};

const getMotivationLabelColor = (value: number) => {
  if (value <= 3) return "#EF4444";
  if (value <= 7) return "#F59E0B";
  return "#22C55E";
};

export function MoodMotivationSection({ daysInMonth, currentDay, year, month }: MoodMotivationSectionProps) {
  const [selectedMood, setSelectedMood] = useState(4);
  const [selectedMotivation, setSelectedMotivation] = useState(7);
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);

  // Generate historical data
  const chartData = useMemo(() => {
    const data: { day: number; mood: number; motivation: number }[] = [];
    for (let day = 1; day <= currentDay; day++) {
      data.push({
        day,
        mood: Math.max(1, Math.min(5, Math.round(3 + Math.sin(day / 4) * 1.5 + (Math.random() - 0.5)))),
        motivation: Math.max(1, Math.min(10, Math.round(6 + Math.sin(day / 3) * 2 + (Math.random() - 0.5) * 2))),
      });
    }
    if (data.length > 0) {
      data[data.length - 1] = { day: currentDay, mood: selectedMood, motivation: selectedMotivation };
    }
    return data;
  }, [currentDay, selectedMood, selectedMotivation, month, year]);

  // Chart dimensions
  const chartHeight = 120;
  const chartWidth = 100;

  const { moodPath, moodArea, points } = useMemo(() => {
    if (chartData.length === 0) return { moodPath: '', moodArea: '', points: [] };

    const padding = 1;
    const getX = (day: number) => padding + ((day - 1) / (daysInMonth - 1)) * (chartWidth - padding * 2);
    // Combined average uses 0-100 scale (mood is 1-5 mapped to 0-100, motivation is 1-10 mapped to 0-100)
    const getCombinedY = (mood: number, motivation: number) => {
      const moodPct = ((mood - 1) / 4) * 100;
      const motivationPct = ((motivation - 1) / 9) * 100;
      const combined = (moodPct + motivationPct) / 2;
      return chartHeight - 10 - (combined / 100) * (chartHeight - 20);
    };

    const combinedPts: { x: number; y: number; day: number; mood: number; motivation: number }[] = [];

    chartData.forEach(d => {
      const x = getX(d.day);
      combinedPts.push({ x, y: getCombinedY(d.mood, d.motivation), day: d.day, mood: d.mood, motivation: d.motivation });
    });

    const createPath = (points: { x: number; y: number }[]) => {
      if (points.length === 0) return '';
      let path = `M ${points[0].x} ${points[0].y}`;
      for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1];
        const curr = points[i];
        const cpx1 = prev.x + (curr.x - prev.x) * 0.35;
        const cpx2 = curr.x - (curr.x - prev.x) * 0.35;
        path += ` C ${cpx1} ${prev.y}, ${cpx2} ${curr.y}, ${curr.x} ${curr.y}`;
      }
      return path;
    };

    const createArea = (points: { x: number; y: number }[]) => {
      if (points.length === 0) return '';
      const path = createPath(points);
      return `${path} L ${points[points.length - 1].x} ${chartHeight - 5} L ${points[0].x} ${chartHeight - 5} Z`;
    };

    return {
      moodPath: createPath(combinedPts),
      moodArea: createArea(combinedPts),
      points: combinedPts,
    };
  }, [chartData, daysInMonth, chartHeight, chartWidth]);

  const getMoodLabel = (value: number) => MOOD_OPTIONS.find(m => m.value === value)?.label || "Okay";

  return (
    <div className="space-y-4 font-['Inter',sans-serif]">
      {/* Daily Mood & Motivation Card */}
      <GlassCard className="p-5 bg-white/80 dark:bg-zinc-900/80">
        <h3 className="text-base font-semibold text-foreground mb-5">Daily Mood & Motivation</h3>
        
        <div className="space-y-6">
          {/* Mood Selection */}
          <div>
            <p className="text-sm font-medium text-foreground/80 mb-1.5">How are you feeling today?</p>
            <p className="text-xs text-muted-foreground mb-3">Choose the emoji that best matches your mood.</p>
            <div className="flex gap-2">
              {MOOD_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedMood(option.value)}
                  className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
                    selectedMood === option.value
                      ? "bg-primary/15 ring-2 ring-primary/50 scale-105"
                      : "bg-secondary/40 hover:bg-secondary/60"
                  }`}
                >
                  <span className={`transition-transform ${selectedMood === option.value ? "text-2xl" : "text-xl opacity-70"}`}>
                    {option.emoji}
                  </span>
                  <span className={`text-[10px] ${selectedMood === option.value ? "font-medium text-primary" : "text-muted-foreground"}`}>
                    {option.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Motivation Selection */}
          <div>
            <p className="text-sm font-medium text-foreground/80 mb-1.5">Motivation level today?</p>
            <p className="text-xs text-muted-foreground mb-3">Rate your motivation from 1 to 10.</p>
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                  <button
                    key={num}
                    onClick={() => setSelectedMotivation(num)}
                    className={`w-8 h-8 rounded-full text-sm font-medium transition-all ${
                      selectedMotivation === num
                        ? "bg-amber-400 text-white shadow-md shadow-amber-400/30 scale-110"
                        : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
              <span
                className="text-xs font-medium px-2 py-1 rounded-full"
                style={{
                  backgroundColor: `${getMotivationLabelColor(selectedMotivation)}15`,
                  color: getMotivationLabelColor(selectedMotivation),
                }}
              >
                {getMotivationLabel(selectedMotivation)}
              </span>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Trend Chart Card */}
      <GlassCard className="p-5 bg-white/80 dark:bg-zinc-900/80">
        <h3 className="text-base font-semibold text-foreground mb-4">Monthly Wellbeing Trend</h3>
        
        <div className="relative">

          {/* Chart */}
          <div 
            className="relative bg-gradient-to-b from-secondary/20 to-transparent rounded-xl"
            onMouseLeave={() => setHoveredDay(null)}
          >
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full"
              style={{ height: "140px" }}
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="moodGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FB923C" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#FB923C" stopOpacity={0.02} />
                </linearGradient>
              </defs>

              {/* Light grid */}
              {[25, 50, 75].map((pct) => (
                <line
                  key={pct}
                  x1="0"
                  y1={chartHeight - 10 - (pct / 100) * (chartHeight - 20)}
                  x2={chartWidth}
                  y2={chartHeight - 10 - (pct / 100) * (chartHeight - 20)}
                  stroke="currentColor"
                  strokeOpacity={0.06}
                />
              ))}

              {/* Mood Area fill */}
              <path d={moodArea} fill="url(#moodGrad)" />

              {/* Mood Line */}
              <path
                d={moodPath}
                fill="none"
                stroke="#FB923C"
                strokeWidth={0.5}
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />

              {/* Interactive points */}
              {points.map((pt, i) => (
                <g key={i}>
                  {/* Larger invisible hit area */}
                  <rect
                    x={pt.x - 2}
                    y={0}
                    width={4}
                    height={chartHeight}
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredDay(pt.day)}
                  />
                  {/* Mood dot */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={hoveredDay === pt.day ? 1.2 : 0.7}
                    fill="#FB923C"
                    className="transition-all"
                    vectorEffect="non-scaling-stroke"
                  />
                </g>
              ))}
            </svg>

            {/* Tooltip */}
            {hoveredDay && (
              <div 
                className="absolute z-20 bg-white dark:bg-zinc-800 shadow-lg rounded-lg px-3 py-2 text-xs pointer-events-none border border-border/50"
                style={{
                  left: `${((hoveredDay - 1) / (daysInMonth - 1)) * 100}%`,
                  top: "10px",
                  transform: "translateX(-50%)",
                }}
              >
                <p className="font-semibold text-foreground">Day {hoveredDay}</p>
                <div className="text-muted-foreground">
                  Mood: {Math.round(((chartData.find(d => d.day === hoveredDay)?.mood || 3) / 5) * 100)}%
                </div>
                <div className="text-muted-foreground">
                  Motivation: {Math.round(((chartData.find(d => d.day === hoveredDay)?.motivation || 5) / 10) * 100)}%
                </div>
              </div>
            )}
          </div>

          {/* Legend - Wellbeing */}
          <div className="flex justify-center mt-3">
            <span className="text-xs text-muted-foreground">Wellbeing</span>
          </div>

          {/* X-axis labels */}
          <div className="flex justify-between mt-2 text-[10px] text-muted-foreground">
            <span>1</span>
            <span>{Math.round(daysInMonth / 2)}</span>
            <span>{daysInMonth}</span>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
