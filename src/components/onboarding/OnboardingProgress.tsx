interface OnboardingProgressProps {
  progress: number;
}

export function OnboardingProgress({ progress }: OnboardingProgressProps) {
  return (
    <div className="w-full max-w-md mx-auto mb-6">
      <div className="h-1.5 bg-white/40 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
