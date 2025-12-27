import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AppleEmoji } from "@/components/AppleEmoji";
import { ChevronRight, ChevronLeft, Check, Sparkles } from "lucide-react";

interface OnboardingQuestionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Question {
  id: string;
  emoji: string;
  title: string;
  placeholder: string;
}

const questions: Question[] = [
  {
    id: "main_goals",
    emoji: "🎯",
    title: "What are your main goals?",
    placeholder: "e.g., Build better habits, improve my health, achieve work-life balance, grow my career...",
  },
  {
    id: "working_toward",
    emoji: "🚀",
    title: "What are you working toward right now?",
    placeholder: "e.g., Launching my business, getting fit, learning a new skill, building stronger relationships...",
  },
  {
    id: "life_areas",
    emoji: "💫",
    title: "What areas of your life do you want to improve?",
    placeholder: "e.g., Health & fitness, career, relationships, mental health, finances, personal growth...",
  },
];

export function OnboardingQuestionsModal({ open, onOpenChange }: OnboardingQuestionsModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isComplete, setIsComplete] = useState(false);
  
  const currentQuestion = questions[currentStep];
  const isLastStep = currentStep === questions.length - 1;
  const canProceed = answers[currentQuestion?.id]?.trim().length > 0;
  
  const handleNext = () => {
    if (isLastStep) {
      // Save answers to localStorage
      localStorage.setItem("locked_onboarding_answers", JSON.stringify(answers));
      setIsComplete(true);
      
      // Dispatch event to mark goals as complete in checklist
      window.dispatchEvent(new CustomEvent("onboarding_goals_completed"));
      
      // Close after animation
      setTimeout(() => {
        onOpenChange(false);
        setIsComplete(false);
        setCurrentStep(0);
      }, 2000);
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };
  
  const handleBack = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };
  
  const handleAnswerChange = (value: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value,
    }));
  };
  
  const handleClose = () => {
    onOpenChange(false);
    // Reset after close animation
    setTimeout(() => {
      setCurrentStep(0);
      setIsComplete(false);
    }, 300);
  };
  
  if (isComplete) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-6 animate-pulse">
              <Check className="w-10 h-10 text-primary-foreground" />
            </div>
            <h2 className="font-display text-2xl font-bold mb-2">You're all set!</h2>
            <p className="text-muted-foreground">
              Your goals have been saved. Let's start your journey!
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <AppleEmoji emoji={currentQuestion?.emoji || "🎯"} size="2xl" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                Question {currentStep + 1} of {questions.length}
              </p>
              <DialogTitle className="font-display text-xl">
                {currentQuestion?.title}
              </DialogTitle>
            </div>
          </div>
          <DialogDescription className="sr-only">
            Share your goals and aspirations
          </DialogDescription>
        </DialogHeader>
        
        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-4">
          {questions.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentStep 
                  ? 'w-8 bg-primary' 
                  : index < currentStep 
                    ? 'w-2 bg-primary/50' 
                    : 'w-2 bg-muted'
              }`}
            />
          ))}
        </div>
        
        {/* Answer input */}
        <Textarea
          value={answers[currentQuestion?.id] || ""}
          onChange={(e) => handleAnswerChange(e.target.value)}
          placeholder={currentQuestion?.placeholder}
          className="min-h-[120px] resize-none"
        />
        
        {/* Navigation buttons */}
        <div className="flex gap-3 mt-4">
          {currentStep > 0 && (
            <Button variant="outline" onClick={handleBack} className="flex-1">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          )}
          <Button 
            variant="gradient" 
            onClick={handleNext} 
            disabled={!canProceed}
            className="flex-1"
          >
            {isLastStep ? (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Complete
              </>
            ) : (
              <>
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
        
        {/* Skip option */}
        <button 
          onClick={handleClose}
          className="text-center text-sm text-muted-foreground hover:text-foreground transition-colors mt-2"
        >
          I'll do this later
        </button>
      </DialogContent>
    </Dialog>
  );
}
