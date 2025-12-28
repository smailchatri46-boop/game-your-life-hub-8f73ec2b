import { memo } from "react";

const GlowOrb = memo(function GlowOrb() {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-visible">
      {/* Outermost soft ambient glow */}
      <div 
        className="absolute w-[200%] h-[200%] animate-[glowPulse_8s_ease-in-out_infinite]"
        style={{
          background: 'radial-gradient(circle, hsla(35, 100%, 65%, 0.4) 0%, hsla(30, 90%, 60%, 0.15) 40%, transparent 70%)',
          filter: 'blur(30px)',
          borderRadius: '50%',
        }}
      />

      {/* Main organic blob - uses border-radius morphing */}
      <div 
        className="absolute w-[90%] h-[90%] animate-[organicMorph1_12s_ease-in-out_infinite]"
        style={{
          background: `
            radial-gradient(ellipse 120% 80% at 30% 30%, hsla(45, 100%, 72%, 0.9) 0%, transparent 50%),
            radial-gradient(ellipse 100% 120% at 70% 70%, hsla(25, 90%, 58%, 0.8) 0%, transparent 50%),
            linear-gradient(135deg, hsla(40, 100%, 65%, 1) 0%, hsla(30, 100%, 55%, 1) 50%, hsla(20, 95%, 50%, 1) 100%)
          `,
          filter: 'blur(1px)',
        }}
      />

      {/* Secondary blob layer - offset timing for organic feel */}
      <div 
        className="absolute w-[85%] h-[85%] animate-[organicMorph2_10s_ease-in-out_infinite]"
        style={{
          background: `
            radial-gradient(ellipse 90% 110% at 60% 40%, hsla(48, 100%, 70%, 0.85) 0%, transparent 55%),
            radial-gradient(ellipse 110% 90% at 40% 60%, hsla(30, 95%, 60%, 0.7) 0%, transparent 55%),
            linear-gradient(200deg, hsla(42, 100%, 68%, 0.95) 0%, hsla(32, 100%, 58%, 0.9) 100%)
          `,
          filter: 'blur(2px)',
        }}
      />

      {/* Inner warm core with its own morph */}
      <div 
        className="absolute w-[70%] h-[70%] animate-[organicMorph3_8s_ease-in-out_infinite]"
        style={{
          background: `
            radial-gradient(ellipse 80% 100% at 50% 45%, hsla(50, 100%, 75%, 1) 0%, transparent 60%),
            radial-gradient(ellipse 100% 80% at 50% 55%, hsla(40, 100%, 68%, 0.9) 0%, transparent 60%)
          `,
          filter: 'blur(3px)',
        }}
      />

      {/* Bright highlight that drifts with position + morph */}
      <div 
        className="absolute w-[50%] h-[50%] animate-[highlightMorph_9s_ease-in-out_infinite]"
        style={{
          background: 'radial-gradient(circle, hsla(52, 100%, 78%, 0.95) 0%, hsla(48, 100%, 70%, 0.5) 40%, transparent 70%)',
          filter: 'blur(5px)',
          top: '15%',
          left: '20%',
        }}
      />

      {/* Peach accent wash with subtle morph */}
      <div 
        className="absolute w-[55%] h-[55%] animate-[accentMorph_11s_ease-in-out_infinite]"
        style={{
          background: 'radial-gradient(ellipse, hsla(28, 85%, 70%, 0.75) 0%, hsla(22, 80%, 62%, 0.3) 50%, transparent 70%)',
          filter: 'blur(6px)',
          bottom: '10%',
          right: '15%',
        }}
      />

      {/* Soft outer edge glow that morphs */}
      <div 
        className="absolute w-[105%] h-[105%] animate-[edgeMorph_14s_ease-in-out_infinite]"
        style={{
          background: `
            conic-gradient(from 45deg, 
              hsla(40, 100%, 70%, 0.25), 
              hsla(35, 95%, 62%, 0.35), 
              hsla(48, 100%, 72%, 0.25), 
              hsla(28, 90%, 58%, 0.3), 
              hsla(40, 100%, 70%, 0.25)
            )
          `,
          filter: 'blur(12px)',
        }}
      />
    </div>
  );
});

export default GlowOrb;
