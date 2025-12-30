import { useState } from "react";
import { OnboardingCard } from "../OnboardingCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PillOption } from "../PillOption";
import { AppleEmoji } from "@/components/AppleEmoji";
import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react";

interface HabitSuggestionsStepProps {
  focusAreas: string[];
  selectedHabits: string[];
  customHabits: string[];
  onToggleHabit: (habit: string) => void;
  onAddCustomHabit: (habit: string) => void;
  onRemoveCustomHabit: (habit: string) => void;
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
}

const HABIT_SUGGESTIONS: Record<string, { label: string; emoji: string }[]> = {
  Health: [
    { label: "Drink 8 glasses of water", emoji: "💧" },
    { label: "Sleep 8 hours", emoji: "😴" },
    { label: "Take vitamins", emoji: "💊" },
    { label: "Eat vegetables", emoji: "🥗" },
  ],
  Career: [
    { label: "Deep work session", emoji: "💼" },
    { label: "Learn new skill", emoji: "📖" },
    { label: "Network with someone", emoji: "🤝" },
    { label: "Review goals", emoji: "🎯" },
  ],
  School: [
    { label: "Study session", emoji: "📚" },
    { label: "Review notes", emoji: "📝" },
    { label: "Complete assignment", emoji: "✅" },
    { label: "Read 30 minutes", emoji: "📖" },
  ],
  Finance: [
    { label: "Track expenses", emoji: "💰" },
    { label: "Budget review", emoji: "📊" },
    { label: "No impulse purchases", emoji: "🛑" },
    { label: "Save money", emoji: "🏦" },
  ],
  Relationships: [
    { label: "Call a friend", emoji: "📞" },
    { label: "Quality time", emoji: "❤️" },
    { label: "Send gratitude message", emoji: "💌" },
    { label: "Active listening", emoji: "👂" },
  ],
  "Mental wellness": [
    { label: "Meditate", emoji: "🧘" },
    { label: "Daily reflection", emoji: "📝" },
    { label: "Gratitude journal", emoji: "🙏" },
    { label: "Digital detox", emoji: "📵" },
  ],
  Fitness: [
    { label: "Exercise 30 minutes", emoji: "💪" },
    { label: "10,000 steps", emoji: "🚶" },
    { label: "Stretch routine", emoji: "🤸" },
    { label: "No junk food", emoji: "🍎" },
  ],
  Other: [
    { label: "Read 30 minutes", emoji: "📖" },
    { label: "Learn something new", emoji: "🧠" },
    { label: "Creative time", emoji: "🎨" },
    { label: "Organize space", emoji: "🏠" },
  ],
};

// Default habits shown when no focus areas selected
const DEFAULT_HABITS = [
  { label: "Drink water", emoji: "💧" },
  { label: "Exercise", emoji: "💪" },
  { label: "Read 30 minutes", emoji: "📖" },
  { label: "No social media", emoji: "📵" },
  { label: "Sleep on time", emoji: "😴" },
  { label: "Daily reflection", emoji: "📝" },
];

export function HabitSuggestionsStep({
  focusAreas,
  selectedHabits,
  customHabits,
  onToggleHabit,
  onAddCustomHabit,
  onRemoveCustomHabit,
  onNext,
  onBack,
  onSkip,
}: HabitSuggestionsStepProps) {
  const [customInput, setCustomInput] = useState("");

  // Generate suggested habits based on focus areas
  const suggestedHabits = focusAreas.length > 0
    ? focusAreas.flatMap(area => HABIT_SUGGESTIONS[area] || [])
    : DEFAULT_HABITS;

  // Remove duplicates
  const uniqueHabits = suggestedHabits.filter(
    (habit, index, self) => self.findIndex(h => h.label === habit.label) === index
  );

  const totalSelected = selectedHabits.length + customHabits.length;
  const canProceed = totalSelected >= 3;

  const handleAddCustom = () => {
    if (customInput.trim()) {
      onAddCustomHabit(customInput.trim());
      setCustomInput("");
    }
  };

  return (
    <OnboardingCard>
      <div className="text-center mb-5">
        <div className="flex justify-center mb-4">
          <AppleEmoji emoji="📋" size="3xl" />
        </div>
        <h2 className="text-xl font-bold font-display text-foreground mb-2">
          Choose your starter habits
        </h2>
        <p className="text-muted-foreground text-sm">
          Select at least 3 to get started
        </p>
      </div>

      {/* Selected count */}
      <div className="flex justify-center mb-4">
        <span className={`text-sm font-medium px-3 py-1 rounded-full ${
          canProceed 
            ? "bg-green-100 text-green-700" 
            : "bg-orange-100 text-orange-700"
        }`}>
          {totalSelected} / 3 minimum selected
        </span>
      </div>

      {/* Suggested habits */}
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {uniqueHabits.map((habit) => (
          <PillOption
            key={habit.label}
            label={habit.label}
            emoji={habit.emoji}
            selected={selectedHabits.includes(habit.label)}
            onClick={() => onToggleHabit(habit.label)}
          />
        ))}
      </div>

      {/* Custom habits */}
      {customHabits.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {customHabits.map((habit) => (
            <div
              key={habit}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-amber-400 to-orange-500 text-white"
            >
              <AppleEmoji emoji="✨" size="sm" />
              {habit}
              <button
                onClick={() => onRemoveCustomHabit(habit)}
                className="ml-1 hover:bg-white/20 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add custom habit */}
      <div className="flex gap-2 mb-6">
        <Input
          placeholder="Add your own habit..."
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleAddCustom()}
          className="flex-1 h-10 bg-white/50 border-border/30 rounded-xl"
        />
        <Button
          onClick={handleAddCustom}
          variant="outline"
          size="icon"
          className="h-10 w-10 bg-white/50 border-border/30 rounded-xl"
          disabled={!customInput.trim()}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex gap-3">
        <Button
          onClick={onBack}
          variant="outline"
          className="flex-1 h-11 bg-white/50 border-border/30"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
        <Button
          onClick={onNext}
          variant="gradient"
          className="flex-1 h-11"
          disabled={!canProceed}
        >
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      <button
        onClick={onSkip}
        className="mt-4 w-full text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
      >
        Skip onboarding
      </button>
    </OnboardingCard>
  );
}
