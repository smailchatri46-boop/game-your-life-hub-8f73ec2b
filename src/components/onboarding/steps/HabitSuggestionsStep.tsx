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
}

const HABIT_SUGGESTIONS: Record<string, { label: string; emoji: string }[]> = {
  Health: [
    { label: "Drink water", emoji: "💧" },
    { label: "Sleep on time", emoji: "😴" },
    { label: "Take vitamins", emoji: "💊" },
  ],
  Career: [
    { label: "Daily learning", emoji: "📖" },
    { label: "Network building", emoji: "🤝" },
    { label: "Update portfolio", emoji: "💼" },
  ],
  Finance: [
    { label: "Track expenses", emoji: "💰" },
    { label: "Budget review", emoji: "📊" },
    { label: "Save money", emoji: "🏦" },
  ],
  Fitness: [
    { label: "Exercise", emoji: "🏃" },
    { label: "Stretch routine", emoji: "🧘" },
    { label: "Walk 10k steps", emoji: "👟" },
  ],
  School: [
    { label: "Study session", emoji: "📚" },
    { label: "Review notes", emoji: "📝" },
    { label: "Complete homework", emoji: "✏️" },
  ],
  Relationships: [
    { label: "Call a friend", emoji: "📞" },
    { label: "Quality time", emoji: "❤️" },
    { label: "Express gratitude", emoji: "🙏" },
  ],
  "Mental wellness": [
    { label: "Meditate", emoji: "🧘" },
    { label: "Daily reflection", emoji: "📝" },
    { label: "No social media", emoji: "📵" },
  ],
  Other: [
    { label: "Read 30 minutes", emoji: "📖" },
    { label: "Practice hobby", emoji: "🎨" },
    { label: "Learn something new", emoji: "💡" },
  ],
};

const DEFAULT_HABITS = [
  { label: "Drink water", emoji: "💧" },
  { label: "Exercise", emoji: "🏃" },
  { label: "Read 30 minutes", emoji: "📖" },
  { label: "Meditate", emoji: "🧘" },
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
}: HabitSuggestionsStepProps) {
  const [customInput, setCustomInput] = useState("");

  // Get suggested habits based on focus areas
  const suggestedHabits = focusAreas.length > 0
    ? focusAreas.flatMap(area => HABIT_SUGGESTIONS[area] || [])
    : DEFAULT_HABITS;

  // Remove duplicates
  const uniqueHabits = suggestedHabits.filter(
    (habit, index, self) => index === self.findIndex(h => h.label === habit.label)
  );

  const totalSelected = selectedHabits.length + customHabits.length;
  const canProceed = totalSelected >= 2;

  const handleAddCustom = () => {
    if (customInput.trim()) {
      onAddCustomHabit(customInput.trim());
      setCustomInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddCustom();
    }
  };

  return (
    <OnboardingCard>
      <div className="text-center mb-6">
        <div className="flex justify-center mb-4">
          <AppleEmoji emoji="✅" size="3xl" />
        </div>
        <h2 className="text-xl font-bold font-display text-foreground mb-2">
          Choose habits and tasks to start with
        </h2>
        <p className="text-muted-foreground text-sm">
          Pick at least 2 to get started
        </p>
      </div>

      {/* Selected count */}
      <div className="text-center mb-4">
        <span className={`text-sm font-medium ${canProceed ? "text-primary" : "text-muted-foreground"}`}>
          {totalSelected} selected {canProceed ? "✓" : `(need ${2 - totalSelected} more)`}
        </span>
      </div>

      {/* Suggested habits */}
      <div className="flex flex-wrap gap-2 justify-center mb-4">
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
        <div className="flex flex-wrap gap-2 justify-center mb-4">
          {customHabits.map((habit) => (
            <div
              key={habit}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-amber-400 to-orange-500 text-white"
            >
              <AppleEmoji emoji="⭐" size="sm" />
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

      {/* Add custom input */}
      <div className="flex gap-2 mb-6">
        <Input
          placeholder="Add your own habit or task..."
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 h-10 bg-white/50 border-border/30 rounded-xl"
        />
        <Button
          onClick={handleAddCustom}
          variant="outline"
          size="icon"
          className="h-10 w-10 bg-white/50 border-border/30 rounded-xl hover:bg-secondary/50"
          disabled={!customInput.trim()}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex gap-3">
        <Button
          onClick={onBack}
          variant="outline"
          size="default"
          className="h-11 px-4 bg-white/50 border-border/30 hover:bg-secondary/50"
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
    </OnboardingCard>
  );
}
