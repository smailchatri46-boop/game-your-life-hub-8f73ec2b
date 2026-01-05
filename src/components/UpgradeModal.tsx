import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { usePolarCheckout } from "@/hooks/use-polar-checkout";

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
}

export function UpgradeModal({ open, onClose }: UpgradeModalProps) {
  const { openCheckout, isLoading } = usePolarCheckout({ 
    theme: "dark",
    onSuccess: onClose 
  });

  const handleUpgrade = (period: "monthly" | "yearly") => {
    openCheckout("pro", period);
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

        <div className="py-4 space-y-3">
          <Button
            onClick={() => handleUpgrade("yearly")}
            disabled={isLoading}
            className="w-full rounded-full text-primary-foreground font-medium shadow-[0_2px_8px_hsl(var(--primary)/0.3)]"
            style={{ background: 'linear-gradient(135deg, hsl(38 100% 70%) 0%, hsl(24 95% 53%) 100%)' }}
          >
            $7/month (billed yearly) — Best Value
          </Button>
          <Button
            onClick={() => handleUpgrade("monthly")}
            disabled={isLoading}
            variant="outline"
            className="w-full rounded-full"
          >
            $14/month (billed monthly)
          </Button>
        </div>

        <div className="flex flex-col gap-3 pt-2">
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
