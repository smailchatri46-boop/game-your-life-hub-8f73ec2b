import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/GlassCard";
import { AppleEmoji } from "@/components/AppleEmoji";
import googleLogo from "@/assets/google-logo.png";
import { Footer } from "@/components/Footer";
import { LandingNavbar } from "@/components/LandingNavbar";
import GlowOrb from "@/components/GlowOrb";

// Floating feature card component
function FloatingCard({ 
  emoji, 
  title, 
  delay = 0,
  className = ""
}: { 
  emoji: string; 
  title: string; 
  delay?: number;
  className?: string;
}) {
  return (
    <div 
      className={`glass-card px-5 py-3 flex items-center gap-3 animate-float ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <AppleEmoji emoji={emoji} size="lg" />
      <span className="font-medium text-foreground text-sm">{title}</span>
    </div>
  );
}

export default function HomepageTestA() {
  return (
    <div className="min-h-screen gradient-hero overflow-hidden">
      <LandingNavbar />
      
      {/* Hero Section - Centered with Glow Orb */}
      <section className="min-h-[90vh] flex flex-col items-center justify-center px-4 relative">
        {/* Background Glow Orb */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[500px] h-[500px] md:w-[700px] md:h-[700px] opacity-40">
            <GlowOrb />
          </div>
        </div>
        
        {/* Floating Feature Cards - Desktop only */}
        <div className="hidden lg:block">
          <div className="absolute top-32 left-[10%]">
            <FloatingCard emoji="🎯" title="Set Goals" delay={0} />
          </div>
          <div className="absolute top-48 right-[12%]">
            <FloatingCard emoji="📊" title="Track Progress" delay={200} />
          </div>
          <div className="absolute bottom-48 left-[15%]">
            <FloatingCard emoji="🤖" title="AI Insights" delay={400} />
          </div>
          <div className="absolute bottom-32 right-[10%]">
            <FloatingCard emoji="✨" title="Level Up" delay={600} />
          </div>
        </div>
        
        {/* Main Content */}
        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-semibold mb-6 animate-fade-in">
            <span className="italic gradient-text">Turn your life</span>
            <br />
            <span className="text-foreground">into a </span>
            <span className="gradient-text">Game</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mb-10 animate-fade-in delay-100">
            The most beautiful habit tracker powered by AI. 
            Set goals, build habits, and watch yourself level up every day.
          </p>
          
          <div className="animate-fade-in delay-200">
            <Button variant="gradient" size="xl" asChild className="shadow-xl">
              <Link to="/signup" className="gap-3">
                <span className="w-7 h-7 bg-white rounded-full flex items-center justify-center">
                  <img src={googleLogo} alt="Google" className="w-5 h-5" />
                </span>
                Continue with Google
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-3xl md:text-5xl font-semibold text-center mb-16">
            Everything you need to <span className="gradient-text italic">succeed</span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <GlassCard className="p-8 text-center" hover>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/30 to-primary/30 flex items-center justify-center mx-auto mb-5">
                <AppleEmoji emoji="📈" size="2xl" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-3">Track Habits</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Beautiful spreadsheet-style tracking that makes building habits feel effortless and rewarding.
              </p>
            </GlassCard>
            
            <GlassCard className="p-8 text-center" hover>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/30 to-primary/30 flex items-center justify-center mx-auto mb-5">
                <AppleEmoji emoji="🎯" size="2xl" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-3">Set Goals</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Connect habits to meaningful goals and watch your progress compound over time.
              </p>
            </GlassCard>
            
            <GlassCard className="p-8 text-center" hover>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/30 to-primary/30 flex items-center justify-center mx-auto mb-5">
                <AppleEmoji emoji="🤖" size="2xl" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-3">AI Coach</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Get personalized insights and guidance from an AI that knows your patterns.
              </p>
            </GlassCard>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <GlassCard className="p-14" glow>
            <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4">
              Ready to level up?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Join thousands who are building better habits every day.
            </p>
            
            <Button variant="gradient" size="xl" asChild>
              <Link to="/signup" className="gap-3">
                <span className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <img src={googleLogo} alt="Google" className="w-4 h-4" />
                </span>
                Continue with Google
              </Link>
            </Button>
          </GlassCard>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
