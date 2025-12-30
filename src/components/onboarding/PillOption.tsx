import { cn } from "@/lib/utils";
import { AppleEmoji } from "@/components/AppleEmoji";

interface PillOptionProps {
  label: string;
  emoji?: string;
  selected: boolean;
  onClick: () => void;
}

export function PillOption({ label, emoji, selected, onClick }: PillOptionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200",
        "border-2",
        selected
          ? "bg-gradient-to-b from-primary to-primary-dark text-white border-transparent shadow-md"
          : "bg-white/80 text-foreground border-border/30 hover:border-primary/40 hover:bg-white"
      )}
    >
      {emoji && <AppleEmoji emoji={emoji} size="md" />}
      {label}
    </button>
  );
}
