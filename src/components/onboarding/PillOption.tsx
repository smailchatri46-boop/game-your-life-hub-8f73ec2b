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
        "inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 relative",
        selected
          ? "bg-white text-foreground shadow-md"
          : "bg-white/80 text-foreground border-2 border-border/30 hover:border-primary/40 hover:bg-white"
      )}
      style={selected ? {
        background: "linear-gradient(white, white) padding-box, linear-gradient(135deg, hsl(25, 95%, 53%), hsl(35, 95%, 60%)) border-box",
        border: "2px solid transparent",
      } : undefined}
    >
      {emoji && <AppleEmoji emoji={emoji} size="md" />}
      {label}
    </button>
  );
}
