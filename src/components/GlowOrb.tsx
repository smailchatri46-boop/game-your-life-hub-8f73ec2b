import { memo } from "react";

const GlowOrb = memo(function GlowOrb() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Outer ambient glow - largest, most diffuse */}
      <div 
        className="absolute w-[140%] h-[140%] rounded-full animate-[breatheGlow_8s_ease-in-out_infinite]"
        style={{
          background: 'radial-gradient(circle, hsla(35, 100%, 70%, 0.4) 0%, hsla(30, 90%, 65%, 0.2) 40%, transparent 70%)',
          filter: 'blur(20px)',
        }}
      />
      
      {/* Secondary glow layer with pink tint */}
      <div 
        className="absolute w-[130%] h-[130%] rounded-full animate-[breatheGlow_10s_ease-in-out_infinite_reverse]"
        style={{
          background: 'radial-gradient(ellipse 80% 90% at 30% 40%, hsla(340, 70%, 80%, 0.35) 0%, transparent 50%), radial-gradient(ellipse 70% 80% at 70% 60%, hsla(40, 100%, 70%, 0.3) 0%, transparent 50%)',
          filter: 'blur(16px)',
        }}
      />

      {/* Main morphing blob - primary orange/yellow */}
      <div 
        className="absolute w-[90%] h-[90%] animate-[morphBlob1_12s_ease-in-out_infinite_alternate]"
        style={{
          background: 'linear-gradient(135deg, hsla(45, 100%, 65%, 0.95) 0%, hsla(35, 100%, 58%, 0.9) 40%, hsla(25, 100%, 55%, 0.85) 100%)',
          filter: 'blur(2px)',
          borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
        }}
      />

      {/* Secondary morphing layer - deeper orange */}
      <div 
        className="absolute w-[85%] h-[85%] animate-[morphBlob2_10s_ease-in-out_infinite_alternate]"
        style={{
          background: 'linear-gradient(225deg, hsla(30, 100%, 60%, 0.8) 0%, hsla(20, 95%, 55%, 0.7) 50%, hsla(35, 100%, 65%, 0.75) 100%)',
          filter: 'blur(3px)',
          borderRadius: '40% 60% 60% 40% / 70% 30% 70% 30%',
        }}
      />

      {/* Third morphing layer - warm peach accent */}
      <div 
        className="absolute w-[75%] h-[75%] animate-[morphBlob3_14s_ease-in-out_infinite_alternate]"
        style={{
          background: 'radial-gradient(ellipse at 40% 30%, hsla(40, 90%, 72%, 0.9) 0%, hsla(30, 85%, 62%, 0.6) 50%, transparent 80%)',
          filter: 'blur(4px)',
          borderRadius: '50% 50% 40% 60% / 40% 60% 40% 60%',
        }}
      />

      {/* Bright yellow core highlight */}
      <div 
        className="absolute w-[50%] h-[55%] animate-[morphCore_8s_ease-in-out_infinite_alternate]"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, hsla(50, 100%, 70%, 0.95) 0%, hsla(45, 100%, 65%, 0.5) 50%, transparent 80%)',
          filter: 'blur(6px)',
          borderRadius: '70% 30% 50% 50% / 50% 50% 50% 50%',
        }}
      />

      {/* Soft pink highlight - top left */}
      <div 
        className="absolute w-[45%] h-[40%] top-[5%] left-[5%] animate-[driftPink1_16s_ease-in-out_infinite_alternate]"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, hsla(340, 65%, 82%, 0.6) 0%, transparent 70%)',
          filter: 'blur(10px)',
          borderRadius: '60% 40% 50% 50% / 50% 60% 40% 50%',
        }}
      />

      {/* Soft pink highlight - bottom */}
      <div 
        className="absolute w-[40%] h-[35%] bottom-[10%] left-[15%] animate-[driftPink2_18s_ease-in-out_infinite_alternate]"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, hsla(350, 60%, 80%, 0.5) 0%, transparent 65%)',
          filter: 'blur(12px)',
          borderRadius: '50% 50% 60% 40% / 40% 50% 50% 60%',
        }}
      />

      {/* Deep orange accent - moving */}
      <div 
        className="absolute w-[55%] h-[50%] animate-[morphAccent_11s_ease-in-out_infinite_alternate]"
        style={{
          background: 'radial-gradient(ellipse at 60% 55%, hsla(20, 95%, 52%, 0.7) 0%, transparent 60%)',
          filter: 'blur(8px)',
          borderRadius: '45% 55% 50% 50% / 55% 45% 55% 45%',
        }}
      />
    </div>
  );
});

export default GlowOrb;
