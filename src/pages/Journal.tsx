import { Navbar } from "@/components/Navbar";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

interface JournalEntry {
  id: string;
  content: string;
  date: string;
  time: string;
  emoji?: string;
  bgColor: string;
}

const bgColors = [
  "bg-journal-orange",
  "bg-journal-yellow",
  "bg-journal-green",
  "bg-journal-purple",
  "bg-journal-pink",
];

const initialEntries: JournalEntry[] = [
  {
    id: "1",
    content: "Today was incredibly productive! I managed to complete all my morning habits and even had time for a 30-minute walk. The meditation session really helped me focus throughout the day. I'm feeling grateful for the progress I've made this week.",
    date: "December 25, 2025",
    time: "8:45 PM",
    emoji: "🥳",
    bgColor: bgColors[0],
  },
  {
    id: "2",
    content: "Had a slower start today but picked up momentum after lunch. Sometimes it's okay to take things easy. The important thing is that I showed up and did what I could. Tomorrow is a new opportunity.",
    date: "December 24, 2025",
    time: "9:30 PM",
    emoji: "😌",
    bgColor: bgColors[1],
  },
  {
    id: "3",
    content: "Feeling motivated after watching some tutorials on habit building. The concept of 'atomic habits' really resonates with me. Small changes compound over time. I'm excited to implement what I learned.",
    date: "December 23, 2025",
    time: "7:15 PM",
    emoji: "💡",
    bgColor: bgColors[2],
  },
  {
    id: "4",
    content: "Struggled with focus today. Too many distractions from social media. Need to be more intentional about screen time. Setting a goal to reduce usage to under 1 hour tomorrow.",
    date: "December 22, 2025",
    time: "10:00 PM",
    emoji: "🤔",
    bgColor: bgColors[3],
  },
  {
    id: "5",
    content: "Amazing workout today! Hit a new personal record on my running distance. The consistency is paying off. My energy levels have improved significantly since I started tracking my habits.",
    date: "December 21, 2025",
    time: "6:30 PM",
    emoji: "💪",
    bgColor: bgColors[4],
  },
];

export default function Journal() {
  const [entries, setEntries] = useState<JournalEntry[]>(initialEntries);

  const deleteEntry = (id: string) => {
    setEntries(entries.filter(e => e.id !== id));
  };

  return (
    <div className="min-h-screen gradient-bg">
      <Navbar />
      
      <main className="pt-28 pb-12 px-4 max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-semibold">Journal</h1>
            <p className="text-muted-foreground mt-1">Reflect on your journey</p>
          </div>
          <Button variant="gradient" size="lg">
            <Plus className="w-5 h-5 mr-2" />
            New Entry
          </Button>
        </div>
        
        {/* Journal Entries */}
        <div className="space-y-6">
          {entries.map((entry, index) => (
            <div
              key={entry.id}
              className={`${entry.bgColor} rounded-3xl p-6 shadow-soft transition-all duration-300 hover:shadow-medium animate-fade-in`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {entry.emoji && (
                    <span className="text-2xl">{entry.emoji}</span>
                  )}
                  <div>
                    <p className="font-semibold text-foreground">{entry.date}</p>
                    <p className="text-sm text-muted-foreground">{entry.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-xl hover:bg-card/50 text-muted-foreground hover:text-foreground transition-colors">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => deleteEntry(entry.id)}
                    className="p-2 rounded-xl hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <p className="text-foreground leading-relaxed">
                {entry.content}
              </p>
            </div>
          ))}
        </div>
        
        {entries.length === 0 && (
          <GlassCard className="p-12 text-center">
            <span className="text-5xl mb-4 block">📝</span>
            <h3 className="font-display text-xl font-semibold mb-2">No entries yet</h3>
            <p className="text-muted-foreground mb-6">
              Start journaling to track your thoughts and progress
            </p>
            <Button variant="gradient">
              <Plus className="w-5 h-5 mr-2" />
              Write your first entry
            </Button>
          </GlassCard>
        )}
      </main>
    </div>
  );
}
