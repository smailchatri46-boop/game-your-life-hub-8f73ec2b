import { useState } from "react";
import { CancellationFlow } from "@/components/CancellationFlow";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function CancellationTest() {
  const [showFlow, setShowFlow] = useState(true);
  const [testPlan, setTestPlan] = useState<"monthly" | "yearly">("monthly");

  const handleConfirmCancel = () => {
    toast.success("Subscription cancelled (test)");
    setShowFlow(false);
  };

  const handleAcceptOffer = () => {
    toast.success("50% discount applied for 3 months (test)");
    setShowFlow(false);
  };

  return (
    <div className="min-h-screen gradient-bg p-8">
      <div className="max-w-md mx-auto space-y-6">
        <h1 className="font-display text-2xl font-bold text-foreground">
          Cancellation Flow Test
        </h1>
        
        <div className="flex gap-3">
          <Button
            variant={testPlan === "monthly" ? "default" : "outline"}
            onClick={() => setTestPlan("monthly")}
            className="rounded-full"
          >
            Monthly Plan
          </Button>
          <Button
            variant={testPlan === "yearly" ? "default" : "outline"}
            onClick={() => setTestPlan("yearly")}
            className="rounded-full"
          >
            Yearly Plan
          </Button>
        </div>
        
        <p className="text-sm text-muted-foreground">
          Testing as: <strong>{testPlan}</strong> plan
          {testPlan === "monthly" && " (shows discount offer)"}
          {testPlan === "yearly" && " (skips to confirm)"}
        </p>

        <Button 
          onClick={() => setShowFlow(true)}
          className="w-full"
          style={{ background: 'linear-gradient(135deg, hsl(25 95% 60%), hsl(35 100% 65%), hsl(25 95% 55%))' }}
        >
          Open Cancellation Flow
        </Button>
      </div>

      <CancellationFlow
        open={showFlow}
        onClose={() => setShowFlow(false)}
        onConfirmCancel={handleConfirmCancel}
        onAcceptOffer={handleAcceptOffer}
        isYearlyPlan={testPlan === "yearly"}
      />
    </div>
  );
}
