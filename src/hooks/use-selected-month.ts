import { useState, useCallback, useEffect } from "react";

const STORAGE_KEY = "locked-selected-month";

export function useSelectedMonth() {
  const [selectedMonth, setSelectedMonth] = useState<Date>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = new Date(stored);
      if (!isNaN(parsed.getTime())) {
        return new Date(parsed.getFullYear(), parsed.getMonth(), 1);
      }
    }
    return new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, selectedMonth.toISOString());
  }, [selectedMonth]);

  const goToPreviousMonth = useCallback(() => {
    setSelectedMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  }, []);

  const goToNextMonth = useCallback(() => {
    setSelectedMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  }, []);

  const monthName = selectedMonth.toLocaleString('default', { month: 'long' });
  const year = selectedMonth.getFullYear();
  const month = selectedMonth.getMonth();

  const getDaysInMonth = useCallback(() => {
    return new Date(year, month + 1, 0).getDate();
  }, [year, month]);

  const getFirstDayOfMonth = useCallback(() => {
    const firstDay = new Date(year, month, 1).getDay();
    // Convert Sunday (0) to 6, Monday (1) to 0, etc. for Monday-first calendar
    return firstDay === 0 ? 6 : firstDay - 1;
  }, [year, month]);

  const isCurrentMonth = useCallback(() => {
    const now = new Date();
    return now.getFullYear() === year && now.getMonth() === month;
  }, [year, month]);

  const getCurrentDay = useCallback(() => {
    const now = new Date();
    if (now.getFullYear() === year && now.getMonth() === month) {
      return now.getDate();
    }
    return getDaysInMonth(); // If viewing past month, all days are "past"
  }, [year, month, getDaysInMonth]);

  return {
    selectedMonth,
    monthName,
    year,
    month,
    goToPreviousMonth,
    goToNextMonth,
    getDaysInMonth,
    getFirstDayOfMonth,
    isCurrentMonth,
    getCurrentDay,
  };
}
