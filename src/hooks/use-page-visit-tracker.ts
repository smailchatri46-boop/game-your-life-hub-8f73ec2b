import { useState, useEffect, useCallback } from "react";

const REQUIRED_PAGES = ["overview", "habits", "journal", "goals"];
const STORAGE_KEY = "neyler_visited_pages";
const REVIEW_SHOWN_KEY = "neyler_review_modal_shown";

export function usePageVisitTracker() {
  const [visitedPages, setVisitedPages] = useState<string[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  const [hasSeenReviewModal, setHasSeenReviewModal] = useState(() => {
    return localStorage.getItem(REVIEW_SHOWN_KEY) === "true";
  });

  const [shouldShowReviewModal, setShouldShowReviewModal] = useState(false);

  const markPageVisited = useCallback((page: string) => {
    const normalizedPage = page.toLowerCase().replace("/", "");
    
    setVisitedPages((prev) => {
      if (prev.includes(normalizedPage)) return prev;
      
      const updated = [...prev, normalizedPage];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const markReviewModalShown = useCallback(() => {
    setHasSeenReviewModal(true);
    localStorage.setItem(REVIEW_SHOWN_KEY, "true");
    setShouldShowReviewModal(false);
  }, []);

  // Check if all required pages have been visited
  useEffect(() => {
    if (hasSeenReviewModal) return;

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
  }, [visitedPages, hasSeenReviewModal]);

  return {
    visitedPages,
    markPageVisited,
    shouldShowReviewModal,
    markReviewModalShown,
  };
}
