import { useState } from "react";
import { Pencil, Trash2, Check, X, Plus, X as CloseIcon } from "lucide-react";
import { Conversation } from "@/hooks/use-ai-chat";
import { isToday, isYesterday, isThisWeek } from "date-fns";

interface ChatSidebarProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  onNewChat: () => void;
  onSelectConversation: (id: string) => void;
  onRenameConversation: (id: string, title: string) => void;
  onDeleteConversation: (id: string) => void;
  onClose?: () => void;
}

export function ChatSidebar({
  conversations,
  currentConversationId,
  onNewChat,
  onSelectConversation,
  onRenameConversation,
  onDeleteConversation,
  onClose,
}: ChatSidebarProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const startEditing = (conv: Conversation, e: React.MouseEvent) => {
    e.stopPropagation();
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

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteConversation(id);
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
    <div className="w-64 h-full bg-card/60 backdrop-blur-2xl border-r border-border/10 flex flex-col shadow-xl rounded-r-2xl">
      {/* Header */}
      <div className="p-3 border-b border-border/10 flex items-center justify-between">
        <button
          onClick={onNewChat}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-muted/50 hover:bg-muted/70 text-foreground text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          New chat
        </button>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-2 p-2 rounded-lg hover:bg-muted/50 text-muted-foreground transition-colors"
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto px-2 py-3">
        {groupOrder.map((group) => {
          const convs = groupedConversations[group];
          if (!convs || convs.length === 0) return null;

          return (
            <div key={group} className="mb-4">
              <p className="px-2 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {group}
              </p>
              <div className="space-y-0.5">
                {convs.map((conv) => (
                  <div
                    key={conv.id}
                    className={`group relative flex items-center rounded-lg transition-colors cursor-pointer ${
                      currentConversationId === conv.id
                        ? "bg-muted/60"
                        : "bg-muted/20 hover:bg-muted/40"
                    }`}
                    onClick={() => onSelectConversation(conv.id)}
                  >
                    {editingId === conv.id ? (
                      <div className="flex-1 flex items-center gap-1 p-2" onClick={(e) => e.stopPropagation()}>
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
                          className="p-1 text-muted-foreground hover:bg-muted rounded"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="flex-1 text-left px-3 py-2.5 text-sm text-foreground truncate">
                          {conv.title}
                        </span>
                        <div className="hidden group-hover:flex items-center gap-0.5 pr-2">
                          <button
                            onClick={(e) => startEditing(conv, e)}
                            className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => handleDelete(conv.id, e)}
                            className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded"
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
