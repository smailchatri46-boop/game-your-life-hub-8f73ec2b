import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Check, Trash2 } from "lucide-react";
import { AppleEmoji } from "@/components/AppleEmoji";

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  emoji: string;
}

interface SortableTodoItemProps {
  todo: TodoItem;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function SortableTodoItem({ todo, onToggle, onDelete }: SortableTodoItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 100 : 1,
  };

  return (
    <div 
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 p-3 rounded-2xl bg-white/80 shadow-sm group"
    >
      <button
        {...attributes}
        {...listeners}
        className="touch-none cursor-grab active:cursor-grabbing p-0.5 rounded hover:bg-secondary/50 transition-colors opacity-0 group-hover:opacity-100"
      >
        <GripVertical className="w-3.5 h-3.5 text-muted-foreground/50" />
      </button>
      <AppleEmoji emoji={todo.emoji || "📝"} size="lg" />
      <span className={`text-sm flex-1 ${
        todo.completed 
          ? 'text-muted-foreground line-through' 
          : 'text-foreground'
      }`}>
        {todo.text}
      </span>
      <button
        onClick={() => onDelete(todo.id)}
        className="p-1.5 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-all"
      >
        <Trash2 className="w-4 h-4" />
      </button>
      <button
        onClick={() => onToggle(todo.id)}
        className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
          todo.completed 
            ? 'bg-gradient-to-br from-accent to-primary text-primary-foreground' 
            : 'border-2 border-muted-foreground/30 hover:border-primary'
        }`}
      >
        {todo.completed && <Check className="w-4 h-4" />}
      </button>
    </div>
  );
}
