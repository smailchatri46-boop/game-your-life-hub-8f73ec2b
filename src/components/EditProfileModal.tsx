import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { updateProfile, getProfile, ensureProfile } from "@/services/supabase/profiles";

interface EditProfileModalProps {
  open: boolean;
  onClose: () => void;
}

const avatarColors = [
  "from-primary to-accent",
  "from-[#FF6B6B] to-[#FFE66D]",
  "from-[#4ECDC4] to-[#556270]",
  "from-[#A8E6CF] to-[#3D5A80]",
  "from-[#F093FB] to-[#F5576C]",
  "from-[#667EEA] to-[#764BA2]",
];

export function EditProfileModal({ open, onClose }: EditProfileModalProps) {
  const { user } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedColor, setSelectedColor] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      if (user && open) {
        setEmail(user.email || "");
        const profile = await getProfile(user.id);
        if (profile) {
          setFullName(profile.full_name || user.user_metadata?.full_name || "");
          // Find the selected color index from saved avatar_url
          const savedColor = profile.avatar_url;
          const colorIndex = avatarColors.findIndex(c => c === savedColor);
          if (colorIndex >= 0) setSelectedColor(colorIndex);
        } else {
          setFullName(user.user_metadata?.full_name || "");
        }
      }
    };
    loadProfile();
  }, [user, open]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    try {
      // Ensure profile exists first
      await ensureProfile(user.id, user.email, fullName, avatarColors[selectedColor]);
      // Then update
      await updateProfile(user.id, {
        full_name: fullName,
        avatar_url: avatarColors[selectedColor],
      });
      toast.success("Profile updated!");
      onClose();
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const initial = fullName?.charAt(0)?.toUpperCase() || email?.charAt(0)?.toUpperCase() || "U";

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md rounded-3xl border-border/20 bg-card/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="font-display text-xl font-semibold text-foreground">
            Edit Profile
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Avatar Preview */}
          <div className="flex flex-col items-center gap-4">
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${avatarColors[selectedColor]} flex items-center justify-center text-white text-3xl font-bold shadow-lg`}>
              {initial}
            </div>
            
            {/* Color Selection */}
            <div className="flex gap-2">
              {avatarColors.map((color, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedColor(index)}
                  className={`w-8 h-8 rounded-full bg-gradient-to-br ${color} transition-all ${
                    selectedColor === index 
                      ? "ring-2 ring-primary ring-offset-2 ring-offset-card scale-110" 
                      : "hover:scale-105"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Name Input */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-foreground">
              Full Name
            </Label>
            <Input
              id="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your name"
              className="rounded-xl border-border/50 bg-background/50"
            />
          </div>

          {/* Email Input */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-foreground">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="rounded-xl border-border/50 bg-background/50"
              disabled
            />
            <p className="text-xs text-muted-foreground">Email cannot be changed here</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="secondary"
              onClick={onClose}
              className="flex-1 rounded-full"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 rounded-full text-primary-foreground font-medium"
              style={{ background: 'linear-gradient(135deg, hsl(38 100% 70%) 0%, hsl(24 95% 53%) 100%)' }}
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
