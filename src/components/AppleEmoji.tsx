import { memo, useState, useMemo } from "react";

interface AppleEmojiProps {
  emoji: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl";
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
  "6xl": "w-20 h-20",
  "7xl": "w-24 h-24",
};

/**
 * Converts an emoji string to its Unicode code points in the format needed for the CDN.
 * Handles multi-codepoint emojis (like flags, skin tones, ZWJ sequences).
 */
function emojiToCodePoints(emoji: string): string {
  const codePoints: string[] = [];
  
  for (const char of emoji) {
    const codePoint = char.codePointAt(0);
    if (codePoint !== undefined) {
      // Include all code points except variation selector FE0F for the filename
      // emoji-datasource-apple uses lowercase hex without FE0F in filenames
      if (codePoint !== 0xfe0f) {
        codePoints.push(codePoint.toString(16).toLowerCase());
      }
    }
  }
  
  return codePoints.join("-");
}

/**
 * AppleEmoji - Displays Apple/iOS style emojis consistently across all platforms
 * by fetching emoji images from the emoji-datasource-apple CDN.
 * 
 * Falls back to native emoji if the image fails to load.
 */
export const AppleEmoji = memo(function AppleEmoji({ 
  emoji, 
  size = "md", 
  className = "" 
}: AppleEmojiProps) {
  const [hasError, setHasError] = useState(false);

  const imageUrl = useMemo(() => {
    const codePoints = emojiToCodePoints(emoji);
    return `https://cdn.jsdelivr.net/npm/emoji-datasource-apple@15.1.2/img/apple/64/${codePoints}.png`;
  }, [emoji]);

  const sizeClass = sizeMap[size] || sizeMap.md;

  // Fallback to native emoji if image fails to load
  if (hasError) {
    return (
      <span 
        className={`inline-flex items-center justify-center ${sizeClass} ${className}`}
        role="img"
        aria-label={emoji}
      >
        {emoji}
      </span>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={emoji}
      className={`inline-block object-contain ${sizeClass} ${className}`}
      draggable={false}
      loading="lazy"
      onError={() => setHasError(true)}
    />
  );
});

export default AppleEmoji;
