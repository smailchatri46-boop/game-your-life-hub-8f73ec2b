import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { AppleEmoji } from "@/components/AppleEmoji";

const CATEGORIES = [
  { value: "work", label: "Work", icon: "💼" },
  { value: "health", label: "Health", icon: "❤️" },
  { value: "fitness", label: "Fitness", icon: "💪" },
  { value: "learning", label: "Learning", icon: "📚" },
  { value: "growth", label: "Personal Growth", icon: "🌱" },
  { value: "spiritual", label: "Spiritual", icon: "🧘" },
  { value: "other", label: "Other", icon: "✨" },
];

const EMOJI_OPTIONS = [
  "🧘", "💪", "📚", "💧", "📵", "🏃", "🍎", "😴", "✍️", "🎯",
  "🌅", "🧹", "💰", "🎸", "🌿", "🧠", "❤️", "🏋️", "🚴", "🧑‍💻",
  "📝", "🎨", "🎵", "🍳", "☕", "🚶", "🧘‍♀️", "🙏", "💤", "🥗",
];

const WEEKDAYS = [
  { value: 0, label: "Sun" },
  { value: 1, label: "Mon" },
  { value: 2, label: "Tue" },
  { value: 3, label: "Wed" },
  { value: 4, label: "Thu" },
  { value: 5, label: "Fri" },
  { value: 6, label: "Sat" },
];

export interface NewHabit {
  id: string;
  name: string;
  icon: string;
  category: string;
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

  const handleSave = () => {
    if (!name.trim()) return;

    const newHabit: NewHabit = {
      id: Date.now().toString(),
      name: name.trim(),
      icon,
      category: CATEGORIES.find(c => c.value === category)?.label || "Other",
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto bg-background border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-display flex items-center gap-2">
            <AppleEmoji emoji={icon} size="lg" />
            Add New Habit
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* Habit Name */}
          <div className="space-y-2">
            <Label htmlFor="habit-name">Habit Name</Label>
            <Input
              id="habit-name"
              placeholder="e.g., Morning Meditation"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-secondary/50"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="bg-secondary/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-background border-border">
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    <span className="flex items-center gap-2">
                      <AppleEmoji emoji={cat.icon} size="sm" />
                      {cat.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Icon Picker */}
          <div className="space-y-2">
            <Label>Icon</Label>
            <div className="grid grid-cols-10 gap-1.5 p-3 bg-secondary/30 rounded-xl">
              {EMOJI_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setIcon(emoji)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                    icon === emoji
                      ? "bg-primary/20 ring-2 ring-primary scale-110"
                      : "hover:bg-secondary"
                  }`}
                >
                  <AppleEmoji emoji={emoji} size="md" />
                </button>
              ))}
            </div>
          </div>

          {/* Habit Type */}
          <div className="space-y-2">
            <Label>Habit Type</Label>
            <RadioGroup
              value={habitType}
              onValueChange={(v) => setHabitType(v as "boolean" | "numeric")}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="boolean" id="type-boolean" />
                <Label htmlFor="type-boolean" className="font-normal cursor-pointer">
                  ✔ Done / Not done
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="numeric" id="type-numeric" />
                <Label htmlFor="type-numeric" className="font-normal cursor-pointer">
                  0–N numeric value
                </Label>
              </div>
            </RadioGroup>

            {habitType === "numeric" && (
              <div className="mt-3 flex items-center gap-3">
                <Label className="text-sm text-muted-foreground">Target per day:</Label>
                <Input
                  type="number"
                  min={1}
                  max={100}
                  value={numericTarget}
                  onChange={(e) => setNumericTarget(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 bg-secondary/50"
                />
              </div>
            )}
          </div>

          {/* Frequency */}
          <div className="space-y-2">
            <Label>Frequency</Label>
            <RadioGroup
              value={frequency}
              onValueChange={(v) => setFrequency(v as "daily" | "weekdays" | "monthly")}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="daily" id="freq-daily" />
                <Label htmlFor="freq-daily" className="font-normal cursor-pointer">
                  Every day
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="weekdays" id="freq-weekdays" />
                <Label htmlFor="freq-weekdays" className="font-normal cursor-pointer">
                  Specific weekdays
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="monthly" id="freq-monthly" />
                <Label htmlFor="freq-monthly" className="font-normal cursor-pointer">
                  Specific days of month
                </Label>
              </div>
            </RadioGroup>

            {frequency === "weekdays" && (
              <div className="mt-3 flex gap-1.5 flex-wrap">
                {WEEKDAYS.map((day) => (
                  <button
                    key={day.value}
                    type="button"
                    onClick={() => toggleWeekday(day.value)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      selectedWeekdays.includes(day.value)
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
            )}

            {frequency === "monthly" && (
              <div className="mt-3 grid grid-cols-7 gap-1.5">
                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleMonthDay(day)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                      selectedDays.includes(day)
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Goal per period */}
          <div className="space-y-2">
            <Label>Goal per Period</Label>
            <div className="flex items-center gap-3">
              <Input
                type="number"
                min={1}
                max={31}
                value={goalValue}
                onChange={(e) => setGoalValue(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-20 bg-secondary/50"
              />
              <span className="text-muted-foreground">
                {habitType === "numeric" ? "times" : "days"} per
              </span>
              <Select value={goalPeriod} onValueChange={(v) => setGoalPeriod(v as "week" | "month")}>
                <SelectTrigger className="w-28 bg-secondary/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background border-border">
                  <SelectItem value="week">week</SelectItem>
                  <SelectItem value="month">month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Importance Weight */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Importance Weight</Label>
              <span className="text-sm font-medium text-primary">{importance}%</span>
            </div>
            <Slider
              value={[importance]}
              onValueChange={(v) => setImportance(v[0])}
              min={10}
              max={100}
              step={10}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Higher weight means this habit contributes more to your overall progress
            </p>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-border">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => {
              resetForm();
              onOpenChange(false);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="gradient"
            className="flex-1"
            onClick={handleSave}
            disabled={!name.trim()}
          >
            Add Habit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
