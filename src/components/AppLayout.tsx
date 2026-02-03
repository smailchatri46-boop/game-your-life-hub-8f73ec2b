import { useLocation } from "react-router-dom";
import { useEffect, ReactNode } from "react";
import { Navbar } from "@/components/Navbar";
import { ReviewRequestModal } from "@/components/ReviewRequestModal";
import { usePageVisitTracker } from "@/hooks/use-page-visit-tracker";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const { markPageVisited, shouldShowReviewModal, markReviewModalShown } = usePageVisitTracker();

  // Track page visits
  useEffect(() => {
    const path = location.pathname.replace("/", "").toLowerCase() || "dashboard";
    markPageVisited(path);
  }, [location.pathname, markPageVisited]);

  return (
    <div className="min-h-screen gradient-bg">
      <Navbar />
      {children}
      
      {/* Review request modal - shows after visiting all main pages */}
      <ReviewRequestModal 
        open={shouldShowReviewModal} 
        onOpenChange={(open) => !open && markReviewModalShown()}
        onDismiss={markReviewModalShown}
      />
    </div>
  );
}
