import { Navbar } from "@/components/Navbar";
import { GlassCard } from "@/components/GlassCard";
import { AppleEmoji } from "@/components/AppleEmoji";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { Plus, Pencil, Trash2 } from "lucide-react";
import { useState, useMemo, useEffect } from "react";

interface JournalEntry {
  id: string;
  content: string;
  date: string;
  time: string;
  emoji?: string;
  bgColor: string;
  createdAt: number; // timestamp for 24-hour logic
}

// Map emojis to specific background colors, modal tints, and button gradients
const emojiToColorMap: Record<string, { bg: string; tint: string; btnGradient: string; glowColor: string }> = {
  "🥳": { bg: "bg-journal-orange", tint: "from-[hsl(30,90%,95%)/0.4]", btnGradient: "from-[hsl(30,100%,85%)] via-[hsl(38,100%,80%)] to-[hsl(45,100%,75%)]", glowColor: "hsl(30,100%,90%)" },
  "😌": { bg: "bg-journal-yellow", tint: "from-[hsl(45,90%,95%)/0.4]", btnGradient: "from-[hsl(45,100%,85%)] via-[hsl(50,100%,80%)] to-[hsl(55,100%,75%)]", glowColor: "hsl(45,100%,90%)" },
  "💡": { bg: "bg-journal-yellow", tint: "from-[hsl(45,90%,95%)/0.4]", btnGradient: "from-[hsl(45,100%,85%)] via-[hsl(50,100%,80%)] to-[hsl(55,100%,75%)]", glowColor: "hsl(45,100%,90%)" },
  "🤔": { bg: "bg-journal-purple", tint: "from-[hsl(270,60%,95%)/0.4]", btnGradient: "from-[hsl(270,60%,90%)] via-[hsl(280,50%,85%)] to-[hsl(290,45%,80%)]", glowColor: "hsl(270,60%,92%)" },
  "💪": { bg: "bg-journal-pink", tint: "from-[hsl(340,70%,95%)/0.4]", btnGradient: "from-[hsl(340,70%,90%)] via-[hsl(350,60%,85%)] to-[hsl(0,50%,80%)]", glowColor: "hsl(340,70%,92%)" },
  "😊": { bg: "bg-journal-green", tint: "from-[hsl(150,50%,95%)/0.4]", btnGradient: "from-[hsl(140,50%,85%)] via-[hsl(150,45%,80%)] to-[hsl(160,40%,75%)]", glowColor: "hsl(150,50%,90%)" },
  "🙏": { bg: "bg-journal-purple", tint: "from-[hsl(270,60%,95%)/0.4]", btnGradient: "from-[hsl(270,60%,90%)] via-[hsl(280,50%,85%)] to-[hsl(290,45%,80%)]", glowColor: "hsl(270,60%,92%)" },
  "🔥": { bg: "bg-journal-orange", tint: "from-[hsl(30,90%,95%)/0.4]", btnGradient: "from-[hsl(30,100%,85%)] via-[hsl(38,100%,80%)] to-[hsl(45,100%,75%)]", glowColor: "hsl(30,100%,90%)" },
  "😴": { bg: "bg-journal-purple", tint: "from-[hsl(270,60%,95%)/0.4]", btnGradient: "from-[hsl(270,60%,90%)] via-[hsl(280,50%,85%)] to-[hsl(290,45%,80%)]", glowColor: "hsl(270,60%,92%)" },
  "🎯": { bg: "bg-journal-orange", tint: "from-[hsl(30,90%,95%)/0.4]", btnGradient: "from-[hsl(30,100%,85%)] via-[hsl(38,100%,80%)] to-[hsl(45,100%,75%)]", glowColor: "hsl(30,100%,90%)" },
  "🌟": { bg: "bg-journal-yellow", tint: "from-[hsl(45,90%,95%)/0.4]", btnGradient: "from-[hsl(45,100%,85%)] via-[hsl(50,100%,80%)] to-[hsl(55,100%,75%)]", glowColor: "hsl(45,100%,90%)" },
  "🎉": { bg: "bg-journal-pink", tint: "from-[hsl(340,70%,95%)/0.4]", btnGradient: "from-[hsl(340,70%,90%)] via-[hsl(350,60%,85%)] to-[hsl(0,50%,80%)]", glowColor: "hsl(340,70%,92%)" },
  "💭": { bg: "bg-journal-purple", tint: "from-[hsl(270,60%,95%)/0.4]", btnGradient: "from-[hsl(270,60%,90%)] via-[hsl(280,50%,85%)] to-[hsl(290,45%,80%)]", glowColor: "hsl(270,60%,92%)" },
  "🌈": { bg: "bg-journal-green", tint: "from-[hsl(150,50%,95%)/0.4]", btnGradient: "from-[hsl(140,50%,85%)] via-[hsl(150,45%,80%)] to-[hsl(160,40%,75%)]", glowColor: "hsl(150,50%,90%)" },
  "☕": { bg: "bg-journal-orange", tint: "from-[hsl(30,90%,95%)/0.4]", btnGradient: "from-[hsl(30,100%,85%)] via-[hsl(38,100%,80%)] to-[hsl(45,100%,75%)]", glowColor: "hsl(30,100%,90%)" },
  "📚": { bg: "bg-journal-yellow", tint: "from-[hsl(45,90%,95%)/0.4]", btnGradient: "from-[hsl(45,100%,85%)] via-[hsl(50,100%,80%)] to-[hsl(55,100%,75%)]", glowColor: "hsl(45,100%,90%)" },
};

// Two rows of emojis (Apple style)
const EMOJI_OPTIONS_ROW_1 = ["🥳", "😌", "💡", "🤔", "💪", "😊", "🙏", "🔥"];
const EMOJI_OPTIONS_ROW_2 = ["😴", "🎯", "🌟", "🎉", "💭", "🌈", "☕", "📚"];

// Onboarding slides for first-time users
const ONBOARDING_SLIDES = [
  {
    emoji: "📓",
    title: "Each journal brings you closer to who you want to become",
    message: "Small reflections written daily compound over time. Journaling helps you notice patterns, track growth, and understand yourself better.",
  },
  {
    emoji: "🤖",
    title: "Your journals help the AI understand you better",
    message: "The more you write, the more personalized your guidance becomes. Your entries help the AI give advice that truly fits what you're going through.",
  },
  {
    emoji: "🔒",
    title: "Entries can only be edited or deleted in the first 24 hours",
    message: "After the first day, entries become locked to protect your progress history and help keep an honest record of your journey.",
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

// Helper to get button gradient based on emoji
const getButtonGradient = (emoji: string): string => {
  return emojiToColorMap[emoji]?.btnGradient || "from-[hsl(140,50%,85%)] via-[hsl(150,45%,80%)] to-[hsl(160,40%,75%)]";
};

// Helper to get glow color based on emoji
const getGlowColor = (emoji: string): string => {
  return emojiToColorMap[emoji]?.glowColor || "hsl(150,50%,90%)";
};

export default function Journal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newContent, setNewContent] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("😊");
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const modalBgClass = useMemo(() => getModalBgClass(selectedEmoji), [selectedEmoji]);
  const modalTintClass = useMemo(() => getModalTintClass(selectedEmoji), [selectedEmoji]);
  const buttonGradient = useMemo(() => getButtonGradient(selectedEmoji), [selectedEmoji]);
  const glowColor = useMemo(() => getGlowColor(selectedEmoji), [selectedEmoji]);

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

  const handleNextSlide = () => {
    if (currentSlideIndex < ONBOARDING_SLIDES.length - 1) {
      setCurrentSlideIndex((prev) => prev + 1);
    } else {
      // Last slide - open modal
      handleOpenNewEntry();
    }
  };

  return (
    <div className="min-h-screen gradient-bg">
      <Navbar />
      
      <main className={`pt-28 pb-24 px-4 max-w-6xl mx-auto ${entries.length === 0 ? 'min-h-[calc(100vh-7rem)] flex flex-col' : ''}`}>
        {entries.length > 0 && (
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display text-3xl font-semibold">Journal</h1>
              <p className="text-muted-foreground mt-1">Reflect on your journey</p>
            </div>
          </div>
        )}
        
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
          /* Empty State - Inline onboarding slides */
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center text-center px-4 max-w-md animate-fade-in">
              {/* Emoji */}
              <div className="mb-6 flex justify-center">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                  <AppleEmoji emoji={ONBOARDING_SLIDES[currentSlideIndex].emoji} size="4xl" />
                </div>
              </div>

              <h2 className="text-xl font-semibold text-foreground mb-3 font-display">
                {ONBOARDING_SLIDES[currentSlideIndex].title}
              </h2>

              <p className="text-muted-foreground text-sm leading-relaxed mb-8 max-w-sm mx-auto">
                {ONBOARDING_SLIDES[currentSlideIndex].message}
              </p>

              {/* Progress dots */}
              <div className="flex justify-center gap-2 mb-6">
                {ONBOARDING_SLIDES.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setCurrentSlideIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentSlideIndex
                        ? "w-6 bg-gradient-to-r from-primary to-primary/80"
                        : index < currentSlideIndex
                          ? "bg-primary/40"
                          : "bg-muted-foreground/20"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>

              <Button
                variant="gradient"
                onClick={handleNextSlide}
                className="px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all text-base font-medium"
              >
                {currentSlideIndex === ONBOARDING_SLIDES.length - 1 ? "Add Journal" : "Next"}
              </Button>
            </div>
          </div>
        )}
      </main>

      {/* Floating Add Button - only show when entries exist */}
      {entries.length > 0 && (
        <button
          onClick={handleOpenNewEntry}
          className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-gradient-to-br from-journal-yellow via-journal-green to-journal-purple shadow-large hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center z-50"
          aria-label="New journal entry"
        >
          <Plus className="w-6 h-6 text-foreground" />
        </button>
      )}

      {/* New/Edit Entry Modal */}
      <Dialog open={isModalOpen} onOpenChange={(open) => { if (!open) resetModal(); else setIsModalOpen(true); }}>
        <DialogContent className="sm:max-w-lg overflow-hidden">
          {/* Animated ambient glow background */}
          <div 
            className="absolute inset-0 -z-10 pointer-events-none"
            style={{
              background: `
                radial-gradient(ellipse 80% 60% at 20% 30%, ${glowColor} 0%, transparent 50%),
                radial-gradient(ellipse 70% 50% at 80% 70%, ${glowColor} 0%, transparent 45%),
                radial-gradient(ellipse 50% 40% at 50% 50%, ${glowColor} 0%, transparent 40%)
              `,
              opacity: 0.5,
              transition: 'background 0.5s ease-in-out',
            }}
          />
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
                className={`px-6 py-2.5 rounded-full bg-gradient-to-br ${buttonGradient} shadow-medium hover:shadow-large hover:scale-105 transition-all duration-300 text-foreground font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
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
