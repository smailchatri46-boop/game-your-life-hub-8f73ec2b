import { useState, useEffect } from "react";
import { OnboardingCard } from "../OnboardingCard";
import { Button } from "@/components/ui/button";
import { AppleEmoji } from "@/components/AppleEmoji";
import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import { AddHabitModal, NewHabit } from "@/components/AddHabitModal";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

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
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showAddModal, setShowAddModal] = useState(false);
  const [createdHabits, setCreatedHabits] = useState<CreatedHabit[]>([]);

  const totalSelected = createdHabits.length;
  const canProceed = totalSelected >= 2;

  // Notify parent when habits change
  useEffect(() => {
    onHabitsChange?.(createdHabits);
  }, [createdHabits, onHabitsChange]);

  // Save habit to database and update local state
  const handleSaveHabit = async (habit: NewHabit) => {
    if (!user) {
      toast.error("Please sign in to create habits");
      return;
    }

    try {
      // Save to database
      const { data, error } = await supabase.from("habits").insert({
        user_id: user.id,
        name: habit.name,
        icon: habit.icon,
        category: habit.category,
        category_color: habit.categoryColor,
        target: habit.target,
        importance: habit.importance,
      }).select().single();

      if (error) throw error;

      // Update local state with the real database ID
      const newHabit: CreatedHabit = {
        name: data.name,
        icon: data.icon,
        id: data.id,
      };
      setCreatedHabits(prev => [...prev, newHabit]);
      onAddCustomHabit(habit.name);

      // Invalidate habits query so goal creation step sees the new habits
      await queryClient.invalidateQueries({ queryKey: ["habits"] });
      
      toast.success("Habit created!");
    } catch (error) {
      console.error("Error creating habit:", error);
      toast.error("Failed to create habit");
    }
  };

  const handleRemoveHabit = async (habitId: string) => {
    const habit = createdHabits.find(h => h.id === habitId);
    if (habit) {
      try {
        // Delete from database
        const { error } = await supabase
          .from("habits")
          .delete()
          .eq("id", habitId);

        if (error) throw error;

        setCreatedHabits(prev => prev.filter(h => h.id !== habitId));
        onRemoveCustomHabit(habit.name);

        // Invalidate habits query
        await queryClient.invalidateQueries({ queryKey: ["habits"] });
      } catch (error) {
        console.error("Error deleting habit:", error);
        toast.error("Failed to remove habit");
      }
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
            {totalSelected} created{!canProceed && ` (need ${2 - totalSelected} more)`}
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
