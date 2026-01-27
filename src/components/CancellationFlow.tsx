import { useState } from "react";
import { X, Heart, ThumbsUp, Gift, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type CancellationStep = 
  | "feedback"
  | "liked"
  | "offer"
  | "confirm";

interface CancellationFlowProps {
  open: boolean;
  onClose: () => void;
  onConfirmCancel: () => void;
  onAcceptOffer?: () => void;
  isYearlyPlan?: boolean;
}

const FEEDBACK_REASONS = [
  { id: "A", label: "Missing features I need" },
  { id: "B", label: "Doesn't fit my budget" },
  { id: "C", label: "Not seeing results" },
  { id: "D", label: "Too difficult to use" },
  { id: "E", label: "Other" },
];

const LIKED_FEATURES = [
  { id: "A", label: "Habits & Tasks Tracking" },
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
  isYearlyPlan = false,
}: CancellationFlowProps) {
  const [currentStep, setCurrentStep] = useState<CancellationStep>("feedback");
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [selectedLiked, setSelectedLiked] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [likedText, setLikedText] = useState("");

  if (!open) return null;

  const handleNext = () => {
    switch (currentStep) {
      case "feedback":
        setCurrentStep("liked");
        break;
      case "liked":
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
      case "offer":
        setCurrentStep("liked");
        break;
      case "confirm":
        setCurrentStep("offer");
        break;
    }
  };

  const handleAcceptOffer = () => {
    onAcceptOffer?.();
    onClose();
  };

  const getHeaderConfig = () => {
    switch (currentStep) {
      case "feedback":
        return { icon: Heart, title: "Your Feedback" };
      case "liked":
        return { icon: ThumbsUp, title: "What did you like?" };
      case "offer":
        return { icon: Gift, title: "Special Offer" };
      case "confirm":
        return { icon: AlertTriangle, title: "Confirm Cancellation" };
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
      <div className="relative w-full max-w-md bg-card/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden animate-scale-in border border-border/30">
        {/* Header with gradient */}
        <div 
          className="px-6 py-5 flex items-center justify-between"
          style={{
            background: currentStep === 'confirm' 
              ? 'hsl(var(--destructive) / 0.1)' 
              : 'linear-gradient(135deg, hsl(25 95% 60% / 0.15), hsl(35 100% 65% / 0.1))',
          }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-2xl flex items-center justify-center"
              style={{
                background: currentStep === 'confirm'
                  ? 'hsl(var(--destructive) / 0.2)'
                  : 'linear-gradient(135deg, hsl(25 95% 60%), hsl(35 100% 65%))',
              }}
            >
              <HeaderIcon className={`w-5 h-5 ${currentStep === 'confirm' ? 'text-destructive' : 'text-white'}`} />
            </div>
            <h2 className={`font-display text-xl font-semibold ${currentStep === 'confirm' ? 'text-destructive' : 'text-foreground'}`}>
              {headerConfig.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/5 transition-colors"
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
          
          {currentStep === "offer" && (
            <OfferStep
              onAccept={handleAcceptOffer}
              onDecline={() => setCurrentStep("confirm")}
              onBack={() => setCurrentStep("liked")}
              isYearlyPlan={isYearlyPlan}
            />
          )}
          
          {currentStep === "confirm" && (
            <ConfirmStep />
          )}
        </div>

        {/* Footer */}
        {currentStep !== "offer" && (
          <div className="px-6 pb-6 flex justify-between items-center">
            {currentStep !== "feedback" ? (
              <button
                onClick={handleBack}
                className="text-muted-foreground hover:text-foreground transition-colors font-medium text-sm"
              >
                Back
              </button>
            ) : (
              <div />
            )}
            
            {currentStep === "confirm" ? (
              <Button
                variant="outline"
                className="border-destructive text-destructive hover:bg-destructive/10 rounded-xl"
                onClick={onConfirmCancel}
              >
                Yes, Cancel Subscription
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className="rounded-xl px-6 text-white font-medium"
                style={{
                  background: 'linear-gradient(135deg, hsl(25 95% 60%), hsl(35 100% 65%), hsl(25 95% 55%))',
                }}
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
        <p className="text-muted-foreground text-sm">
          What's prompting your decision to leave?
        </p>
      </div>

      <div className="space-y-2.5">
        {FEEDBACK_REASONS.map((reason) => (
          <button
            key={reason.id}
            onClick={() => setSelectedReason(reason.id)}
            className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${
              selectedReason === reason.id
                ? "border-primary bg-primary/5"
                : "border-border/50 hover:border-primary/30 bg-secondary/30"
            }`}
          >
            <span 
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold text-white shrink-0"
              style={{
                background: selectedReason === reason.id 
                  ? 'linear-gradient(135deg, hsl(25 95% 60%), hsl(35 100% 65%))'
                  : 'hsl(var(--muted-foreground) / 0.5)',
              }}
            >
              {reason.id}
            </span>
            <span className="text-foreground font-medium text-left">{reason.label}</span>
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
            className="resize-none border-2 border-border/50 focus:border-border/50 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-xl bg-secondary/30"
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
        <p className="text-muted-foreground text-sm">
          Pick one area you valued most.
        </p>
      </div>

      <div className="space-y-2.5">
        {LIKED_FEATURES.map((feature) => (
          <button
            key={feature.id}
            onClick={() => setSelectedLiked(feature.id)}
            className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${
              selectedLiked === feature.id
                ? "border-primary bg-primary/5"
                : "border-border/50 hover:border-primary/30 bg-secondary/30"
            }`}
          >
            <span 
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold text-white shrink-0"
              style={{
                background: selectedLiked === feature.id 
                  ? 'linear-gradient(135deg, hsl(25 95% 60%), hsl(35 100% 65%))'
                  : 'hsl(var(--muted-foreground) / 0.5)',
              }}
            >
              {feature.id}
            </span>
            <span className="text-foreground font-medium text-left">{feature.label}</span>
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
            className="resize-none border-2 border-border/50 focus:border-border/50 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-xl bg-secondary/30"
            rows={3}
          />
        </div>
      )}
    </div>
  );
}

function OfferStep({
  onAccept,
  onDecline,
  onBack,
  isYearlyPlan = false,
}: {
  onAccept: () => void;
  onDecline: () => void;
  onBack: () => void;
  isYearlyPlan?: boolean;
}) {
  const discountPercent = isYearlyPlan ? "50%" : "50%";
  const discountDuration = isYearlyPlan ? "for 1 year" : "for 3 months";
  const discountDescription = isYearlyPlan 
    ? "This exclusive discount will be applied to your next yearly billing cycle."
    : "This exclusive discount will be applied to your next 3 billing cycles.";

  return (
    <div className="space-y-5">
      <div className="text-center">
        <h3 className="font-display text-xl font-semibold text-foreground mb-2">
          Wait! We have something special for you.
        </h3>
        <p className="text-muted-foreground text-sm">
          We'd hate to see you go! Here's an exclusive offer just for you.
        </p>
      </div>

      <div 
        className="rounded-3xl p-6 text-center"
        style={{
          background: 'linear-gradient(135deg, hsl(25 95% 60% / 0.15), hsl(35 100% 65% / 0.1))',
        }}
      >
        <p className="text-sm font-medium text-muted-foreground mb-1">Limited Time Offer</p>
        <h4 className="font-display text-4xl font-bold mb-1 text-foreground">
          {discountPercent} off
        </h4>
        <p className="text-foreground font-semibold text-lg">{discountDuration}</p>

        <Button
          onClick={onAccept}
          className="w-full mt-5 rounded-xl py-6 text-base font-semibold text-white shadow-lg"
          style={{
            background: 'linear-gradient(135deg, hsl(25 95% 60%), hsl(35 100% 65%), hsl(25 95% 55%))',
          }}
        >
          Accept This Offer
        </Button>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        {discountDescription}
      </p>

      <div className="flex justify-between items-center pt-2">
        <button
          onClick={onBack}
          className="text-muted-foreground hover:text-foreground transition-colors font-medium text-sm"
        >
          Back
        </button>
        <button
          onClick={onDecline}
          className="text-muted-foreground hover:text-foreground hover:font-medium transition-all text-sm"
        >
          No thanks, cancel anyway
        </button>
      </div>
    </div>
  );
}

function ConfirmStep() {
  return (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <h3 className="font-display text-xl font-semibold text-foreground mb-2">
          Are you sure you want to cancel?
        </h3>
      </div>

      <div className="bg-destructive/10 rounded-2xl p-4 border border-destructive/20">
        <p className="text-foreground text-sm">
          Your subscription will remain active until the end of your current billing period. After that, you'll lose access to:
        </p>
      </div>

      <ul className="space-y-2.5">
        <li className="flex items-center gap-3 text-sm text-muted-foreground">
          <span className="w-2 h-2 rounded-full bg-destructive shrink-0" />
          AI Buddy coaching & insights
        </li>
        <li className="flex items-center gap-3 text-sm text-muted-foreground">
          <span className="w-2 h-2 rounded-full bg-destructive shrink-0" />
          Unlimited habits, goals & tasks
        </li>
        <li className="flex items-center gap-3 text-sm text-muted-foreground">
          <span className="w-2 h-2 rounded-full bg-destructive shrink-0" />
          Deep analytics & mood tracking
        </li>
        <li className="flex items-center gap-3 text-sm text-muted-foreground">
          <span className="w-2 h-2 rounded-full bg-destructive shrink-0" />
          Priority support
        </li>
      </ul>
    </div>
  );
}
