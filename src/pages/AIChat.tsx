import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Send, Download, Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAIChat } from "@/hooks/use-ai-chat";
import { useAuth } from "@/contexts/AuthContext";
import { TypingIndicator } from "@/components/TypingIndicator";
import { exportUserData, downloadTextFile } from "@/utils/exportChatData";
import { format } from "date-fns";

export default function AIChat() {
  const [message, setMessage] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
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

  const handleExport = async () => {
    if (!user) return;
    
    setIsExporting(true);
    try {
      const content = await exportUserData(user.id);
      const filename = `wellness-export-${format(new Date(), "yyyy-MM-dd")}.txt`;
      downloadTextFile(content, filename);
      toast({
        title: "Export complete",
        description: "Your data has been downloaded. You can upload it to ChatGPT or Gemini to continue your coaching conversation.",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Could not export your data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
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
      
      <main className="pt-24 pb-6 px-4 max-w-2xl mx-auto h-[calc(100vh-0px)] flex flex-col">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="font-display text-2xl font-semibold text-foreground">AI Coach</h1>
          <p className="text-muted-foreground text-sm mt-1">Your personal motivation assistant</p>
        </div>
        
        {/* Chat Container */}
        <div className="flex-1 bg-card/80 backdrop-blur-sm rounded-3xl shadow-soft overflow-hidden flex flex-col min-h-0">
          {/* Messages Area */}
          <div className="flex-1 px-4 py-6 overflow-y-auto space-y-4">
            {/* Welcome message */}
            {messages.length === 0 && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                  <span className="text-base">🌟</span>
                </div>
                <div className="bg-secondary/80 rounded-3xl rounded-tl-lg px-4 py-3 max-w-[85%]">
                  <p className="text-sm text-foreground leading-relaxed">
                    Hey there! 👋 I'm your wellness coach. I help with habits, routines, motivation, 
                    and avoiding burnout. I can see your habits, journal, and mood data to give 
                    personalized guidance. What's on your mind? 🌱
                  </p>
                </div>
              </div>
            )}
            
            {/* Message list */}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-end gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.role === "user" 
                    ? "bg-primary/20" 
                    : "bg-secondary"
                }`}>
                  <span className="text-base">{msg.role === "user" ? "😊" : "🌟"}</span>
                </div>
                
                {/* Message bubble */}
                <div
                  className={`px-4 py-3 max-w-[80%] ${
                    msg.role === "user"
                      ? "bg-primary/15 rounded-3xl rounded-tr-lg"
                      : "bg-secondary/80 rounded-3xl rounded-tl-lg"
                  }`}
                >
                  <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                    {msg.content}
                  </p>
                </div>
              </div>
            ))}
            
            {/* Typing indicator */}
            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <div className="flex items-end gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                  <span className="text-base">🌟</span>
                </div>
                <div className="bg-secondary/80 rounded-3xl rounded-tl-lg">
                  <TypingIndicator />
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Bottom composer */}
          <div className="p-4 border-t border-border/30 bg-card/50">
            <form onSubmit={handleSubmit} className="flex items-center gap-3">
              {/* Export button */}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleExport}
                disabled={isExporting}
                className="w-10 h-10 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary/80 flex-shrink-0"
                title="Export your data"
              >
                {isExporting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Download className="w-5 h-5" />
                )}
              </Button>
              
              {/* Text input */}
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask your AI coach…"
                className="flex-1 px-4 py-3 rounded-full bg-secondary/60 border-0 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm placeholder:text-muted-foreground"
                disabled={isLoading}
              />
              
              {/* Send button */}
              <Button 
                type="submit" 
                size="icon" 
                className="w-10 h-10 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground flex-shrink-0 shadow-sm"
                disabled={isLoading || !message.trim()}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </form>
            
            {/* Clear chat link */}
            {messages.length > 0 && (
              <button
                onClick={handleClearHistory}
                className="w-full text-center text-xs text-muted-foreground hover:text-foreground mt-3 transition-colors"
              >
                Clear conversation
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
