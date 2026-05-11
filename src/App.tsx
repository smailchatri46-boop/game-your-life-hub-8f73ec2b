import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/contexts/AuthContext";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import { AppLayout } from "@/components/AppLayout";
import { SubscriptionGate } from "@/components/SubscriptionGate";
import { AuthRedirect } from "@/components/AuthRedirect";
import { AuthGuard } from "@/components/AuthGuard";
import { DomainRedirect } from "@/components/DomainRedirect";

// Critical path - load immediately
import Landing from "./pages/Landing";

// Lazy load non-critical pages
const Auth = lazy(() => import("./pages/Auth"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const Habits = lazy(() => import("./pages/Habits"));
const Journal = lazy(() => import("./pages/Journal"));
const Overview = lazy(() => import("./pages/Overview"));
const Goals = lazy(() => import("./pages/Goals"));
const Tutorials = lazy(() => import("./pages/Tutorials"));
const VideoTutorial = lazy(() => import("./pages/VideoTutorial"));
const Settings = lazy(() => import("./pages/Settings"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Contact = lazy(() => import("./pages/Contact"));
const About = lazy(() => import("./pages/About"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const Cookies = lazy(() => import("./pages/Cookies"));
const Refund = lazy(() => import("./pages/Refund"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Paywall = lazy(() => import("./pages/Paywall"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
      refetchOnWindowFocus: false,
    },
  },
});

// No loading fallback - instant navigation
const PageLoader = () => null;

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <SubscriptionProvider>
            <DomainRedirect />
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  {/* Root path - redirect authenticated users to dashboard */}
                  <Route path="/" element={<AuthRedirect><Landing /></AuthRedirect>} />
                  
                  {/* Public routes - no authentication required */}
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/cookies" element={<Cookies />} />
                  <Route path="/refund" element={<Refund />} />
                  <Route path="/contact" element={<Contact />} />
                  
                  {/* Auth routes - redirect if already authenticated */}
                  <Route path="/auth" element={<AuthGuard><Auth /></AuthGuard>} />
                  <Route path="/signup" element={<AuthGuard><Auth /></AuthGuard>} />
                  <Route path="/login" element={<AuthGuard><Auth /></AuthGuard>} />
                  
                  {/* Onboarding, paywall, and payment success - require auth but not subscription */}
                  <Route path="/onboarding" element={<Onboarding />} />
                  <Route path="/paywall" element={<Paywall />} />
                  <Route path="/payment-success" element={<PaymentSuccess />} />
                  
                  {/* Protected routes - require active subscription */}
                  <Route element={<SubscriptionGate><AppLayout /></SubscriptionGate>}>
                    <Route path="/dashboard" element={<Habits />} />
                    <Route path="/journal" element={<Journal />} />
                    <Route path="/overview" element={<Overview />} />
                    <Route path="/goals" element={<Goals />} />
                    <Route path="/tutorials" element={<Tutorials />} />
                    <Route path="/video-tutorial" element={<VideoTutorial />} />
                    <Route path="/settings" element={<Settings />} />
                  </Route>
                  
                  {/* 404 - catch all unknown routes */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </SubscriptionProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
