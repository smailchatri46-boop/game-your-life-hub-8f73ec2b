import { useState } from "react";
import { Play } from "lucide-react";

interface YouTubeEmbedProps {
  videoId: string;
  thumbnail?: string;
  className?: string;
}

export function YouTubeEmbed({ videoId, thumbnail, className = "" }: YouTubeEmbedProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  if (isPlaying) {
    return (
      <div className={`aspect-video ${className}`}>
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0&showinfo=0&controls=1&disablekb=0&fs=0&iv_load_policy=3&playsinline=1&playlist=${videoId}&loop=1`}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full rounded-t-xl"
          style={{ border: 'none' }}
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
        onError={(e) => {
          // Fallback to hqdefault if maxresdefault doesn't exist (only for YouTube thumbnails)
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
