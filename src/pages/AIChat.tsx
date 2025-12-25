import { Navbar } from "@/components/Navbar";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Sparkles, Lock, Send } from "lucide-react";
import { useState } from "react";

export default function AIChat() {
  const [showPaywall, setShowPaywall] = useState(true);
  const [message, setMessage] = useState("");

  return (
    <div className="min-h-screen gradient-bg">
      <Navbar />
      
      <main className="pt-28 pb-12 px-4 max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-semibold">AI Coach</h1>
          <p className="text-muted-foreground mt-1">Your personal motivation assistant</p>
        </div>
        
        {/* Chat Container */}
        <GlassCard className="h-[600px] flex flex-col relative overflow-hidden">
          {/* Chat Messages Area */}
          <div className="flex-1 p-6 overflow-y-auto">
            {/* AI Welcome Message */}
            <div className="flex gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-accent to-primary flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <div className="bg-secondary rounded-2xl rounded-tl-md p-4 max-w-[80%]">
                  <p className="text-sm text-foreground">
                    Hey there! 👋 I'm your AI coach. I'm here to help you stay motivated, 
                    reflect on your progress, and provide personalized insights based on your habits and journal entries.
                  </p>
                </div>
                <p className="text-xs text-muted-foreground mt-1 ml-1">Just now</p>
              </div>
            </div>
            
            {/* Sample user message */}
            <div className="flex gap-3 mb-6 justify-end">
              <div className="flex-1 flex justify-end">
                <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-md p-4 max-w-[80%]">
                  <p className="text-sm">
                    How can I stay more consistent with my morning meditation?
                  </p>
                </div>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-secondary flex items-center justify-center flex-shrink-0">
                <span className="text-lg">👤</span>
              </div>
            </div>
          </div>
          
          {/* Input Area */}
          <div className="p-4 border-t border-border/50">
            <div className="flex gap-3">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask your AI coach..."
                className="flex-1 px-4 py-3 rounded-2xl bg-secondary border-0 focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
              />
              <Button variant="gradient" size="icon" className="w-12 h-12 rounded-2xl">
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
          
          {/* Paywall Overlay */}
          {showPaywall && (
            <div className="absolute inset-0 bg-card/80 backdrop-blur-md flex items-center justify-center p-6">
              <div className="text-center max-w-sm">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-accent/30 to-primary/30 flex items-center justify-center mx-auto mb-6">
                  <Lock className="w-10 h-10 text-primary" />
                </div>
                <h2 className="font-display text-2xl font-semibold mb-3">
                  Unlock AI Coaching
                </h2>
                <p className="text-muted-foreground mb-6">
                  AI coaching is part of Locked Pro. Unlock personalized insights, 
                  motivation, and progress reflection.
                </p>
                <div className="space-y-3">
                  <Button variant="gradient" size="lg" className="w-full">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Upgrade to Pro
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="lg" 
                    className="w-full text-muted-foreground"
                    onClick={() => setShowPaywall(false)}
                  >
                    Maybe later
                  </Button>
                </div>
                
                {/* Pricing Info */}
                <div className="mt-6 pt-6 border-t border-border/50">
                  <div className="flex items-center justify-center gap-6 text-sm">
                    <div>
                      <p className="font-semibold text-foreground">$14/mo</p>
                      <p className="text-muted-foreground text-xs">Monthly</p>
                    </div>
                    <div className="w-px h-8 bg-border" />
                    <div>
                      <p className="font-semibold text-foreground">$7/mo</p>
                      <p className="text-muted-foreground text-xs">Yearly (save 50%)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </GlassCard>
      </main>
    </div>
  );
}
