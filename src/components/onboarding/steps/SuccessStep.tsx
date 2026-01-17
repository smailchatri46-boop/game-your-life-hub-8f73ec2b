import { OnboardingCard } from "../OnboardingCard";
import { Button } from "@/components/ui/button";
import { AppleEmoji } from "@/components/AppleEmoji";
import { useEffect } from "react";
import dashboardPreview from "@/assets/dashboard-preview-optimized.jpg";

interface SuccessStepProps {
  commitmentName: string;
  onGoToDashboard: () => void;
  onAddMoreHabits: () => void;
  onStartJournaling: () => void;
}

export function SuccessStep({
  commitmentName,
  onGoToDashboard,
  onAddMoreHabits,
  onStartJournaling,
}: SuccessStepProps) {
  // Hide scrollbar on mount
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    
    const originalHtmlOverflow = html.style.overflow;
    const originalBodyOverflow = body.style.overflow;
    
    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    
    return () => {
      html.style.overflow = originalHtmlOverflow;
      body.style.overflow = originalBodyOverflow;
    };
  }, []);

  // The image URL - we use this inline to ensure instant display
  const imageUrl = dashboardPreview;

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center"
      style={{ overflow: 'hidden', height: '100vh', maxHeight: '100vh' }}
    >
      {/* Blurred dashboard background - use an actual img element for more reliable rendering */}
      <img 
        src={imageUrl}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          filter: 'blur(8px)',
          transform: 'scale(1.1)',
        }}
      />
      {/* Light overlay for readability */}
      <div className="absolute inset-0 bg-white/40" />
      
      {/* Card content */}
      <div className="relative z-10 w-full max-w-md px-4">
        <OnboardingCard className="text-center">
          <div className="mb-6">
            <div className="flex justify-center mb-4">
              <AppleEmoji emoji="🎉" size="3xl" />
            </div>
            <h2 className="text-2xl font-bold font-display text-foreground mb-3">
              You're all set{commitmentName ? `, ${commitmentName}` : ""}!
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed">
              Your journey starts now. Remember: small steps, taken consistently, lead to remarkable change.
            </p>
          </div>

          {/* Motivational quote */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4 mb-6 border border-primary/10">
            <p className="text-sm text-foreground italic font-display">
              "The secret of getting ahead is getting started."
            </p>
            <p className="text-xs text-muted-foreground mt-1">— Mark Twain</p>
          </div>

          <Button
            onClick={onGoToDashboard}
            variant="gradient"
            className="w-full h-12 text-base hover:opacity-90"
          >
            Start My Journey Now
          </Button>
        </OnboardingCard>
      </div>
    </div>
  );
}
