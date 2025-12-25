import { useEffect } from "react";
import twemoji from "@twemoji/api";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const queryClient = new QueryClient();

function EmojiRenderer() {
  useEffect(() => {
    const root = document.getElementById("root");
    if (!root) return;

    let raf = 0;
    let observer: MutationObserver | null = null;

    const parse = () => {
      // Prevent feedback loops (parsing itself mutates the DOM)
      observer?.disconnect();
      twemoji.parse(root, {
        // Use a reliable CDN base (maxcdn can be blocked in some networks)
        base: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/",
        folder: "svg",
        ext: ".svg",
      });
      observer?.observe(root, { childList: true, subtree: true, characterData: true });
    };

    observer = new MutationObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(parse);
    });

    // Initial parse + keep it in sync as UI updates
    parse();

    return () => {
      observer?.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <EmojiRenderer />
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

