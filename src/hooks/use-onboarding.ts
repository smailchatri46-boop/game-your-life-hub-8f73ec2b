import { useState, useCallback } from "react";
import type { CreatedHabit } from "@/components/onboarding/steps/HabitSuggestionsStep";

export type OnboardingStep = 
  | "survey-1"
  | "survey-2"
  | "survey-3"
  | "survey-4"
  | "survey-5"
  | "survey-6"
  // Section A: Past Experience (after survey)
  | "past-tracking"
  | "why-stopped"
  | "current-situation"
  | "progress-visibility"
  | "emotional-checkin"
  | "readiness-signal"
  // Original about steps
  | "about-focus"
  | "about-struggle"
  | "about-time"
  | "tell-us-about-you"
  | "why-we-exist"
  | "feature-intro"
  | "feature-goals"
  | "feature-habits"
  | "feature-ai-buddy"
  | "feature-insights"
  | "feature-outro"
  // Section C: AI Personalization
  | "ai-tone"
  | "ai-feedback-style"
  | "ai-insight-depth"
  // Section D: Video Preview
  | "video-preview"
  // Section E: Journey Transition
  | "journey-readiness"
  | "journey-commitment"
  // Original final steps
  | "habit-suggestions"
  | "goal-creation"
  | "commitment"
  | "loading"
  | "success"
  | "paywall";

export interface OnboardingData {
  focusAreas: string[];
  struggles: string[];
  trackingStruggles: string[];
  preferredTime: string;
  selectedHabits: string[];
  customHabits: string[];
  goalCategory: string;
  goalName: string;
  commitmentName: string;
  checkedAffirmations: string[];
  uniqueAbout: string;
  currentApps: string;
  surveyAnswers: {
    survey1: string | null;
    survey2: string | null;
    survey3: string | null;
    survey4: string | null;
    survey5: string | null;
    survey6: string | null;
  };
  createdHabits: CreatedHabit[];
  // Section A: Past Experience
  pastExperience: {
    trackingExperience: string[];
    whyStopped: string[];
    currentSituation: string[];
    progressVisibility: string[];
    emotionalCheckin: string[];
    readinessSignal: string[];
  };
  // Section C: AI Personalization
  aiPreferences: {
    tone: string | null;
    feedbackStyle: string | null;
    insightDepth: string | null;
  };
}

const INITIAL_DATA: OnboardingData = {
  focusAreas: [],
  struggles: [],
  trackingStruggles: [],
  preferredTime: "",
  selectedHabits: [],
  customHabits: [],
  goalCategory: "",
  goalName: "",
  commitmentName: "",
  checkedAffirmations: [],
  uniqueAbout: "",
  currentApps: "",
  surveyAnswers: {
    survey1: null,
    survey2: null,
    survey3: null,
    survey4: null,
    survey5: null,
    survey6: null,
  },
  createdHabits: [],
  pastExperience: {
    trackingExperience: [],
    whyStopped: [],
    currentSituation: [],
    progressVisibility: [],
    emotionalCheckin: [],
    readinessSignal: [],
  },
  aiPreferences: {
    tone: null,
    feedbackStyle: null,
    insightDepth: null,
  },
};

const STEP_ORDER: OnboardingStep[] = [
  // Initial surveys
  "survey-1",
  "survey-2",
  // Section A: Past Experience (INSERT AFTER CARD 2)
  "past-tracking",
  "why-stopped",
  "current-situation",
  "progress-visibility",
  "emotional-checkin",
  "readiness-signal",
  // Continue with original surveys
  "survey-4",
  "survey-3",
  "survey-5",
  "survey-6",
  // About steps
  "about-focus",
  "about-struggle",
  "about-time",
  "tell-us-about-you",
  "why-we-exist",
  "feature-intro",
  // Original feature showcases
  "feature-goals",
  "feature-ai-buddy",
  "feature-habits",
  "feature-insights",
  "feature-outro",
  // Section C: AI Personalization (INSERT BEFORE VIDEO)
  "ai-tone",
  "ai-feedback-style",
  "ai-insight-depth",
  // Section D: Video Preview
  "video-preview",
  // Section E: Journey Transition (INSERT BEFORE habit selection)
  "journey-readiness",
  "journey-commitment",
  // Final steps
  "habit-suggestions",
  "goal-creation",
  "commitment",
  "loading",
  "success",
  "paywall",
];

export function useOnboarding() {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("survey-1");
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

  const toggleTrackingStruggle = useCallback((item: string) => {
    setData(prev => ({
      ...prev,
      trackingStruggles: prev.trackingStruggles.includes(item)
        ? prev.trackingStruggles.filter(s => s !== item)
        : [...prev.trackingStruggles, item],
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

  const setSurveyAnswer = useCallback((surveyKey: keyof OnboardingData['surveyAnswers'], answer: string) => {
    setData(prev => ({
      ...prev,
      surveyAnswers: {
        ...prev.surveyAnswers,
        [surveyKey]: answer,
      },
    }));
  }, []);

  const setCreatedHabits = useCallback((habits: CreatedHabit[]) => {
    setData(prev => ({ ...prev, createdHabits: habits }));
  }, []);

  // Past Experience toggles
  const togglePastExperienceOption = useCallback((
    key: keyof OnboardingData['pastExperience'], 
    option: string
  ) => {
    setData(prev => ({
      ...prev,
      pastExperience: {
        ...prev.pastExperience,
        [key]: prev.pastExperience[key].includes(option)
          ? prev.pastExperience[key].filter(o => o !== option)
          : [...prev.pastExperience[key], option],
      },
    }));
  }, []);

  // AI Preferences setter
  const setAIPreference = useCallback((
    key: keyof OnboardingData['aiPreferences'],
    value: string
  ) => {
    setData(prev => ({
      ...prev,
      aiPreferences: {
        ...prev.aiPreferences,
        [key]: value,
      },
    }));
  }, []);

  const completeOnboarding = useCallback(() => {
    setIsComplete(true);
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
    setCurrentStep("survey-1");
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
    toggleTrackingStruggle,
    toggleHabit,
    addCustomHabit,
    removeCustomHabit,
    toggleAffirmation,
    setSurveyAnswer,
    setCreatedHabits,
    togglePastExperienceOption,
    setAIPreference,
    completeOnboarding,
    skipOnboarding,
    getTotalSelectedHabits,
    hasCompletedOnboarding,
    resetOnboarding,
  };
}
