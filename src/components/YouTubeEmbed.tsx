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
      <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors duration-300 flex items-center justify-center rounded-t-xl">
        <div 
          className="w-16 h-16 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 ease-out group-hover:scale-110 group-hover:shadow-2xl"
          style={{
            background: 'linear-gradient(135deg, hsl(25 95% 53%) 0%, hsl(35 100% 55%) 50%, hsl(25 95% 50%) 100%)',
            boxShadow: '0 8px 32px rgba(245, 130, 32, 0.4), 0 4px 16px rgba(245, 130, 32, 0.3)'
          }}
        >
          <Play className="w-7 h-7 text-white ml-1 drop-shadow-sm transition-transform duration-300 group-hover:scale-105" fill="white" />
        </div>
      </div>
    </div>
  );
}
