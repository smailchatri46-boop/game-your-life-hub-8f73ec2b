import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { AppleEmoji } from "@/components/AppleEmoji";
import { Check, X, Mic, MicOff } from "lucide-react";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { useToast } from "@/hooks/use-toast";

const CATEGORIES = [
  { value: "work", label: "Work", color: "#3B82F6" },
  { value: "health", label: "Health", color: "#22C55E" },
  { value: "fitness", label: "Fitness", color: "#F59E0B" },
  { value: "learning", label: "Learning", color: "#8B5CF6" },
  { value: "growth", label: "Personal Growth", color: "#EC4899" },
  { value: "spiritual", label: "Spiritual", color: "#06B6D4" },
  { value: "other", label: "Other", color: "#6B7280" },
];

const EMOJI_OPTIONS = [
  "🎯", "🧘", "💪", "📚", "💧", "🏃", "🍎", "😴", "✍️", "⭐",
  "🌅", "🧹", "💰", "🎸", "🌿", "🧠", "❤️", "🏋️", "🚴", "💻",
  "📝", "🎨", "🎵", "🍳", "☕", "🚶", "🙏", "💤", "🥗", "🔥",
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
  
  const { toast } = useToast();

  const { isListening, isSupported, toggleListening } = useSpeechRecognition({
    onResult: (transcript) => {
      setName((prev) => prev + (prev ? " " : "") + transcript);
      if (error) setError("");
    },
    onError: (err) => {
      toast({
        title: "Voice input error",
        description: err === "not-allowed" 
          ? "Please allow microphone access" 
          : `Error: ${err}`,
        variant: "destructive",
      });
    },
  });

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
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent 
        className="sm:max-w-[680px] p-0 gap-0 bg-white dark:bg-zinc-900 border-0 shadow-2xl rounded-2xl overflow-hidden font-['Inter',sans-serif]"
        onInteractOutside={(e) => e.preventDefault()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${selectedCategory?.color}15` }}
              >
                <AppleEmoji emoji={icon} size="lg" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                  Add New Habit
                </h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Build better routines, one habit at a time
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6 max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Habit Name */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Habit Name
                </label>
                <div className="relative">
                  <Input
                    placeholder="e.g., Morning Meditation"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (error) setError("");
                    }}
                    className="h-12 px-4 pr-12 bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 rounded-xl text-base placeholder:text-zinc-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                  {isSupported && (
                    <button
                      type="button"
                      onClick={toggleListening}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full transition-all ${
                        isListening 
                          ? "bg-destructive text-white animate-pulse" 
                          : "text-zinc-400 hover:text-primary hover:bg-primary/10"
                      }`}
                      title={isListening ? "Stop recording" : "Voice input"}
                    >
                      {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </button>
                  )}
                </div>
                {isListening && (
                  <p className="mt-1 text-xs text-muted-foreground animate-pulse flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-destructive rounded-full" />
                    Listening...
                  </p>
                )}
                {error && (
                  <p className="mt-2 text-sm text-red-500">{error}</p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
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
                          ? "shadow-md"
                          : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      }`}
                      style={{
                        backgroundColor: category === cat.value ? `${cat.color}15` : undefined,
                        color: category === cat.value ? cat.color : undefined,
                        boxShadow: category === cat.value ? `0 0 0 2px ${cat.color}` : undefined,
                      }}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: cat.color }}
                      />
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Icon Picker */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
                  Icon
                </label>
                <div className="grid grid-cols-10 gap-1 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                  {EMOJI_OPTIONS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setIcon(emoji)}
                      className={`aspect-square rounded-lg flex items-center justify-center transition-all ${
                        icon === emoji
                          ? "bg-white dark:bg-zinc-700 shadow-sm ring-2 ring-primary/50 scale-110"
                          : "hover:bg-white dark:hover:bg-zinc-700 hover:shadow-sm"
                      }`}
                    >
                      <AppleEmoji emoji={emoji} size="md" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Habit Type */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
                  Habit Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setHabitType("boolean")}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      habitType === "boolean"
                        ? "border-primary bg-primary/5"
                        : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600"
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mb-2 ${
                      habitType === "boolean" ? "border-primary bg-primary" : "border-zinc-300 dark:border-zinc-600"
                    }`}>
                      {habitType === "boolean" && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <p className="font-medium text-sm text-zinc-900 dark:text-zinc-100">Done / Not Done</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Simple completion</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setHabitType("numeric")}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      habitType === "numeric"
                        ? "border-primary bg-primary/5"
                        : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600"
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mb-2 ${
                      habitType === "numeric" ? "border-primary bg-primary" : "border-zinc-300 dark:border-zinc-600"
                    }`}>
                      {habitType === "numeric" && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <p className="font-medium text-sm text-zinc-900 dark:text-zinc-100">Numeric Value</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Track a number</p>
                  </button>
                </div>
                {habitType === "numeric" && (
                  <div className="mt-3 flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">Daily target:</span>
                    <Input
                      type="number"
                      min={1}
                      max={100}
                      value={numericTarget}
                      onChange={(e) => setNumericTarget(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-20 h-9 text-center bg-white dark:bg-zinc-700 border-zinc-200 dark:border-zinc-600 rounded-lg"
                    />
                  </div>
                )}
              </div>

              {/* Frequency */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
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
                      className={`w-full p-3 rounded-xl border-2 text-left flex items-center justify-between transition-all ${
                        frequency === freq.value
                          ? "border-primary bg-primary/5"
                          : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600"
                      }`}
                    >
                      <div>
                        <p className="font-medium text-sm text-zinc-900 dark:text-zinc-100">{freq.label}</p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">{freq.desc}</p>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        frequency === freq.value ? "border-primary bg-primary" : "border-zinc-300 dark:border-zinc-600"
                      }`}>
                        {frequency === freq.value && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Progressive Build-up Configuration */}
                {frequency === "progressive" && (
                  <div className="mt-3 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5">
                          Starting goal per day
                        </label>
                        <Input
                          type="number"
                          min={1}
                          max={progressiveTargetGoal - 1}
                          value={progressiveStartGoal}
                          onChange={(e) => setProgressiveStartGoal(Math.max(1, Math.min(progressiveTargetGoal - 1, parseInt(e.target.value) || 1)))}
                          className="h-9 text-center bg-white dark:bg-zinc-700 border-zinc-200 dark:border-zinc-600 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5">
                          Target goal per day
                        </label>
                        <Input
                          type="number"
                          min={progressiveStartGoal + 1}
                          max={100}
                          value={progressiveTargetGoal}
                          onChange={(e) => setProgressiveTargetGoal(Math.max(progressiveStartGoal + 1, parseInt(e.target.value) || 2))}
                          className="h-9 text-center bg-white dark:bg-zinc-700 border-zinc-200 dark:border-zinc-600 rounded-lg"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5">
                        Ramp duration
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {RAMP_DURATION_OPTIONS.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => setProgressiveRampDuration(option.value as typeof progressiveRampDuration)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                              progressiveRampDuration === option.value
                                ? "bg-primary text-white"
                                : "bg-white dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-600 border border-zinc-200 dark:border-zinc-600"
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
                            className="w-20 h-9 text-center bg-white dark:bg-zinc-700 border-zinc-200 dark:border-zinc-600 rounded-lg"
                          />
                          <span className="text-sm text-zinc-600 dark:text-zinc-400">weeks</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-3 bg-primary/10 dark:bg-primary/20 rounded-lg">
                      <p className="text-sm text-primary dark:text-primary/90">
                        You will start at {progressiveStartGoal}× per day and gradually increase to {progressiveTargetGoal}× per day over {getRampDurationLabel()}.
                      </p>
                    </div>
                  </div>
                )}

                {frequency === "weekdays" && (
                  <div className="mt-3 flex justify-between gap-1.5 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                    {WEEKDAYS.map((day) => (
                      <button
                        key={day.value}
                        type="button"
                        onClick={() => toggleWeekday(day.value)}
                        className={`w-9 h-9 rounded-full text-sm font-medium transition-all ${
                          selectedWeekdays.includes(day.value)
                            ? "bg-primary text-white"
                            : "bg-white dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-600"
                        }`}
                      >
                        {day.label}
                      </button>
                    ))}
                  </div>
                )}

                {frequency === "monthly" && (
                  <div className="mt-3 grid grid-cols-7 gap-1 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl max-h-40 overflow-y-auto">
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleMonthDay(day)}
                        className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                          selectedDays.includes(day)
                            ? "bg-primary text-white"
                            : "bg-white dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-600"
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Goal */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
                  Goal per Period
                </label>
                <div className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                  <Input
                    type="number"
                    min={1}
                    max={31}
                    value={goalValue}
                    onChange={(e) => setGoalValue(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 h-9 text-center bg-white dark:bg-zinc-700 border-zinc-200 dark:border-zinc-600 rounded-lg"
                  />
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">
                    {habitType === "numeric" ? "times" : "days"} per
                  </span>
                  <div className="flex rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-600">
                    <button
                      type="button"
                      onClick={() => setGoalPeriod("week")}
                      className={`px-3 py-1.5 text-sm font-medium transition-all ${
                        goalPeriod === "week"
                          ? "bg-primary text-white"
                          : "bg-white dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300"
                      }`}
                    >
                      Week
                    </button>
                    <button
                      type="button"
                      onClick={() => setGoalPeriod("month")}
                      className={`px-3 py-1.5 text-sm font-medium transition-all ${
                        goalPeriod === "month"
                          ? "bg-primary text-white"
                          : "bg-white dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300"
                      }`}
                    >
                      Month
                    </button>
                  </div>
                </div>
              </div>

              {/* Importance */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Importance Weight
                  </label>
                  <span className="text-sm font-semibold text-primary">{importance}%</span>
                </div>
                <Slider
                  value={[importance]}
                  onValueChange={(val) => setImportance(val[0])}
                  min={10}
                  max={100}
                  step={5}
                  className="py-2"
                />
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">
                  Higher importance = more impact on daily score
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={handleClose}
            className="px-6 rounded-xl"
          >
            Cancel
          </Button>
          <Button
            variant="gradient"
            onClick={handleSave}
            className="px-6 rounded-xl"
          >
            Create Habit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
