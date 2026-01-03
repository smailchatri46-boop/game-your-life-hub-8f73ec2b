import { GlassCard } from "@/components/GlassCard";
import { AppleEmoji } from "@/components/AppleEmoji";
import { Send } from "lucide-react";

export function AIBuddyShowcase() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* AI Chat Preview */}
          <div>
            <GlassCard className="p-6" glow>
              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent to-primary flex items-center justify-center">
                  <AppleEmoji emoji="🌞" size="lg" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">AI Buddy</h4>
                  <p className="text-xs text-muted-foreground">Your personal wellness coach</p>
                </div>
              </div>

              {/* Chat Area */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-start">
                  <div className="max-w-[80%] p-3 rounded-2xl rounded-tl-sm bg-secondary/70">
                    <p className="text-sm text-foreground">
                      Hey there! 👋 I noticed you've been crushing your meditation habit this week. That's amazing progress!
                    </p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <div className="max-w-[80%] p-3 rounded-2xl rounded-tr-sm bg-gradient-to-r from-accent/80 to-primary/80">
                    <p className="text-sm text-white">
                      Thanks! Any tips for staying consistent?
                    </p>
                  </div>
                </div>

                <div className="flex justify-start">
                  <div className="max-w-[80%] p-3 rounded-2xl rounded-tl-sm bg-secondary/70">
                    <p className="text-sm text-foreground">
                      Based on your patterns, mornings work best for you. Try anchoring it to your coffee routine! ☕
                    </p>
                  </div>
                </div>
              </div>

              {/* Input Area */}
              <div className="flex items-center gap-2 p-2 rounded-xl bg-secondary/50">
                <input
                  type="text"
                  placeholder="Start a conversation..."
                  className="flex-1 bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none px-2"
                  disabled
                />
                <button className="w-10 h-10 rounded-xl bg-gradient-to-r from-accent to-primary flex items-center justify-center">
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
            </GlassCard>
          </div>

          {/* Text Content */}
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4">
              Your Personal <span className="gradient-text italic">Wellness Coach</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-6">
              Meet AI Buddy - your supportive motivation buddy that turns your habits into insights to help you reach your goals.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                  <AppleEmoji emoji="📊" size="sm" />
                </div>
                <span className="text-sm text-foreground">Analyzes your habit patterns</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                  <AppleEmoji emoji="💡" size="sm" />
                </div>
                <span className="text-sm text-foreground">Provides personalized tips</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                  <AppleEmoji emoji="🎯" size="sm" />
                </div>
                <span className="text-sm text-foreground">Helps you stay motivated</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
