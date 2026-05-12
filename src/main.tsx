import { createRoot } from "react-dom/client";
import { PostHogProvider } from "posthog-js/react";
import App from "./App.tsx";
import "./index.css";

const posthogOptions = {
  api_host: "https://us.i.posthog.com",
  defaults: "2025-11-30",
  autocapture: false,
  disable_session_recording: true,
  capture_performance: false,
  disable_surveys: true,
} as const;

createRoot(document.getElementById("root")!).render(
  <PostHogProvider 
    apiKey="phc_HSFpFrlX4PsVJfLy18xto81nJTGlox5eqEJ51LxEX41" 
    options={posthogOptions}
  >
    <App />
  </PostHogProvider>
);
