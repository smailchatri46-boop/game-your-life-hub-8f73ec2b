import { useState } from "react";
import { Pencil, Trash2, Check, X, MessageSquare } from "lucide-react";
import { Conversation } from "@/hooks/use-ai-chat";
import { format, isToday, isYesterday, isThisWeek } from "date-fns";

interface ChatSidebarProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  onNewChat: () => void;
  onSelectConversation: (id: string) => void;
  onRenameConversation: (id: string, title: string) => void;
  onDeleteConversation: (id: string) => void;
}

export function ChatSidebar({
  conversations,
  currentConversationId,
  onNewChat,
  onSelectConversation,
  onRenameConversation,
  onDeleteConversation,
}: ChatSidebarProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const startEditing = (conv: Conversation) => {
    setEditingId(conv.id);
    setEditTitle(conv.title);
  };

  const saveEdit = () => {
    if (editingId && editTitle.trim()) {
      onRenameConversation(editingId, editTitle.trim());
    }
    setEditingId(null);
    setEditTitle("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
  };

  // Group conversations by date
  const groupedConversations = conversations.reduce((groups, conv) => {
    let label = "Older";
    if (isToday(conv.updatedAt)) {
      label = "Today";
    } else if (isYesterday(conv.updatedAt)) {
      label = "Yesterday";
    } else if (isThisWeek(conv.updatedAt)) {
      label = "This week";
    }
    if (!groups[label]) groups[label] = [];
    groups[label].push(conv);
    return groups;
  }, {} as Record<string, Conversation[]>);

  const groupOrder = ["Today", "Yesterday", "This week", "Older"];

  return (
    <div className="w-64 h-full bg-secondary/30 border-r border-border/30 flex flex-col">
      {/* New Chat Button */}
      <div className="p-3">
        <button
          onClick={onNewChat}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl bg-primary/10 hover:bg-primary/20 text-foreground text-sm font-medium transition-colors"
        >
          <MessageSquare className="w-4 h-4" />
          New Chat
        </button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto px-2 pb-4">
        {groupOrder.map((group) => {
          const convs = groupedConversations[group];
          if (!convs || convs.length === 0) return null;

          return (
            <div key={group} className="mb-4">
              <p className="px-2 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {group}
              </p>
              <div className="space-y-1">
                {convs.map((conv) => (
                  <div
                    key={conv.id}
                    className={`group relative flex items-center rounded-lg transition-colors ${
                      currentConversationId === conv.id
                        ? "bg-primary/15"
                        : "hover:bg-secondary/60"
                    }`}
                  >
                    {editingId === conv.id ? (
                      <div className="flex-1 flex items-center gap-1 p-2">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveEdit();
                            if (e.key === "Escape") cancelEdit();
                          }}
                          className="flex-1 px-2 py-1 text-sm bg-background rounded border border-border focus:outline-none focus:ring-1 focus:ring-primary/30"
                          autoFocus
                        />
                        <button
                          onClick={saveEdit}
                          className="p-1 text-primary hover:bg-primary/10 rounded"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="p-1 text-muted-foreground hover:bg-secondary rounded"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => onSelectConversation(conv.id)}
                          className="flex-1 text-left px-3 py-2 text-sm text-foreground truncate"
                        >
                          {conv.title}
                        </button>
                        <div className="hidden group-hover:flex items-center gap-0.5 pr-2">
                          <button
                            onClick={() => startEditing(conv)}
                            className="p-1 text-muted-foreground hover:text-foreground hover:bg-secondary rounded"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteConversation(conv.id)}
                            className="p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {conversations.length === 0 && (
          <p className="px-3 py-8 text-center text-sm text-muted-foreground">
            No conversations yet
          </p>
        )}
      </div>
    </div>
  );
}
