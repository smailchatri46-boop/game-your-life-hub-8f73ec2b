import { AppleEmoji } from "@/components/AppleEmoji";

// Regex to match emoji characters (covers most common emojis including ZWJ sequences)
const emojiRegex = /(\p{Emoji_Presentation}|\p{Emoji}\uFE0F|\p{Emoji_Modifier_Base}\p{Emoji_Modifier}?|\p{Emoji}\u200D\p{Emoji})+/gu;

/**
 * Parses text and replaces emoji characters with AppleEmoji components
 * while preserving surrounding text and formatting.
 */
export function parseTextWithEmojis(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let keyIndex = 0;

  // Reset regex state
  emojiRegex.lastIndex = 0;

  while ((match = emojiRegex.exec(text)) !== null) {
    // Add text before the emoji
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    // Add the emoji as AppleEmoji component
    const emoji = match[0];
    parts.push(
      <AppleEmoji
        key={`emoji-${keyIndex++}`}
        emoji={emoji}
        size="sm"
        className="inline align-middle mx-0.5"
      />
    );

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text after the last emoji
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  // If no emojis found, return the original text
  if (parts.length === 0) {
    return [text];
  }

  return parts;
}
