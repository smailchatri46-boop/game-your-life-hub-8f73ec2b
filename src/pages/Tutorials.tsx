import { Navbar } from "@/components/Navbar";
import { GlassCard } from "@/components/GlassCard";
import { Emoji } from "@/components/Emoji";
import { Play, Clock } from "lucide-react";

interface Tutorial {
  id: string;
  title: string;
  description: string;
  duration: string;
  thumbnail: string;
  category: string;
}

const tutorials: Tutorial[] = [
  {
    id: "1",
    title: "Getting Started with Locked",
    description: "Learn the basics of tracking your habits and setting up your first goals.",
    duration: "5 min",
    thumbnail: "🎯",
    category: "Basics",
  },
  {
    id: "2",
    title: "Mastering the Dashboard",
    description: "Understand all the stats, progress indicators, and how to interpret your data.",
    duration: "7 min",
    thumbnail: "📊",
    category: "Dashboard",
  },
  {
    id: "3",
    title: "Building Effective Habits",
    description: "Tips and strategies for creating habits that stick using the habits tracker.",
    duration: "10 min",
    thumbnail: "✅",
    category: "Habits",
  },
  {
    id: "4",
    title: "Monthly Overview Guide",
    description: "How to use the calendar view to track your progress over time.",
    duration: "4 min",
    thumbnail: "📅",
    category: "Overview",
  },
  {
    id: "5",
    title: "Journaling for Growth",
    description: "Make the most of the journal feature to reflect and improve.",
    duration: "6 min",
    thumbnail: "📝",
    category: "Journal",
  },
  {
    id: "6",
    title: "AI Coach Features",
    description: "Unlock the power of AI coaching for personalized insights and motivation.",
    duration: "8 min",
    thumbnail: "🤖",
    category: "AI Chat",
  },
  {
    id: "7",
    title: "Leveling Up & Gamification",
    description: "Understanding XP, levels, streaks, and how to stay motivated.",
    duration: "5 min",
    thumbnail: "🏆",
    category: "Gamification",
  },
  {
    id: "8",
    title: "Pro Tips & Tricks",
    description: "Advanced strategies from power users to maximize your productivity.",
    duration: "12 min",
    thumbnail: "💡",
    category: "Advanced",
  },
];

export default function Tutorials() {
  return (
    <div className="min-h-screen gradient-bg">
      <Navbar />
      
      <main className="pt-28 pb-12 px-4 max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-semibold">Tutorials</h1>
          <p className="text-muted-foreground mt-1">Learn how to get the most out of Locked</p>
        </div>
        
        {/* Tutorial Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {tutorials.map((tutorial, index) => (
            <GlassCard 
              key={tutorial.id} 
              className="overflow-hidden group cursor-pointer animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` } as React.CSSProperties}
              hover
            >
              <div className="aspect-video bg-gradient-to-br from-secondary to-muted flex items-center justify-center relative">
                <Emoji emoji={tutorial.thumbnail} size="5xl" className="w-16 h-16" />
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-large">
                    <Play className="w-6 h-6 text-primary-foreground ml-1" />
                  </div>
                </div>
                <span className="absolute top-3 left-3 px-2 py-1 bg-card/80 backdrop-blur-sm rounded-lg text-xs font-medium">
                  {tutorial.category}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-display text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                  {tutorial.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {tutorial.description}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{tutorial.duration}</span>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </main>
    </div>
  );
}
