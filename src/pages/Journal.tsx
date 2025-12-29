import { Navbar } from "@/components/Navbar";
import { GlassCard } from "@/components/GlassCard";
import { AppleEmoji } from "@/components/AppleEmoji";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useState, useMemo } from "react";

interface JournalEntry {
  id: string;
  content: string;
  date: string;
  time: string;
  emoji?: string;
  bgColor: string;
  createdAt: number; // timestamp for 24-hour logic
}

// Map emojis to specific background colors and modal tints
const emojiToColorMap: Record<string, { bg: string; tint: string }> = {
  "🥳": { bg: "bg-journal-orange", tint: "from-[hsl(30,90%,95%)/0.4]" },
  "😌": { bg: "bg-journal-yellow", tint: "from-[hsl(45,90%,95%)/0.4]" },
  "💡": { bg: "bg-journal-yellow", tint: "from-[hsl(45,90%,95%)/0.4]" },
  "🤔": { bg: "bg-journal-purple", tint: "from-[hsl(270,60%,95%)/0.4]" },
  "💪": { bg: "bg-journal-pink", tint: "from-[hsl(340,70%,95%)/0.4]" },
  "😊": { bg: "bg-journal-green", tint: "from-[hsl(150,50%,95%)/0.4]" },
  "🙏": { bg: "bg-journal-purple", tint: "from-[hsl(270,60%,95%)/0.4]" },
  "🔥": { bg: "bg-journal-orange", tint: "from-[hsl(30,90%,95%)/0.4]" },
  "😴": { bg: "bg-journal-purple", tint: "from-[hsl(270,60%,95%)/0.4]" },
  "🎯": { bg: "bg-journal-orange", tint: "from-[hsl(30,90%,95%)/0.4]" },
  "🌟": { bg: "bg-journal-yellow", tint: "from-[hsl(45,90%,95%)/0.4]" },
  "🎉": { bg: "bg-journal-pink", tint: "from-[hsl(340,70%,95%)/0.4]" },
  "💭": { bg: "bg-journal-purple", tint: "from-[hsl(270,60%,95%)/0.4]" },
  "🌈": { bg: "bg-journal-green", tint: "from-[hsl(150,50%,95%)/0.4]" },
  "☕": { bg: "bg-journal-orange", tint: "from-[hsl(30,90%,95%)/0.4]" },
  "📚": { bg: "bg-journal-yellow", tint: "from-[hsl(45,90%,95%)/0.4]" },
};

// Two rows of emojis (Apple style)
const EMOJI_OPTIONS_ROW_1 = ["🥳", "😌", "💡", "🤔", "💪", "😊", "🙏", "🔥"];
const EMOJI_OPTIONS_ROW_2 = ["😴", "🎯", "🌟", "🎉", "💭", "🌈", "☕", "📚"];

// Initial entries with timestamps set to more than 24 hours ago (locked)
const initialEntries: JournalEntry[] = [
  {
    id: "1",
    content: "Today was incredibly productive! I managed to complete all my morning habits and even had time for a 30-minute walk. The meditation session really helped me focus throughout the day. I'm feeling grateful for the progress I've made this week.",
    date: "December 25, 2025",
    time: "8:45 PM",
    emoji: "🥳",
    bgColor: "bg-journal-orange",
    createdAt: Date.now() - 48 * 60 * 60 * 1000, // 48 hours ago
  },
  {
    id: "2",
    content: "Had a slower start today but picked up momentum after lunch. Sometimes it's okay to take things easy. The important thing is that I showed up and did what I could. Tomorrow is a new opportunity.",
    date: "December 24, 2025",
    time: "9:30 PM",
    emoji: "😌",
    bgColor: "bg-journal-yellow",
    createdAt: Date.now() - 72 * 60 * 60 * 1000, // 72 hours ago
  },
  {
    id: "3",
    content: "Feeling motivated after watching some tutorials on habit building. The concept of 'atomic habits' really resonates with me. Small changes compound over time. I'm excited to implement what I learned.",
    date: "December 23, 2025",
    time: "7:15 PM",
    emoji: "💡",
    bgColor: "bg-journal-yellow",
    createdAt: Date.now() - 96 * 60 * 60 * 1000, // 96 hours ago
  },
  {
    id: "4",
    content: "Struggled with focus today. Too many distractions from social media. Need to be more intentional about screen time. Setting a goal to reduce usage to under 1 hour tomorrow.",
    date: "December 22, 2025",
    time: "10:00 PM",
    emoji: "🤔",
    bgColor: "bg-journal-purple",
    createdAt: Date.now() - 120 * 60 * 60 * 1000, // 120 hours ago
  },
  {
    id: "5",
    content: "Amazing workout today! Hit a new personal record on my running distance. The consistency is paying off. My energy levels have improved significantly since I started tracking my habits.",
    date: "December 21, 2025",
    time: "6:30 PM",
    emoji: "💪",
    bgColor: "bg-journal-pink",
    createdAt: Date.now() - 144 * 60 * 60 * 1000, // 144 hours ago
  },
];

// Helper to check if entry is within 24 hours
const isWithin24Hours = (createdAt: number): boolean => {
  const now = Date.now();
  const twentyFourHours = 24 * 60 * 60 * 1000;
  return now - createdAt < twentyFourHours;
};

// Helper to get tailwind bg class for modal based on emoji
const getModalBgClass = (emoji: string): string => {
  return emojiToColorMap[emoji]?.bg || "bg-journal-green";
};

// Helper to get modal tint gradient based on emoji
const getModalTintClass = (emoji: string): string => {
  return emojiToColorMap[emoji]?.tint || "from-[hsl(150,50%,95%)/0.4]";
};

export default function Journal() {
  const [entries, setEntries] = useState<JournalEntry[]>(initialEntries);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newContent, setNewContent] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("😊");
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  

  const modalBgClass = useMemo(() => getModalBgClass(selectedEmoji), [selectedEmoji]);
  const modalTintClass = useMemo(() => getModalTintClass(selectedEmoji), [selectedEmoji]);

  const deleteEntry = (id: string) => {
    setEntries(entries.filter(e => e.id !== id));
  };

  const handleEdit = (entry: JournalEntry) => {
    setEditingEntry(entry);
    setNewContent(entry.content);
    setSelectedEmoji(entry.emoji || "😊");
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!newContent.trim()) return;
    
    const bgColor = getModalBgClass(selectedEmoji);
    
    if (editingEntry) {
      // Update existing entry
      setEntries(entries.map(e => 
        e.id === editingEntry.id 
          ? { ...e, content: newContent.trim(), emoji: selectedEmoji, bgColor }
          : e
      ));
    } else {
      // Create new entry
      const now = new Date();
      const newEntry: JournalEntry = {
        id: Date.now().toString(),
        content: newContent.trim(),
        date: now.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
        time: now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
        emoji: selectedEmoji,
        bgColor,
        createdAt: Date.now(),
      };
      
      setEntries([newEntry, ...entries]);
    }
    
    resetModal();
  };

  const resetModal = () => {
    setNewContent("");
    setSelectedEmoji("😊");
    setEditingEntry(null);
    setIsModalOpen(false);
  };

  const handleOpenNewEntry = () => {
    setEditingEntry(null);
    setNewContent("");
    setSelectedEmoji("😊");
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen gradient-bg">
      <Navbar />
      
      <main className="pt-28 pb-24 px-4 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-semibold">Journal</h1>
            <p className="text-muted-foreground mt-1">Reflect on your journey</p>
          </div>
        </div>
        
        {/* Journal Entries Grid */}
        {entries.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {entries.map((entry, index) => {
              const canEdit = isWithin24Hours(entry.createdAt);
              
              return (
                <div
                  key={entry.id}
                  className={`${entry.bgColor} rounded-3xl p-5 shadow-soft transition-all duration-300 hover:shadow-medium animate-fade-in flex flex-col`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {entry.emoji && (
                        <AppleEmoji emoji={entry.emoji} size="xl" />
                      )}
                      <div>
                        <p className="font-semibold text-foreground text-sm">{entry.date}</p>
                        <p className="text-xs text-muted-foreground">{entry.time}</p>
                      </div>
                    </div>
                    {canEdit && (
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => handleEdit(entry)}
                          className="p-1.5 rounded-xl hover:bg-card/50 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => deleteEntry(entry.id)}
                          className="p-1.5 rounded-xl hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-foreground leading-relaxed text-sm flex-1">
                    {entry.content}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <GlassCard className="p-12 text-center">
            <span className="mb-4 block"><AppleEmoji emoji="📝" size="5xl" /></span>
            <h3 className="font-display text-xl font-semibold mb-2">No entries yet</h3>
            <p className="text-muted-foreground mb-6">
              Start journaling to track your thoughts and progress
            </p>
            <Button variant="gradient" onClick={handleOpenNewEntry}>
              <Plus className="w-5 h-5 mr-2" />
              Write your first entry
            </Button>
          </GlassCard>
        )}
      </main>

      {/* Floating Add Button */}
      <button
        onClick={handleOpenNewEntry}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-gradient-to-br from-journal-yellow via-journal-green to-journal-purple shadow-large hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center z-50"
        aria-label="New journal entry"
      >
        <Plus className="w-6 h-6 text-foreground" />
      </button>

      {/* New/Edit Entry Modal */}
      <Dialog open={isModalOpen} onOpenChange={(open) => { if (!open) resetModal(); else setIsModalOpen(true); }}>
        <DialogContent className={`sm:max-w-lg max-h-[85vh] overflow-y-auto bg-gradient-to-br ${modalTintClass} to-transparent to-30% transition-all duration-300`}>
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              {editingEntry ? "Edit Journal Entry" : "New Journal Entry"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 pt-4">
            {/* Emoji Picker - Two Rows */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                How are you feeling?
              </label>
              <div className="space-y-2">
                <div className="flex gap-2 flex-wrap">
                  {EMOJI_OPTIONS_ROW_1.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setSelectedEmoji(emoji)}
                      className={`p-2 rounded-xl transition-all ${
                        selectedEmoji === emoji
                          ? "bg-primary/20 ring-2 ring-primary scale-110"
                          : "hover:bg-secondary"
                      }`}
                    >
                      <AppleEmoji emoji={emoji} size="lg" />
                    </button>
                  ))}
                </div>
                <div className="flex gap-2 flex-wrap">
                  {EMOJI_OPTIONS_ROW_2.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setSelectedEmoji(emoji)}
                      className={`p-2 rounded-xl transition-all ${
                        selectedEmoji === emoji
                          ? "bg-primary/20 ring-2 ring-primary scale-110"
                          : "hover:bg-secondary"
                      }`}
                    >
                      <AppleEmoji emoji={emoji} size="lg" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Content with dynamic background */}
            <div className={`${modalBgClass} rounded-2xl p-4 transition-colors duration-300`}>
              <Textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="What's on your mind today?"
                className="min-h-[180px] resize-none bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-foreground/50"
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSave}
                disabled={!newContent.trim()}
                className="px-6 py-2.5 rounded-full bg-gradient-to-br from-journal-yellow via-journal-green to-journal-purple shadow-medium hover:shadow-large hover:scale-105 transition-all duration-300 text-foreground font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                Save
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
