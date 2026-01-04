import { useState, useEffect, useCallback } from "react";

// Map routes to page names for tracking
const ROUTE_TO_PAGE: Record<string, string> = {
  "dashboard": "habits",
  "habits": "habits",
  "overview": "overview",
  "journal": "journal",
  "goals": "goals",
};

const REQUIRED_PAGES = ["overview", "habits", "journal", "goals"];
const STORAGE_KEY = "neyler_visited_pages";
const REVIEW_SHOWN_KEY = "neyler_review_modal_shown";
const WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

interface ReviewData {
  shownAt: number;
}

export function usePageVisitTracker() {
  const [visitedPages, setVisitedPages] = useState<string[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  const [reviewData, setReviewData] = useState<ReviewData | null>(() => {
    const stored = localStorage.getItem(REVIEW_SHOWN_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  const [shouldShowReviewModal, setShouldShowReviewModal] = useState(false);

  // Check if a week has passed since last shown
  // TODO: Re-enable weekly check after testing
  const hasWeekPassed = useCallback(() => {
    // For testing: always return true to show modal every time
    return true;
    // Production logic:
    // if (!reviewData) return true;
    // return Date.now() - reviewData.shownAt >= WEEK_IN_MS;
  }, [reviewData]);

  const markPageVisited = useCallback((route: string) => {
    const normalizedRoute = route.toLowerCase().replace("/", "");
    const pageName = ROUTE_TO_PAGE[normalizedRoute] || normalizedRoute;
    
    setVisitedPages((prev) => {
      if (prev.includes(pageName)) return prev;
      
      const updated = [...prev, pageName];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const markReviewModalShown = useCallback(() => {
    const newData: ReviewData = { shownAt: Date.now() };
    setReviewData(newData);
    localStorage.setItem(REVIEW_SHOWN_KEY, JSON.stringify(newData));
    setShouldShowReviewModal(false);
    
    // Reset visited pages so they need to visit again next week
    setVisitedPages([]);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  }, []);

  // Check if all required pages have been visited
  useEffect(() => {
    // Only show if a week has passed since last time
    if (!hasWeekPassed()) return;

    const allPagesVisited = REQUIRED_PAGES.every((page) =>
      visitedPages.includes(page)
    );

    if (allPagesVisited) {
      // Small delay to let the page render first
      const timer = setTimeout(() => {
        setShouldShowReviewModal(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [visitedPages, hasWeekPassed]);

  return {
    visitedPages,
    markPageVisited,
    shouldShowReviewModal,
    markReviewModalShown,
  };
}
