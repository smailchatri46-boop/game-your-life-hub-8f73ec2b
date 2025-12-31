import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GlassCard } from "@/components/GlassCard";
import { AppleEmoji } from "@/components/AppleEmoji";
import { Check, Bookmark, Target, BookOpen, Sparkles, PlayCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface ChecklistItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  emoji: string;
  completed: boolean;
  current: number;
  target: number;
  action?: () => void;
}

export function SettingsChecklist() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchProgress = async () => {
      // Check localStorage values
      const bookmarked = localStorage.getItem("locked_bookmarked") === "true";
      const tutorialsChecked = localStorage.getItem("locked_tutorials_checked") === "true";

      let goalsCount = 0;
      let journalsCount = 0;
      let habitsCount = 0;

      if (user) {
        try {
          // Fetch counts from database in parallel
          const [goalsRes, journalsRes, habitsRes] = await Promise.all([
            supabase.from("goals").select("id", { count: "exact" }).eq("user_id", user.id),
            supabase.from("journal_entries").select("id", { count: "exact" }).eq("user_id", user.id),
            supabase.from("habits").select("id", { count: "exact" }).eq("user_id", user.id),
          ]);

          goalsCount = goalsRes.count || 0;
          journalsCount = journalsRes.count || 0;
          habitsCount = habitsRes.count || 0;
        } catch (error) {
          console.error("Error fetching checklist progress:", error);
        }
      }

      const checklistItems: ChecklistItem[] = [
        {
          id: "bookmark",
          label: "Bookmark Locked",
          icon: <Bookmark className="w-4 h-4" />,
          emoji: "🔖",
          completed: bookmarked,
          current: bookmarked ? 1 : 0,
          target: 1,
        },
        {
          id: "goals",
          label: "Add 2 goals",
          icon: <Target className="w-4 h-4" />,
          emoji: "🎯",
          completed: goalsCount >= 2,
          current: Math.min(goalsCount, 2),
          target: 2,
        },
        {
          id: "journals",
          label: "Add 2 journal entries",
          icon: <BookOpen className="w-4 h-4" />,
          emoji: "📔",
          completed: journalsCount >= 2,
          current: Math.min(journalsCount, 2),
          target: 2,
        },
        {
          id: "habits",
          label: "Add 3 habits",
          icon: <Sparkles className="w-4 h-4" />,
          emoji: "✨",
          completed: habitsCount >= 3,
          current: Math.min(habitsCount, 3),
          target: 3,
        },
        {
          id: "tutorials",
          label: "Check the tutorials tab",
          icon: <PlayCircle className="w-4 h-4" />,
          emoji: "🎬",
          completed: tutorialsChecked,
          current: tutorialsChecked ? 1 : 0,
          target: 1,
        },
      ];

      setItems(checklistItems);
      setLoading(false);
    };

    fetchProgress();
  }, [user]);
  
  const handleItemClick = (id: string) => {
    if (id === "bookmark") {
      const newValue = !items.find(i => i.id === "bookmark")?.completed;
      localStorage.setItem("locked_bookmarked", String(newValue));
      setItems(prev => prev.map(item => 
        item.id === "bookmark" 
          ? { ...item, completed: newValue, current: newValue ? 1 : 0 } 
          : item
      ));
    } else if (id === "tutorials") {
      localStorage.setItem("locked_tutorials_checked", "true");
      setItems(prev => prev.map(item => 
        item.id === "tutorials" 
          ? { ...item, completed: true, current: 1 } 
          : item
      ));
      navigate("/tutorials");
    } else if (id === "goals") {
      navigate("/goals");
    } else if (id === "journals") {
      navigate("/journal");
    } else if (id === "habits") {
      navigate("/dashboard");
    }
  };
  
  const completedCount = items.filter(i => i.completed).length;
  const totalCount = items.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  
  if (loading) {
    return (
      <GlassCard className="p-6 mb-6">
        <div className="animate-pulse">
          <div className="h-6 bg-secondary/50 rounded w-1/3 mb-4"></div>
          <div className="h-2 bg-secondary/50 rounded mb-6"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-14 bg-secondary/30 rounded-xl"></div>
            ))}
          </div>
        </div>
      </GlassCard>
    );
  }
  
  if (completedCount === totalCount && totalCount > 0) {
    return null; // Hide when all completed
  }
  
  return (
    <GlassCard className="p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <AppleEmoji emoji="🚀" size="xl" />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold text-foreground">Getting Started</h3>
            <p className="text-sm text-muted-foreground">{completedCount}/{totalCount} completed</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-primary">{progressPercent}%</span>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="h-2 bg-secondary rounded-full mb-4 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      
      {/* Message */}
      <p className="text-sm text-muted-foreground mb-6">
        Complete these tasks to unlock all features except AI chat
      </p>
      
      {/* Checklist items */}
      <div className="space-y-3">
        {items.map(item => (
          <button
            key={item.id}
            onClick={() => handleItemClick(item.id)}
            className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-200 cursor-pointer ${
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
            {!item.completed && item.target > 1 && (
              <span className="text-xs px-2 py-1 bg-secondary text-muted-foreground rounded-full">
                {item.current}/{item.target}
              </span>
            )}
          </button>
        ))}
      </div>
    </GlassCard>
  );
}
