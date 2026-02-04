import { useState } from "react";
import { ChevronDown, ChevronRight, GripVertical, Check, Trash2 } from "lucide-react";
import { AppleEmoji } from "@/components/AppleEmoji";
import { MarqueeText } from "@/components/MarqueeText";

interface Habit {
  id: string;
  name: string;
  icon: string;
  category: string;
  category_color: string | null;
  target: number;
  schedule_days?: number[] | null;
}

interface HabitCategoryGroupProps {
  category: string;
  categoryColor: string | null;
  habits: Habit[];
  completionsMap: Record<string, Record<string, number>>;
  getDateKey: (day: number) => string;
  currentDay: number;
  daysInMonth: number;
  onToggleCompletion: (habitId: string, day: number) => void;
  onDelete: (habit: Habit) => void;
  getProgress: (habitId: string, target: number) => number;
  categoryColors: Record<string, string>;
}

export function HabitCategoryGroup({
  category,
  habits,
  completionsMap,
  getDateKey,
  currentDay,
  daysInMonth,
  onToggleCompletion,
  onDelete,
  getProgress,
  categoryColors,
}: HabitCategoryGroupProps) {
  const shouldAutoCollapse = habits.length >= 3;
  const [isExpanded, setIsExpanded] = useState(!shouldAutoCollapse);

  // Check if habit should be visible on a specific day
  const isVisibleOnDay = (habit: Habit, dayOfWeek: number): boolean => {
    if (!habit.schedule_days || habit.schedule_days.length === 0) {
      return true;
    }
    return habit.schedule_days.includes(dayOfWeek);
  };

  // If less than 3 habits, render directly without grouping header
  if (!shouldAutoCollapse) {
    return (
      <>
        {habits.map((habit, idx) => (
          <HabitRow
            key={habit.id}
            habit={habit}
            habitIndex={idx}
            daysInMonth={daysInMonth}
            currentDay={currentDay}
            getDateKey={getDateKey}
            completionsMap={completionsMap}
            onToggleCompletion={onToggleCompletion}
            onDelete={onDelete}
            getProgress={getProgress}
            categoryColors={categoryColors}
            isVisibleOnDay={isVisibleOnDay}
          />
        ))}
      </>
    );
  }

  return (
    <>
      {/* Group row - identical structure to habit rows */}
      <tr className="border-t border-border/30">
        <td className="p-1.5 lg:p-2">
          <div className="flex items-center gap-1.5">
            <button
              className="touch-none cursor-grab active:cursor-grabbing p-0.5 rounded hover:bg-secondary/50 transition-colors"
            >
              <GripVertical className="w-3 h-3 text-muted-foreground/50 flex-shrink-0" />
            </button>
            {/* Toggle icon in place of emoji */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-6 h-6 lg:w-7 lg:h-7 flex items-center justify-center rounded hover:bg-secondary/50 transition-colors flex-shrink-0"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 lg:w-5 lg:h-5 text-muted-foreground" />
              ) : (
                <ChevronRight className="w-4 h-4 lg:w-5 lg:h-5 text-muted-foreground" />
              )}
            </button>
            <div className="min-w-0 flex-1">
              <MarqueeText 
                text={`${category} · ${habits.length} habits`} 
                className="text-xs lg:text-sm font-medium" 
                index={0} 
              />
              <div className="flex items-center gap-1.5">
                <span 
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: categoryColors[category] || '#6B7280' }}
                />
                <p className="text-[10px] lg:text-xs text-muted-foreground">{category}</p>
              </div>
            </div>
          </div>
        </td>
        {/* Same dot columns as habits - empty for groups */}
        {Array.from({ length: daysInMonth }, (_, i) => (
          <td key={i} className="p-0.5 lg:p-1">
            <div className="w-5 h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 mx-auto" />
          </td>
        ))}
        {/* Same percentage column */}
        <td className="p-1 lg:p-2 text-right">
          <span className="text-xs lg:text-sm font-bold gradient-text">—</span>
        </td>
        {/* Same delete column - empty for groups */}
        <td className="p-1 lg:p-2">
          <div className="p-1">
            <div className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
          </div>
        </td>
      </tr>

      {/* Expanded habits */}
      {isExpanded && habits.map((habit, idx) => (
        <HabitRow
          key={habit.id}
          habit={habit}
          habitIndex={idx}
          daysInMonth={daysInMonth}
          currentDay={currentDay}
          getDateKey={getDateKey}
          completionsMap={completionsMap}
          onToggleCompletion={onToggleCompletion}
          onDelete={onDelete}
          getProgress={getProgress}
          categoryColors={categoryColors}
          isVisibleOnDay={isVisibleOnDay}
          isGrouped
        />
      ))}
    </>
  );
}

// Individual habit row component
function HabitRow({
  habit,
  habitIndex,
  daysInMonth,
  currentDay,
  getDateKey,
  completionsMap,
  onToggleCompletion,
  onDelete,
  getProgress,
  categoryColors,
  isVisibleOnDay,
  isGrouped = false,
}: {
  habit: Habit;
  habitIndex: number;
  daysInMonth: number;
  currentDay: number;
  getDateKey: (day: number) => string;
  completionsMap: Record<string, Record<string, number>>;
  onToggleCompletion: (habitId: string, day: number) => void;
  onDelete: (habit: Habit) => void;
  getProgress: (habitId: string, target: number) => number;
  categoryColors: Record<string, string>;
  isVisibleOnDay: (habit: Habit, dayOfWeek: number) => boolean;
  isGrouped?: boolean;
}) {
  return (
    <tr className="border-t border-border/30">
      <td className="p-1.5 lg:p-2">
        <div className="flex items-center gap-1.5">
          <button
            className="touch-none cursor-grab active:cursor-grabbing p-0.5 rounded hover:bg-secondary/50 transition-colors"
          >
            <GripVertical className="w-3 h-3 text-muted-foreground/50 flex-shrink-0" />
          </button>
          {isGrouped && (
            <div className="w-6 h-6 lg:w-7 lg:h-7 flex-shrink-0" /> 
          )}
          <AppleEmoji emoji={habit.icon} size="lg" />
          <div className="min-w-0 flex-1">
            <MarqueeText text={habit.name} className="text-xs lg:text-sm font-medium" index={habitIndex} />
            <div className="flex items-center gap-1.5">
              <span 
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: habit.category_color || categoryColors[habit.category] || "#6B7280" }}
              />
              <p className="text-[10px] lg:text-xs text-muted-foreground">{habit.category}</p>
            </div>
          </div>
        </div>
      </td>
      {Array.from({ length: daysInMonth }, (_, i) => {
        const day = i + 1;
        const dateKey = getDateKey(day);
        const value = completionsMap[habit.id]?.[dateKey] || 0;
        const isCompleted = habit.target === 1 ? value >= 1 : value >= habit.target;
        const isFuture = day > currentDay;
        
        const [yearStr, monthStr] = dateKey.split('-');
        const dateObj = new Date(parseInt(yearStr), parseInt(monthStr) - 1, day);
        const dayOfWeek = dateObj.getDay();
        const isScheduled = isVisibleOnDay(habit, dayOfWeek);
        
        return (
          <td key={i} className="p-0.5 lg:p-1">
            {isScheduled ? (
              <button
                disabled={isFuture}
                onClick={() => !isFuture && onToggleCompletion(habit.id, day)}
                className={`w-5 h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 mx-auto rounded-md flex items-center justify-center text-xs ${
                  isFuture 
                    ? 'bg-muted/30 cursor-not-allowed'
                    : isCompleted
                      ? 'bg-gradient-to-br from-accent to-primary text-primary-foreground shadow-sm'
                      : 'bg-secondary hover:bg-secondary/80 cursor-pointer'
                }`}
              >
                {!isFuture && habit.target === 1 && isCompleted && (
                  <Check className="w-3 h-3 lg:w-4 lg:h-4" />
                )}
                {!isFuture && habit.target > 1 && (
                  <span className={`font-medium text-[10px] lg:text-xs ${isCompleted ? '' : 'text-muted-foreground'}`}>
                    {value}
                  </span>
                )}
              </button>
            ) : (
              <div className="w-5 h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 mx-auto" />
            )}
          </td>
        );
      })}
      <td className="p-1 lg:p-2 text-right">
        <span className="text-xs lg:text-sm font-bold gradient-text">{getProgress(habit.id, habit.target)}%</span>
      </td>
      <td className="p-1 lg:p-2">
        <button 
          onClick={() => onDelete(habit)}
          className="p-1 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
        </button>
      </td>
    </tr>
  );
}
