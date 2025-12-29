import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
}

export function UpgradeModal({ open, onClose }: UpgradeModalProps) {
  const handleUpgrade = () => {
    // TODO: Integrate with Polar.sh payment flow
    window.open("https://polar.sh", "_blank");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md rounded-3xl border-border/20 bg-card/95 backdrop-blur-xl">
        <DialogHeader className="text-center space-y-3">
          <DialogTitle className="font-display text-xl font-semibold text-foreground">
            Unlock AI Buddy
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            You can chat with AI Buddy only on the Pro plan.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 text-center">
          <p className="text-foreground font-medium text-lg">
            $14 per month
          </p>
          <p className="text-muted-foreground text-sm mt-1">
            or $7 per month billed yearly
          </p>
        </div>

        <div className="flex flex-col gap-3 pt-2">
          <Button
            onClick={handleUpgrade}
            className="w-full rounded-full text-primary-foreground font-medium shadow-[0_2px_8px_hsl(var(--primary)/0.3)]"
            style={{ background: 'linear-gradient(135deg, hsl(38 100% 70%) 0%, hsl(24 95% 53%) 100%)' }}
          >
            Upgrade Now
          </Button>
          <Button
            variant="ghost"
            onClick={onClose}
            className="w-full rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
