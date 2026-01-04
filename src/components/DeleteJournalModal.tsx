import { useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AppleEmoji } from "@/components/AppleEmoji";
import { X } from "lucide-react";

interface DeleteJournalModalProps {
  journalPreview: string;
  onConfirmDelete: () => void;
  onClose: () => void;
}

export function DeleteJournalModal({ journalPreview, onConfirmDelete, onClose }: DeleteJournalModalProps) {
  const [deleteInput, setDeleteInput] = useState("");

  const canDelete = deleteInput.toLowerCase() === "delete";

  const handleDelete = () => {
    if (canDelete) {
      onConfirmDelete();
    }
  };

  // Truncate journal preview if too long
  const truncatedPreview = journalPreview.length > 50 
    ? journalPreview.substring(0, 50) + "..." 
    : journalPreview;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center animate-fade-in pointer-events-auto">
      {/* Blurred background overlay */}
      <div 
        className="absolute inset-0 bg-background/60 backdrop-blur-md pointer-events-auto cursor-pointer" 
        onClick={onClose}
      />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md mx-4 animate-scale-in pointer-events-auto">
        <div className="bg-card/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-border/10 overflow-hidden">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors z-10"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="px-8 py-10 text-center min-h-[320px] flex flex-col">
            {/* Content area */}
            <div className="flex-1 flex flex-col justify-start">
              {/* Delete emoji */}
              <div className="mb-6 flex justify-center">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-destructive/10 to-destructive/5 flex items-center justify-center">
                  <AppleEmoji emoji="❌" size="4xl" />
                </div>
              </div>

              <h2 className="text-xl font-semibold text-foreground mb-3 font-display">
                Are you sure you want to delete this journal?
              </h2>

              <p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-sm mx-auto">
                This will permanently remove <span className="font-medium text-foreground">"{truncatedPreview}"</span>.
                To confirm, please type <span className="font-medium text-foreground">delete</span> in the box below.
              </p>

              <Input
                type="text"
                placeholder="Type 'delete' to confirm"
                value={deleteInput}
                onChange={(e) => setDeleteInput(e.target.value)}
                className="mb-6 text-center"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 justify-center">
              <Button
                variant="outline"
                onClick={onClose}
                className="px-6 py-3 rounded-xl text-base font-medium hover:bg-muted/50"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={!canDelete}
                className="px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Delete Journal
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}