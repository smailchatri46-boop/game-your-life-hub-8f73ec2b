import { Navbar } from "@/components/Navbar";
import { GlassCard } from "@/components/GlassCard";
import { AppleEmoji } from "@/components/AppleEmoji";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Mic, MicOff } from "lucide-react";
import { useState } from "react";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { useToast } from "@/hooks/use-toast";
import { useFirstTimeTips } from "@/hooks/use-first-time-tips";
import { FirstTimeTip } from "@/components/FirstTimeTip";

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

const EMOJI_OPTIONS = ["🥳", "😌", "💡", "🤔", "💪", "😊", "🙏", "🔥", "✨", "❤️"];

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newContent, setNewContent] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("😊");
  const { toast } = useToast();
  const { activeTip, tipMessage, triggerTip, dismissTip, shouldShowTip } = useFirstTimeTips();

  const { isListening, isSupported, toggleListening } = useSpeechRecognition({
    onResult: (transcript) => {
      setNewContent((prev) => prev + (prev ? " " : "") + transcript);
    },
    onError: (error) => {
      toast({
        title: "Voice input error",
        description: error === "not-allowed" 
          ? "Please allow microphone access" 
          : `Error: ${error}`,
        variant: "destructive",
      });
    },
  });

  const deleteEntry = (id: string) => {
    setEntries(entries.filter(e => e.id !== id));
  };

  const handleSave = () => {
    if (!newContent.trim()) return;
    
    const now = new Date();
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      content: newContent.trim(),
      date: now.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      time: now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      emoji: selectedEmoji,
      bgColor: bgColors[Math.floor(Math.random() * bgColors.length)],
    };
    
    setEntries([newEntry, ...entries]);
    setNewContent("");
    setSelectedEmoji("😊");
    setIsModalOpen(false);
    
    // Trigger first-time tip after saving
    if (shouldShowTip("journal")) {
      setTimeout(() => triggerTip("journal"), 300);
    }
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
          <Button variant="gradient" size="lg" onClick={() => setIsModalOpen(true)}>
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
                    <AppleEmoji emoji={entry.emoji} size="2xl" />
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
            <span className="mb-4 block"><AppleEmoji emoji="📝" size="5xl" /></span>
            <h3 className="font-display text-xl font-semibold mb-2">No entries yet</h3>
            <p className="text-muted-foreground mb-6">
              Start journaling to track your thoughts and progress
            </p>
            <Button variant="gradient" onClick={() => setIsModalOpen(true)}>
              <Plus className="w-5 h-5 mr-2" />
              Write your first entry
            </Button>
          </GlassCard>
        )}
      </main>

      {/* New Entry Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">New Journal Entry</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 pt-4">
            {/* Emoji Picker */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                How are you feeling?
              </label>
              <div className="flex gap-2 flex-wrap">
                {EMOJI_OPTIONS.map((emoji) => (
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

            {/* Content */}
            <div className="relative">
              <Textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="What's on your mind today?"
                className="min-h-[200px] resize-none pr-12"
              />
              {isSupported && (
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`absolute bottom-3 right-3 p-2 rounded-full transition-all ${
                    isListening 
                      ? "bg-destructive text-white animate-pulse" 
                      : "text-muted-foreground hover:text-primary hover:bg-primary/10"
                  }`}
                  title={isListening ? "Stop recording" : "Voice input"}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
              )}
            </div>

            {isListening && (
              <p className="text-xs text-muted-foreground animate-pulse flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-destructive rounded-full" />
                Listening... Speak now
              </p>
            )}

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="gradient" onClick={handleSave} disabled={!newContent.trim()}>
                Save Entry
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* First-time tip */}
      <FirstTimeTip
        open={activeTip === "journal"}
        title={tipMessage?.title || ""}
        message={tipMessage?.message || ""}
        onDismiss={dismissTip}
      />
    </div>
  );
}
