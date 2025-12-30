import { useState, useCallback } from "react";

export type OnboardingStep = 
  | "welcome"
  | "identity-1"
  | "identity-2"
  | "why-we-exist"
  | "tell-us-about-you"
  | "about-focus"
  | "about-struggle"
  | "about-time"
  | "habit-suggestions"
  | "goals"
  | "commitment"
  | "loading"
  | "success";

export interface OnboardingData {
  focusAreas: string[];
  struggles: string[];
  preferredTime: string;
  selectedHabits: string[];
  customHabits: string[];
  goalCategory: string;
  goalName: string;
  commitmentName: string;
  checkedAffirmations: string[];
  uniqueAbout: string;
}

const INITIAL_DATA: OnboardingData = {
  focusAreas: [],
  struggles: [],
  preferredTime: "",
  selectedHabits: [],
  customHabits: [],
  goalCategory: "",
  goalName: "",
  commitmentName: "",
  checkedAffirmations: [],
  uniqueAbout: "",
};

const STEP_ORDER: OnboardingStep[] = [
  "welcome",
  "identity-1",
  "identity-2",
  "why-we-exist",
  "tell-us-about-you",
  "about-focus",
  "about-struggle",
  "about-time",
  "habit-suggestions",
  "goals",
  "commitment",
  "loading",
  "success",
];

export function useOnboarding() {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("welcome");
  const [data, setData] = useState<OnboardingData>(INITIAL_DATA);
  const [isComplete, setIsComplete] = useState(false);

  const currentIndex = STEP_ORDER.indexOf(currentStep);
  const totalSteps = STEP_ORDER.length;
  const progress = ((currentIndex + 1) / totalSteps) * 100;

  const canGoBack = currentIndex > 0 && currentStep !== "loading" && currentStep !== "success";
  const canGoNext = currentIndex < totalSteps - 1;

  const goToNext = useCallback(() => {
    if (currentIndex < totalSteps - 1) {
      setCurrentStep(STEP_ORDER[currentIndex + 1]);
    }
  }, [currentIndex, totalSteps]);

  const goToPrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentStep(STEP_ORDER[currentIndex - 1]);
    }
  }, [currentIndex]);

  const goToStep = useCallback((step: OnboardingStep) => {
    setCurrentStep(step);
  }, []);

  const updateData = useCallback((updates: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...updates }));
  }, []);

  const toggleFocusArea = useCallback((area: string) => {
    setData(prev => ({
      ...prev,
      focusAreas: prev.focusAreas.includes(area)
        ? prev.focusAreas.filter(a => a !== area)
        : [...prev.focusAreas, area],
    }));
  }, []);

  const toggleStruggle = useCallback((struggle: string) => {
    setData(prev => ({
      ...prev,
      struggles: prev.struggles.includes(struggle)
        ? prev.struggles.filter(s => s !== struggle)
        : [...prev.struggles, struggle],
    }));
  }, []);

  const toggleHabit = useCallback((habit: string) => {
    setData(prev => ({
      ...prev,
      selectedHabits: prev.selectedHabits.includes(habit)
        ? prev.selectedHabits.filter(h => h !== habit)
        : [...prev.selectedHabits, habit],
    }));
  }, []);

  const addCustomHabit = useCallback((habit: string) => {
    if (habit.trim()) {
      setData(prev => ({
        ...prev,
        customHabits: [...prev.customHabits, habit.trim()],
      }));
    }
  }, []);

  const removeCustomHabit = useCallback((habit: string) => {
    setData(prev => ({
      ...prev,
      customHabits: prev.customHabits.filter(h => h !== habit),
    }));
  }, []);

  const toggleAffirmation = useCallback((affirmation: string) => {
    setData(prev => ({
      ...prev,
      checkedAffirmations: prev.checkedAffirmations.includes(affirmation)
        ? prev.checkedAffirmations.filter(a => a !== affirmation)
        : [...prev.checkedAffirmations, affirmation],
    }));
  }, []);

  const completeOnboarding = useCallback(() => {
    setIsComplete(true);
    // Save to localStorage to prevent showing again
    localStorage.setItem("locked_onboarding_complete", "true");
  }, []);

  const skipOnboarding = useCallback(() => {
    localStorage.setItem("locked_onboarding_skipped", "true");
    setIsComplete(true);
  }, []);

  const getTotalSelectedHabits = useCallback(() => {
    return data.selectedHabits.length + data.customHabits.length;
  }, [data.selectedHabits, data.customHabits]);

  const hasCompletedOnboarding = useCallback(() => {
    return (
      localStorage.getItem("locked_onboarding_complete") === "true" ||
      localStorage.getItem("locked_onboarding_skipped") === "true"
    );
  }, []);

  const resetOnboarding = useCallback(() => {
    setCurrentStep("welcome");
    setData(INITIAL_DATA);
    setIsComplete(false);
  }, []);

  return {
    currentStep,
    data,
    progress,
    canGoBack,
    canGoNext,
    isComplete,
    goToNext,
    goToPrevious,
    goToStep,
    updateData,
    toggleFocusArea,
    toggleStruggle,
    toggleHabit,
    addCustomHabit,
    removeCustomHabit,
    toggleAffirmation,
    completeOnboarding,
    skipOnboarding,
    getTotalSelectedHabits,
    hasCompletedOnboarding,
    resetOnboarding,
  };
}
