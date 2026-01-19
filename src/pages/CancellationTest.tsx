import { useState } from "react";
import { CancellationFlow } from "@/components/CancellationFlow";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function CancellationTest() {
  const [showFlow, setShowFlow] = useState(true);

  const handleConfirmCancel = () => {
    toast.error("Subscription cancelled");
    setShowFlow(false);
  };

  const handleAcceptOffer = () => {
    toast.success("30% discount applied!");
    setShowFlow(false);
  };

  const handlePause = (months: number) => {
    toast.success(`Subscription paused for ${months} month(s)`);
    setShowFlow(false);
  };

  return (
    <div className="min-h-screen gradient-bg flex flex-col items-center justify-center p-8">
      <div className="text-center mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">
          Cancellation Flow Test
        </h1>
        <p className="text-muted-foreground">
          This page lets you test the cancellation flow without being logged in.
        </p>
      </div>

      {!showFlow && (
        <Button
          onClick={() => setShowFlow(true)}
          className="btn-primary-gradient rounded-xl px-8 py-6 text-lg"
        >
          Open Cancellation Flow
        </Button>
      )}

      <CancellationFlow
        open={showFlow}
        onClose={() => setShowFlow(false)}
        onConfirmCancel={handleConfirmCancel}
        onAcceptOffer={handleAcceptOffer}
        onPauseSubscription={handlePause}
      />
    </div>
  );
}
