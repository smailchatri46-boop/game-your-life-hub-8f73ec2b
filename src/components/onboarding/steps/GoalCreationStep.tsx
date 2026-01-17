import { useState } from "react";
import { OnboardingCard } from "../OnboardingCard";
import { Button } from "@/components/ui/button";
import { AppleEmoji } from "@/components/AppleEmoji";
import { ChevronRight, Plus, X } from "lucide-react";
import { AddGoalModal } from "@/components/AddGoalModal";

interface CreatedGoal {
  name: string;
  emoji: string;
}

interface GoalCreationStepProps {
  onNext: () => void;
}

export function GoalCreationStep({
  onNext,
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
    <div className="flex flex-col min-h-[calc(100vh-120px)] justify-between">
      {/* Centered card */}
      <div className="flex-1 flex items-center justify-center px-4">
        <OnboardingCard className="max-w-lg w-full min-h-[340px] p-10">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-5">
              <AppleEmoji emoji="🎯" size="3xl" />
            </div>
            <h2 className="text-xl font-bold font-display text-foreground mb-3">
              Add a goal to start with
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Add one goal now, then link it to habits or tasks so you can track real progress.
            </p>
          </div>

          {/* Created goals list */}
          {createdGoals.length > 0 && (
            <div className="space-y-3 mb-8">
              {createdGoals.map((goal) => (
                <div
                  key={goal.name}
                  className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 border border-border/20"
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
            className="w-full h-14 bg-white/50 border-border/30 hover:bg-secondary/50 rounded-xl text-base"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add goal
          </Button>
        </OnboardingCard>
      </div>

      {/* Fixed bottom CTA */}
      <div className="px-4 pb-8 pt-4">
        <div className="max-w-lg mx-auto">
          <Button
            onClick={onNext}
            disabled={!hasGoals}
            variant="gradient"
            size="lg"
            className="w-full h-14 text-base"
          >
            Continue
            <ChevronRight className="w-5 h-5 ml-1" />
          </Button>
        </div>
      </div>

      <AddGoalModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        skipCommitment
        onGoalCreated={handleGoalCreated}
      />
    </div>
  );
}
