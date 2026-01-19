import { useState } from "react";
import { X, Heart, ThumbsUp, Gift, AlertTriangle, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type CancellationStep = 
  | "feedback"
  | "liked"
  | "pause"
  | "offer"
  | "confirm";

interface CancellationFlowProps {
  open: boolean;
  onClose: () => void;
  onConfirmCancel: () => void;
  onAcceptOffer?: () => void;
  onPauseSubscription?: (months: number) => void;
}

const FEEDBACK_REASONS = [
  { id: "A", label: "Missing features I need" },
  { id: "B", label: "Doesn't fit my budget" },
  { id: "C", label: "Not seeing results" },
  { id: "D", label: "Too difficult to use" },
  { id: "E", label: "Other" },
];

const LIKED_FEATURES = [
  { id: "A", label: "Habits <span style='font-family: Inter'>&amp;</span> Tasks Tracking" },
  { id: "B", label: "AI Buddy Coaching" },
  { id: "C", label: "Goal Setting" },
  { id: "D", label: "Analytics Dashboard" },
  { id: "E", label: "Daily Journal" },
];

export function CancellationFlow({
  open,
  onClose,
  onConfirmCancel,
  onAcceptOffer,
  onPauseSubscription,
}: CancellationFlowProps) {
  const [currentStep, setCurrentStep] = useState<CancellationStep>("feedback");
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [selectedLiked, setSelectedLiked] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [likedText, setLikedText] = useState("");
  const [pauseMonths, setPauseMonths] = useState(1);

  if (!open) return null;

  const handleNext = () => {
    switch (currentStep) {
      case "feedback":
        setCurrentStep("liked");
        break;
      case "liked":
        setCurrentStep("pause");
        break;
      case "pause":
        setCurrentStep("offer");
        break;
      case "offer":
        setCurrentStep("confirm");
        break;
      case "confirm":
        onConfirmCancel();
        break;
    }
  };

  const handleBack = () => {
    switch (currentStep) {
      case "liked":
        setCurrentStep("feedback");
        break;
      case "pause":
        setCurrentStep("liked");
        break;
      case "offer":
        setCurrentStep("pause");
        break;
      case "confirm":
        setCurrentStep("offer");
        break;
    }
  };

  const handlePause = () => {
    onPauseSubscription?.(pauseMonths);
    onClose();
  };

  const handleAcceptOffer = () => {
    onAcceptOffer?.();
    onClose();
  };

  const getHeaderConfig = () => {
    switch (currentStep) {
      case "feedback":
        return { icon: Heart, title: "Your Feedback", bgColor: "bg-secondary" };
      case "liked":
        return { icon: ThumbsUp, title: "What did you like?", bgColor: "bg-secondary" };
      case "pause":
        return { icon: Pause, title: "Subscription Pause", bgColor: "bg-secondary" };
      case "offer":
        return { icon: Gift, title: "Special Offer", bgColor: "bg-secondary" };
      case "confirm":
        return { icon: AlertTriangle, title: "Confirm Cancellation", bgColor: "bg-destructive/10" };
    }
  };

  const headerConfig = getHeaderConfig();
  const HeaderIcon = headerConfig.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md bg-card rounded-3xl shadow-large overflow-hidden animate-scale-in">
        {/* Header */}
        <div className={`${headerConfig.bgColor} px-6 py-4 flex items-center justify-between`}>
          <div className="flex items-center gap-2">
            <HeaderIcon className={`w-5 h-5 ${currentStep === 'confirm' ? 'text-destructive' : 'text-primary'}`} />
            <h2 className={`font-display text-lg font-semibold ${currentStep === 'confirm' ? 'text-destructive' : 'text-foreground'}`}>
              {headerConfig.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-black/5 transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {currentStep === "feedback" && (
            <FeedbackStep
              selectedReason={selectedReason}
              setSelectedReason={setSelectedReason}
              feedbackText={feedbackText}
              setFeedbackText={setFeedbackText}
            />
          )}
          
          {currentStep === "liked" && (
            <LikedStep
              selectedLiked={selectedLiked}
              setSelectedLiked={setSelectedLiked}
              likedText={likedText}
              setLikedText={setLikedText}
            />
          )}
          
          {currentStep === "pause" && (
            <PauseStep
              pauseMonths={pauseMonths}
              setPauseMonths={setPauseMonths}
              onPause={handlePause}
              onDecline={() => setCurrentStep("offer")}
            />
          )}
          
          {currentStep === "offer" && (
            <OfferStep
              onAccept={handleAcceptOffer}
              onDecline={() => setCurrentStep("confirm")}
            />
          )}
          
          {currentStep === "confirm" && (
            <ConfirmStep />
          )}
        </div>

        {/* Footer */}
        {currentStep !== "pause" && currentStep !== "offer" && (
          <div className="px-6 pb-6 flex justify-between items-center">
            {currentStep !== "feedback" ? (
              <button
                onClick={handleBack}
                className="text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                Back
              </button>
            ) : (
              <div />
            )}
            
            {currentStep === "confirm" ? (
              <Button
                variant="outline"
                className="border-destructive text-destructive hover:bg-destructive/10"
                onClick={onConfirmCancel}
              >
                Yes, Cancel Subscription
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className="btn-primary-gradient rounded-xl px-6"
                disabled={
                  (currentStep === "feedback" && !selectedReason) ||
                  (currentStep === "liked" && !selectedLiked)
                }
              >
                Next
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Step Components
function FeedbackStep({
  selectedReason,
  setSelectedReason,
  feedbackText,
  setFeedbackText,
}: {
  selectedReason: string | null;
  setSelectedReason: (reason: string | null) => void;
  feedbackText: string;
  setFeedbackText: (text: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="font-display text-xl font-semibold text-foreground mb-2">
          We're sad to see you leave.
        </h3>
        <p className="text-muted-foreground">
          What's prompting your decision to leave?
        </p>
      </div>

      <div className="space-y-3">
        {FEEDBACK_REASONS.map((reason) => (
          <button
            key={reason.id}
            onClick={() => setSelectedReason(reason.id)}
            className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${
              selectedReason === reason.id
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/30"
            }`}
          >
            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold text-primary-foreground ${
              selectedReason === reason.id ? "bg-primary" : "bg-primary/70"
            }`}>
              {reason.id}
            </span>
            <span className="text-foreground font-medium">{reason.label}</span>
          </button>
        ))}
      </div>

      {selectedReason && (
        <div className="mt-4 animate-fade-in">
          <label className="block text-sm font-medium text-foreground mb-2">
            What could we have done better?
          </label>
          <Textarea
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            placeholder="We read every answer..."
            className="resize-none border-2 border-primary/30 focus:border-primary rounded-xl"
            rows={3}
          />
        </div>
      )}
    </div>
  );
}

function LikedStep({
  selectedLiked,
  setSelectedLiked,
  likedText,
  setLikedText,
}: {
  selectedLiked: string | null;
  setSelectedLiked: (liked: string | null) => void;
  likedText: string;
  setLikedText: (text: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="font-display text-xl font-semibold text-foreground mb-2">
          What did you like about Neyler?
        </h3>
        <p className="text-muted-foreground">
          Pick one area you valued most.
        </p>
      </div>

      <div className="space-y-3">
        {LIKED_FEATURES.map((feature) => (
          <button
            key={feature.id}
            onClick={() => setSelectedLiked(feature.id)}
            className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${
              selectedLiked === feature.id
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/30"
            }`}
          >
            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold text-primary-foreground ${
              selectedLiked === feature.id ? "bg-primary" : "bg-primary/70"
            }`}>
              {feature.id}
            </span>
            <span 
              className="text-foreground font-medium"
              dangerouslySetInnerHTML={{ __html: feature.label }}
            />
          </button>
        ))}
      </div>

      {selectedLiked && (
        <div className="mt-4 animate-fade-in">
          <label className="block text-sm font-medium text-foreground mb-2">
            What exactly did you like about it?
          </label>
          <Textarea
            value={likedText}
            onChange={(e) => setLikedText(e.target.value)}
            placeholder="We read every answer..."
            className="resize-none border-2 border-primary/30 focus:border-primary rounded-xl"
            rows={3}
          />
        </div>
      )}
    </div>
  );
}

function PauseStep({
  pauseMonths,
  setPauseMonths,
  onPause,
  onDecline,
}: {
  pauseMonths: number;
  setPauseMonths: (months: number) => void;
  onPause: () => void;
  onDecline: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="font-display text-xl font-semibold text-foreground mb-2">
          Need a break? We've got you covered.
        </h3>
        <p className="text-muted-foreground">
          We totally get it—sometimes life gets busy. Take a breather, and we'll be here when you're ready to dive back in.
        </p>
      </div>

      <p className="text-center text-muted-foreground">
        In the meantime, check out our{" "}
        <a href="/tutorials" className="text-primary underline hover:text-primary-dark">
          Tutorials
        </a>{" "}
        to discover new ways Neyler can work for you.
      </p>

      <div className="mt-4">
        <select
          value={pauseMonths}
          onChange={(e) => setPauseMonths(Number(e.target.value))}
          className="w-full p-4 rounded-2xl border-2 border-border bg-card text-foreground font-medium focus:border-primary outline-none"
        >
          <option value={1}>1 month</option>
          <option value={2}>2 months</option>
          <option value={3}>3 months</option>
        </select>
      </div>

      <Button
        onClick={onPause}
        className="w-full btn-primary-gradient rounded-xl py-6 text-base font-semibold"
      >
        Pause Subscription
      </Button>

      <p className="text-sm text-muted-foreground text-center">
        Your subscription will renew on{" "}
        <span className="font-semibold">
          {new Date(Date.now() + pauseMonths * 30 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </span>
        .
      </p>

      <div className="flex justify-between items-center pt-2">
        <button
          onClick={() => {}}
          className="text-muted-foreground hover:text-foreground transition-colors font-medium"
        >
          Go Back
        </button>
        <Button
          variant="outline"
          onClick={onDecline}
          className="rounded-xl"
        >
          Decline Offer
        </Button>
      </div>
    </div>
  );
}

function OfferStep({
  onAccept,
  onDecline,
}: {
  onAccept: () => void;
  onDecline: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="font-display text-xl font-semibold text-foreground mb-2">
          Wait! We have something special for you.
        </h3>
        <p className="text-muted-foreground">
          We'd hate to see you go! To make it easier to stay, here's an exclusive offer just for you.
        </p>
      </div>

      <div className="bg-secondary/50 rounded-3xl p-6 text-center">
        <h4 className="font-display text-3xl font-bold text-primary mb-1">
          30% off your subscription
        </h4>
        <p className="text-muted-foreground font-medium">For 3 months</p>

        <Button
          onClick={onAccept}
          className="w-full mt-6 btn-primary-gradient rounded-xl py-6 text-base font-semibold"
        >
          Accept This Offer
        </Button>
      </div>

      <p className="text-sm text-muted-foreground text-center">
        This exclusive discount will be applied to your next billing cycles.
      </p>

      <div className="flex justify-between items-center pt-2">
        <button
          onClick={() => {}}
          className="text-muted-foreground hover:text-foreground transition-colors font-medium"
        >
          Back
        </button>
        <Button
          variant="outline"
          onClick={onDecline}
          className="rounded-xl"
        >
          Cancel Anyway
        </Button>
      </div>
    </div>
  );
}

function ConfirmStep() {
  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="font-display text-xl font-semibold text-foreground mb-2">
          Are you sure you want to cancel?
        </h3>
      </div>

      <div className="bg-muted rounded-2xl p-4">
        <p className="text-muted-foreground text-sm">
          Your subscription will remain active until the end of your current billing period. After that, you'll lose access to all premium features.
        </p>
      </div>

      <div className="space-y-3 mt-4">
        <p className="font-semibold text-foreground">If you cancel:</p>
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <X className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
            <p className="text-muted-foreground text-sm">
              You will lose access to all premium features at the end of your billing period.
            </p>
          </div>
          <div className="flex items-start gap-2">
            <X className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
            <p className="text-muted-foreground text-sm">
              Your special offer price, if any, will be lost.
            </p>
          </div>
          <div className="flex items-start gap-2">
            <X className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
            <p className="text-muted-foreground text-sm">
              You will be downgraded to the free version with limited features.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CancellationFlow;
