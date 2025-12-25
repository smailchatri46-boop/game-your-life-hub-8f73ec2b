import { useState, useMemo } from "react";
import { GlassCard } from "@/components/GlassCard";
import { AppleEmoji } from "@/components/AppleEmoji";

const MOOD_OPTIONS = [
  { emoji: "🥳", label: "Amazing", value: 5 },
  { emoji: "😊", label: "Happy", value: 4 },
  { emoji: "😌", label: "Good", value: 3 },
  { emoji: "😐", label: "Okay", value: 2 },
  { emoji: "😔", label: "Low", value: 1 },
];

const MOTIVATION_OPTIONS = [
  { emoji: "🔥", label: "On Fire", value: 5 },
  { emoji: "💪", label: "Motivated", value: 4 },
  { emoji: "⚡", label: "Energized", value: 3 },
  { emoji: "🌱", label: "Growing", value: 2 },
  { emoji: "😴", label: "Tired", value: 1 },
];

interface MoodMotivationSectionProps {
  daysInMonth: number;
  currentDay: number;
  year: number;
  month: number;
}

export function MoodMotivationSection({ daysInMonth, currentDay, year, month }: MoodMotivationSectionProps) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  
  // Generate sample mood/motivation data
  const { moodData, motivationData } = useMemo(() => {
    const moods: Record<number, number> = {};
    const motivations: Record<number, number> = {};
    for (let day = 1; day <= currentDay; day++) {
      moods[day] = Math.floor(Math.random() * 5) + 1;
      motivations[day] = Math.floor(Math.random() * 5) + 1;
    }
    return { moodData: moods, motivationData: motivations };
  }, [currentDay, month, year]);

  const getMoodEmoji = (value: number) => MOOD_OPTIONS.find(m => m.value === value)?.emoji || "😐";
  const getMotivationEmoji = (value: number) => MOTIVATION_OPTIONS.find(m => m.value === value)?.emoji || "⚡";

  // Chart data for mood trend
  const chartData = useMemo(() => {
    return Array.from({ length: currentDay }, (_, i) => ({
      day: i + 1,
      mood: moodData[i + 1] || 0,
      motivation: motivationData[i + 1] || 0,
    }));
  }, [currentDay, moodData, motivationData]);

  const chartHeight = 80;
  const maxValue = 5;

  // Generate SVG paths for mood and motivation lines
  const { moodPath, motivationPath, moodAreaPath, motivationAreaPath } = useMemo(() => {
    if (chartData.length === 0) return { moodPath: '', motivationPath: '', moodAreaPath: '', motivationAreaPath: '' };

    const width = 100; // percentage based
    const padding = 2;
    
    const getX = (index: number) => padding + (index / (chartData.length - 1 || 1)) * (width - padding * 2);
    const getY = (value: number) => chartHeight - (value / maxValue) * (chartHeight - 10) - 5;

    let moodPath = `M ${getX(0)} ${getY(chartData[0].mood)}`;
    let motivationPath = `M ${getX(0)} ${getY(chartData[0].motivation)}`;

    for (let i = 1; i < chartData.length; i++) {
      const prev = chartData[i - 1];
      const curr = chartData[i];
      const prevX = getX(i - 1);
      const currX = getX(i);
      
      const tension = 0.3;
      const cp1x = prevX + (currX - prevX) * tension;
      const cp2x = currX - (currX - prevX) * tension;

      moodPath += ` C ${cp1x} ${getY(prev.mood)}, ${cp2x} ${getY(curr.mood)}, ${currX} ${getY(curr.mood)}`;
      motivationPath += ` C ${cp1x} ${getY(prev.motivation)}, ${cp2x} ${getY(curr.motivation)}, ${currX} ${getY(curr.motivation)}`;
    }

    const lastX = getX(chartData.length - 1);
    const firstX = getX(0);
    const moodAreaPath = `${moodPath} L ${lastX} ${chartHeight} L ${firstX} ${chartHeight} Z`;
    const motivationAreaPath = `${motivationPath} L ${lastX} ${chartHeight} L ${firstX} ${chartHeight} Z`;

    return { moodPath, motivationPath, moodAreaPath, motivationAreaPath };
  }, [chartData, chartHeight, maxValue]);

  return (
    <GlassCard className="p-4 sm:p-5 lg:p-6">
      <div className="flex items-center gap-2 mb-5">
        <AppleEmoji emoji="💭" size="lg" />
        <h3 className="font-display text-lg font-semibold">Mood & Motivation</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Selection */}
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-3 flex items-center gap-2">
              <span>How are you feeling today?</span>
            </p>
            <div className="flex gap-2">
              {MOOD_OPTIONS.map((mood) => (
                <button
                  key={mood.value}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                    moodData[currentDay] === mood.value
                      ? "bg-primary/20 ring-2 ring-primary scale-105"
                      : "bg-secondary/50 hover:bg-secondary"
                  }`}
                >
                  <AppleEmoji emoji={mood.emoji} size="lg" />
                  <span className="text-[10px] text-muted-foreground">{mood.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-3 flex items-center gap-2">
              <span>What's your motivation level?</span>
            </p>
            <div className="flex gap-2">
              {MOTIVATION_OPTIONS.map((motivation) => (
                <button
                  key={motivation.value}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                    motivationData[currentDay] === motivation.value
                      ? "bg-accent/20 ring-2 ring-accent scale-105"
                      : "bg-secondary/50 hover:bg-secondary"
                  }`}
                >
                  <AppleEmoji emoji={motivation.emoji} size="lg" />
                  <span className="text-[10px] text-muted-foreground">{motivation.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Weekly Summary */}
          <div className="flex gap-4 pt-3 border-t border-border/30">
            <div className="flex-1 text-center">
              <p className="text-xs text-muted-foreground mb-1">Avg Mood</p>
              <div className="flex items-center justify-center gap-1">
                <AppleEmoji emoji={getMoodEmoji(Math.round(Object.values(moodData).reduce((a, b) => a + b, 0) / currentDay))} size="md" />
                <span className="font-semibold text-sm">
                  {(Object.values(moodData).reduce((a, b) => a + b, 0) / currentDay).toFixed(1)}
                </span>
              </div>
            </div>
            <div className="flex-1 text-center">
              <p className="text-xs text-muted-foreground mb-1">Avg Motivation</p>
              <div className="flex items-center justify-center gap-1">
                <AppleEmoji emoji={getMotivationEmoji(Math.round(Object.values(motivationData).reduce((a, b) => a + b, 0) / currentDay))} size="md" />
                <span className="font-semibold text-sm">
                  {(Object.values(motivationData).reduce((a, b) => a + b, 0) / currentDay).toFixed(1)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Trend Chart */}
        <div>
          <p className="text-sm font-medium mb-3">Monthly Trend</p>
          <div className="bg-secondary/30 rounded-xl p-3 relative" style={{ height: `${chartHeight + 40}px` }}>
            {/* Legend */}
            <div className="flex gap-4 mb-2 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-primary/80"></div>
                <span className="text-muted-foreground">Mood</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-accent/80"></div>
                <span className="text-muted-foreground">Motivation</span>
              </div>
            </div>
            
            <svg 
              viewBox={`0 0 100 ${chartHeight}`} 
              className="w-full" 
              style={{ height: `${chartHeight}px` }}
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(24, 95%, 53%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(24, 95%, 53%)" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="motivationGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(38, 100%, 60%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(38, 100%, 60%)" stopOpacity={0.02} />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              {[1, 2, 3, 4, 5].map(val => (
                <line
                  key={val}
                  x1="0"
                  y1={chartHeight - (val / maxValue) * (chartHeight - 10) - 5}
                  x2="100"
                  y2={chartHeight - (val / maxValue) * (chartHeight - 10) - 5}
                  stroke="currentColor"
                  strokeOpacity={0.1}
                  strokeDasharray="2,2"
                />
              ))}

              {/* Area fills */}
              <path d={moodAreaPath} fill="url(#moodGradient)" />
              <path d={motivationAreaPath} fill="url(#motivationGradient)" />

              {/* Lines */}
              <path
                d={moodPath}
                fill="none"
                stroke="hsl(24, 95%, 53%)"
                strokeWidth={0.8}
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
              <path
                d={motivationPath}
                fill="none"
                stroke="hsl(38, 100%, 60%)"
                strokeWidth={0.8}
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            </svg>

            {/* X-axis labels */}
            <div className="flex justify-between mt-1 text-[10px] text-muted-foreground">
              <span>1</span>
              <span>{Math.round(currentDay / 2)}</span>
              <span>{currentDay}</span>
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
