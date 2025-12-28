import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Send, Download, Loader2, Menu, Plus } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAIChat } from "@/hooks/use-ai-chat";
import { useAuth } from "@/contexts/AuthContext";
import { TypingIndicator } from "@/components/TypingIndicator";
import { ChatSidebar } from "@/components/ChatSidebar";
import { exportUserData, downloadTextFile } from "@/utils/exportChatData";
import { format } from "date-fns";
import { useIsMobile } from "@/hooks/use-mobile";

export default function AIChat() {
  const [message, setMessage] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

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
    isAuthed,
  } = useAIChat();

  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user, loadConversations]);

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

      <main className="pt-24 pb-6 px-4 max-w-4xl mx-auto h-[calc(100vh-0px)] flex flex-col">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="font-display text-3xl font-semibold text-foreground">AI Buddy</h1>
          <p className="text-muted-foreground text-sm mt-1">Your supportive motivation buddy</p>
        </div>

        {/* Main Chat Container */}
        <div className="flex-1 bg-card/50 backdrop-blur-sm rounded-2xl shadow-soft overflow-hidden flex flex-col min-h-0 relative">
          {/* Chat Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border/10">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-secondary/50 text-muted-foreground transition-colors"
              aria-label="Toggle sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleExport}
              disabled={isExporting}
              className="text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            >
              {isExporting ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              Download data
            </Button>
          </div>

          {/* Sidebar Overlay */}
          {sidebarOpen && (
            <>
              <div 
                className="absolute inset-0 bg-foreground/10 z-10"
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
          <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
            {/* Welcome state */}
            {messages.length === 0 && (
              <div className="max-w-xl mx-auto text-center py-16">
                <h2 className="font-display text-xl font-medium text-foreground mb-2">
                  Start a conversation
                </h2>
                <p className="text-muted-foreground text-sm max-w-md mx-auto">
                  I'm your wellness buddy. Ask me about habits, routines, motivation, or anything to help you stay on track.
                </p>
              </div>
            )}

            {/* Messages */}
            <div className="max-w-xl mx-auto space-y-4">
              {messages.map((msg, index) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                      msg.role === "user"
                        ? "bg-card border border-border/30"
                        : "bg-secondary/70"
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
                <div className="flex justify-start">
                  <div className="bg-secondary/70 rounded-2xl px-4 py-3">
                    <TypingIndicator />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-border/10">
            <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
              <div className="flex items-center gap-3 bg-secondary/30 rounded-xl px-4 py-2.5 border border-border/10 focus-within:border-primary/20 transition-colors">
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
                  className="w-9 h-9 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground flex-shrink-0"
                  disabled={isLoading || !message.trim()}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
