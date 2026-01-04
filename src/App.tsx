import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/AppLayout";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import Habits from "./pages/Habits";
import Journal from "./pages/Journal";
import Overview from "./pages/Overview";
import Goals from "./pages/Goals";
import Tutorials from "./pages/Tutorials";
import VideoTutorial from "./pages/VideoTutorial";
import Settings from "./pages/Settings";
import FAQ from "./pages/FAQ";
import Pricing from "./pages/Pricing";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/signup" element={<Auth />} />
              <Route path="/login" element={<Auth />} />
              {/* App pages with persistent navbar */}
              <Route element={<AppLayout />}>
                <Route path="/dashboard" element={<Habits />} />
                <Route path="/journal" element={<Journal />} />
                <Route path="/overview" element={<Overview />} />
                <Route path="/goals" element={<Goals />} />
                <Route path="/tutorials" element={<Tutorials />} />
                <Route path="/video-tutorial" element={<VideoTutorial />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
