import { ReactNode } from "react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { cn } from "@/lib/utils";

type AnimationType = 
  | "fade-up" 
  | "fade-down" 
  | "fade-left" 
  | "fade-right" 
  | "zoom-in" 
  | "zoom-out"
  | "slide-up"
  | "blur-in";

interface ScrollRevealProps {
  children: ReactNode;
  animation?: AnimationType;
  delay?: number;
  duration?: number;
  className?: string;
  threshold?: number;
}

// Premium animation styles with subtle, elegant movements
const animationStyles: Record<AnimationType, { hidden: string; visible: string }> = {
  "fade-up": {
    hidden: "opacity-0 translate-y-4",
    visible: "opacity-100 translate-y-0",
  },
  "fade-down": {
    hidden: "opacity-0 -translate-y-4",
    visible: "opacity-100 translate-y-0",
  },
  "fade-left": {
    hidden: "opacity-0 translate-x-4",
    visible: "opacity-100 translate-x-0",
  },
  "fade-right": {
    hidden: "opacity-0 -translate-x-4",
    visible: "opacity-100 translate-x-0",
  },
  "zoom-in": {
    hidden: "opacity-0 scale-[0.97]",
    visible: "opacity-100 scale-100",
  },
  "zoom-out": {
    hidden: "opacity-0 scale-[1.03]",
    visible: "opacity-100 scale-100",
  },
  "slide-up": {
    hidden: "opacity-0 translate-y-6",
    visible: "opacity-100 translate-y-0",
  },
  "blur-in": {
    hidden: "opacity-0 blur-[2px] scale-[0.99]",
    visible: "opacity-100 blur-0 scale-100",
  },
};

export function ScrollReveal({
  children,
  animation = "fade-up",
  delay = 0,
  duration = 600,
  className,
  threshold = 0.15,
}: ScrollRevealProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold });
  const styles = animationStyles[animation];

  return (
    <div
      ref={ref}
      className={cn(
        "will-change-transform",
        isVisible ? styles.visible : styles.hidden,
        className
      )}
      style={{
        transitionProperty: "opacity, transform, filter",
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: "cubic-bezier(0.25, 0.1, 0.25, 1)",
      }}
    >
      {children}
    </div>
  );
}
