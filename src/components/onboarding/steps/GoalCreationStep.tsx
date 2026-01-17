import { useState } from "react";
import { OnboardingCard } from "../OnboardingCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AppleEmoji } from "@/components/AppleEmoji";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import type { CreatedHabit } from "./HabitSuggestionsStep";

const CATEGORIES = [
  { name: "Personal Growth", emoji: "🧠" },
  { name: "Fitness & Health", emoji: "💪" },
  { name: "Learning", emoji: "📚" },
  { name: "Career", emoji: "💼" },
  { name: "Finance", emoji: "💰" },
  { name: "Relationships", emoji: "💞" },
  { name: "Mental Wellness", emoji: "🧘" },
];

const TIME_PERIODS = [
  { label: "3 Months", months: 3 },
  { label: "6 Months", months: 6 },
  { label: "9 Months", months: 9 },
  { label: "1 Year", months: 12 },
];

interface GoalCreationStepProps {
  createdHabits: CreatedHabit[];
  onNext: () => void;
  onBack: () => void;
  onGoalDataChange?: (data: GoalData) => void;
}

export interface GoalData {
  goalName: string;
  goalWhy: string;
  category: typeof CATEGORIES[0] | null;
  timePeriod: typeof TIME_PERIODS[0] | null;
  linkedHabitIds: string[];
}

export function GoalCreationStep({
  createdHabits,
  onNext,
  onBack,
  onGoalDataChange,
}: GoalCreationStepProps) {
  const [step, setStep] = useState(1);
  const [goalName, setGoalName] = useState("");
  const [goalWhy, setGoalWhy] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<typeof CATEGORIES[0] | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<typeof TIME_PERIODS[0] | null>(null);
  const [linkedHabits, setLinkedHabits] = useState<string[]>([]);

  const totalSteps = 5;

  const canProceed = () => {
    switch (step) {
      case 1: return goalName.trim().length > 0;
      case 2: return goalWhy.trim().length > 0;
      case 3: return selectedCategory !== null;
      case 4: return selectedPeriod !== null;
      case 5: return true; // Linking habits is optional
      default: return false;
    }
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Save goal data and proceed to commitment
      onGoalDataChange?.({
        goalName,
        goalWhy,
        category: selectedCategory,
        timePeriod: selectedPeriod,
        linkedHabitIds: linkedHabits,
      });
      onNext();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      onBack();
    }
  };

  const toggleHabitLink = (habitId: string) => {
    setLinkedHabits(prev =>
      prev.includes(habitId)
        ? prev.filter(id => id !== habitId)
        : [...prev, habitId]
    );
  };

  return (
    <OnboardingCard>
      {/* Progress dots */}
      <div className="flex justify-center gap-2 mb-6">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all duration-300 ${
              i + 1 === step
                ? "w-8 bg-gradient-to-r from-primary to-accent"
                : i + 1 < step
                ? "w-2 bg-primary/60"
                : "w-2 bg-muted-foreground/20"
            }`}
          />
        ))}
      </div>

      {/* Step Content */}
      <div className="min-h-[280px]">
        {/* Step 1: What is your goal? */}
        {step === 1 && (
          <div className="flex flex-col justify-center h-full">
            <div className="text-center mb-6">
              <AppleEmoji emoji="✨" size="3xl" className="mb-4" />
              <h2 className="font-display text-xl font-semibold text-foreground">
                What is your goal?
              </h2>
            </div>
            <div>
              <Input
                value={goalName}
                onChange={(e) => setGoalName(e.target.value)}
                placeholder="Enter your goal..."
                className="h-14 text-lg bg-white/80 border-white/50 rounded-2xl"
              />
              <p className="text-sm text-muted-foreground mt-3 text-center">
                Examples: Make 10k, Learn Spanish, Read 20 books
              </p>
            </div>
          </div>
        )}

        {/* Step 2: Why do you want to achieve this? */}
        {step === 2 && (
          <div className="flex flex-col justify-center h-full">
            <div className="text-center mb-6">
              <AppleEmoji emoji="💡" size="3xl" className="mb-4" />
              <h2 className="font-display text-xl font-semibold text-foreground">
                Why do you want to achieve this goal?
              </h2>
              <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                Writing your "why" keeps you motivated when things get hard.
              </p>
            </div>
            <div>
              <Textarea
                value={goalWhy}
                onChange={(e) => setGoalWhy(e.target.value)}
                placeholder="Write your 'why' here…"
                className="min-h-[100px] text-base bg-white/80 border-white/50 rounded-2xl resize-none"
              />
            </div>
          </div>
        )}

        {/* Step 3: What type of goal is this? */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <AppleEmoji emoji="🎨" size="3xl" className="mb-4" />
              <h2 className="font-display text-xl font-semibold text-foreground">
                What type of goal is this?
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat)}
                  className={`p-4 rounded-2xl text-left transition-all duration-200 ${
                    selectedCategory?.name === cat.name
                      ? "bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-primary/50"
                      : "bg-white/80 hover:bg-white border-2 border-transparent"
                  }`}
                >
                  <AppleEmoji emoji={cat.emoji} size="xl" className="mb-2" />
                  <p className="text-sm font-medium text-foreground">{cat.name}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: When do you want to achieve this? */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <AppleEmoji emoji="📅" size="3xl" className="mb-4" />
              <h2 className="font-display text-xl font-semibold text-foreground">
                When do you want to achieve this?
              </h2>
              <p className="text-sm text-muted-foreground mt-2">
                Goals must be at least 3 months long
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {TIME_PERIODS.map((period) => (
                <button
                  key={period.label}
                  onClick={() => setSelectedPeriod(period)}
                  className={`p-4 rounded-2xl text-center transition-all duration-200 ${
                    selectedPeriod?.label === period.label
                      ? "bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-primary/50"
                      : "bg-white/80 hover:bg-white border-2 border-transparent"
                  }`}
                >
                  <p className="text-lg font-semibold text-foreground">{period.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {period.months === 3 || period.months === 6 ? "Quarterly" : "Yearly"}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Link habits to your goal */}
        {step === 5 && (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <AppleEmoji emoji="🔗" size="3xl" className="mb-4" />
              <h2 className="font-display text-xl font-semibold text-foreground">
                Link your habits to this goal
              </h2>
              <p className="text-sm text-muted-foreground mt-2">
                These are the habits you just created
              </p>
            </div>
            {createdHabits.length > 0 ? (
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {createdHabits.map((habit) => (
                  <button
                    key={habit.id}
                    onClick={() => toggleHabitLink(habit.id)}
                    className={`w-full p-3 rounded-2xl flex items-center gap-3 transition-all duration-200 ${
                      linkedHabits.includes(habit.id)
                        ? "bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-primary/50"
                        : "bg-white/80 hover:bg-white border-2 border-transparent"
                    }`}
                  >
                    <AppleEmoji emoji={habit.icon} size="lg" />
                    <span className="text-sm font-medium text-foreground flex-1 text-left">
                      {habit.name}
                    </span>
                    {linkedHabits.includes(habit.id) && (
                      <Check className="w-5 h-5 text-primary" />
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">No habits to link</p>
              </div>
            )}
            <p className="text-xs text-muted-foreground text-center">
              {linkedHabits.length} linked
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-6">
        <Button
          onClick={handleBack}
          variant="outline"
          size="default"
          className="h-11 px-5 border-border/30 hover:bg-secondary/50"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
        <Button
          onClick={handleNext}
          variant="gradient"
          size="default"
          className="h-11 px-6"
          disabled={!canProceed()}
        >
          {step === totalSteps ? "Continue" : "Next"}
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </OnboardingCard>
  );
}
