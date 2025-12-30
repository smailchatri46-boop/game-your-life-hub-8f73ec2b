import { useState } from "react";
import { AppleEmoji } from "@/components/AppleEmoji";
import { GlassCard } from "@/components/GlassCard";
import { Goal, useGoals } from "@/hooks/use-goals";
import { format } from "date-fns";
import { Trash2, Calendar, Pencil, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DeleteGoalCarousel } from "@/components/DeleteGoalCarousel";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface GoalCardProps {
  goal: Goal;
  linkedHabits?: { id: string; name: string; icon: string }[];
}

export function GoalCard({ goal, linkedHabits = [] }: GoalCardProps) {
  const { getGoalProgress, getGoalPace, deleteGoal, updateGoal } = useGoals();
  const { toast } = useToast();
  const [showDeleteCarousel, setShowDeleteCarousel] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState(goal.name);
  
  const progress = getGoalProgress(goal);
  const pace = getGoalPace(goal);

  const paceColor = {
    "Ahead of schedule": "text-green-600",
    "On track": "text-primary",
    "Falling behind": "text-orange-500",
    "Not started": "text-muted-foreground",
    "Ended": "text-muted-foreground",
    "Completed": "text-green-600",
  }[pace] || "text-muted-foreground";

  const handleSaveEdit = () => {
    if (editName.trim() && editName !== goal.name) {
      updateGoal.mutate({ id: goal.id, name: editName.trim() });
      toast({
        title: "Goal renamed",
        description: "Your goal has been updated successfully.",
      });
    }
    setShowEditModal(false);
  };

  const handleOpenEdit = () => {
    setEditName(goal.name);
    setShowEditModal(true);
  };

  return (
    <GlassCard className="p-5 hover:shadow-large transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <AppleEmoji emoji={goal.category_emoji} size="xl" />
          </div>
          <div>
            <h3 className="font-body text-lg font-semibold text-foreground line-clamp-1">
              {goal.name}
            </h3>
            <p className="text-xs text-muted-foreground">{goal.category}</p>
          </div>
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white border border-border shadow-lg z-50">
              <DropdownMenuItem onClick={handleOpenEdit} className="cursor-pointer">
                <Pencil className="w-4 h-4 mr-2" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setShowDeleteCarousel(true)} 
                className="cursor-pointer text-destructive focus:text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Edit name modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="sm:max-w-md bg-gradient-to-br from-[hsl(30,100%,98%)] to-[hsl(25,80%,95%)] border-0">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Rename Goal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <Input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Enter goal name..."
              className="h-12 bg-white/80 border-white/50 rounded-xl"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowEditModal(false)}
                className="bg-muted/30 border-muted/50 hover:bg-muted/50 rounded-xl"
              >
                Cancel
              </Button>
              <Button
                variant="gradient"
                onClick={handleSaveEdit}
                disabled={!editName.trim() || updateGoal.isPending}
                className="rounded-xl"
              >
                {updateGoal.isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation carousel */}
      {showDeleteCarousel && (
        <DeleteGoalCarousel
          goalName={goal.name}
          onClose={() => setShowDeleteCarousel(false)}
          onConfirmDelete={() => {
            deleteGoal.mutate(goal.id);
            setShowDeleteCarousel(false);
            toast({
              title: "Goal deleted successfully",
              description: "Your goal has been permanently removed.",
            });
          }}
        />
      )}

      {/* Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-2xl font-bold gradient-text">{progress}%</span>
          <span className={`text-xs font-medium ${paceColor}`}>{pace}</span>
        </div>
        <div className="h-3 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full progress-bar-orange rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>{goal.completed_count} completed</span>
          <span>{goal.target_count} target</span>
        </div>
      </div>

      {/* Date range */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
        <Calendar className="w-3.5 h-3.5" />
        <span>
          {format(new Date(goal.start_date), "MMM d, yyyy")} — {format(new Date(goal.end_date), "MMM d, yyyy")}
        </span>
      </div>

      {/* Linked habits */}
      {linkedHabits.length > 0 && (
        <div className="pt-3 border-t border-border/50">
          <p className="text-xs text-muted-foreground mb-2">Linked habits:</p>
          <div className="flex flex-wrap gap-2">
            {linkedHabits.slice(0, 3).map((habit) => (
              <div
                key={habit.id}
                className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-secondary/80 text-xs"
              >
                <AppleEmoji emoji={habit.icon} size="sm" />
                <span className="text-foreground">{habit.name}</span>
              </div>
            ))}
            {linkedHabits.length > 3 && (
              <span className="px-2 py-1 rounded-full bg-secondary/80 text-xs text-muted-foreground">
                +{linkedHabits.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}
    </GlassCard>
  );
}
