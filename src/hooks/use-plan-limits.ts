import { useState, useEffect, useCallback } from 'react';

export type PlanType = 'free' | 'core' | 'pro';

export interface PlanLimits {
  maxHabits: number;
  maxGoals: number;
  maxTodosPerDay: number;
  hasAIAccess: boolean;
}

export interface UsageData {
  habitsCount: number;
  goalsCount: number;
  todosToday: number;
  todosDate: string; // YYYY-MM-DD format to reset daily
}

const PLAN_LIMITS: Record<PlanType, PlanLimits> = {
  free: {
    maxHabits: 2,
    maxGoals: 1,
    maxTodosPerDay: 3,
    hasAIAccess: false,
  },
  core: {
    maxHabits: 6,
    maxGoals: 4,
    maxTodosPerDay: Infinity,
    hasAIAccess: false,
  },
  pro: {
    maxHabits: Infinity,
    maxGoals: Infinity,
    maxTodosPerDay: Infinity,
    hasAIAccess: true,
  },
};

const STORAGE_KEY = 'neyler_usage_data';
const PLAN_STORAGE_KEY = 'neyler_current_plan';

const getToday = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const getDefaultUsage = (): UsageData => ({
  habitsCount: 0,
  goalsCount: 0,
  todosToday: 0,
  todosDate: getToday(),
});

export type LimitType = 'habits' | 'goals' | 'todos';

export function usePlanLimits() {
  const [currentPlan, setCurrentPlanState] = useState<PlanType>('free');
  const [usage, setUsage] = useState<UsageData>(getDefaultUsage);

  // Load from localStorage on mount
  useEffect(() => {
    const savedPlan = localStorage.getItem(PLAN_STORAGE_KEY) as PlanType | null;
    if (savedPlan && ['free', 'core', 'pro'].includes(savedPlan)) {
      setCurrentPlanState(savedPlan);
    }

    const savedUsage = localStorage.getItem(STORAGE_KEY);
    if (savedUsage) {
      try {
        const parsed = JSON.parse(savedUsage) as UsageData;
        // Reset todos if it's a new day
        if (parsed.todosDate !== getToday()) {
          parsed.todosToday = 0;
          parsed.todosDate = getToday();
        }
        setUsage(parsed);
      } catch {
        setUsage(getDefaultUsage());
      }
    }
  }, []);

  // Persist usage to localStorage
  const persistUsage = useCallback((newUsage: UsageData) => {
    setUsage(newUsage);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUsage));
  }, []);

  const setCurrentPlan = useCallback((plan: PlanType) => {
    setCurrentPlanState(plan);
    localStorage.setItem(PLAN_STORAGE_KEY, plan);
  }, []);

  const limits = PLAN_LIMITS[currentPlan];

  // Check if a specific limit is reached
  const canAddHabit = usage.habitsCount < limits.maxHabits;
  const canAddGoal = usage.goalsCount < limits.maxGoals;
  const canAddTodo = usage.todosToday < limits.maxTodosPerDay;

  // Increment counts
  const incrementHabits = useCallback(() => {
    const newUsage = { ...usage, habitsCount: usage.habitsCount + 1 };
    persistUsage(newUsage);
  }, [usage, persistUsage]);

  const decrementHabits = useCallback(() => {
    const newUsage = { ...usage, habitsCount: Math.max(0, usage.habitsCount - 1) };
    persistUsage(newUsage);
  }, [usage, persistUsage]);

  const incrementGoals = useCallback(() => {
    const newUsage = { ...usage, goalsCount: usage.goalsCount + 1 };
    persistUsage(newUsage);
  }, [usage, persistUsage]);

  const decrementGoals = useCallback(() => {
    const newUsage = { ...usage, goalsCount: Math.max(0, usage.goalsCount - 1) };
    persistUsage(newUsage);
  }, [usage, persistUsage]);

  const incrementTodos = useCallback(() => {
    // Reset if it's a new day
    const today = getToday();
    if (usage.todosDate !== today) {
      const newUsage = { ...usage, todosToday: 1, todosDate: today };
      persistUsage(newUsage);
    } else {
      const newUsage = { ...usage, todosToday: usage.todosToday + 1 };
      persistUsage(newUsage);
    }
  }, [usage, persistUsage]);

  const decrementTodos = useCallback(() => {
    const newUsage = { ...usage, todosToday: Math.max(0, usage.todosToday - 1) };
    persistUsage(newUsage);
  }, [usage, persistUsage]);

  // Set exact counts (useful for syncing with actual data)
  const setHabitsCount = useCallback((count: number) => {
    const newUsage = { ...usage, habitsCount: count };
    persistUsage(newUsage);
  }, [usage, persistUsage]);

  const setGoalsCount = useCallback((count: number) => {
    const newUsage = { ...usage, goalsCount: count };
    persistUsage(newUsage);
  }, [usage, persistUsage]);

  const setTodosCount = useCallback((count: number) => {
    const today = getToday();
    const newUsage = { ...usage, todosToday: count, todosDate: today };
    persistUsage(newUsage);
  }, [usage, persistUsage]);

  // Get limit message for paywall
  const getLimitMessage = (limitType: LimitType): string => {
    switch (limitType) {
      case 'habits':
        return `You've reached your limit of ${limits.maxHabits} habit${limits.maxHabits === 1 ? '' : 's'}. Upgrade your plan to add more habits and unlock your full potential.`;
      case 'goals':
        return `You've reached your limit of ${limits.maxGoals} goal${limits.maxGoals === 1 ? '' : 's'}. Upgrade your plan to set more goals and achieve greater success.`;
      case 'todos':
        return `You've reached your daily limit of ${limits.maxTodosPerDay} task${limits.maxTodosPerDay === 1 ? '' : 's'}. Upgrade your plan for unlimited daily tasks.`;
      default:
        return 'You have reached your plan limit. Upgrade to unlock more features.';
    }
  };

  return {
    currentPlan,
    setCurrentPlan,
    limits,
    usage,
    canAddHabit,
    canAddGoal,
    canAddTodo,
    incrementHabits,
    decrementHabits,
    incrementGoals,
    decrementGoals,
    incrementTodos,
    decrementTodos,
    setHabitsCount,
    setGoalsCount,
    setTodosCount,
    getLimitMessage,
  };
}
