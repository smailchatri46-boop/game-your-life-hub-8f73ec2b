import { useState, useRef } from "react";
import { Play } from "lucide-react";

interface YouTubeEmbedProps {
  videoId: string;
  thumbnail?: string;
  className?: string;
}

export function YouTubeEmbed({ videoId, thumbnail, className = "" }: YouTubeEmbedProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  if (isPlaying) {
    return (
      <div className={`aspect-video relative ${className}`}>
        <iframe
          ref={iframeRef}
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&disablekb=1&fs=0&playsinline=1&loop=1&playlist=${videoId}`}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          className="w-full h-full rounded-t-xl pointer-events-none"
          style={{ border: 'none' }}
        />
        {/* Clickable overlay to pause */}
        <div 
          className="absolute inset-0 cursor-pointer z-10"
          onClick={handlePause}
        />
      </div>
    );
  }

  return (
    <div 
      className={`aspect-video relative cursor-pointer group ${className}`}
      onClick={handlePlay}
    >
      <img 
        src={thumbnail || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
        alt="Video thumbnail"
        className="w-full h-full object-cover rounded-t-xl"
        loading="lazy"
        onError={(e) => {
          if (!thumbnail) {
            (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
          }
        }}
      />
      <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors flex items-center justify-center rounded-t-xl">
        <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center shadow-large transition-transform group-hover:scale-110">
          <Play className="w-6 h-6 text-primary-foreground ml-1" />
        </div>
      </div>
    </div>
  );
}
