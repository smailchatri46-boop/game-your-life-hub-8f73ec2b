import { useState } from "react";
import { OnboardingCard } from "../OnboardingCard";
import { Button } from "@/components/ui/button";
import { AppleEmoji } from "@/components/AppleEmoji";
import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import { AddGoalModal } from "@/components/AddGoalModal";
import type { CreatedHabit } from "./HabitSuggestionsStep";

interface CreatedGoal {
  name: string;
  emoji: string;
}

interface GoalCreationStepProps {
  createdHabits: CreatedHabit[];
  onNext: () => void;
  onBack: () => void;
  onGoalDataChange?: (data: any) => void;
}

export interface GoalData {
  goalName: string;
  goalWhy: string;
  category: { name: string; emoji: string } | null;
  timePeriod: { label: string; months: number } | null;
  linkedHabitIds: string[];
}

export function GoalCreationStep({
  createdHabits,
  onNext,
  onBack,
  onGoalDataChange,
}: GoalCreationStepProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [createdGoals, setCreatedGoals] = useState<CreatedGoal[]>([]);

  const hasGoals = createdGoals.length > 0;

  const handleGoalCreated = (goalName: string, emoji: string) => {
    setCreatedGoals(prev => [...prev, { name: goalName, emoji }]);
  };

  const handleRemoveGoal = (goalName: string) => {
    setCreatedGoals(prev => prev.filter(g => g.name !== goalName));
  };

  return (
    <>
      <OnboardingCard>
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <AppleEmoji emoji="🎯" size="3xl" />
          </div>
          <h2 className="text-xl font-bold font-display text-foreground mb-2">
            Add a goal to start with
          </h2>
          <p className="text-muted-foreground text-sm">
            Optional — you can skip this step
          </p>
        </div>

        {/* Created goals list */}
        {createdGoals.length > 0 && (
          <div className="space-y-2 mb-6">
            {createdGoals.map((goal) => (
              <div
                key={goal.name}
                className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 border border-border/20"
              >
                <div className="flex items-center gap-3">
                  <AppleEmoji emoji={goal.emoji} size="lg" />
                  <span className="font-medium text-foreground">{goal.name}</span>
                </div>
                <button
                  onClick={() => handleRemoveGoal(goal.name)}
                  className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add goal button */}
        <Button
          onClick={() => setShowAddModal(true)}
          variant="outline"
          className="w-full h-12 mb-6 bg-white/50 border-border/30 hover:bg-secondary/50 rounded-xl"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add goal
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
          >
            {hasGoals ? "Next" : "Skip"}
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </OnboardingCard>

      <AddGoalModal
        open={showAddModal}
        onOpenChange={(open) => {
          if (!open) {
            // Modal was closed - check if a goal was created
            // The modal handles its own state, so we don't need to do anything special here
          }
          setShowAddModal(open);
        }}
      />
    </>
  );
}
