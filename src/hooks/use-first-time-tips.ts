import { useState, useCallback } from "react";

export type TipType = "habit" | "mood" | "journal";

interface TipConfig {
  title: string;
  messages: string[];
}

const TIP_CONFIGS: Record<TipType, TipConfig> = {
  habit: {
    title: "Great start!",
    messages: [
      "Start small. Choose habits you can definitely keep. Consistency beats intensity.",
      "Most people overestimate what they can do in a week. Keep habits tiny to prevent burnout.",
      "Make habits so easy they're hard to skip.",
    ],
  },
  mood: {
    title: "Tracking your feelings",
    messages: [
      "Logging how you feel regularly helps you notice patterns over time.",
      "There are no 'good' or 'bad' emotions. Just be honest with yourself.",
    ],
  },
  journal: {
    title: "Your space to reflect",
    messages: [
      "Your journal is for you. No rules, no grammar needed—just write how you feel.",
      "Short entries still count. One sentence is progress.",
    ],
  },
};

const STORAGE_KEY = "first-time-tips-shown";

type ShownTips = Partial<Record<TipType, boolean>>;

function getShownTips(): ShownTips {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function saveShownTips(tips: ShownTips) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tips));
  } catch {
    // localStorage unavailable
  }
}

export function useFirstTimeTips() {
  const [activeTip, setActiveTip] = useState<TipType | null>(null);
  const [tipMessage, setTipMessage] = useState<{ title: string; message: string } | null>(null);

  const triggerTip = useCallback((type: TipType) => {
    const shown = getShownTips();
    
    if (shown[type]) {
      return; // Already shown
    }

    const config = TIP_CONFIGS[type];
    const randomMessage = config.messages[Math.floor(Math.random() * config.messages.length)];
    
    setTipMessage({ title: config.title, message: randomMessage });
    setActiveTip(type);
  }, []);

  const dismissTip = useCallback((dontShowAgain: boolean = true) => {
    if (activeTip && dontShowAgain) {
      const shown = getShownTips();
      shown[activeTip] = true;
      saveShownTips(shown);
    }
    setActiveTip(null);
    setTipMessage(null);
  }, [activeTip]);

  const shouldShowTip = useCallback((type: TipType): boolean => {
    const shown = getShownTips();
    return !shown[type];
  }, []);

  return {
    activeTip,
    tipMessage,
    triggerTip,
    dismissTip,
    shouldShowTip,
  };
}
