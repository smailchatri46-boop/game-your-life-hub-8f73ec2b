import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/GlassCard";
import { AppleEmoji } from "@/components/AppleEmoji";
import googleLogo from "@/assets/google-logo.png";
import { Footer } from "@/components/Footer";
import { LandingNavbar } from "@/components/LandingNavbar";

// Animated stat card
function StatCard({ 
  value, 
  label, 
  emoji,
  delay = 0 
}: { 
  value: string; 
  label: string; 
  emoji: string;
  delay?: number;
}) {
  return (
    <div 
      className="glass-card p-6 text-center animate-scale-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-center gap-2 mb-2">
        <AppleEmoji emoji={emoji} size="xl" />
        <span className="font-display text-3xl md:text-4xl font-bold gradient-text">{value}</span>
      </div>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

// Animated pill badge
function AnimatedPill({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <span 
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </span>
  );
}

export default function HomepageTestB() {
  return (
    <div className="min-h-screen overflow-hidden relative">
      {/* Animated gradient background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-secondary/30" />
        <div 
          className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full opacity-30 animate-pulse-float-slow"
          style={{ 
            background: 'radial-gradient(circle, hsl(38 100% 70% / 0.5) 0%, transparent 70%)',
            filter: 'blur(60px)'
          }}
        />
        <div 
          className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full opacity-25 animate-pulse-float"
          style={{ 
            background: 'radial-gradient(circle, hsl(24 95% 60% / 0.5) 0%, transparent 70%)',
            filter: 'blur(50px)',
            animationDelay: '1s'
          }}
        />
      </div>
      
      <LandingNavbar />
      
      {/* Hero Section */}
      <section className="min-h-[85vh] flex flex-col items-center justify-center px-4 pt-20">
        <div className="text-center max-w-4xl mx-auto">
          {/* Animated pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            <AnimatedPill delay={0}>
              <AppleEmoji emoji="🎯" size="sm" /> Goals
            </AnimatedPill>
            <AnimatedPill delay={100}>
              <AppleEmoji emoji="📊" size="sm" /> Habits
            </AnimatedPill>
            <AnimatedPill delay={200}>
              <AppleEmoji emoji="🤖" size="sm" /> AI
            </AnimatedPill>
            <AnimatedPill delay={300}>
              <AppleEmoji emoji="📝" size="sm" /> Journal
            </AnimatedPill>
          </div>
          
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-semibold mb-6 animate-fade-in">
            Your life,{" "}
            <span className="italic gradient-text">gamified</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in delay-100">
            Track habits, set goals, and get AI-powered insights to level up every aspect of your life. 
            Beautiful, simple, and effective.
          </p>
          
          <div className="animate-fade-in delay-200 mb-16">
            <Button variant="gradient" size="xl" asChild className="shadow-xl">
              <Link to="/signup" className="gap-3">
                <span className="w-7 h-7 bg-white rounded-full flex items-center justify-center">
                  <img src={googleLogo} alt="Google" className="w-5 h-5" />
                </span>
                Continue with Google
              </Link>
            </Button>
          </div>
          
          {/* Animated stat cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <StatCard value="30+" emoji="🎯" label="Days to build a habit" delay={300} />
            <StatCard value="∞" emoji="📈" label="Habits to track" delay={400} />
            <StatCard value="24/7" emoji="🤖" label="AI available" delay={500} />
            <StatCard value="100%" emoji="🔒" label="Private & secure" delay={600} />
          </div>
        </div>
      </section>
      
      {/* How it works */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-3xl md:text-5xl font-semibold text-center mb-6">
            How it <span className="gradient-text italic">works</span>
          </h2>
          <p className="text-muted-foreground text-lg text-center mb-16 max-w-2xl mx-auto">
            Three simple steps to transform your daily routine into measurable progress.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent/40 to-primary/40 flex items-center justify-center mx-auto mb-6 animate-float">
                <span className="font-display text-3xl font-bold gradient-text">1</span>
              </div>
              <h3 className="font-display text-xl font-semibold mb-3">Set your goals</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Define what you want to achieve and break it down into daily habits.
              </p>
            </div>
            
            <div className="text-center">
              <div 
                className="w-20 h-20 rounded-full bg-gradient-to-br from-accent/40 to-primary/40 flex items-center justify-center mx-auto mb-6 animate-float"
                style={{ animationDelay: '200ms' }}
              >
                <span className="font-display text-3xl font-bold gradient-text">2</span>
              </div>
              <h3 className="font-display text-xl font-semibold mb-3">Track daily</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Check off your habits each day and watch your streaks grow.
              </p>
            </div>
            
            <div className="text-center">
              <div 
                className="w-20 h-20 rounded-full bg-gradient-to-br from-accent/40 to-primary/40 flex items-center justify-center mx-auto mb-6 animate-float"
                style={{ animationDelay: '400ms' }}
              >
                <span className="font-display text-3xl font-bold gradient-text">3</span>
              </div>
              <h3 className="font-display text-xl font-semibold mb-3">Level up</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Get AI insights and see your progress compound over time.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <GlassCard className="p-14" glow>
            <AppleEmoji emoji="🚀" size="3xl" className="mb-4" />
            <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4">
              Start your journey today
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              No credit card required. Free to start. Upgrade when you're ready.
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
