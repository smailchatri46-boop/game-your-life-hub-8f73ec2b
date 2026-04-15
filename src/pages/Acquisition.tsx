import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { YouTubeEmbed } from "@/components/YouTubeEmbed";
import neylerLogo from "@/assets/neyler-logo.png";
import dashboardThumbnail from "@/assets/dashboard-thumbnail.png";

export default function Acquisition() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-3 group">
          <ArrowLeft className="w-5 h-5 text-white/50 group-hover:text-white/80 transition-colors" />
          <img
            src={neylerLogo}
            alt="Neyler"
            className="h-7 w-auto brightness-0 invert"
            width={100}
            height={28}
          />
        </Link>
      </div>

      {/* Centered video */}
      <div className="flex-1 flex items-center justify-center px-4 pb-12">
        <div className="w-full max-w-[960px]">
          <div className="rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
            <YouTubeEmbed
              videoId="0GO0SyFo8dc"
              thumbnail={dashboardThumbnail}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
