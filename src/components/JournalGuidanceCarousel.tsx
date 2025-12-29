import { useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { AppleEmoji } from "@/components/AppleEmoji";
import { X } from "lucide-react";

interface JournalGuidanceCarouselProps {
  onComplete: () => void;
  onClose: () => void;
}

const SLIDES = [
  {
    emoji: "📓",
    title: "Each journal brings you closer to who you want to become",
    message: "Small reflections written daily compound over time. Journaling helps you notice patterns, track growth, and understand yourself better.",
  },
  {
    emoji: "🤖",
    title: "Your journals help the AI understand you better",
    message: "The more you write, the more personalized your guidance becomes. Your entries help the AI give advice that truly fits what you're going through.",
  },
  {
    emoji: "🔒",
    title: "Entries can only be edited or deleted in the first 24 hours",
    message: "After the first day, entries become locked to protect your progress history and help keep an honest record of your journey.",
  },
];

export function JournalGuidanceCarousel({ onComplete, onClose }: JournalGuidanceCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < SLIDES.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      onComplete();
    }
  };

  const slide = SLIDES[currentSlide];
  const isLastSlide = currentSlide === SLIDES.length - 1;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center animate-fade-in pointer-events-auto">
      {/* Blurred background overlay */}
      <div 
        className="absolute inset-0 bg-background/60 backdrop-blur-md pointer-events-auto cursor-pointer" 
        onClick={onClose}
      />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md mx-4 animate-scale-in pointer-events-auto">
        <div className="bg-card/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-border/10 overflow-hidden">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors z-10"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="px-8 py-10 text-center">
            {/* Emoji */}
            <div className="mb-6 flex justify-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                <AppleEmoji emoji={slide.emoji} size="4xl" />
              </div>
            </div>

            <h2 className="text-xl font-semibold text-foreground mb-3 font-display">
              {slide.title}
            </h2>

            <p className="text-muted-foreground text-sm leading-relaxed mb-8 max-w-sm mx-auto">
              {slide.message}
            </p>

            {/* Progress dots */}
            <div className="flex justify-center gap-2 mb-6">
              {SLIDES.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? "w-6 bg-gradient-to-r from-primary to-primary/80"
                      : index < currentSlide
                        ? "bg-primary/40"
                        : "bg-muted-foreground/20"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            {isLastSlide ? (
              <Button
                variant="gradient"
                onClick={handleNext}
                className="px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all text-base font-medium"
              >
                Add Journal
              </Button>
            ) : (
              <Button
                variant="ghost"
                onClick={handleNext}
                className="px-8 py-3 rounded-xl text-base font-medium text-muted-foreground hover:text-foreground"
              >
                Next
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
