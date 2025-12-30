import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AppleEmoji } from "@/components/AppleEmoji";
import { ChevronLeft, ChevronRight, Check, Plus } from "lucide-react";
import { useGoals, CreateGoalInput } from "@/hooks/use-goals";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { format, addMonths } from "date-fns";

interface AddGoalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

export function AddGoalModal({ open, onOpenChange }: AddGoalModalProps) {
  const { user } = useAuth();
  const { createGoal } = useGoals();
  const [step, setStep] = useState(1);
  const [isComplete, setIsComplete] = useState(false);

  // Form state
  const [goalName, setGoalName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<typeof CATEGORIES[0] | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<typeof TIME_PERIODS[0] | null>(null);
  const [selectedHabits, setSelectedHabits] = useState<string[]>([]);
  const [habitTargets, setHabitTargets] = useState<Record<string, number>>({});
  const [currentHabitIndex, setCurrentHabitIndex] = useState(0);
  const [currentHabitTarget, setCurrentHabitTarget] = useState("");

  // Demo habits for when user is not logged in
  // Note: "Drink Water" is marked as oncePerDay for testing the different wording
  const demoHabits = [
    { id: "demo-1", name: "Morning Meditation", icon: "🧘", target: 1, oncePerDay: false },
    { id: "demo-2", name: "Exercise", icon: "💪", target: 3, oncePerDay: false },
    { id: "demo-3", name: "Read 30 mins", icon: "📚", target: 1, oncePerDay: false },
    { id: "demo-4", name: "Drink Water", icon: "💧", target: 8, oncePerDay: true }, // TEST: once-per-day habit
    { id: "demo-5", name: "No Social Media", icon: "📵", target: 1, oncePerDay: false },
  ];

  // Fetch user's habits (only when logged in)
  const { data: fetchedHabits = [] } = useQuery({
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

  // Use fetched habits if logged in, otherwise use demo habits
  const habits = user ? fetchedHabits : demoHabits;

  // Get currently selected habit objects
  const selectedHabitObjects = habits.filter((h) => selectedHabits.includes(h.id));
  const currentHabit = selectedHabitObjects[currentHabitIndex];
  const isLastHabitTarget = currentHabitIndex >= selectedHabitObjects.length - 1;

  // Check if habit is once-per-day type (for testing, uses oncePerDay flag if present)
  const isOncePerDayHabit = (habit: any) => {
    return habit.oncePerDay === true;
  };

  const totalSteps = 5;

  const handleNext = () => {
    if (step === 5 && selectedHabitObjects.length > 0) {
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
      if (step === 4) {
        // Reset habit target state when entering step 5
        setCurrentHabitIndex(0);
        setCurrentHabitTarget("");
      }
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step === 5 && currentHabitIndex > 0) {
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
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleClose = () => {
    setStep(1);
    setIsComplete(false);
    setGoalName("");
    setSelectedCategory(null);
    setSelectedPeriod(null);
    setSelectedHabits([]);
    setHabitTargets({});
    setCurrentHabitIndex(0);
    setCurrentHabitTarget("");
    onOpenChange(false);
  };

  const canProceed = () => {
    switch (step) {
      case 1: return goalName.trim().length > 0;
      case 2: return selectedCategory !== null;
      case 3: return selectedPeriod !== null;
      case 4: return true; // Habits are optional
      case 5: 
        if (selectedHabitObjects.length === 0) return true;
        return parseInt(currentHabitTarget) > 0;
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

  if (isComplete) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-lg p-0 overflow-hidden bg-gradient-to-br from-[hsl(30,100%,98%)] to-[hsl(25,80%,95%)] border-0" hideCloseButton>
          <div className="p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <AppleEmoji emoji="🎯" size="3xl" />
            </div>
            <h2 className="font-display text-2xl font-semibold text-foreground mb-2">
              Goal Created!
            </h2>
            <p className="text-muted-foreground mb-6">
              Your journey to "{goalName}" has begun. Stay consistent and track your progress!
            </p>
            <Button onClick={handleClose} variant="gradient" size="lg" className="w-full">
              Let's Go
            </Button>
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

            {step === 2 && (
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

            {step === 3 && (
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

            {step === 4 && (
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
                    <p className="text-muted-foreground mb-4">No habits yet</p>
                    <Button variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Create habit first
                    </Button>
                  </div>
                )}
                <p className="text-xs text-muted-foreground text-center">
                  {selectedHabits.length} selected
                </p>
              </div>
            )}

            {step === 5 && (
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
            
            {/* Progress circle badge - centered between buttons on step 5 */}
            {step === 5 && selectedHabitObjects.length > 1 && (
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
                : step === totalSteps && (selectedHabitObjects.length === 0 || isLastHabitTarget)
                  ? "Create Goal" 
                  : "Next"}
              {!(step === totalSteps && (selectedHabitObjects.length === 0 || isLastHabitTarget)) && (
                <ChevronRight className="w-4 h-4 ml-1" />
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}