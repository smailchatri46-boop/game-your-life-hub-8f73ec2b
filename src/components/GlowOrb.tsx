import { memo } from "react";

const GlowOrb = memo(function GlowOrb() {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-visible">
      {/* Outermost soft glow aura */}
      <div 
        className="absolute w-[180%] h-[180%] animate-[auraPulse_6s_ease-in-out_infinite]"
        style={{
          background: 'radial-gradient(circle, hsla(35, 100%, 65%, 0.35) 0%, hsla(30, 90%, 60%, 0.15) 35%, transparent 65%)',
          filter: 'blur(25px)',
          borderRadius: '50%',
        }}
      />

      {/* Secondary glow with peach tint */}
      <div 
        className="absolute w-[150%] h-[150%] animate-[auraPulse_8s_ease-in-out_infinite_reverse]"
        style={{
          background: 'radial-gradient(ellipse 70% 80% at 40% 45%, hsla(25, 85%, 70%, 0.4) 0%, hsla(35, 80%, 65%, 0.2) 40%, transparent 70%)',
          filter: 'blur(18px)',
          borderRadius: '50%',
        }}
      />

      {/* Main morphing blob - Layer 1 (back) */}
      <div 
        className="absolute w-[95%] h-[95%] animate-[blobMorph1_8s_ease-in-out_infinite_alternate]"
        style={{
          background: 'linear-gradient(145deg, hsla(40, 100%, 68%, 1) 0%, hsla(30, 100%, 58%, 0.95) 50%, hsla(20, 95%, 52%, 0.9) 100%)',
          filter: 'blur(1px)',
        }}
      />

      {/* Main morphing blob - Layer 2 (middle) */}
      <div 
        className="absolute w-[88%] h-[88%] animate-[blobMorph2_10s_ease-in-out_infinite_alternate]"
        style={{
          background: 'linear-gradient(200deg, hsla(45, 100%, 70%, 0.95) 0%, hsla(35, 100%, 62%, 0.9) 40%, hsla(25, 100%, 55%, 0.85) 100%)',
          filter: 'blur(2px)',
        }}
      />

      {/* Inner warm core - Layer 3 */}
      <div 
        className="absolute w-[70%] h-[75%] animate-[blobMorph3_7s_ease-in-out_infinite_alternate]"
        style={{
          background: 'radial-gradient(ellipse 80% 70% at 45% 45%, hsla(48, 100%, 72%, 1) 0%, hsla(40, 100%, 65%, 0.8) 50%, transparent 85%)',
          filter: 'blur(4px)',
        }}
      />

      {/* Bright yellow highlight spot */}
      <div 
        className="absolute w-[45%] h-[50%] animate-[highlightDrift_9s_ease-in-out_infinite_alternate]"
        style={{
          background: 'radial-gradient(ellipse at 50% 40%, hsla(50, 100%, 75%, 0.95) 0%, hsla(45, 100%, 68%, 0.5) 40%, transparent 70%)',
          filter: 'blur(6px)',
        }}
      />

      {/* Peach accent wash */}
      <div 
        className="absolute w-[60%] h-[55%] animate-[accentFloat_11s_ease-in-out_infinite_alternate]"
        style={{
          background: 'radial-gradient(ellipse at 60% 55%, hsla(28, 90%, 72%, 0.7) 0%, transparent 60%)',
          filter: 'blur(8px)',
        }}
      />

      {/* Subtle warm edge glow */}
      <div 
        className="absolute w-[100%] h-[100%] animate-[blobMorph1_12s_ease-in-out_infinite_alternate-reverse]"
        style={{
          background: 'conic-gradient(from 0deg, hsla(40, 100%, 70%, 0.3), hsla(30, 95%, 60%, 0.4), hsla(45, 100%, 72%, 0.3), hsla(25, 90%, 58%, 0.35), hsla(40, 100%, 70%, 0.3))',
          filter: 'blur(10px)',
        }}
      />
    </div>
  );
});

export default GlowOrb;
