import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AppleEmoji } from "@/components/AppleEmoji";

interface HabitGuidanceCarouselProps {
  onComplete: () => void;
}

const SLIDES = [
  {
    emoji: "🌱",
    title: "Start small, stay consistent",
    message: "Over 90% of people who set hard goals give up in the first week. Make your habits easy and achievable so you can build momentum.",
  },
  {
    emoji: "📈",
    title: "Make progress feel natural",
    message: "Don't jump to the final goal immediately. Use progressive build-up habits and gradually increase difficulty so new routines stay comfortable.",
  },
  {
    emoji: "🔥",
    title: "Tiny steps beat burnout",
    message: "Small goals done daily are more powerful than big goals abandoned. Stick to simple habits and let compound progress work for you.",
  },
];

export function HabitGuidanceCarousel({ onComplete }: HabitGuidanceCarouselProps) {
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
      {/* Blurred background overlay */}
      <div 
        className="absolute inset-0 bg-background/60 backdrop-blur-md"
        onClick={(e) => e.stopPropagation()}
      />
      
      {/* Card */}
      <div className="relative z-10 w-full max-w-md mx-4 animate-scale-in">
        <div className="bg-card/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-border/10 overflow-hidden">
          {/* Content */}
          <div className="px-8 py-10 text-center">
            {/* Emoji */}
            <div className="mb-6 flex justify-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                <AppleEmoji emoji={slide.emoji} size="4xl" />
              </div>
            </div>

            {/* Title */}
            <h2 className="text-xl font-semibold text-foreground mb-3 font-display">
              {slide.title}
            </h2>

            {/* Message */}
            <p className="text-muted-foreground text-sm leading-relaxed mb-8 max-w-sm mx-auto">
              {slide.message}
            </p>

            {/* Progress dots */}
            <div className="flex justify-center gap-2 mb-6">
              {SLIDES.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? "w-6 bg-gradient-to-r from-primary to-primary/80"
                      : index < currentSlide
                      ? "bg-primary/40"
                      : "bg-muted-foreground/20"
                  }`}
                />
              ))}
            </div>

            {/* Button */}
            <Button
              variant="gradient"
              onClick={handleNext}
              className="px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all text-base font-medium"
            >
              {isLastSlide ? "Add Habit" : "Next"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
