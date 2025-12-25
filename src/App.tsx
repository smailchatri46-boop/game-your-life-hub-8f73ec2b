import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Landing from "./pages/Landing";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Habits from "./pages/Habits";
import Journal from "./pages/Journal";
import Overview from "./pages/Overview";
import AIChat from "./pages/AIChat";
import Tutorials from "./pages/Tutorials";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

declare global {
  interface Window {
    twemoji: {
      parse: (element: HTMLElement | string, options?: object) => void;
    };
  }
}

const queryClient = new QueryClient();

function TwemojiParser() {
  const location = useLocation();
  
  useEffect(() => {
    // Parse emojis after route changes and DOM updates
    const timeout = setTimeout(() => {
      if (window.twemoji) {
        window.twemoji.parse(document.body, {
          folder: 'svg',
          ext: '.svg',
        });
      }
    }, 100);
    return () => clearTimeout(timeout);
  }, [location.pathname]);

  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <TwemojiParser />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/habits" element={<Habits />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/overview" element={<Overview />} />
          <Route path="/ai-chat" element={<AIChat />} />
          <Route path="/tutorials" element={<Tutorials />} />
          <Route path="/settings" element={<Settings />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
