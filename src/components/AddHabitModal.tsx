import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { AppleEmoji } from "@/components/AppleEmoji";
import { Check, X } from "lucide-react";

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

export interface NewHabit {
  id: string;
  name: string;
  icon: string;
  category: string;
  categoryColor: string;
  habitType: "boolean" | "numeric";
  target: number;
  frequency: "daily" | "weekdays" | "monthly";
  selectedWeekdays: number[];
  selectedDays: number[];
  goalValue: number;
  goalPeriod: "week" | "month";
  importance: number;
  completions: Record<string, boolean | number>;
}

interface AddHabitModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (habit: NewHabit) => void;
}

export function AddHabitModal({ open, onOpenChange, onSave }: AddHabitModalProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("health");
  const [icon, setIcon] = useState("🎯");
  const [habitType, setHabitType] = useState<"boolean" | "numeric">("boolean");
  const [numericTarget, setNumericTarget] = useState(8);
  const [frequency, setFrequency] = useState<"daily" | "weekdays" | "monthly">("daily");
  const [selectedWeekdays, setSelectedWeekdays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 15]);
  const [goalValue, setGoalValue] = useState(5);
  const [goalPeriod, setGoalPeriod] = useState<"week" | "month">("week");
  const [importance, setImportance] = useState(50);
  const [error, setError] = useState("");

  const selectedCategory = CATEGORIES.find(c => c.value === category);

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
                <Input
                  placeholder="e.g., Morning Meditation"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (error) setError("");
                  }}
                  className="h-12 px-4 bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 rounded-xl text-base placeholder:text-zinc-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
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
                  ].map((freq) => (
                    <button
                      key={freq.value}
                      type="button"
                      onClick={() => setFrequency(freq.value as "daily" | "weekdays" | "monthly")}
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
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Importance Weight
                  </label>
                  <span 
                    className="text-sm font-semibold px-2 py-0.5 rounded-md"
                    style={{ 
                      backgroundColor: `${selectedCategory?.color}15`,
                      color: selectedCategory?.color 
                    }}
                  >
                    {importance}%
                  </span>
                </div>
                <Slider
                  value={[importance]}
                  onValueChange={(v) => setImportance(v[0])}
                  min={10}
                  max={100}
                  step={10}
                  className="w-full"
                />
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">
                  Higher weight = more impact on your overall progress
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-zinc-50 dark:bg-zinc-800/50 border-t border-zinc-100 dark:border-zinc-800 flex gap-3">
          <Button
            variant="outline"
            onClick={handleClose}
            className="flex-1 h-11 rounded-xl border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700 font-medium"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!name.trim()}
            className="flex-1 h-11 rounded-xl bg-primary hover:bg-primary/90 text-white font-medium shadow-lg shadow-primary/25 disabled:opacity-50 disabled:shadow-none"
          >
            Add Habit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
