import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface OnboardingCardProps {
  children: ReactNode;
  className?: string;
}

export function OnboardingCard({ children, className }: OnboardingCardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-[2rem] p-8 w-full max-w-md mx-auto shadow-lg",
        "border border-white/60",
        className
      )}
    >
      {children}
    </div>
  );
}
