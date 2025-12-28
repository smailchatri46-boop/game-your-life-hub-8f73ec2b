import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Send, Download, Loader2, Menu } from "lucide-react";
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
  const [sidebarOpen, setSidebarOpen] = useState(true);
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
  } = useAIChat();

  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user, loadConversations]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Close sidebar on mobile by default
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to send messages to your AI Coach.",
        variant: "destructive",
      });
      return;
    }

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
        description: "Your data has been downloaded. Upload it to ChatGPT or Gemini to continue your coaching conversation.",
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
    if (isMobile) setSidebarOpen(false);
  };

  const handleSelectConversation = async (id: string) => {
    await loadConversation(id);
    if (isMobile) setSidebarOpen(false);
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

      <main className="pt-20 pb-4 px-4 max-w-5xl mx-auto h-[calc(100vh-0px)] flex flex-col">
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="font-display text-2xl font-semibold text-foreground">AI Coach</h1>
          <p className="text-muted-foreground text-sm">Your personal motivation assistant</p>
        </div>

        {/* Main Chat Container */}
        <div className="flex-1 bg-card/60 backdrop-blur-sm rounded-2xl shadow-soft overflow-hidden flex min-h-0">
          {/* Sidebar */}
          {sidebarOpen && (
            <ChatSidebar
              conversations={conversations}
              currentConversationId={currentConversationId}
              onNewChat={handleNewChat}
              onSelectConversation={handleSelectConversation}
              onRenameConversation={updateConversationTitle}
              onDeleteConversation={deleteConversation}
            />
          )}

          {/* Chat Area */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Chat Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/20">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-secondary/60 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleExport}
                disabled={isExporting}
                className="text-muted-foreground hover:text-foreground"
              >
                {isExporting ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
                Download data
              </Button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
              {/* Welcome state */}
              {messages.length === 0 && (
                <div className="max-w-2xl mx-auto text-center py-12">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">🌱</span>
                  </div>
                  <h2 className="font-display text-xl font-medium text-foreground mb-2">
                    Start a conversation
                  </h2>
                  <p className="text-muted-foreground text-sm max-w-md mx-auto">
                    I'm your wellness coach. Ask me about habits, routines, motivation, or anything to help you stay on track.
                  </p>
                </div>
              )}

              {/* Messages */}
              <div className="max-w-2xl mx-auto space-y-6">
                {messages.map((msg, index) => (
                  <div
                    key={msg.id}
                    className={`animate-fade-in ${msg.role === "user" ? "" : ""}`}
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    {/* Role label */}
                    <p className={`text-xs font-medium mb-1.5 ${
                      msg.role === "user" ? "text-primary" : "text-muted-foreground"
                    }`}>
                      {msg.role === "user" ? "You" : "AI Coach"}
                    </p>

                    {/* Message content */}
                    <div
                      className={`rounded-xl px-4 py-3 ${
                        msg.role === "user"
                          ? "bg-primary/8 border border-primary/10"
                          : "bg-secondary/50"
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
                  <div className="animate-fade-in">
                    <p className="text-xs font-medium mb-1.5 text-muted-foreground">
                      AI Coach
                    </p>
                    <div className="bg-secondary/50 rounded-xl px-4 py-3 inline-block">
                      <TypingIndicator />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-border/20">
              <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
                <div className="flex items-center gap-3 bg-secondary/40 rounded-xl px-4 py-2 border border-border/20 focus-within:border-primary/30 focus-within:ring-2 focus-within:ring-primary/10 transition-all">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={user ? "Message AI Coach..." : "Sign in to chat..."}
                    className="flex-1 bg-transparent border-0 focus:outline-none text-sm text-foreground placeholder:text-muted-foreground"
                    disabled={isLoading || !user}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    className="w-9 h-9 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground flex-shrink-0"
                    disabled={isLoading || !message.trim() || !user}
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
        </div>
      </main>
    </div>
  );
}
