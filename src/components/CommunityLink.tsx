import { AppleEmoji } from "@/components/AppleEmoji";

export function CommunityLink() {
  return (
    <a
      href="https://discord.gg/r7FgYNRqSR"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-center gap-1.5 py-3 text-xs text-muted-foreground hover:text-foreground transition-colors bg-background/80 backdrop-blur-sm border-t border-border/30"
    >
      <AppleEmoji emoji="🤗" size="sm" />
      <span>Join our community</span>
    </a>
  );
}
