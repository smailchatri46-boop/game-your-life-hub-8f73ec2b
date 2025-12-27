import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { AppleEmoji } from "@/components/AppleEmoji";
import { format } from "date-fns";

interface UnifiedMoodMotivationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date: Date;
  dateKey: string;
  completionPercent: number;
  existingMood?: number;
  existingMotivation?: number;
  onSave: (dateKey: string, mood: number, motivation: number) => void;
}

// Mood emojis for 1-10 scale
const MOOD_EMOJIS: Record<number, string> = {
  1: "😢",
  2: "😞",
  3: "😔",
  4: "😕",
  5: "😐",
  6: "🙂",
  7: "😊",
  8: "😄",
  9: "🥳",
  10: "🔥",
};

// Motivation emojis for 1-10 scale
const MOTIVATION_EMOJIS: Record<number, string> = {
  1: "😴",
  2: "🥱",
  3: "😑",
  4: "😶",
  5: "🤔",
  6: "💪",
  7: "⚡",
  8: "🚀",
  9: "✨",
  10: "🔥",
};

const getMotivationLabel = (value: number) => {
  if (value <= 3) return "Low";
  if (value <= 5) return "Medium";
  if (value <= 7) return "High";
  if (value <= 9) return "Very High";
  return "Peak";
};

export function UnifiedMoodMotivationModal({
  open,
  onOpenChange,
  date,
  dateKey,
  completionPercent,
  existingMood,
  existingMotivation,
  onSave,
}: UnifiedMoodMotivationModalProps) {
  const [mood, setMood] = useState<number>(existingMood ?? 5);
  const [motivation, setMotivation] = useState<number>(existingMotivation ?? 5);

  useEffect(() => {
    if (open) {
      setMood(existingMood ?? 5);
      setMotivation(existingMotivation ?? 5);
    }
  }, [open, existingMood, existingMotivation]);

  const handleSave = () => {
    onSave(dateKey, mood, motivation);
    onOpenChange(false);
  };

  const dayName = format(date, "EEEE");
  const fullDate = format(date, "MMMM d, yyyy");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-orange-50 to-white dark:from-zinc-900 dark:to-zinc-800 border-orange-100 dark:border-zinc-700">
        <DialogHeader className="text-center">
          <DialogTitle className="font-display text-xl">{dayName}</DialogTitle>
          <p className="text-sm text-muted-foreground">{fullDate}</p>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Completion Stats */}
          <div className="bg-orange-100/50 dark:bg-orange-900/20 rounded-xl p-4">
            <span className="text-sm text-muted-foreground">Completion</span>
            <p className="text-2xl font-bold text-foreground mt-1">
              {completionPercent}%
            </p>
          </div>

          {/* Mood Selection */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <AppleEmoji emoji="😊" size="sm" />
                <span className="text-sm font-medium text-foreground">How are you feeling?</span>
              </div>
              <AppleEmoji emoji={MOOD_EMOJIS[mood]} size="lg" />
            </div>
            <div className="flex gap-1.5">
              {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  onClick={() => setMood(num)}
                  className={`flex-1 h-10 rounded-lg text-sm font-medium transition-all ${
                    mood === num
                      ? "bg-gradient-to-br from-accent to-primary text-white ring-2 ring-primary/50 scale-105"
                      : "bg-secondary/60 dark:bg-zinc-700/60 text-muted-foreground hover:bg-secondary dark:hover:bg-zinc-600"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Motivation Selection */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <AppleEmoji emoji="⚡" size="sm" />
                <span className="text-sm font-medium text-foreground">Motivation Level</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  motivation >= 8 
                    ? "bg-gradient-to-br from-accent to-primary text-white" 
                    : "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300"
                }`}>
                  {getMotivationLabel(motivation)}
                </span>
              </div>
            </div>
            <div className="flex gap-1.5">
              {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  onClick={() => setMotivation(num)}
                  className={`flex-1 h-10 rounded-lg text-sm font-medium transition-all ${
                    motivation === num
                      ? "bg-gradient-to-br from-accent to-primary text-white ring-2 ring-primary/50 scale-105"
                      : "bg-secondary/60 dark:bg-zinc-700/60 text-muted-foreground hover:bg-secondary dark:hover:bg-zinc-600"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-3 pt-2">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="hover:bg-secondary hover:text-foreground hover:border-border"
            >
              Cancel
            </Button>
            <Button variant="gradient" onClick={handleSave}>
              Save Entry
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
