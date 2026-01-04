import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AppleEmoji } from "@/components/AppleEmoji";

interface ReviewRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDismiss: () => void;
}

export function ReviewRequestModal({ open, onOpenChange, onDismiss }: ReviewRequestModalProps) {
  const handleReview = () => {
    // Open app store or review link - placeholder for now
    window.open("https://www.trustpilot.com", "_blank");
    onDismiss();
    onOpenChange(false);
  };

  const handleMaybeLater = () => {
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
            You have explored Neyler and we hope you are enjoying it! Your feedback helps us improve and create a better experience for everyone.
          </p>

          {/* Additional message */}
          <div className="bg-white/60 rounded-2xl p-4 mb-6">
            <p className="text-foreground/80 text-sm leading-relaxed">
              <AppleEmoji emoji="🙏" className="inline mr-1" />
              A quick review means the world to us and helps others discover Neyler too.
            </p>
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={handleReview} 
              variant="gradient" 
              size="lg" 
              className="w-full"
            >
              <AppleEmoji emoji="⭐" className="mr-2" />
              Leave a Review
            </Button>
            <Button 
              onClick={handleMaybeLater} 
              variant="outline" 
              size="lg" 
              className="w-full text-muted-foreground bg-muted/30 border-muted/50 hover:bg-muted/50"
            >
              Maybe Later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
