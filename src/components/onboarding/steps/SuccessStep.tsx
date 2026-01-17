import { OnboardingCard } from "../OnboardingCard";
import { Button } from "@/components/ui/button";
import { AppleEmoji } from "@/components/AppleEmoji";
import { useEffect, useState, useRef } from "react";
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
  const [showImage, setShowImage] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

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

  // Check if image is already loaded (from preload in CommitmentStep)
  // and trigger fade-in after a brief delay to ensure CSS transition works
  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    const triggerFade = () => {
      // Use double RAF to ensure the browser has painted the initial state
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setShowImage(true);
        });
      });
    };

    if (img.complete && img.naturalHeight !== 0) {
      // Image already loaded (from preload)
      triggerFade();
    } else {
      // Wait for image to load
      img.onload = triggerFade;
    }
  }, []);

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center gradient-hero"
      style={{ overflow: 'hidden', height: '100vh', maxHeight: '100vh' }}
    >
      {/* Blurred dashboard background with fade-in animation */}
      <img 
        ref={imgRef}
        src={dashboardPreview}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-out"
        style={{
          filter: 'blur(8px)',
          transform: 'scale(1.1)',
          opacity: showImage ? 1 : 0,
        }}
      />
      {/* Light overlay for readability - also fades in with image */}
      <div 
        className="absolute inset-0 bg-white/40 transition-opacity duration-700 ease-out"
        style={{
          opacity: showImage ? 1 : 0,
        }}
      />
      
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
