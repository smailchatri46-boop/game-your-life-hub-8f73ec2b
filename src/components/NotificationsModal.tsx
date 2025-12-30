import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Bell, Calendar, Flame, Target } from "lucide-react";

interface NotificationsModalProps {
  open: boolean;
  onClose: () => void;
}

interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  enabled: boolean;
}

export function NotificationsModal({ open, onClose }: NotificationsModalProps) {
  const [settings, setSettings] = useState<NotificationSetting[]>([
    {
      id: "daily_reminders",
      label: "Daily Reminders",
      description: "Get reminded to complete your habits",
      icon: <Bell className="w-5 h-5 text-primary" />,
      enabled: true,
    },
    {
      id: "weekly_summaries",
      label: "Weekly Summaries",
      description: "Receive a summary of your weekly progress",
      icon: <Calendar className="w-5 h-5 text-primary" />,
      enabled: true,
    },
    {
      id: "goal_deadlines",
      label: "Goal Deadline Reminders",
      description: "Get notified when goals are approaching deadlines",
      icon: <Target className="w-5 h-5 text-primary" />,
      enabled: false,
    },
    {
      id: "streak_reminders",
      label: "Streak Reminders",
      description: "Don't break your streak! Get reminded daily",
      icon: <Flame className="w-5 h-5 text-primary" />,
      enabled: true,
    },
  ]);

  const toggleSetting = (id: string) => {
    setSettings((prev) =>
      prev.map((setting) =>
        setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
      )
    );
  };

  const handleSave = () => {
    // TODO: Save notification settings to backend
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md rounded-3xl border-border/20 bg-card/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="font-display text-xl font-semibold text-foreground">
            Notifications
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-1 pt-4">
          {settings.map((setting) => (
            <div
              key={setting.id}
              className="flex items-center justify-between p-4 rounded-2xl hover:bg-secondary/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  {setting.icon}
                </div>
                <div>
                  <p className="font-medium text-foreground">{setting.label}</p>
                  <p className="text-sm text-muted-foreground">{setting.description}</p>
                </div>
              </div>
              <Switch
                checked={setting.enabled}
                onCheckedChange={() => toggleSetting(setting.id)}
              />
            </div>
          ))}
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            variant="secondary"
            onClick={onClose}
            className="flex-1 rounded-full"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="flex-1 rounded-full text-primary-foreground font-medium"
            style={{ background: 'linear-gradient(135deg, hsl(38 100% 70%) 0%, hsl(24 95% 53%) 100%)' }}
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
