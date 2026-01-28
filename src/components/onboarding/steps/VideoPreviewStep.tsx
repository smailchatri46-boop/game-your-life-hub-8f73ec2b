import { OnboardingCard } from "../OnboardingCard";
import { Button } from "@/components/ui/button";
import { AppleEmoji } from "@/components/AppleEmoji";
import { ChevronRight } from "lucide-react";
import { YouTubeEmbed } from "@/components/YouTubeEmbed";
import dashboardThumbnail from "@/assets/dashboard-thumbnail.png";

interface VideoPreviewStepProps {
  onNext: () => void;
}

export function VideoPreviewStep({ onNext }: VideoPreviewStepProps) {
  return (
    <OnboardingCard className="max-w-lg">
      <div className="text-center mb-5">
        <div className="flex justify-center mb-3">
          <AppleEmoji emoji="🎬" size="3xl" />
        </div>
        <h2 className="text-xl font-bold font-display text-foreground mb-2">
          See Neyler in action
        </h2>
        <p className="text-muted-foreground text-sm">
          A quick look at how everything comes together.
        </p>
      </div>

      {/* Video Player */}
      <div className="rounded-xl overflow-hidden mb-6 shadow-soft">
        <YouTubeEmbed 
          videoId="0GO0SyFo8dc"
          thumbnail={dashboardThumbnail}
        />
      </div>

      <Button
        onClick={onNext}
        variant="gradient"
        className="w-full h-11 hover:opacity-90"
      >
        Continue <ChevronRight className="w-4 h-4 ml-1" />
      </Button>
    </OnboardingCard>
  );
}
