import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Check, Trash2 } from "lucide-react";
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

interface SortableHabitRowProps {
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
}

export function SortableHabitRow({
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
}: SortableHabitRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: habit.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 100 : 1,
  };

  // Check if habit should be visible on a specific day
  const isVisibleOnDay = (dayOfWeek: number): boolean => {
    if (!habit.schedule_days || habit.schedule_days.length === 0) {
      return true; // Daily habit
    }
    return habit.schedule_days.includes(dayOfWeek);
  };

  return (
    <tr ref={setNodeRef} style={style} className="border-t border-border/30">
      <td className="p-1.5 lg:p-2">
        <div className="flex items-center gap-1.5">
          <button
            {...attributes}
            {...listeners}
            className="touch-none cursor-grab active:cursor-grabbing p-0.5 rounded hover:bg-secondary/50 transition-colors"
          >
            <GripVertical className="w-3 h-3 text-muted-foreground/50 flex-shrink-0" />
          </button>
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
        const isCompleted = habit.target === 1 
          ? value >= 1 
          : value >= habit.target;
        const isFuture = day > currentDay;
        
        // Get day of week (0=Sunday, 1=Monday, ..., 6=Saturday)
        const [yearStr, monthStr] = dateKey.split('-');
        const dateObj = new Date(parseInt(yearStr), parseInt(monthStr) - 1, day);
        const dayOfWeek = dateObj.getDay();
        
        // Check if habit is scheduled for this day
        const isScheduled = isVisibleOnDay(dayOfWeek);
        
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
              // Empty space for non-scheduled days
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
