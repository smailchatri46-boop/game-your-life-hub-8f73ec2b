import { useState, useEffect } from "react";
import { OnboardingCard } from "../OnboardingCard";
import { Button } from "@/components/ui/button";
import { AppleEmoji } from "@/components/AppleEmoji";
import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import { AddHabitModal, NewHabit } from "@/components/AddHabitModal";

export interface CreatedHabit {
  name: string;
  icon: string;
  id: string;
}

interface HabitSuggestionsStepProps {
  focusAreas: string[];
  selectedHabits: string[];
  customHabits: string[];
  onToggleHabit: (habit: string) => void;
  onAddCustomHabit: (habit: string) => void;
  onRemoveCustomHabit: (habit: string) => void;
  onNext: () => void;
  onBack: () => void;
  onHabitsChange?: (habits: CreatedHabit[]) => void;
}

export function HabitSuggestionsStep({
  customHabits,
  onAddCustomHabit,
  onRemoveCustomHabit,
  onNext,
  onBack,
  onHabitsChange,
}: HabitSuggestionsStepProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [createdHabits, setCreatedHabits] = useState<CreatedHabit[]>([]);

  const totalSelected = createdHabits.length;
  const canProceed = totalSelected >= 2;

  // Notify parent when habits change
  useEffect(() => {
    onHabitsChange?.(createdHabits);
  }, [createdHabits, onHabitsChange]);

  const handleSaveHabit = (habit: NewHabit) => {
    const newHabit: CreatedHabit = {
      name: habit.name,
      icon: habit.icon,
      id: `onboarding-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    setCreatedHabits(prev => [...prev, newHabit]);
    onAddCustomHabit(habit.name);
  };

  const handleRemoveHabit = (habitId: string) => {
    const habit = createdHabits.find(h => h.id === habitId);
    if (habit) {
      setCreatedHabits(prev => prev.filter(h => h.id !== habitId));
      onRemoveCustomHabit(habit.name);
    }
  };

  return (
    <>
      <OnboardingCard>
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <AppleEmoji emoji="✅" size="3xl" />
          </div>
          <h2 className="text-xl font-bold font-display text-foreground mb-2">
            Choose habits or tasks to start with
          </h2>
          <p className="text-muted-foreground text-sm">
            Create at least 2 to get started
          </p>
        </div>

        {/* Selected count */}
        <div className="text-center mb-4">
          <span className={`text-sm font-medium ${canProceed ? "text-primary" : "text-muted-foreground"}`}>
            {totalSelected} created {canProceed ? "✓" : `(need ${2 - totalSelected} more)`}
          </span>
        </div>

        {/* Created habits list */}
        {createdHabits.length > 0 && (
          <div className="space-y-2 mb-6">
            {createdHabits.map((habit) => (
              <div
                key={habit.id}
                className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 border border-border/20"
              >
                <div className="flex items-center gap-3">
                  <AppleEmoji emoji={habit.icon} size="lg" />
                  <span className="font-medium text-foreground">{habit.name}</span>
                </div>
                <button
                  onClick={() => handleRemoveHabit(habit.id)}
                  className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add habit button */}
        <Button
          onClick={() => setShowAddModal(true)}
          variant="outline"
          className="w-full h-12 mb-6 bg-white/50 border-border/30 hover:bg-secondary/50 rounded-xl"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add habit or task
        </Button>

        <div className="flex justify-between items-center">
          <Button
            onClick={onBack}
            variant="outline"
            size="default"
            className="h-11 px-5 border-border/30 hover:bg-secondary/50"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
          <Button
            onClick={onNext}
            variant="gradient"
            size="default"
            className="h-11 px-6"
            disabled={!canProceed}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </OnboardingCard>

      <AddHabitModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onSave={handleSaveHabit}
        skipGuidance
      />
    </>
  );
}
