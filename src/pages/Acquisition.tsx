import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { YouTubeEmbed } from "@/components/YouTubeEmbed";
import neylerLogo from "@/assets/neyler-logo.png";
import dashboardThumbnail from "@/assets/dashboard-thumbnail.png";

export default function Acquisition() {
  return (
    <div className="min-h-screen gradient-hero flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-3 group">
          <ArrowLeft className="w-5 h-5 text-foreground group-hover:text-foreground/70 transition-colors" />
          <img
            src={neylerLogo}
            alt="Neyler"
            className="h-7 w-auto"
            width={100}
            height={28}
          />
        </Link>
      </div>

      {/* Heading + Centered video */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 pb-12">
        <h1 className="font-display text-2xl md:text-4xl font-semibold text-center mb-8 max-w-3xl text-foreground">
          Unlocking Neyler's Growth: A Buyer's Complete Strategy Guide
        </h1>
        <div className="w-full max-w-[960px]">
          <div className="rounded-2xl overflow-hidden shadow-2xl shadow-black/10">
            <YouTubeEmbed
              videoId="ZGbHccnE0wg"
              thumbnail={dashboardThumbnail}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
