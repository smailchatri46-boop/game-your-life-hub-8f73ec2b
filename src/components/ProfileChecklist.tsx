import { useState, useEffect } from "react";
import { GlassCard } from "@/components/GlassCard";
import { AppleEmoji } from "@/components/AppleEmoji";
import { Check, Bookmark, Target, Calendar, Star, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChecklistItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  emoji: string;
  completed: boolean;
  delayDays?: number;
  action?: () => void;
}

interface ProfileChecklistProps {
  onOpenOnboarding: () => void;
}

export function ProfileChecklist({ onOpenOnboarding }: ProfileChecklistProps) {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  
  useEffect(() => {
    // Get signup date from localStorage (or set it now if first time)
    const signupDate = localStorage.getItem("locked_signup_date");
    if (!signupDate) {
      localStorage.setItem("locked_signup_date", new Date().toISOString());
    }
    
    // Calculate days since signup
    const daysSinceSignup = signupDate 
      ? Math.floor((Date.now() - new Date(signupDate).getTime()) / (1000 * 60 * 60 * 24))
      : 0;
    
    // Load completed items from localStorage
    const savedCompleted = JSON.parse(localStorage.getItem("locked_profile_checklist") || "{}");
    
    const baseItems: ChecklistItem[] = [
      {
        id: "bookmark",
        label: "Bookmark the website",
        icon: <Bookmark className="w-4 h-4" />,
        emoji: "🔖",
        completed: savedCompleted.bookmark || false,
      },
      {
        id: "goals",
        label: "Share your goals and life direction",
        icon: <Target className="w-4 h-4" />,
        emoji: "🎯",
        completed: savedCompleted.goals || false,
        action: onOpenOnboarding,
      },
      {
        id: "quarterly",
        label: "Set yearly or quarterly goals",
        icon: <Calendar className="w-4 h-4" />,
        emoji: "📅",
        completed: savedCompleted.quarterly || false,
      },
    ];
    
    // Only show review task after 3 days
    if (daysSinceSignup >= 3) {
      baseItems.push({
        id: "review",
        label: "Write a review",
        icon: <Star className="w-4 h-4" />,
        emoji: "⭐",
        completed: savedCompleted.review || false,
        delayDays: 3,
      });
    }
    
    setItems(baseItems);
  }, [onOpenOnboarding]);
  
  const toggleItem = (id: string) => {
    const item = items.find(i => i.id === id);
    
    // If item has an action and is not completed, trigger the action
    if (item?.action && !item.completed) {
      item.action();
      return;
    }
    
    setItems(prev => {
      const updated = prev.map(item => 
        item.id === id ? { ...item, completed: !item.completed } : item
      );
      
      // Save to localStorage
      const completedState = updated.reduce((acc, item) => {
        acc[item.id] = item.completed;
        return acc;
      }, {} as Record<string, boolean>);
      localStorage.setItem("locked_profile_checklist", JSON.stringify(completedState));
      
      return updated;
    });
  };
  
  const completedCount = items.filter(i => i.completed).length;
  const totalCount = items.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  
  // Mark goals as complete from onboarding
  const markGoalsComplete = () => {
    setItems(prev => {
      const updated = prev.map(item => 
        item.id === "goals" ? { ...item, completed: true } : item
      );
      
      const completedState = updated.reduce((acc, item) => {
        acc[item.id] = item.completed;
        return acc;
      }, {} as Record<string, boolean>);
      localStorage.setItem("locked_profile_checklist", JSON.stringify(completedState));
      
      return updated;
    });
  };
  
  // Expose the markGoalsComplete function via a custom event
  useEffect(() => {
    const handleGoalsCompleted = () => markGoalsComplete();
    window.addEventListener("onboarding_goals_completed", handleGoalsCompleted);
    return () => window.removeEventListener("onboarding_goals_completed", handleGoalsCompleted);
  }, []);
  
  if (completedCount === totalCount && totalCount > 0) {
    return null; // Hide when all completed
  }
  
  return (
    <GlassCard className="p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <AppleEmoji emoji="✨" size="xl" />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold">Complete your profile</h3>
            <p className="text-sm text-muted-foreground">{completedCount}/{totalCount} completed</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-primary">{progressPercent}%</span>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="h-2 bg-secondary rounded-full mb-6 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      
      {/* Checklist items */}
      <div className="space-y-3">
        {items.map(item => (
          <button
            key={item.id}
            onClick={() => toggleItem(item.id)}
            className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-200 ${
              item.completed 
                ? 'bg-primary/10 border border-primary/20' 
                : 'bg-secondary/50 hover:bg-secondary border border-transparent'
            }`}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
              item.completed 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted border-2 border-muted-foreground/30'
            }`}>
              {item.completed && <Check className="w-4 h-4" />}
            </div>
            <AppleEmoji emoji={item.emoji} size="xl" />
            <span className={`flex-1 text-left text-sm font-medium ${
              item.completed ? 'text-muted-foreground line-through' : 'text-foreground'
            }`}>
              {item.label}
            </span>
            {item.delayDays && (
              <span className="text-xs px-2 py-1 bg-accent/20 text-accent rounded-full">
                Unlocked after {item.delayDays} days
              </span>
            )}
          </button>
        ))}
      </div>
    </GlassCard>
  );
}
