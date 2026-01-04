import { YouTubeEmbed } from "@/components/YouTubeEmbed";

const TUTORIAL_VIDEO_ID = "eX6Tn66IXCM";

export default function VideoTutorial() {
  return (
    <main className="pt-28 pb-12 px-4 max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="font-display text-3xl font-semibold">App Tutorial</h1>
        <p className="font-body text-muted-foreground mt-1">Watch this complete walkthrough to master all features</p>
      </div>
      
      <div className="rounded-2xl overflow-hidden shadow-2xl">
        <YouTubeEmbed videoId={TUTORIAL_VIDEO_ID} />
      </div>
    </main>
  );
}
