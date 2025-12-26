import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";

interface DailyReflectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date: string; // formatted date string
  dateKey: string; // YYYY-MM-DD
  completionPercent: number;
  existingReflection?: string;
  onSave: (dateKey: string, text: string) => void;
}

const PLACEHOLDER_PROMPTS = [
  "Why did today go well?",
  "What made today difficult?",
  "What did you learn today?",
  "What are you grateful for today?",
  "What would you do differently?",
];

export function DailyReflectionModal({
  open,
  onOpenChange,
  date,
  dateKey,
  completionPercent,
  existingReflection,
  onSave,
}: DailyReflectionModalProps) {
  const [text, setText] = useState(existingReflection || "");
  const [placeholderIndex] = useState(() => Math.floor(Math.random() * PLACEHOLDER_PROMPTS.length));

  useEffect(() => {
    if (open) {
      setText(existingReflection || "");
    }
  }, [open, existingReflection]);

  const handleSave = () => {
    onSave(dateKey, text);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Daily Reflection</DialogTitle>
          <div className="flex items-center gap-3 pt-2">
            <span className="text-sm text-muted-foreground">{date}</span>
            {completionPercent >= 0 && (
              <span className="text-sm font-medium">
                <span className="gradient-text">{completionPercent}%</span>
                <span className="text-muted-foreground ml-1">completed</span>
              </span>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={PLACEHOLDER_PROMPTS[placeholderIndex]}
            className="min-h-[150px] resize-none"
          />

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button variant="gradient" onClick={handleSave}>
              Save Reflection
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
