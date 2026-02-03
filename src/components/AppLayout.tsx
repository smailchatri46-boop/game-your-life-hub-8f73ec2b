import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { ReviewRequestModal } from "@/components/ReviewRequestModal";
import { usePageVisitTracker } from "@/hooks/use-page-visit-tracker";
import { useUrlHide } from "@/hooks/use-url-hide";

export function AppLayout() {
  const location = useLocation();
  const { markPageVisited, shouldShowReviewModal, markReviewModalShown } = usePageVisitTracker();
  
  // Hide URL paths for cleaner look
  useUrlHide();

  // Track page visits
  useEffect(() => {
    const path = location.pathname.replace("/", "").toLowerCase() || "overview";
    markPageVisited(path);
  }, [location.pathname, markPageVisited]);

  return (
    <div className="min-h-screen gradient-bg">
      <Navbar />
      <Outlet />
      
      {/* Review request modal - shows after visiting all main pages */}
      <ReviewRequestModal 
        open={shouldShowReviewModal} 
        onOpenChange={(open) => !open && markReviewModalShown()}
        onDismiss={markReviewModalShown}
      />
    </div>
  );
}
