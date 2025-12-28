import { Navbar } from "@/components/Navbar";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Sparkles, Send, Trash2, Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAIChat } from "@/hooks/use-ai-chat";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

export default function AIChat() {
  const [message, setMessage] = useState("");
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, isLoading, sendMessage, loadHistory, clearHistory } = useAIChat();

  useEffect(() => {
    if (user) {
      loadHistory();
    }
  }, [user, loadHistory]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;
    
    const currentMessage = message;
    setMessage("");
    await sendMessage(currentMessage);
  };

  const handleClearHistory = async () => {
    await clearHistory();
    toast({
      title: "Chat cleared",
      description: "Your conversation history has been deleted.",
    });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg">
      <Navbar />
      
      <main className="pt-28 pb-12 px-4 max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-semibold">AI Coach</h1>
            <p className="text-muted-foreground mt-1">Your personal motivation assistant</p>
          </div>
          {messages.length > 0 && (
            <Button variant="ghost" size="sm" onClick={handleClearHistory}>
              <Trash2 className="w-4 h-4 mr-2" />
              Clear chat
            </Button>
          )}
        </div>
        
        {/* Chat Container */}
        <GlassCard className="h-[600px] flex flex-col overflow-hidden">
          {/* Chat Messages Area */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            {messages.length === 0 && (
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-accent to-primary flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <div className="bg-secondary rounded-2xl rounded-tl-md p-4 max-w-[80%]">
                    <p className="text-sm text-foreground">
                      Hey there! 👋 I'm your wellness coach. I help with habits, routines, motivation, 
                      and avoiding burnout. I can see your habits, journal, and mood data to give 
                      personalized guidance. What's on your mind? 🌱
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 ml-1">Just now</p>
                </div>
              </div>
            )}
            
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}
              >
                {msg.role === "assistant" && (
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-accent to-primary flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-primary-foreground" />
                  </div>
                )}
                
                <div className={`flex-1 ${msg.role === "user" ? "flex justify-end" : ""}`}>
                  <div
                    className={`rounded-2xl p-4 max-w-[80%] ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-tr-md"
                        : "bg-secondary rounded-tl-md"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 ml-1">
                    {format(msg.timestamp, "h:mm a")}
                  </p>
                </div>
                
                {msg.role === "user" && (
                  <div className="w-10 h-10 rounded-2xl bg-secondary flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">👤</span>
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-accent to-primary flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <div className="bg-secondary rounded-2xl rounded-tl-md p-4 max-w-[80%]">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm text-muted-foreground">Thinking...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input Area */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-border/50">
            <div className="flex gap-3">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask your AI coach..."
                className="flex-1 px-4 py-3 rounded-2xl bg-secondary border-0 focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                disabled={isLoading}
              />
              <Button 
                type="submit" 
                variant="gradient" 
                size="icon" 
                className="w-12 h-12 rounded-2xl"
                disabled={isLoading || !message.trim()}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </Button>
            </div>
          </form>
        </GlassCard>
      </main>
    </div>
  );
}
