import { AppleEmoji } from "@/components/AppleEmoji";

export function CommunityLink() {
  return (
    <a
      href="https://discord.gg/r7FgYNRqSR"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center gap-1.5 py-4 text-xs text-muted-foreground hover:text-foreground transition-colors"
    >
      <AppleEmoji emoji="🤗" size="sm" />
      <span>Join our community</span>
    </a>
  );
}
