import { cn } from "@/lib/utils";
import { ReactNode, CSSProperties, forwardRef } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glow?: boolean;
  hover?: boolean;
  style?: CSSProperties;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ children, className, glow = false, hover = false, style, onMouseEnter, onMouseLeave }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-card/70 backdrop-blur-xl rounded-3xl border border-white/50",
          "shadow-glass transition-all duration-300",
          glow && "shadow-glow",
          hover && "hover:shadow-large hover:-translate-y-1",
          className
        )}
        style={style}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {children}
      </div>
    );
  }
);

GlassCard.displayName = "GlassCard";
