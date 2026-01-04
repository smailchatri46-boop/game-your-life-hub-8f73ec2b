import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AppleEmoji } from "@/components/AppleEmoji";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface ReviewRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDismiss: () => void;
}

export function ReviewRequestModal({ open, onOpenChange, onDismiss }: ReviewRequestModalProps) {
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!feedback.trim()) {
      toast.error("Please write some feedback before submitting.");
      return;
    }

    setIsSubmitting(true);
    
    // TODO: Send feedback to backend
    // For now, simulate a delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log("Feedback submitted:", feedback);
    
    setIsSubmitting(false);
    setFeedback("");
    
    toast.success("Thank you for your feedback!", {
      description: "Your input helps us build a better product.",
      style: {
        background: 'hsl(35 40% 92%)',
        color: 'hsl(var(--foreground))',
        border: 'none',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      },
      descriptionClassName: 'text-muted-foreground',
    });
    
    onDismiss();
    onOpenChange(false);
  };

  const handleMaybeLater = () => {
    setFeedback("");
    onDismiss();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-md p-0 overflow-hidden bg-gradient-to-br from-[hsl(30,100%,98%)] to-[hsl(25,80%,95%)] border-0" 
        hideCloseButton
      >
        <div className="p-8 text-center">
          {/* Emoji header */}
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <AppleEmoji emoji="💬" size="3xl" />
          </div>

          {/* Title */}
          <h2 className="font-display text-xl font-semibold text-foreground mb-3">
            Help us build something great <AppleEmoji emoji="✨" className="inline" />
          </h2>

          {/* Description */}
          <p className="text-muted-foreground text-sm mb-6 leading-relaxed max-w-sm mx-auto">
            We would love to hear from you! Share your suggestions, what you like, or what you think is missing.
          </p>

          {/* Feedback textarea */}
          <div className="mb-6">
            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="What features would you like to see? What do you love about Neyler? Any suggestions..."
              className="min-h-[120px] bg-white/60 border-border/30 focus:border-primary/50 resize-none text-sm"
              maxLength={1000}
            />
            <p className="text-right text-xs text-muted-foreground mt-1">
              {feedback.length}/1000
            </p>
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={handleSubmit} 
              variant="gradient" 
              size="lg" 
              className="w-full"
              disabled={isSubmitting || !feedback.trim()}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <AppleEmoji emoji="📨" className="mr-2" />
                  Send Feedback
                </>
              )}
            </Button>
            <Button 
              onClick={handleMaybeLater} 
              variant="outline" 
              size="lg" 
              className="w-full text-muted-foreground bg-muted/30 border-muted/50 hover:bg-muted/50"
              disabled={isSubmitting}
            >
              Maybe Later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
