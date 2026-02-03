import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { AppleEmoji } from "@/components/AppleEmoji";
import { ChevronLeft, ChevronRight, Check, Plus } from "lucide-react";
import { useGoals, CreateGoalInput } from "@/hooks/use-goals";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { format, addMonths } from "date-fns";
import { AddHabitModal, NewHabit } from "@/components/AddHabitModal";

interface AddGoalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  skipCommitment?: boolean;
  onGoalCreated?: (goalName: string, emoji: string) => void;
}

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

const COMMITMENT_STATEMENTS = [
  "From today forward, I commit to working toward this goal.",
  "I understand progress is built through small daily actions.",
  "I will stay consistent even when motivation is low.",
  "This goal matters to me and I am taking it seriously.",
];

// Confetti particle component
function ConfettiParticle({ delay, left }: { delay: number; left: number }) {
  const colors = ["#F97316", "#FBBF24", "#34D399", "#60A5FA", "#A78BFA", "#F472B6"];
  const color = colors[Math.floor(Math.random() * colors.length)];
  
  return (
    <div
      className="absolute w-2 h-2 rounded-full animate-confetti"
      style={{
        left: `${left}%`,
        backgroundColor: color,
        animationDelay: `${delay}ms`,
        top: "-10px",
      }}
    />
  );
}

export function AddGoalModal({ open, onOpenChange, skipCommitment = false, onGoalCreated }: AddGoalModalProps) {
  const { user } = useAuth();
  const { createGoal } = useGoals();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(1);
  const [isComplete, setIsComplete] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showInlineHabitModal, setShowInlineHabitModal] = useState(false);

  // Form state
  const [goalName, setGoalName] = useState("");
  const [goalWhy, setGoalWhy] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<typeof CATEGORIES[0] | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<typeof TIME_PERIODS[0] | null>(null);
  const [selectedHabits, setSelectedHabits] = useState<string[]>([]);
  const [habitTargets, setHabitTargets] = useState<Record<string, number>>({});
  const [currentHabitIndex, setCurrentHabitIndex] = useState(0);
  const [currentHabitTarget, setCurrentHabitTarget] = useState("");
  
  // Commitment state
  const [commitmentChecks, setCommitmentChecks] = useState<boolean[]>([false, false, false, false]);
  const [signatureName, setSignatureName] = useState("");

  // Fetch user's habits (only when logged in)
  const { data: fetchedHabits = [], refetch: refetchHabits } = useQuery({
    queryKey: ["habits", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("habits")
        .select("*")
        .eq("user_id", user.id)
        .order("name");
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Only show real user habits - no demo habits
  const habits = fetchedHabits;

  // Get currently selected habit objects
  const selectedHabitObjects = habits.filter((h) => selectedHabits.includes(h.id));
  const currentHabit = selectedHabitObjects[currentHabitIndex];
  const isLastHabitTarget = currentHabitIndex >= selectedHabitObjects.length - 1;

  // Check if habit is once-per-day type (target === 1 means it's a daily checkmark habit)
  const isOncePerDayHabit = (habit: any) => {
    return habit.target === 1;
  };

  // Total steps: 1-Goal, 2-Why, 3-Category, 4-Period, 5-Habits, 6-Target, 7-Commitment
  // If skipCommitment is true, we skip step 7
  const totalSteps = skipCommitment ? 6 : 7;

  // Trigger confetti when complete
  useEffect(() => {
    if (isComplete) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isComplete]);

  const handleNext = () => {
    // Step 6 is now the target step (was step 7)
    if (step === 6 && selectedHabitObjects.length > 0) {
      // Save current habit target
      if (currentHabit && currentHabitTarget) {
        setHabitTargets((prev) => ({
          ...prev,
          [currentHabit.id]: parseInt(currentHabitTarget) || 0,
        }));
      }

      if (!isLastHabitTarget) {
        // Move to next habit target
        setCurrentHabitIndex((prev) => prev + 1);
        setCurrentHabitTarget("");
        return;
      }
    }

    if (step < totalSteps) {
      setStep(step + 1);
      if (step === 5) {
        // Reset habit target state when entering step 6 (target setting)
        setCurrentHabitIndex(0);
        setCurrentHabitTarget("");
      }
    } else {
      // Last step - submit the goal (step 6 if skipCommitment, step 7 otherwise)
      handleSubmit();
    }
  };

  const handleSkip = () => {
    // Only used for step 2 (Why) - skip without filling
    if (step === 2) {
      setStep(3);
    }
  };

  const handleBack = () => {
    // Step 6 is now the target step
    if (step === 6 && currentHabitIndex > 0) {
      // Go back to previous habit target
      setCurrentHabitIndex((prev) => prev - 1);
      const prevHabit = selectedHabitObjects[currentHabitIndex - 1];
      setCurrentHabitTarget(habitTargets[prevHabit?.id]?.toString() || "");
      return;
    }

    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    if (!selectedCategory || !selectedPeriod) return;

    // Save the last habit target before submitting
    const finalHabitTargets = { ...habitTargets };
    if (currentHabit && currentHabitTarget) {
      finalHabitTargets[currentHabit.id] = parseInt(currentHabitTarget) || 0;
    }

    const startDate = new Date();
    const endDate = addMonths(startDate, selectedPeriod.months);

    // Calculate total target from all habit targets
    const totalTarget = Object.values(finalHabitTargets).reduce((sum, val) => sum + val, 0) || 100;

    const input: CreateGoalInput = {
      name: goalName,
      category: selectedCategory.name,
      category_emoji: selectedCategory.emoji,
      start_date: format(startDate, "yyyy-MM-dd"),
      end_date: format(endDate, "yyyy-MM-dd"),
      target_count: totalTarget,
      habit_ids: selectedHabits,
    };

    try {
      await createGoal.mutateAsync(input);
      setIsComplete(true);
      // Notify parent about the created goal
      if (onGoalCreated && selectedCategory) {
        onGoalCreated(goalName, selectedCategory.emoji);
      }
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleClose = () => {
    setStep(1);
    setIsComplete(false);
    setGoalName("");
    setGoalWhy("");
    setSelectedCategory(null);
    setSelectedPeriod(null);
    setSelectedHabits([]);
    setHabitTargets({});
    setCurrentHabitIndex(0);
    setCurrentHabitTarget("");
    setCommitmentChecks([false, false, false, false]);
    setSignatureName("");
    setShowConfetti(false);
    onOpenChange(false);
  };

  const handleAddAnother = () => {
    setStep(1);
    setIsComplete(false);
    setGoalName("");
    setGoalWhy("");
    setSelectedCategory(null);
    setSelectedPeriod(null);
    setSelectedHabits([]);
    setHabitTargets({});
    setCurrentHabitIndex(0);
    setCurrentHabitTarget("");
    setCommitmentChecks([false, false, false, false]);
    setSignatureName("");
    setShowConfetti(false);
  };

  const canProceed = () => {
    switch (step) {
      case 1: return goalName.trim().length > 0;
      case 2: return goalWhy.trim().length > 0;
      case 3: return selectedCategory !== null;
      case 4: return selectedPeriod !== null;
      case 5: return true; // Habits are optional
      case 6: 
        if (selectedHabitObjects.length === 0) return true;
        return parseInt(currentHabitTarget) > 0;
      case 7: 
        // All checkboxes must be checked and name must be entered (only if not skipping)
        if (skipCommitment) return true;
        return commitmentChecks.every(c => c) && signatureName.trim().length > 0;
      default: return false;
    }
  };

  const toggleHabit = (habitId: string) => {
    setSelectedHabits((prev) =>
      prev.includes(habitId)
        ? prev.filter((id) => id !== habitId)
        : [...prev, habitId]
    );
  };

  const toggleCommitment = (index: number) => {
    setCommitmentChecks(prev => {
      const newChecks = [...prev];
      newChecks[index] = !newChecks[index];
      return newChecks;
    });
  };

  // Handle inline habit creation
  const handleInlineHabitSave = async (newHabit: NewHabit) => {
    if (!user) {
      toast.error("Please sign up to create habits");
      return;
    }

    try {
      // Save the habit to the database
      const { data, error } = await supabase.from("habits").insert({
        user_id: user.id,
        name: newHabit.name,
        icon: newHabit.icon,
        category: newHabit.category,
        category_color: newHabit.categoryColor,
        target: newHabit.target,
        importance: newHabit.importance,
      }).select().single();

      if (error) throw error;

      // Refetch the habits list to get the new habit
      await refetchHabits();

      // Also invalidate the dashboard habits query
      await queryClient.invalidateQueries({ queryKey: ["habits"] });

      // Auto-select the newly created habit
      if (data) {
        setSelectedHabits(prev => [...prev, data.id]);
      }

      toast.success("Habit created and selected!");
    } catch (error) {
      console.error("Error creating habit:", error);
      toast.error("Failed to create habit");
    }
  };

  if (isComplete) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-lg p-0 overflow-hidden bg-gradient-to-br from-[hsl(30,100%,98%)] to-[hsl(25,80%,95%)] border-0" hideCloseButton>
          <div className="p-8 text-center relative overflow-hidden">
            {/* Confetti animation */}
            {showConfetti && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {Array.from({ length: 30 }).map((_, i) => (
                  <ConfettiParticle 
                    key={i} 
                    delay={i * 100} 
                    left={Math.random() * 100} 
                  />
                ))}
              </div>
            )}
            
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center animate-scale-in">
              <AppleEmoji emoji="🎉" size="3xl" />
            </div>
            <h2 className="font-display text-2xl font-semibold text-foreground mb-3">
              Goal created! <AppleEmoji emoji="🎉" className="inline" />
            </h2>
            <p className="text-muted-foreground text-sm mb-6 leading-relaxed text-center max-w-sm mx-auto">
              You just took a meaningful step toward the life you want. Stay consistent, keep showing up, and your small actions will compound into real, lasting change.
            </p>
            <div className="space-y-3">
              {/* Onboarding mode: show only Finish button */}
              {skipCommitment ? (
                <Button onClick={handleClose} variant="gradient" size="lg" className="w-full">
                  Finish
                </Button>
              ) : (
                <>
                  <Button onClick={handleClose} variant="gradient" size="lg" className="w-full">
                    Go to my goals
                  </Button>
                  <Button onClick={handleAddAnother} variant="outline" size="lg" className="w-full text-muted-foreground bg-muted/30 border-muted/50 hover:bg-muted/50">
                    Add another goal
                  </Button>
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden bg-gradient-to-br from-[hsl(30,100%,98%)] to-[hsl(25,80%,95%)] border-0" hideCloseButton>
        <div className="p-6">
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
          <div className="min-h-[300px]">
            {/* Step 1: What is your goal? */}
            {step === 1 && (
              <div className="flex flex-col justify-center h-full min-h-[280px]">
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
              <div className="flex flex-col justify-center h-full min-h-[280px]">
                <div className="text-center mb-6">
                  <AppleEmoji emoji="💡" size="3xl" className="mb-4" />
                  <h2 className="font-display text-xl font-semibold text-foreground">
                    Why do you want to achieve this goal?
                  </h2>
                  <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                    Writing your "why" keeps you motivated when things get hard.
                    <br />
                    We also use this privately to personalize your AI guidance and remind you why you started.
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

            {/* Step 5: Which habits and tasks will help you? */}
            {step === 5 && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <AppleEmoji emoji="🔗" size="3xl" className="mb-4" />
                  <h2 className="font-display text-xl font-semibold text-foreground">
                    Which habits and tasks will help you?
                  </h2>
                </div>
                {habits.length > 0 ? (
                  <div className="space-y-2 max-h-[200px] overflow-y-auto">
                    {habits.map((habit) => (
                      <button
                        key={habit.id}
                        onClick={() => toggleHabit(habit.id)}
                        className={`w-full p-3 rounded-2xl flex items-center gap-3 transition-all duration-200 ${
                          selectedHabits.includes(habit.id)
                            ? "bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-primary/50"
                            : "bg-white/80 hover:bg-white border-2 border-transparent"
                        }`}
                      >
                        <AppleEmoji emoji={habit.icon} size="lg" />
                        <span className="text-sm font-medium text-foreground flex-1 text-left">
                          {habit.name}
                        </span>
                        {selectedHabits.includes(habit.id) && (
                          <Check className="w-5 h-5 text-primary" />
                        )}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <AppleEmoji emoji="📝" size="2xl" className="mb-3" />
                    <p className="text-muted-foreground mb-2">
                      {user ? "You haven't created any habits yet" : "Sign up to create and link habits"}
                    </p>
                    <p className="text-xs text-muted-foreground mb-4">
                      You can link habits to this goal later
                    </p>
                    {user && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setShowInlineHabitModal(true)}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Create a habit
                      </Button>
                    )}
                  </div>
                )}
                <p className="text-xs text-muted-foreground text-center">
                  {selectedHabits.length} selected
                </p>
              </div>
            )}

            {/* Step 6: Set your target */}
            {step === 6 && (
              <div className="space-y-6 relative">
                {selectedHabitObjects.length > 0 && currentHabit ? (
                  <>
                    <div className="text-center">
                      <AppleEmoji emoji={currentHabit.icon} size="3xl" className="mb-4" />
                      <h2 className="font-display text-xl font-semibold text-foreground">
                        Set target for "{currentHabit.name}"
                      </h2>
                      <p className="text-sm text-muted-foreground mt-2">
                        {isOncePerDayHabit(currentHabit)
                          ? "How many days do you need to do this?"
                          : "How many total times do you want to complete this over the selected goal period?"}
                      </p>
                    </div>
                    <div>
                      <Input
                        type="number"
                        value={currentHabitTarget}
                        onChange={(e) => setCurrentHabitTarget(e.target.value)}
                        placeholder={
                          isOncePerDayHabit(currentHabit)
                            ? `Once per day ${selectedPeriod ? `over the next ${selectedPeriod.months === 12 ? "1 year" : `${selectedPeriod.months} months`}` : ""}`
                            : `Total count — multiple times per day ${selectedPeriod ? `over the next ${selectedPeriod.months === 12 ? "1 year" : `${selectedPeriod.months} months`}` : ""}`
                        }
                        min={1}
                        className="h-14 text-lg text-center bg-white/80 border-white/50 rounded-2xl placeholder:text-muted-foreground/50 placeholder:text-sm"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-center">
                      <AppleEmoji emoji="🎯" size="3xl" className="mb-4" />
                      <h2 className="font-display text-xl font-semibold text-foreground">
                        Set your target
                      </h2>
                      <p className="text-sm text-muted-foreground mt-2">
                        How many total times do you want to complete this over the selected goal period?
                      </p>
                    </div>
                    <div>
                      <Input
                        type="number"
                        value={currentHabitTarget}
                        onChange={(e) => setCurrentHabitTarget(e.target.value)}
                        placeholder={`Total count — multiple times per day ${selectedPeriod ? `over the next ${selectedPeriod.months === 12 ? "1 year" : `${selectedPeriod.months} months`}` : ""}`}
                        min={1}
                        className="h-14 text-lg text-center bg-white/80 border-white/50 rounded-2xl placeholder:text-muted-foreground/50 placeholder:text-sm"
                      />
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Step 7: Sign your commitment */}
            {step === 7 && (
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <AppleEmoji emoji="🤝" size="3xl" className="mb-4" />
                  <h2 className="font-display text-xl font-semibold text-foreground">
                    Sign your commitment
                  </h2>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                    A written commitment increases your chance of success.
                    <br />
                    Read and confirm the statements below, then sign your name.
                  </p>
                </div>
                <div className="space-y-3">
                  {COMMITMENT_STATEMENTS.map((statement, index) => {
                    const isChecked = commitmentChecks[index];
                    return (
                      <button
                        key={index}
                        onClick={() => toggleCommitment(index)}
                        className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all ${
                          isChecked
                            ? "bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-primary/30"
                            : "bg-white/50 border-2 border-border/20 hover:bg-secondary/30 hover:border-border/30"
                        }`}
                      >
                        <div className={`flex-shrink-0 w-5 h-5 rounded-md flex items-center justify-center mt-0.5 ${
                          isChecked
                            ? "bg-gradient-to-r from-amber-400 to-orange-500"
                            : "border-2 border-muted-foreground/30"
                        }`}>
                          {isChecked && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <span className={`text-sm ${isChecked ? "text-foreground" : "text-muted-foreground"}`}>
                          {statement}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <div className="pt-2">
                  <label className="block text-sm font-medium text-foreground mb-2 text-center">
                    Sign with your name
                  </label>
                  <Input
                    value={signatureName}
                    onChange={(e) => setSignatureName(e.target.value)}
                    placeholder="Your name"
                    className="h-12 bg-white/50 border-border/30 rounded-xl text-center font-display text-lg italic"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/30">
            <Button
              variant="outline"
              onClick={step === 1 ? handleClose : handleBack}
              className="text-muted-foreground bg-muted/30 border-muted/50 hover:bg-muted/50 rounded-xl h-11"
            >
              {step > 1 && <ChevronLeft className="w-4 h-4 mr-1" />}
              {step === 1 ? "Cancel" : "Back"}
            </Button>
            
            {/* Add habit button - only on step 5 */}
            {step === 5 && (
              <Button
                variant="outline"
                onClick={() => setShowInlineHabitModal(true)}
                className="text-primary bg-primary/10 border-primary/30 hover:bg-primary/20 rounded-xl h-11"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Habit
              </Button>
            )}

            {/* Progress circle badge - centered between buttons on step 6 */}
            {step === 6 && selectedHabitObjects.length > 1 && (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-primary/30 flex items-center justify-center">
                <span className="text-xs font-semibold text-primary">
                  {currentHabitIndex + 1}/{selectedHabitObjects.length}
                </span>
              </div>
            )}

            
            <Button
              onClick={handleNext}
              disabled={!canProceed() || createGoal.isPending}
              variant="gradient"
              className="rounded-xl h-11"
            >
              {createGoal.isPending 
                ? "Creating..." 
                : step === totalSteps
                  ? (skipCommitment ? "Create Goal" : "Sign & Create")
                  : "Next"}
              {step !== totalSteps && (
                <ChevronRight className="w-4 h-4 ml-1" />
              )}
            </Button>
          </div>
        </div>
      </DialogContent>

      {/* Inline Add Habit Modal - skips guidance carousel and celebration */}
      <AddHabitModal
        open={showInlineHabitModal}
        onOpenChange={setShowInlineHabitModal}
        onSave={handleInlineHabitSave}
        skipGuidance
        skipCelebration
      />
    </Dialog>
  );
}
