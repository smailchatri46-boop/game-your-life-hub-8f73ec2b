import { Button } from "@/components/ui/button";
import { ArrowUp, Download, Loader2, Menu } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAIChat } from "@/hooks/use-ai-chat";
import { useAuth } from "@/contexts/AuthContext";
import { TypingIndicator } from "@/components/TypingIndicator";
import { ChatSidebar } from "@/components/ChatSidebar";
import { exportUserData, downloadTextFile } from "@/utils/exportChatData";
import { format } from "date-fns";
import { AppleEmoji } from "@/components/AppleEmoji";
import { parseTextWithEmojis } from "@/utils/parseTextWithEmojis";
import mascotImage from "@/assets/mascot.png";

export function AIBuddyChat() {
  const [message, setMessage] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    conversations,
    currentConversationId,
    isLoading,
    sendMessage,
    loadConversations,
    loadConversation,
    startNewConversation,
    updateConversationTitle,
    deleteConversation,
    clearMessages,
  } = useAIChat();

  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user, loadConversations]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const currentMessage = message;
    setMessage("");
    await sendMessage(currentMessage);
  };

  const handleExport = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to export your data.",
        variant: "destructive",
      });
      return;
    }

    setIsExporting(true);
    try {
      const content = await exportUserData(user.id);
      const filename = `wellness-export-${format(new Date(), "yyyy-MM-dd")}.txt`;
      downloadTextFile(content, filename);
      toast({
        title: "Export complete",
        description: "Your data has been downloaded.",
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

  const handleNewChat = async () => {
    clearMessages();
    await startNewConversation();
    setSidebarOpen(false);
  };

  const handleSelectConversation = async (id: string) => {
    await loadConversation(id);
    setSidebarOpen(false);
  };

  return (
    <div className="w-full bg-card/40 backdrop-blur-xl rounded-3xl shadow-soft overflow-hidden flex flex-col relative border border-border/10" style={{ height: "min(600px, 70vh)", maxWidth: "100%" }}>
      {/* Chat Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border/10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-muted/50 text-muted-foreground transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h3 className="font-display text-lg font-semibold text-foreground">AI Buddy</h3>
            <p className="text-xs text-muted-foreground">Your supportive motivation buddy</p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleExport}
          disabled={isExporting}
          className="text-muted-foreground hover:text-foreground hover:bg-muted/50"
        >
          {isExporting ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <Download className="w-4 h-4 mr-2" />
          )}
          Download data
        </Button>
      </div>

      {/* Sidebar Overlay - no blur, just dim */}
      {sidebarOpen && (
        <>
          <div 
            className="absolute inset-0 bg-foreground/15 z-10"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 z-20">
            <ChatSidebar
              conversations={conversations}
              currentConversationId={currentConversationId}
              onNewChat={handleNewChat}
              onSelectConversation={handleSelectConversation}
              onRenameConversation={updateConversationTitle}
              onDeleteConversation={deleteConversation}
              onClose={() => setSidebarOpen(false)}
            />
          </div>
        </>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6">
        {/* Welcome state with mascot */}
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center px-4">
            {/* Mascot with animated glow - perfectly centered */}
            <div className="relative flex items-center justify-center mb-4">
              {/* Animated gradient glow behind mascot - centered */}
              <div 
                className="absolute w-44 h-44 md:w-52 md:h-52 rounded-full blur-2xl animate-glow-pulse"
                style={{ 
                  background: 'radial-gradient(circle, hsl(var(--primary) / 0.4) 0%, hsl(35 80% 70% / 0.25) 50%, transparent 70%)',
                }}
              />
              {/* Circular mask container */}
              <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden shadow-[0_6px_24px_hsl(var(--primary)/0.2)] border-[3px] border-background/70 flex-shrink-0">
                <img 
                  src={mascotImage}
                  alt="Friendly orange mascot waving"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>
            
            <h2 className="font-display text-lg font-medium text-foreground mb-2">
              Start a conversation
            </h2>
            <p className="text-muted-foreground text-sm max-w-sm">
              I'm your wellness buddy <AppleEmoji emoji="😊" size="sm" className="inline align-middle mx-0.5" /> Ask me about habits, routines, motivation, or anything to help you stay on track!
            </p>
          </div>
        )}

        {/* Messages */}
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className="max-w-[80%] rounded-2xl px-4 py-3 text-foreground"
                style={msg.role === "user" 
                  ? {
                      background: 'linear-gradient(180deg, rgba(255, 190, 120, 0.35), rgba(255, 160, 80, 0.35))',
                      boxShadow: 'inset 0 6px 20px rgba(255, 150, 60, 0.18), inset 0 -6px 20px rgba(255, 120, 40, 0.12)'
                    }
                  : {
                      background: 'linear-gradient(135deg, hsl(40 60% 96%) 0%, hsl(35 50% 94%) 100%)'
                    }
                }
              >
                <p className="text-sm whitespace-pre-wrap leading-relaxed">
                  {parseTextWithEmojis(msg.content)}
                </p>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isLoading && messages[messages.length - 1]?.role === "user" && (
            <div className="flex justify-start">
              <div className="bg-secondary/80 rounded-2xl px-4 py-3">
                <TypingIndicator />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area - elevated with soft gradient */}
      <div className="p-4">
        <form onSubmit={handleSubmit}>
          <div 
            className="flex items-center gap-3 rounded-full px-5 py-3 transition-all border border-orange-100/60" 
            style={{ 
              background: 'hsl(35 30% 97%)'
            }}
          >
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Message AI Buddy..."
              className="flex-1 bg-transparent border-0 focus:outline-none text-sm text-foreground placeholder:text-muted-foreground"
              disabled={isLoading}
            />
            <Button
              type="submit"
              size="icon"
              className="w-10 h-10 min-w-[2.5rem] min-h-[2.5rem] rounded-full text-primary-foreground flex-shrink-0 shadow-[0_2px_8px_hsl(var(--primary)/0.3)] flex items-center justify-center p-0 hover:opacity-90 active:opacity-80 transition-opacity"
              style={{ background: 'linear-gradient(135deg, hsl(38 100% 70%) 0%, hsl(24 95% 53%) 100%)' }}
              disabled={isLoading || !message.trim()}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <ArrowUp className="w-5 h-5 stroke-[2.5]" />
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
