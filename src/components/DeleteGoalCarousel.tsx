import { useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AppleEmoji } from "@/components/AppleEmoji";
import { X } from "lucide-react";

interface DeleteGoalCarouselProps {
  goalName: string;
  onConfirmDelete: () => void;
  onClose: () => void;
}

const SLIDES = [
  {
    emoji: "🌱",
    title: "Update goals — don't delete them too fast",
    message: "Many people delete goals when they really just need to adjust them. Instead of deleting this goal completely, consider updating the time frame or reducing the target. Progress is rarely linear, and small adjustments keep you moving forward.",
  },
  {
    emoji: "🎯",
    title: "Small goals beat no goals",
    message: "A smaller goal still builds momentum. If this goal feels too big right now, replace it with something simpler for the next three months. Tiny consistent wins matter more than starting over.",
  },
];

export function DeleteGoalCarousel({ goalName, onConfirmDelete, onClose }: DeleteGoalCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [deleteInput, setDeleteInput] = useState("");

  const isConfirmationSlide = currentSlide === 2;
  const canDelete = deleteInput.toLowerCase() === "delete";

  const handleNext = () => {
    if (currentSlide < 2) {
      setCurrentSlide((prev) => prev + 1);
    }
  };

  const handleDelete = () => {
    if (canDelete) {
      onConfirmDelete();
    }
  };

  const totalSlides = 3;

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

          <div className="px-8 py-10 text-center min-h-[380px] flex flex-col">
            {/* Content area with fixed height to prevent card size changes */}
            <div className="flex-1 flex flex-col justify-start">
              {/* Slides 1 & 2 */}
              {!isConfirmationSlide && (
                <>
                  {/* Emoji */}
                  <div className="mb-6 flex justify-center">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                      <AppleEmoji emoji={SLIDES[currentSlide].emoji} size="4xl" />
                    </div>
                  </div>

                  <h2 className="text-xl font-semibold text-foreground mb-3 font-display">
                    {SLIDES[currentSlide].title}
                  </h2>

                  <p className="text-muted-foreground text-sm leading-relaxed mb-8 max-w-sm mx-auto">
                    {SLIDES[currentSlide].message}
                  </p>
                </>
              )}

              {/* Slide 3 - Confirmation */}
              {isConfirmationSlide && (
                <>
                  {/* Delete emoji */}
                  <div className="mb-6 flex justify-center">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-destructive/10 to-destructive/5 flex items-center justify-center">
                      <AppleEmoji emoji="❌" size="4xl" />
                    </div>
                  </div>

                  <h2 className="text-xl font-semibold text-foreground mb-3 font-display">
                    Are you sure you want to delete this goal?
                  </h2>

                  <p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-sm mx-auto">
                    This will permanently remove <span className="font-medium text-foreground">"{goalName}"</span> and its progress.
                    To confirm, please type <span className="font-medium text-foreground">delete</span> in the box below.
                  </p>

                  <Input
                    type="text"
                    placeholder="Type 'delete' to confirm"
                    value={deleteInput}
                    onChange={(e) => setDeleteInput(e.target.value)}
                    className="mb-6 text-center"
                  />
                </>
              )}
            </div>

            {/* Progress dots */}
            <div className="flex justify-center gap-2 mb-6">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => index <= currentSlide && setCurrentSlide(index)}
                  disabled={index > currentSlide}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? `w-6 ${isConfirmationSlide ? "bg-gradient-to-r from-destructive to-destructive/80" : "bg-gradient-to-r from-primary to-primary/80"}`
                      : index < currentSlide
                        ? "bg-primary/40"
                        : "bg-muted-foreground/20"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            {/* Buttons */}
            {!isConfirmationSlide ? (
              <Button
                variant="gradient"
                onClick={handleNext}
                className="px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all text-base font-medium"
              >
                Next
              </Button>
            ) : (
              <div className="flex gap-3 justify-center">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="px-6 py-3 rounded-xl text-base font-medium hover:bg-muted/50"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={!canDelete}
                  className="px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Delete Goal
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
