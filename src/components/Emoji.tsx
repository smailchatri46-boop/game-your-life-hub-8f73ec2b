import twemoji from "@twemoji/api";
import { useMemo } from "react";

interface EmojiProps {
  emoji: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";
  className?: string;
}

const sizeMap: Record<string, string> = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
  xl: "w-7 h-7",
  "2xl": "w-8 h-8",
  "3xl": "w-10 h-10",
  "4xl": "w-12 h-12",
  "5xl": "w-14 h-14",
};

/**
 * Renders an emoji as an image using Twemoji (Twitter/Apple-style emojis)
 * This ensures consistent emoji appearance across all platforms
 */
export function Emoji({ emoji, size = "md", className = "" }: EmojiProps) {
  const imageUrl = useMemo(() => {
    // Convert emoji to codepoint for Twemoji URL
    const codePoints = [];
    for (const char of emoji) {
      const cp = char.codePointAt(0);
      if (cp !== undefined) {
        // Skip variation selectors (FE0F) and zero-width joiners (200D) for the base URL
        if (cp !== 0xfe0f) {
          codePoints.push(cp.toString(16));
        }
      }
    }
    const filename = codePoints.join("-");
    return `https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/${filename}.svg`;
  }, [emoji]);

  return (
    <img
      src={imageUrl}
      alt={emoji}
      className={`inline-block ${sizeMap[size] || sizeMap.md} ${className}`}
      draggable={false}
      loading="lazy"
    />
  );
}

/**
 * Parses a string containing emojis and returns HTML with image replacements
 * Useful for text content that may contain emojis
 */
export function parseEmojis(text: string): string {
  const container = document.createElement("span");
  container.textContent = text;
  twemoji.parse(container, {
    base: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/",
    folder: "svg",
    ext: ".svg",
  });
  return container.innerHTML;
}
