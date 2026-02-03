import { lazy, Suspense } from "react";
import { useInternalNavigation, InternalNavigationProvider } from "@/contexts/InternalNavigationContext";
import { Navbar } from "@/components/Navbar";
import { ReviewRequestModal } from "@/components/ReviewRequestModal";
import { usePageVisitTracker } from "@/hooks/use-page-visit-tracker";
import { useEffect } from "react";

// Lazy load pages
const Habits = lazy(() => import("@/pages/Habits"));
const Overview = lazy(() => import("@/pages/Overview"));
const Journal = lazy(() => import("@/pages/Journal"));
const Goals = lazy(() => import("@/pages/Goals"));
const Tutorials = lazy(() => import("@/pages/Tutorials"));
const VideoTutorial = lazy(() => import("@/pages/VideoTutorial"));
const Settings = lazy(() => import("@/pages/Settings"));

const PageLoader = () => null;

function InternalAppContent() {
  const { currentPage } = useInternalNavigation();
  const { markPageVisited, shouldShowReviewModal, markReviewModalShown } = usePageVisitTracker();

  // Track page visits
  useEffect(() => {
    markPageVisited(currentPage);
  }, [currentPage, markPageVisited]);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Habits />;
      case 'overview':
        return <Overview />;
      case 'journal':
        return <Journal />;
      case 'goals':
        return <Goals />;
      case 'tutorials':
        return <Tutorials />;
      case 'video-tutorial':
        return <VideoTutorial />;
      case 'settings':
        return <Settings />;
      default:
        return <Habits />;
    }
  };

  return (
    <div className="min-h-screen gradient-bg">
      <Navbar />
      <Suspense fallback={<PageLoader />}>
        {renderPage()}
      </Suspense>
      
      {/* Review request modal - shows after visiting all main pages */}
      <ReviewRequestModal 
        open={shouldShowReviewModal} 
        onOpenChange={(open) => !open && markReviewModalShown()}
        onDismiss={markReviewModalShown}
      />
    </div>
  );
}

export function InternalAppRouter() {
  return (
    <InternalNavigationProvider>
      <InternalAppContent />
    </InternalNavigationProvider>
  );
}
