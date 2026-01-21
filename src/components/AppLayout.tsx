import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { ReviewRequestModal } from "@/components/ReviewRequestModal";
import { MobileNotificationBanner } from "@/components/MobileNotificationBanner";
import { usePageVisitTracker } from "@/hooks/use-page-visit-tracker";

export function AppLayout() {
  const location = useLocation();
  const { markPageVisited, shouldShowReviewModal, markReviewModalShown } = usePageVisitTracker();

  // Track page visits
  useEffect(() => {
    const path = location.pathname.replace("/", "").toLowerCase() || "overview";
    markPageVisited(path);
  }, [location.pathname, markPageVisited]);

  return (
    <div className="min-h-screen gradient-bg">
      <Navbar />
      <Outlet />
      
      {/* Mobile notification banner */}
      <MobileNotificationBanner />
      
      {/* Review request modal - shows after visiting all main pages */}
      <ReviewRequestModal 
        open={shouldShowReviewModal} 
        onOpenChange={(open) => !open && markReviewModalShown()}
        onDismiss={markReviewModalShown}
      />
    </div>
  );
}
