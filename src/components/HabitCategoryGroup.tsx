import { useState, useMemo } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { AppleEmoji } from "@/components/AppleEmoji";
import { cn } from "@/lib/utils";

interface Habit {
  id: string;
  name: string;
  icon: string;
  category: string;
  category_color: string | null;
  target: number;
}

interface HabitCategoryGroupProps {
  category: string;
  categoryColor: string | null;
  habits: Habit[];
  completionsMap: Record<string, Record<string, number>>;
  getDateKey: (day: number) => string;
  currentDay: number;
  renderHabit: (habit: Habit) => React.ReactNode;
  autoCollapse?: boolean; // Auto-collapse when 3+ habits
}

export function HabitCategoryGroup({
  category,
  categoryColor,
  habits,
  completionsMap,
  getDateKey,
  currentDay,
  renderHabit,
  autoCollapse = true,
}: HabitCategoryGroupProps) {
  const shouldAutoCollapse = autoCollapse && habits.length >= 3;
  const [isExpanded, setIsExpanded] = useState(!shouldAutoCollapse);

  // Calculate group completion percentage
  const groupCompletionPercent = useMemo(() => {
    let totalCompleted = 0;
    let totalPossible = 0;

    habits.forEach(habit => {
      for (let day = 1; day <= currentDay; day++) {
        const dateKey = getDateKey(day);
        const value = completionsMap[habit.id]?.[dateKey] || 0;
        totalPossible++;
        if (habit.target === 1) {
          if (value >= 1) totalCompleted++;
        } else {
          if (value >= habit.target) totalCompleted++;
        }
      }
    });

    return totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;
  }, [habits, completionsMap, currentDay, getDateKey]);

  // If less than 3 habits, render directly without grouping
  if (!shouldAutoCollapse) {
    return <>{habits.map(renderHabit)}</>;
  }

  return (
    <>
      {/* Group header - collapsed view */}
      {!isExpanded && (
        <tr className="border-t border-border/30">
          <td className="p-1.5 lg:p-2" colSpan={100}>
            <button
              onClick={() => setIsExpanded(true)}
              className="flex items-center gap-2 w-full hover:bg-secondary/50 rounded-lg p-1 transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
              <div 
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: categoryColor || '#6B7280' }}
              />
              <span className="text-sm font-medium text-foreground">{category}</span>
              <span className="text-xs text-muted-foreground">({habits.length} habits)</span>
              <div className="ml-auto flex items-center gap-2">
                <div className="h-2 w-24 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all"
                    style={{ width: `${groupCompletionPercent}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-primary">{groupCompletionPercent}%</span>
              </div>
            </button>
          </td>
        </tr>
      )}

      {/* Expanded view - show individual habits */}
      {isExpanded && (
        <>
          {/* Category header */}
          <tr className="border-t border-border/30">
            <td className="p-1.5 lg:p-2" colSpan={100}>
              <button
                onClick={() => setIsExpanded(false)}
                className="flex items-center gap-2 hover:bg-secondary/50 rounded-lg p-1 transition-colors"
              >
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
                <div 
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: categoryColor || '#6B7280' }}
                />
                <span className="text-sm font-medium text-foreground">{category}</span>
                <span className="text-xs text-muted-foreground">({habits.length} habits)</span>
              </button>
            </td>
          </tr>
          {habits.map(renderHabit)}
        </>
      )}
    </>
  );
}
