import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { AppleEmoji } from "@/components/AppleEmoji";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CATEGORIES = [
  { value: "work", label: "Work", color: "#3B82F6", emoji: "💼" },
  { value: "health", label: "Health", color: "#22C55E", emoji: "💚" },
  { value: "fitness", label: "Fitness", color: "#F59E0B", emoji: "💪" },
  { value: "learning", label: "Learning", color: "#8B5CF6", emoji: "📚" },
  { value: "growth", label: "Personal Growth", color: "#EC4899", emoji: "🧠" },
  { value: "spiritual", label: "Spiritual", color: "#06B6D4", emoji: "🧘" },
  { value: "other", label: "Other", color: "#6B7280", emoji: "✨" },
];

// Helper to get lighter background color from category color
const getCategoryBgColor = (color: string) => {
  return `${color}20`; // 20% opacity
};

const getCategoryBorderColor = (color: string) => {
  return `${color}50`; // 50% opacity
};

// Curated unique Apple emoji set - 21 emojis for 3 rows of 7
const EMOJI_OPTIONS = [
  "📖", "💪", "💼", "🏃", "💧", "🧘", "✍️",
  "🎯", "🥗", "😴", "🚶", "📝", "🎨", "🎵",
  "💡", "🧠", "🌸", "🌟", "🔥", "🍎", "🌙",
];

const WEEKDAYS = [
  { value: 0, label: "S" },
  { value: 1, label: "M" },
  { value: 2, label: "T" },
  { value: 3, label: "W" },
  { value: 4, label: "T" },
  { value: 5, label: "F" },
  { value: 6, label: "S" },
];

// Guidance slides shown before habit creation
const GUIDANCE_SLIDES = [
  {
    emoji: "🌱",
    title: "Start small, stay consistent",
    message: "Over 90% of people who set hard goals give up in the first week. Make your habits easy and achievable so you can build momentum.",
  },
  {
    emoji: "📈",
    title: "Make progress feel natural",
    message: "Don't jump to the final goal immediately. Use progressive build-up habits and gradually increase difficulty so new routines stay comfortable.",
  },
  {
    emoji: "📝",
    title: "Need only a quick to-do?",
    message: "Not everything needs to become a habit. If you just want a one-time task for today or tomorrow, use the To-Do List in the Overview tab.",
  },
  {
    emoji: "🔥",
    title: "Tiny steps beat burnout",
    message: "Small goals done daily are more powerful than big goals abandoned. Stick to simple habits and let compound progress work for you.",
  },
];

export interface ProgressiveBuildUp {
  enabled: boolean;
  startGoal: number;
  targetGoal: number;
  rampDuration: "1-week" | "2-weeks" | "1-month" | "custom";
  customWeeks: number;
  startDate: string;
}

export interface NewHabit {
  id: string;
  name: string;
  icon: string;
  category: string;
  categoryColor: string;
  habitType: "boolean" | "numeric";
  target: number;
  frequency: "daily" | "weekdays" | "monthly" | "progressive";
  selectedWeekdays: number[];
  selectedDays: number[];
  goalValue: number;
  goalPeriod: "week" | "month";
  importance: number;
  progressiveBuildUp?: ProgressiveBuildUp;
  completions: Record<string, boolean | number>;
}

interface AddHabitModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (habit: NewHabit) => void;
  skipGuidance?: boolean; // Skip guidance slides when opening from goal flow or onboarding
}

const RAMP_DURATION_OPTIONS = [
  { value: "1-week", label: "1 week" },
  { value: "2-weeks", label: "2 weeks" },
  { value: "1-month", label: "1 month" },
  { value: "custom", label: "Custom" },
];

export function AddHabitModal({ open, onOpenChange, onSave, skipGuidance = false }: AddHabitModalProps) {
  // Total steps: 4 guidance + 5 habit creation = 9 steps (or 5 if skipping guidance)
  const guidanceSteps = skipGuidance ? 0 : GUIDANCE_SLIDES.length;
  const habitSteps = 5; // Icon → Name → Category → Frequency → Importance
  const totalSteps = guidanceSteps + habitSteps;

  const [step, setStep] = useState(1);
  const [isComplete, setIsComplete] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [icon, setIcon] = useState("🎯");
  const [habitType] = useState<"boolean" | "numeric">("boolean");
  const [numericTarget] = useState(8);
  const [frequency, setFrequency] = useState<"daily" | "weekdays" | "monthly" | "progressive">("daily");
  const [selectedWeekdays, setSelectedWeekdays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 15]);
  const [importance, setImportance] = useState(50);

  // Progressive build-up state
  const [progressiveStartGoal, setProgressiveStartGoal] = useState(1);
  const [progressiveTargetGoal, setProgressiveTargetGoal] = useState(5);
  const [progressiveRampDuration, setProgressiveRampDuration] = useState<"1-week" | "2-weeks" | "1-month" | "custom">("2-weeks");
  const [progressiveCustomWeeks, setProgressiveCustomWeeks] = useState(3);

  const selectedCategory = CATEGORIES.find(c => c.value === category);

  // Check if we're in guidance phase or habit creation phase
  const isGuidancePhase = !skipGuidance && step <= guidanceSteps;
  const habitStep = isGuidancePhase ? 0 : (step - guidanceSteps);

  const getRampDurationLabel = () => {
    if (progressiveRampDuration === "custom") {
      return `${progressiveCustomWeeks} week${progressiveCustomWeeks > 1 ? 's' : ''}`;
    }
    return RAMP_DURATION_OPTIONS.find(opt => opt.value === progressiveRampDuration)?.label || "2 weeks";
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Final step - submit the habit
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = () => {
    const cat = CATEGORIES.find(c => c.value === category) || CATEGORIES[6];
    
    const newHabit: NewHabit = {
      id: Date.now().toString(),
      name: name.trim(),
      icon,
      category: cat.label,
      categoryColor: cat.color,
      habitType,
      target: habitType === "boolean" ? 1 : numericTarget,
      frequency,
      selectedWeekdays,
      selectedDays,
      goalValue: 5,
      goalPeriod: "week",
      importance,
      progressiveBuildUp: frequency === "progressive" ? {
        enabled: true,
        startGoal: progressiveStartGoal,
        targetGoal: progressiveTargetGoal,
        rampDuration: progressiveRampDuration,
        customWeeks: progressiveCustomWeeks,
        startDate: new Date().toISOString(),
      } : undefined,
      completions: {},
    };

    onSave(newHabit);
    setIsComplete(true);
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    setStep(1);
    setIsComplete(false);
    setName("");
    setCategory("");
    setIcon("🎯");
    setFrequency("daily");
    setSelectedWeekdays([1, 2, 3, 4, 5]);
    setSelectedDays([1, 15]);
    setImportance(50);
    setProgressiveStartGoal(1);
    setProgressiveTargetGoal(5);
    setProgressiveRampDuration("2-weeks");
    setProgressiveCustomWeeks(3);
  };

  const handleAddAnother = () => {
    resetForm();
  };

  useEffect(() => {
    if (open) {
      resetForm();
    }
  }, [open]);

  const toggleWeekday = (day: number) => {
    setSelectedWeekdays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const toggleMonthDay = (day: number) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const canProceed = () => {
    // During guidance phase, always can proceed
    if (isGuidancePhase) return true;
    
    // During habit creation phase
    switch (habitStep) {
      case 1: return icon.length > 0;
      case 2: return name.trim().length > 0;
      case 3: return category.length > 0;
      case 4: 
        if (frequency === "weekdays") return selectedWeekdays.length > 0;
        if (frequency === "monthly") return selectedDays.length > 0;
        return true;
      case 5: return true;
      default: return false;
    }
  };

  // Get button text
  const getNextButtonText = () => {
    if (isGuidancePhase) {
      // Last guidance slide shows "Add Habit"
      if (step === guidanceSteps) {
        return "Add Habit";
      }
      return "Next";
    }
    // In habit creation phase
    if (step === totalSteps) {
      return "Add Habit";
    }
    return "Next";
  };

  // Success screen
  if (isComplete) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-lg p-0 overflow-hidden bg-gradient-to-br from-[hsl(30,100%,98%)] to-[hsl(25,80%,95%)] border-0" hideCloseButton>
          <div className="p-8 text-center relative overflow-hidden">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center animate-scale-in">
              <AppleEmoji emoji="🎉" size="3xl" />
            </div>
            <h2 className="font-display text-2xl font-semibold text-foreground mb-3">
              Habit created! <AppleEmoji emoji="🎉" className="inline" />
            </h2>
            <p className="text-muted-foreground text-sm mb-6 leading-relaxed text-center max-w-sm mx-auto">
              Your new habit has been added. Stay consistent and watch your progress grow over time.
            </p>
            <div className="space-y-3">
              <Button onClick={handleClose} variant="gradient" size="lg" className="w-full">
                Done
              </Button>
              <Button onClick={handleAddAnother} variant="outline" size="lg" className="w-full text-muted-foreground bg-muted/30 border-muted/50 hover:bg-muted/50">
                Add another habit
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Guidance slide content
  const currentGuidanceSlide = isGuidancePhase ? GUIDANCE_SLIDES[step - 1] : null;

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
            {/* Guidance Slides */}
            {isGuidancePhase && currentGuidanceSlide && (
              <div className="flex flex-col justify-center h-full min-h-[280px] text-center">
                <div className="mb-6 flex justify-center">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                    <AppleEmoji emoji={currentGuidanceSlide.emoji} size="4xl" />
                  </div>
                </div>
                <h2 className="font-display text-xl font-semibold text-foreground mb-3">
                  {currentGuidanceSlide.title}
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mx-auto">
                  {currentGuidanceSlide.message}
                </p>
              </div>
            )}

            {/* Habit Step 1: Choose an icon */}
            {!isGuidancePhase && habitStep === 1 && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <AppleEmoji emoji="🎨" size="3xl" className="mb-4" />
                  <h2 className="font-display text-xl font-semibold text-foreground">
                    Choose an icon
                  </h2>
                  <p className="text-sm text-muted-foreground mt-2">
                    Pick an icon that represents your habit
                  </p>
                </div>
                <div className="grid grid-cols-7 gap-3 p-4 bg-white/50 rounded-2xl">
                  {EMOJI_OPTIONS.map((emoji, index) => (
                    <button
                      key={`${emoji}-${index}`}
                      type="button"
                      onClick={() => setIcon(emoji)}
                      className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-150 ${
                        icon === emoji
                          ? "bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-primary/50"
                          : "hover:bg-white border-2 border-transparent"
                      }`}
                    >
                      <AppleEmoji emoji={emoji} size="2xl" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Habit Step 2: Name your habit */}
            {!isGuidancePhase && habitStep === 2 && (
              <div className="flex flex-col justify-center h-full min-h-[280px]">
                <div className="text-center mb-6">
                  <AppleEmoji emoji={icon} size="3xl" className="mb-4" />
                  <h2 className="font-display text-xl font-semibold text-foreground">
                    Name your habit or task
                  </h2>
                </div>
                <div>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Morning Meditation"
                    className="h-14 text-lg bg-white/80 border-white/50 rounded-2xl"
                    autoFocus
                  />
                  <p className="text-sm text-muted-foreground mt-3 text-center">
                    Examples: Read 30 mins, Drink water, Exercise
                  </p>
                </div>
              </div>
            )}

            {/* Habit Step 3: Choose a category */}
            {!isGuidancePhase && habitStep === 3 && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <AppleEmoji emoji="📂" size="3xl" className="mb-4" />
                  <h2 className="font-display text-xl font-semibold text-foreground">
                    What category is this?
                  </h2>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => setCategory(cat.value)}
                      className={`p-4 rounded-2xl text-left transition-all duration-200 border-2 ${
                        category === cat.value
                          ? ""
                          : "bg-white/80 hover:bg-white border-transparent"
                      }`}
                      style={category === cat.value ? {
                        backgroundColor: getCategoryBgColor(cat.color),
                        borderColor: getCategoryBorderColor(cat.color),
                      } : undefined}
                    >
                      <AppleEmoji emoji={cat.emoji} size="xl" className="mb-2" />
                      <p className="text-sm font-medium text-foreground">{cat.label}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Habit Step 4: Choose frequency */}
            {!isGuidancePhase && habitStep === 4 && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <AppleEmoji emoji="📅" size="3xl" className="mb-4" />
                  <h2 className="font-display text-xl font-semibold text-foreground">
                    How often?
                  </h2>
                </div>
                <div className="space-y-2">
                  {/* Every day */}
                  <button
                    type="button"
                    onClick={() => setFrequency("daily")}
                    className={`w-full p-3.5 rounded-2xl text-left flex items-center justify-between transition-all ${
                      frequency === "daily"
                        ? "bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-primary/50"
                        : "bg-white/80 hover:bg-white border-2 border-transparent"
                    }`}
                  >
                    <div>
                      <p className="font-medium text-sm text-foreground">Every day</p>
                      <p className="text-xs text-muted-foreground">Track daily</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      frequency === "daily" ? "border-primary bg-primary" : "border-muted-foreground/30"
                    }`}>
                      {frequency === "daily" && <div className="w-2 h-2 bg-primary-foreground rounded-full" />}
                    </div>
                  </button>

                  {/* Specific days */}
                  <div>
                    <button
                      type="button"
                      onClick={() => setFrequency("weekdays")}
                      className={`w-full p-3.5 rounded-2xl text-left flex items-center justify-between transition-all ${
                        frequency === "weekdays"
                          ? "bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-primary/50"
                          : "bg-white/80 hover:bg-white border-2 border-transparent"
                      }`}
                    >
                      <div>
                        <p className="font-medium text-sm text-foreground">Specific days</p>
                        <p className="text-xs text-muted-foreground">Choose days</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        frequency === "weekdays" ? "border-primary bg-primary" : "border-muted-foreground/30"
                      }`}>
                        {frequency === "weekdays" && <div className="w-2 h-2 bg-primary-foreground rounded-full" />}
                      </div>
                    </button>
                    {frequency === "weekdays" && (
                      <div className="mt-2 flex justify-between gap-2 p-4 bg-white/60 rounded-2xl">
                        {WEEKDAYS.map((day) => (
                          <button
                            key={day.value}
                            type="button"
                            onClick={() => toggleWeekday(day.value)}
                            className={`w-10 h-10 rounded-full text-sm font-semibold transition-all duration-150 flex items-center justify-center ${
                              selectedWeekdays.includes(day.value)
                                ? "bg-primary text-primary-foreground shadow-md"
                                : "bg-white text-muted-foreground hover:bg-muted/40 border border-border/20"
                            }`}
                          >
                            {day.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Monthly dates */}
                  <div>
                    <button
                      type="button"
                      onClick={() => setFrequency("monthly")}
                      className={`w-full p-3.5 rounded-2xl text-left flex items-center justify-between transition-all ${
                        frequency === "monthly"
                          ? "bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-primary/50"
                          : "bg-white/80 hover:bg-white border-2 border-transparent"
                      }`}
                    >
                      <div>
                        <p className="font-medium text-sm text-foreground">Monthly dates</p>
                        <p className="text-xs text-muted-foreground">Pick dates</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        frequency === "monthly" ? "border-primary bg-primary" : "border-muted-foreground/30"
                      }`}>
                        {frequency === "monthly" && <div className="w-2 h-2 bg-primary-foreground rounded-full" />}
                      </div>
                    </button>
                    {frequency === "monthly" && (
                      <div className="mt-2 grid grid-cols-7 gap-2 p-4 bg-white/60 rounded-2xl max-h-44 overflow-y-auto">
                        {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                          <button
                            key={day}
                            type="button"
                            onClick={() => toggleMonthDay(day)}
                            className={`w-9 h-9 rounded-full text-xs font-semibold transition-all duration-150 flex items-center justify-center ${
                              selectedDays.includes(day)
                                ? "bg-primary text-primary-foreground shadow-md"
                                : "bg-white text-muted-foreground hover:bg-muted/40 border border-border/20"
                            }`}
                          >
                            {day}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Progressive build-up */}
                  <div>
                    <button
                      type="button"
                      onClick={() => setFrequency("progressive")}
                      className={`w-full p-3.5 rounded-2xl text-left flex items-center justify-between transition-all ${
                        frequency === "progressive"
                          ? "bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-primary/50"
                          : "bg-white/80 hover:bg-white border-2 border-transparent"
                      }`}
                    >
                      <div>
                        <p className="font-medium text-sm text-foreground">Progressive build-up</p>
                        <p className="text-xs text-muted-foreground">Start small and increase over time</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        frequency === "progressive" ? "border-primary bg-primary" : "border-muted-foreground/30"
                      }`}>
                        {frequency === "progressive" && <div className="w-2 h-2 bg-primary-foreground rounded-full" />}
                      </div>
                    </button>
                    {frequency === "progressive" && (
                      <div className="mt-2 p-4 bg-white/60 rounded-2xl space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                              Starting goal per day
                            </label>
                            <Input
                              type="number"
                              min={1}
                              max={progressiveTargetGoal - 1}
                              value={progressiveStartGoal}
                              onChange={(e) => setProgressiveStartGoal(Math.max(1, Math.min(progressiveTargetGoal - 1, parseInt(e.target.value) || 1)))}
                              className="h-10 text-center bg-white border-border/20 rounded-xl"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                              Target goal per day
                            </label>
                            <Input
                              type="number"
                              min={progressiveStartGoal + 1}
                              max={100}
                              value={progressiveTargetGoal}
                              onChange={(e) => setProgressiveTargetGoal(Math.max(progressiveStartGoal + 1, parseInt(e.target.value) || 2))}
                              className="h-10 text-center bg-white border-border/20 rounded-xl"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                            Ramp duration
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {RAMP_DURATION_OPTIONS.map((option) => (
                              <button
                                key={option.value}
                                type="button"
                                onClick={() => setProgressiveRampDuration(option.value as typeof progressiveRampDuration)}
                                className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                                  progressiveRampDuration === option.value
                                    ? "bg-primary text-primary-foreground shadow-md"
                                    : "bg-white text-muted-foreground hover:bg-muted/40 border border-border/20"
                                }`}
                              >
                                {option.label}
                              </button>
                            ))}
                          </div>
                          {progressiveRampDuration === "custom" && (
                            <div className="mt-2 flex items-center gap-2">
                              <Input
                                type="number"
                                min={1}
                                max={52}
                                value={progressiveCustomWeeks}
                                onChange={(e) => setProgressiveCustomWeeks(Math.max(1, Math.min(52, parseInt(e.target.value) || 1)))}
                                className="w-20 h-10 text-center bg-white border-border/20 rounded-xl"
                              />
                              <span className="text-sm text-muted-foreground">weeks</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="p-3 bg-primary/10 rounded-xl">
                          <p className="text-sm text-primary">
                            Start at {progressiveStartGoal}× per day, increase to {progressiveTargetGoal}× over {getRampDurationLabel()}.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Habit Step 5: Set importance */}
            {!isGuidancePhase && habitStep === 5 && (
              <div className="flex flex-col justify-center h-full min-h-[280px]">
                <div className="text-center mb-8">
                  <AppleEmoji emoji="🤔" size="3xl" className="mb-4" />
                  <h2 className="font-display text-xl font-semibold text-foreground">
                    How important is this habit or task?
                  </h2>
                  <p className="text-sm text-muted-foreground mt-2">
                    Higher importance = more impact on your daily score
                  </p>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Low</span>
                    <span className="text-2xl font-bold gradient-text">{importance}%</span>
                    <span className="text-sm text-muted-foreground">High</span>
                  </div>
                  <Slider
                    value={[importance]}
                    onValueChange={(val) => setImportance(val[0])}
                    min={10}
                    max={100}
                    step={5}
                    className="py-2"
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
            
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              variant="gradient"
              className="rounded-xl h-11"
            >
              {getNextButtonText()}
              {step !== totalSteps && step !== guidanceSteps && <ChevronRight className="w-4 h-4 ml-1" />}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
