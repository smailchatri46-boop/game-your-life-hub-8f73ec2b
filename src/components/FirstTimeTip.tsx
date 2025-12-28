import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface FirstTimeTipProps {
  open: boolean;
  title: string;
  message: string;
  onDismiss: (dontShowAgain: boolean) => void;
}

export function FirstTimeTip({ open, title, message, onDismiss }: FirstTimeTipProps) {
  const [dontShowAgain, setDontShowAgain] = useState(true);

  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 animate-fade-in"
        onClick={() => onDismiss(dontShowAgain)}
      />
      
      {/* Tip Card */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90vw] max-w-sm animate-scale-in">
        <div className="bg-card rounded-2xl shadow-large border border-border p-5">
          {/* Close button */}
          <button
            onClick={() => onDismiss(dontShowAgain)}
            className="absolute top-3 right-3 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Content */}
          <div className="pr-6">
            <h3 className="font-display text-lg font-semibold text-foreground mb-2">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {message}
            </p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-5 pt-4 border-t border-border">
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={dontShowAgain}
                onCheckedChange={(checked) => setDontShowAgain(checked === true)}
                className="h-4 w-4"
              />
              <span className="text-xs text-muted-foreground">Don't show again</span>
            </label>
            
            <Button
              variant="gradient"
              size="sm"
              onClick={() => onDismiss(dontShowAgain)}
              className="rounded-xl px-4"
            >
              Got it
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
