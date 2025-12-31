import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AppleEmoji } from "@/components/AppleEmoji";
import { Pencil } from "lucide-react";
import { useState, useEffect } from "react";
import { format } from "date-fns";

interface DailyReflectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date: string; // formatted date string
  dateKey: string; // YYYY-MM-DD
  completionPercent: number;
  existingReflection?: string;
  reflectionCreatedAt?: string; // ISO timestamp when reflection was saved
  onSave: (dateKey: string, text: string) => void;
}

const PLACEHOLDER_PROMPTS = [
  "Why did today go well?",
  "What made today difficult?",
  "What did you learn today?",
  "What are you grateful for today?",
  "What would you do differently?",
];

// Map completion percent to emoji
const getCompletionEmoji = (percent: number): string => {
  if (percent >= 90) return "🤩";
  if (percent >= 70) return "😊";
  if (percent >= 50) return "🙂";
  if (percent >= 30) return "😐";
  return "😔";
};

export function DailyReflectionModal({
  open,
  onOpenChange,
  date,
  dateKey,
  completionPercent,
  existingReflection,
  reflectionCreatedAt,
  onSave,
}: DailyReflectionModalProps) {
  const [text, setText] = useState(existingReflection || "");
  const [isEditing, setIsEditing] = useState(!existingReflection);
  const [placeholderIndex] = useState(() => Math.floor(Math.random() * PLACEHOLDER_PROMPTS.length));
  const [savedAt, setSavedAt] = useState<Date | null>(reflectionCreatedAt ? new Date(reflectionCreatedAt) : null);

  useEffect(() => {
    if (open) {
      setText(existingReflection || "");
      // If there's an existing reflection, start in view mode; otherwise edit mode
      setIsEditing(!existingReflection);
      setSavedAt(reflectionCreatedAt ? new Date(reflectionCreatedAt) : null);
    }
  }, [open, existingReflection, reflectionCreatedAt]);

  const handleSave = () => {
    onSave(dateKey, text);
    setSavedAt(new Date());
    setIsEditing(false);
  };

  // Parse date for display in view mode
  const parsedDate = (() => {
    const [y, m, d] = dateKey.split('-').map(Number);
    return new Date(y, m - 1, d);
  })();

  const formattedViewDate = format(parsedDate, "MMMM d, yyyy");
  const formattedTime = savedAt ? format(savedAt, "h:mm a") : "";

  // View mode - showing existing reflection
  if (!isEditing && existingReflection) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md" hideCloseButton>
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[hsl(30,70%,96%)] to-[hsl(25,60%,92%)]">
            <div className="flex items-start gap-3">
              {/* Emoji */}
              <div className="flex-shrink-0">
                <AppleEmoji emoji={getCompletionEmoji(completionPercent)} size="2xl" />
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{formattedViewDate}</p>
                    {formattedTime && (
                      <p className="text-xs text-muted-foreground">{formattedTime}</p>
                    )}
                  </div>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-2 rounded-lg hover:bg-white/50 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                </div>
                
                <p className="mt-3 text-sm text-foreground whitespace-pre-wrap">{existingReflection}</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Edit mode - adding or editing reflection
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
            <Button variant="outline" onClick={() => {
              if (existingReflection) {
                setIsEditing(false);
                setText(existingReflection);
              } else {
                onOpenChange(false);
              }
            }}>
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
