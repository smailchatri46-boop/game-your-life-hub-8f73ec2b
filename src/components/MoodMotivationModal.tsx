import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface MoodMotivationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date: string;
  dateKey: string;
  type: "mood" | "motivation";
  existingValue?: number;
  onSave: (dateKey: string, value: number) => void;
}

export function MoodMotivationModal({
  open,
  onOpenChange,
  date,
  dateKey,
  type,
  existingValue,
  onSave,
}: MoodMotivationModalProps) {
  const [value, setValue] = useState<number>(existingValue ?? 50);

  useEffect(() => {
    if (open) {
      setValue(existingValue ?? 50);
    }
  }, [open, existingValue]);

  const handleSave = () => {
    onSave(dateKey, value);
    onOpenChange(false);
  };

  const title = type === "mood" ? "How are you feeling today?" : "Motivation level";
  const presets = [0, 25, 50, 75, 100];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">{title}</DialogTitle>
          <div className="pt-2">
            <span className="text-sm text-muted-foreground">{date}</span>
          </div>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Percentage Display */}
          <div className="text-center">
            <span className="text-5xl font-bold gradient-text">{value}%</span>
          </div>

          {/* Quick Select Buttons */}
          <div className="flex justify-center gap-2">
            {presets.map((preset) => (
              <button
                key={preset}
                onClick={() => setValue(preset)}
                className={`w-12 h-12 rounded-lg text-sm font-medium transition-all ${
                  value === preset
                    ? "bg-gradient-to-br from-accent to-primary text-primary-foreground shadow-md scale-105"
                    : "bg-secondary hover:bg-secondary/80 text-foreground"
                }`}
              >
                {preset}%
              </button>
            ))}
          </div>

          {/* Slider */}
          <div className="px-2">
            <input
              type="range"
              min={0}
              max={100}
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
              className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>0%</span>
              <span>100%</span>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button variant="gradient" onClick={handleSave}>
              Save {type === "mood" ? "Mood" : "Motivation"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
