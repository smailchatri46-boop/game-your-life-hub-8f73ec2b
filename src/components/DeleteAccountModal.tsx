import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertTriangle } from "lucide-react";

interface DeleteAccountModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteAccountModal({ open, onClose, onConfirm }: DeleteAccountModalProps) {
  const [confirmText, setConfirmText] = useState("");
  const isConfirmed = confirmText === "DELETE";

  const handleDelete = () => {
    if (isConfirmed) {
      onConfirm();
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { 
      if (!isOpen) {
        setConfirmText("");
        onClose();
      }
    }}>
      <DialogContent className="sm:max-w-md rounded-3xl border-destructive/20 bg-card/95 backdrop-blur-xl">
        <DialogHeader className="text-center space-y-3">
          <div className="mx-auto w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="w-7 h-7 text-destructive" />
          </div>
          <DialogTitle className="font-display text-xl font-semibold text-foreground">
            Delete Account
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            This action is permanent and cannot be undone. All your data including habits, goals, journals, and chat history will be permanently deleted.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          <div className="p-4 rounded-2xl bg-destructive/5 border border-destructive/20">
            <p className="text-sm text-foreground font-medium mb-2">
              To confirm, type <span className="text-destructive font-bold">DELETE</span> below:
            </p>
            <Input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
              placeholder="Type DELETE to confirm"
              className="rounded-xl border-destructive/30 bg-background/50 uppercase"
            />
          </div>

          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={onClose}
              className="flex-1 rounded-full"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={!isConfirmed}
              className="flex-1 rounded-full"
            >
              Delete My Account
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
