import { OnboardingCard } from "../OnboardingCard";
import { Button } from "@/components/ui/button";
import { AppleEmoji } from "@/components/AppleEmoji";
import { useEffect, useState } from "react";
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
}: SuccessStepProps) {
  const [bgLoaded, setBgLoaded] = useState(false);
  const [showContent, setShowContent] = useState(false);

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

  // Handle background image load with decode() for bulletproof fade-in
  useEffect(() => {
    let cancelled = false;

    const preload = async () => {
      const img = new Image();
      img.src = dashboardPreview;

      try {
        // Use decode() if available for proper paint readiness
        if (typeof img.decode === 'function') {
          await img.decode();
        } else {
          // Fallback to onload
          await new Promise<void>((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = () => reject();
          });
        }

        if (!cancelled) setBgLoaded(true);
      } catch {
        // Still fade in even if decode fails
        if (!cancelled) setBgLoaded(true);
      }
    };

    preload();
    return () => {
      cancelled = true;
    };
  }, []);

  // Show content slightly after bg starts fading (staggered entrance)
  useEffect(() => {
    if (bgLoaded) {
      const timer = setTimeout(() => {
        setShowContent(true);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [bgLoaded]);

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center gradient-hero"
      style={{ overflow: 'hidden', height: '100vh', maxHeight: '100vh' }}
    >
      {/* Soft placeholder gradient while image loads */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-100/40 via-white/30 to-orange-200/30" />

      {/* Background image layer - always has transition for bulletproof fade-in */}
      <div
        className="absolute inset-0"
        style={{
          opacity: bgLoaded ? 1 : 0,
          transition: "opacity 1500ms ease-out",
          willChange: "opacity",
          transform: "translateZ(0)",
        }}
      >
        {/* Blurred dashboard background */}
        <img 
          src={dashboardPreview}
          alt=""
          aria-hidden="true"
          loading="eager"
          decoding="async"
          fetchPriority="high"
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            filter: 'blur(8px)',
            transform: 'scale(1.1)',
            willChange: 'transform, filter',
          }}
        />
        {/* Light overlay for readability */}
        <div className="absolute inset-0 bg-white/40" />
      </div>
      
      {/* Card content - fades in after background */}
      <div 
        className="relative z-10 w-full max-w-md px-4"
        style={{
          opacity: showContent ? 1 : 0,
          transform: showContent ? 'translateY(0)' : 'translateY(10px)',
          transition: 'opacity 500ms ease-out, transform 500ms ease-out',
        }}
      >
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
