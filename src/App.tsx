import { useEffect } from "react";
import twemoji from "@twemoji/api";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Signup from "./pages/Signup";
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

    let debounceTimer: number;
    let isProcessing = false;

    const parse = () => {
      if (isProcessing) return;
      isProcessing = true;
      
      // Parse all text nodes for emojis
      twemoji.parse(root, {
        base: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/",
        folder: "svg",
        ext: ".svg",
        className: "emoji",
      });
      
      // Small delay before allowing next parse to prevent infinite loops
      setTimeout(() => {
        isProcessing = false;
      }, 50);
    };

    // Initial parse
    parse();

    // Use MutationObserver with debounce for dynamic content
    const observer = new MutationObserver((mutations) => {
      // Skip if mutations are only from emoji img elements
      const hasRelevantChanges = mutations.some(m => {
        if (m.type === "childList") {
          return Array.from(m.addedNodes).some(
            node => !(node instanceof HTMLImageElement && (node as HTMLImageElement).classList.contains("emoji"))
          );
        }
        return m.type === "characterData";
      });

      if (hasRelevantChanges) {
        clearTimeout(debounceTimer);
        debounceTimer = window.setTimeout(parse, 100);
      }
    });

    observer.observe(root, { 
      childList: true, 
      subtree: true, 
      characterData: true 
    });

    return () => {
      observer.disconnect();
      clearTimeout(debounceTimer);
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
          <Route path="/dashboard" element={<Habits />} />
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

