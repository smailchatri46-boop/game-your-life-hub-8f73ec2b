import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { AppleEmoji } from "@/components/AppleEmoji";
import { X } from "lucide-react";
import { useFirstTimeTips } from "@/hooks/use-first-time-tips";
import { FirstTimeTip } from "@/components/FirstTimeTip";

const CATEGORIES = [
  { value: "work", label: "Work", color: "#3B82F6" },
  { value: "health", label: "Health", color: "#22C55E" },
  { value: "fitness", label: "Fitness", color: "#F59E0B" },
  { value: "learning", label: "Learning", color: "#8B5CF6" },
  { value: "growth", label: "Personal Growth", color: "#EC4899" },
  { value: "spiritual", label: "Spiritual", color: "#06B6D4" },
  { value: "other", label: "Other", color: "#6B7280" },
];

// Curated Apple emoji set - 14 emojis for 2 rows of 7
const EMOJI_OPTIONS = [
  "📖", "💪", "💼", "🏃", "💧", "🧘", "✍️", "🎯",
  "💪", "🥗", "😴", "🚶", "📝", "🎨", "🎵", "💡",
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
}

const RAMP_DURATION_OPTIONS = [
  { value: "1-week", label: "1 week" },
  { value: "2-weeks", label: "2 weeks" },
  { value: "1-month", label: "1 month" },
  { value: "custom", label: "Custom" },
];

export function AddHabitModal({ open, onOpenChange, onSave }: AddHabitModalProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("health");
  const [icon, setIcon] = useState("🎯");
  const [habitType, setHabitType] = useState<"boolean" | "numeric">("boolean");
  const [numericTarget, setNumericTarget] = useState(8);
  const [frequency, setFrequency] = useState<"daily" | "weekdays" | "monthly" | "progressive">("daily");
  const [selectedWeekdays, setSelectedWeekdays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 15]);
  const [goalValue, setGoalValue] = useState(5);
  const [goalPeriod, setGoalPeriod] = useState<"week" | "month">("week");
  const [importance, setImportance] = useState(50);
  const [error, setError] = useState("");
  
  // Progressive build-up state
  const [progressiveStartGoal, setProgressiveStartGoal] = useState(1);
  const [progressiveTargetGoal, setProgressiveTargetGoal] = useState(5);
  const [progressiveRampDuration, setProgressiveRampDuration] = useState<"1-week" | "2-weeks" | "1-month" | "custom">("2-weeks");
  const [progressiveCustomWeeks, setProgressiveCustomWeeks] = useState(3);
  const { activeTip, tipMessage, triggerTip, dismissTip, shouldShowTip } = useFirstTimeTips();

  const selectedCategory = CATEGORIES.find(c => c.value === category);

  const getRampDurationLabel = () => {
    if (progressiveRampDuration === "custom") {
      return `${progressiveCustomWeeks} week${progressiveCustomWeeks > 1 ? 's' : ''}`;
    }
    return RAMP_DURATION_OPTIONS.find(opt => opt.value === progressiveRampDuration)?.label || "2 weeks";
  };

  const handleSave = () => {
    if (!name.trim()) {
      setError("Please enter a habit name");
      return;
    }
    setError("");

    const newHabit: NewHabit = {
      id: Date.now().toString(),
      name: name.trim(),
      icon,
      category: selectedCategory?.label || "Other",
      categoryColor: selectedCategory?.color || "#6B7280",
      habitType,
      target: habitType === "boolean" ? 1 : numericTarget,
      frequency,
      selectedWeekdays,
      selectedDays,
      goalValue,
      goalPeriod,
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
    resetForm();
    onOpenChange(false);
    
    if (shouldShowTip("habit")) {
      setTimeout(() => triggerTip("habit"), 300);
    }
  };

  const resetForm = () => {
    setName("");
    setCategory("health");
    setIcon("🎯");
    setHabitType("boolean");
    setNumericTarget(8);
    setFrequency("daily");
    setSelectedWeekdays([1, 2, 3, 4, 5]);
    setSelectedDays([1, 15]);
    setGoalValue(5);
    setGoalPeriod("week");
    setImportance(50);
    setProgressiveStartGoal(1);
    setProgressiveTargetGoal(5);
    setProgressiveRampDuration("2-weeks");
    setProgressiveCustomWeeks(3);
    setError("");
  };

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

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  return (
    <>
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent 
        hideCloseButton
        className="sm:max-w-[720px] p-0 gap-0 bg-card border-0 shadow-2xl rounded-3xl overflow-hidden font-['Plus_Jakarta_Sans',sans-serif]"
        onInteractOutside={(e) => e.preventDefault()}
      >
        {/* Header */}
        <div className="px-7 py-6 border-b border-border/30">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground font-display">
                Add New Habit
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Build better routines, one habit at a time
              </p>
            </div>
            <button
              onClick={handleClose}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content - Fixed height scrollable area */}
        <div className="px-7 py-6 overflow-y-auto" style={{ maxHeight: 'calc(70vh - 180px)' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-6">
            {/* Left Column - Fixed layout, no jumping */}
            <div className="space-y-6">
              {/* Icon Picker - Large icons with rounded-square gradient selection */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  Choose Icon
                </label>
                <div className="grid grid-cols-7 gap-4">
                  {EMOJI_OPTIONS.map((emoji, index) => (
                    <button
                      key={`${emoji}-${index}`}
                      type="button"
                      onClick={() => setIcon(emoji)}
                      className={`w-12 h-12 rounded-[16px] flex items-center justify-center transition-all duration-200 ${
                        icon === emoji
                          ? "btn-primary-gradient shadow-lg"
                          : "bg-muted/40 hover:bg-muted/60 hover:shadow-sm"
                      }`}
                      style={{
                        boxShadow: icon === emoji 
                          ? 'inset 0 1px 2px rgba(255,255,255,0.3), 0 4px 12px rgba(234, 88, 12, 0.25)' 
                          : undefined,
                      }}
                    >
                      <AppleEmoji emoji={emoji} size="3xl" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setCategory(cat.value)}
                      className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-sm font-medium transition-all ${
                        category === cat.value
                          ? "shadow-sm"
                          : "text-muted-foreground hover:bg-muted/50"
                      }`}
                      style={{
                        backgroundColor: category === cat.value ? `${cat.color}15` : undefined,
                        color: category === cat.value ? cat.color : undefined,
                        boxShadow: category === cat.value ? `0 0 0 1.5px ${cat.color}40` : undefined,
                      }}
                    >
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: cat.color }}
                      />
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Habit Name with emoji inside input - Fixed height */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Habit Name
                </label>
                <div className="relative flex items-center">
                  {/* Icon preview inside input - non-editable */}
                  <div className="absolute left-4 z-10 flex items-center justify-center pointer-events-none">
                    <AppleEmoji emoji={icon} size="2xl" />
                  </div>
                  <Input
                    placeholder="e.g., Morning Meditation"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (error) setError("");
                    }}
                    className="h-14 pl-14 pr-4 bg-muted/30 border-border/30 rounded-2xl text-base placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
                  />
                </div>
                {error && (
                  <p className="mt-2 text-sm text-destructive">{error}</p>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Frequency */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  Frequency
                </label>
                <div className="space-y-2">
                  {[
                    { value: "daily", label: "Every day", desc: "Track daily" },
                    { value: "weekdays", label: "Specific days", desc: "Choose days" },
                    { value: "monthly", label: "Monthly dates", desc: "Pick dates" },
                    { value: "progressive", label: "Progressive build-up", desc: "Start small and increase your target over time" },
                  ].map((freq) => (
                    <button
                      key={freq.value}
                      type="button"
                      onClick={() => setFrequency(freq.value as "daily" | "weekdays" | "monthly" | "progressive")}
                      className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                        frequency === freq.value
                          ? "border-primary/40 bg-primary/5"
                          : "border-border/30 hover:border-border/50"
                      }`}
                    >
                      <div>
                        <p className="font-medium text-sm text-foreground">{freq.label}</p>
                        <p className="text-xs text-muted-foreground">{freq.desc}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        frequency === freq.value ? "border-primary bg-primary" : "border-muted-foreground/30"
                      }`}>
                        {frequency === freq.value && <div className="w-2 h-2 bg-primary-foreground rounded-full" />}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Progressive Build-up Configuration */}
                {frequency === "progressive" && (
                  <div className="mt-3 p-4 bg-muted/30 rounded-2xl space-y-4">
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
                          className="h-10 text-center bg-card border-border/30 rounded-xl"
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
                          className="h-10 text-center bg-card border-border/30 rounded-xl"
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
                                ? "btn-primary-gradient shadow-md"
                                : "bg-card text-muted-foreground hover:bg-muted/50 border border-border/30"
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
                            className="w-20 h-10 text-center bg-card border-border/30 rounded-xl"
                          />
                          <span className="text-sm text-muted-foreground">weeks</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-3 bg-primary/10 rounded-xl">
                      <p className="text-sm text-primary">
                        You will start at {progressiveStartGoal}× per day and gradually increase to {progressiveTargetGoal}× per day over {getRampDurationLabel()}.
                      </p>
                    </div>
                  </div>
                )}

                {/* Weekdays selector */}
                {frequency === "weekdays" && (
                  <div className="mt-3 flex justify-between gap-2 p-4 bg-muted/30 rounded-2xl">
                    {WEEKDAYS.map((day) => (
                      <button
                        key={day.value}
                        type="button"
                        onClick={() => toggleWeekday(day.value)}
                        className={`w-10 h-10 rounded-full text-sm font-semibold transition-all duration-200 flex items-center justify-center ${
                          selectedWeekdays.includes(day.value)
                            ? "btn-primary-gradient shadow-md text-white"
                            : "bg-card text-muted-foreground hover:bg-muted/60 border border-border/20"
                        }`}
                      >
                        {day.label}
                      </button>
                    ))}
                  </div>
                )}

                {/* Monthly days selector */}
                {frequency === "monthly" && (
                  <div className="mt-3 grid grid-cols-7 gap-2 p-4 bg-muted/30 rounded-2xl max-h-44 overflow-y-auto">
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleMonthDay(day)}
                        className={`w-9 h-9 rounded-full text-xs font-semibold transition-all duration-200 flex items-center justify-center ${
                          selectedDays.includes(day)
                            ? "btn-primary-gradient shadow-md text-white"
                            : "bg-card text-muted-foreground hover:bg-muted/60 border border-border/20"
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Bottom Section - Goal, Importance, and Buttons - Always visible */}
        <div className="px-7 py-5 border-t border-border/30 bg-card">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-5">
            {/* Goal per Period - Always visible */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Goal per Period
              </label>
              <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-2xl">
                <Input
                  type="number"
                  min={1}
                  max={31}
                  value={goalValue}
                  onChange={(e) => setGoalValue(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 h-10 text-center bg-card border-border/30 rounded-xl"
                />
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  {habitType === "numeric" ? "times" : "days"} per
                </span>
                <div className="flex rounded-xl overflow-hidden border border-border/20 bg-card shadow-sm">
                  <button
                    type="button"
                    onClick={() => setGoalPeriod("week")}
                    className={`px-5 py-2.5 text-sm font-semibold transition-all ${
                      goalPeriod === "week"
                        ? "btn-primary-gradient text-white"
                        : "bg-transparent text-foreground hover:bg-muted/50"
                    }`}
                  >
                    Week
                  </button>
                  <button
                    type="button"
                    onClick={() => setGoalPeriod("month")}
                    className={`px-5 py-2.5 text-sm font-semibold transition-all ${
                      goalPeriod === "month"
                        ? "btn-primary-gradient text-white"
                        : "bg-transparent text-foreground hover:bg-muted/50"
                    }`}
                  >
                    Month
                  </button>
                </div>
              </div>
            </div>

            {/* Importance Weight - Always visible */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-foreground">
                  Importance Weight
                </label>
                <span className="text-sm font-semibold gradient-text">{importance}%</span>
              </div>
              <Slider
                value={[importance]}
                onValueChange={(val) => setImportance(val[0])}
                min={10}
                max={100}
                step={5}
                className="py-2"
              />
              <p className="text-xs text-muted-foreground mt-1.5">
                Higher importance = more impact on daily score
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-5 pt-4 border-t border-border/20">
            <Button
              variant="ghost"
              onClick={handleClose}
              className="px-6 rounded-xl hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-all"
            >
              Cancel
            </Button>
            <Button
              variant="gradient"
              onClick={handleSave}
              className="px-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              Create Habit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    
    <FirstTimeTip
      open={activeTip === "habit"}
      title={tipMessage?.title || ""}
      message={tipMessage?.message || ""}
      onDismiss={dismissTip}
    />
  </>
  );
}
