import { cn } from "@/lib/utils";
import { ReactNode, CSSProperties } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glow?: boolean;
  hover?: boolean;
  style?: CSSProperties;
}

export function GlassCard({ children, className, glow = false, hover = false, style }: GlassCardProps) {
  return (
    <div
      className={cn(
        "bg-card/70 backdrop-blur-xl rounded-3xl border border-white/50",
        "shadow-glass transition-all duration-300",
        glow && "shadow-glow",
        hover && "hover:shadow-large hover:-translate-y-1",
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
}
