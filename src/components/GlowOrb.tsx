import { memo } from "react";

const GlowOrb = memo(function GlowOrb() {
  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Base ambient glow */}
      <div 
        className="absolute inset-0 animate-[breathe_8s_ease-in-out_infinite]"
        style={{
          background: 'radial-gradient(ellipse 80% 70% at 50% 50%, hsla(35, 100%, 65%, 0.9) 0%, hsla(30, 100%, 60%, 0.6) 30%, transparent 70%)',
          filter: 'blur(8px)',
        }}
      />
      
      {/* Primary warm core - yellow/orange */}
      <div 
        className="absolute inset-0 animate-[morph1_12s_ease-in-out_infinite]"
        style={{
          background: 'radial-gradient(ellipse 60% 55% at 55% 45%, hsla(45, 100%, 60%, 0.95) 0%, hsla(35, 100%, 55%, 0.7) 40%, transparent 65%)',
          filter: 'blur(6px)',
        }}
      />
      
      {/* Secondary orange layer */}
      <div 
        className="absolute inset-0 animate-[morph2_10s_ease-in-out_infinite]"
        style={{
          background: 'radial-gradient(ellipse 70% 60% at 45% 55%, hsla(25, 100%, 60%, 0.85) 0%, hsla(20, 100%, 55%, 0.5) 35%, transparent 60%)',
          filter: 'blur(10px)',
        }}
      />
      
      {/* Peach accent layer */}
      <div 
        className="absolute inset-0 animate-[morph3_14s_ease-in-out_infinite]"
        style={{
          background: 'radial-gradient(ellipse 55% 65% at 60% 40%, hsla(30, 90%, 70%, 0.8) 0%, hsla(25, 85%, 65%, 0.4) 40%, transparent 55%)',
          filter: 'blur(12px)',
        }}
      />
      
      {/* Soft pink edge accent - top left */}
      <div 
        className="absolute inset-0 animate-[drift1_16s_ease-in-out_infinite]"
        style={{
          background: 'radial-gradient(ellipse 40% 35% at 25% 30%, hsla(340, 70%, 80%, 0.5) 0%, transparent 60%)',
          filter: 'blur(18px)',
        }}
      />
      
      {/* Soft pink edge accent - bottom */}
      <div 
        className="absolute inset-0 animate-[drift2_18s_ease-in-out_infinite]"
        style={{
          background: 'radial-gradient(ellipse 45% 30% at 35% 75%, hsla(350, 65%, 78%, 0.45) 0%, transparent 55%)',
          filter: 'blur(20px)',
        }}
      />
      
      {/* Bright yellow highlight */}
      <div 
        className="absolute inset-0 animate-[pulse_6s_ease-in-out_infinite]"
        style={{
          background: 'radial-gradient(ellipse 35% 40% at 50% 55%, hsla(50, 100%, 65%, 0.7) 0%, hsla(40, 100%, 60%, 0.3) 30%, transparent 50%)',
          filter: 'blur(8px)',
        }}
      />
      
      {/* Deep orange warm spot */}
      <div 
        className="absolute inset-0 animate-[morph4_11s_ease-in-out_infinite]"
        style={{
          background: 'radial-gradient(ellipse 45% 50% at 55% 60%, hsla(20, 95%, 55%, 0.65) 0%, transparent 50%)',
          filter: 'blur(14px)',
        }}
      />
      
      {/* Outer soft glow ring */}
      <div 
        className="absolute -inset-4 animate-[breathe_10s_ease-in-out_infinite_reverse]"
        style={{
          background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, hsla(35, 80%, 75%, 0.2) 60%, hsla(340, 60%, 85%, 0.15) 80%, transparent 100%)',
          filter: 'blur(24px)',
          opacity: 0.8,
        }}
      />
    </div>
  );
});

export default GlowOrb;
