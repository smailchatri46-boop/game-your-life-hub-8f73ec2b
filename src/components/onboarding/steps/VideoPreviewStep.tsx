import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AppleEmoji } from "@/components/AppleEmoji";
import { ChevronRight } from "lucide-react";
import { YouTubeEmbed } from "@/components/YouTubeEmbed";
import dashboardThumbnail from "@/assets/dashboard-thumbnail.png";

interface VideoPreviewStepProps {
  onNext: () => void;
}

export function VideoPreviewStep({ onNext }: VideoPreviewStepProps) {
  // Hide the global scrollbar when this component mounts
  useEffect(() => {
    const html = document.documentElement;
    const originalOverflow = html.style.overflow;
    const originalOverflowY = html.style.overflowY;
    
    // Hide the scrollbar completely
    html.style.overflow = 'hidden';
    html.style.overflowY = 'hidden';
    
    return () => {
      // Restore original scrollbar behavior on unmount
      html.style.overflow = originalOverflow;
      html.style.overflowY = originalOverflowY;
    };
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center gradient-hero overflow-hidden">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex justify-center mb-3">
          <AppleEmoji emoji="🎬" size="3xl" />
        </div>
        <h2 className="text-2xl font-bold font-display text-foreground mb-2">
          See Neyler in action
        </h2>
        <p className="text-muted-foreground text-base max-w-lg mx-auto px-4 whitespace-nowrap">
          A quick walkthrough of how everything comes together.
        </p>
      </div>

      {/* Video Player - Full Width */}
      <div className="w-full max-w-4xl px-4 mb-8">
        <div className="rounded-2xl overflow-hidden shadow-2xl">
          <YouTubeEmbed 
            videoId="0GO0SyFo8dc"
            thumbnail={dashboardThumbnail}
          />
        </div>
      </div>

      {/* CTA Button */}
      <Button
        onClick={onNext}
        variant="gradient"
        className="h-12 px-8 text-base hover:opacity-90"
      >
        Continue <ChevronRight className="w-4 h-4 ml-1" />
      </Button>
    </div>
  );
}
