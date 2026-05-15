import { useRef, useState, useEffect, lazy, Suspense, useCallback, MouseEvent as ReactMouseEvent } from "react";
import { LandingNavbar } from "@/components/LandingNavbar";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/GlassCard";
import { AppleEmoji } from "@/components/AppleEmoji";
import { Link } from "react-router-dom";
import { YouTubeEmbed } from "@/components/YouTubeEmbed";
import { Plus, Check } from "lucide-react";
import googleLogo from "@/assets/google-logo.png";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Footer } from "@/components/Footer";
import dashboardThumbnail from "@/assets/dashboard-thumbnail.png";
import { useReferral } from "@/hooks/use-referral";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

// Lazy load below-fold sections for better initial load
const AnalyticsCarousel = lazy(() => import("@/components/landing/AnalyticsCarousel").then(m => ({ default: m.AnalyticsCarousel })));
const HabitsShowcase = lazy(() => import("@/components/landing/HabitsShowcase").then(m => ({ default: m.HabitsShowcase })));

const GoalsShowcase = lazy(() => import("@/components/landing/GoalsShowcase").then(m => ({ default: m.GoalsShowcase })));


const LandingFAQ = lazy(() => import("@/components/landing/LandingFAQ").then(m => ({ default: m.LandingFAQ })));

// Minimal section placeholder
const SectionPlaceholder = () => <div className="min-h-[200px]" />;

export default function Landing() {
  const signUpButtonRef = useRef<HTMLDivElement>(null);
  const finalCtaRef = useRef<HTMLDivElement>(null);
  const [showStickyButton, setShowStickyButton] = useState(false);
  const [nearFinalCta, setNearFinalCta] = useState(false);
  const { signInWithGoogle } = useAuth();

  // Capture affiliate referral ID from URL
  useReferral();

  // On mobile, bypass intermediate /signup page and trigger Google OAuth directly.
  const handleSignupClick = useCallback(
    async (e: ReactMouseEvent<HTMLAnchorElement>) => {
      if (typeof window === "undefined") return;
      if (window.matchMedia("(max-width: 767px)").matches) {
        e.preventDefault();
        const { error } = await signInWithGoogle();
        if (error) {
          toast.error("Failed to sign in with Google. Please try again.");
        }
      }
    },
    [signInWithGoogle]
  );

  useEffect(() => {
    const signUpObserver = new IntersectionObserver(
      ([entry]) => {
        setShowStickyButton(!entry.isIntersecting);
      },
      { threshold: 0 }
    );

    const ctaObserver = new IntersectionObserver(
      ([entry]) => {
        setNearFinalCta(entry.isIntersecting);
      },
      { threshold: 0, rootMargin: '100px 0px 0px 0px' }
    );

    if (signUpButtonRef.current) {
      signUpObserver.observe(signUpButtonRef.current);
    }

    if (finalCtaRef.current) {
      ctaObserver.observe(finalCtaRef.current);
    }

    return () => {
      signUpObserver.disconnect();
      ctaObserver.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen gradient-hero overflow-hidden">
      <LandingNavbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-[5fr_7fr] gap-10 lg:gap-12 items-start">
            {/* Left Column - Title, Description, CTA */}
            <div className="lg:order-1 flex flex-col lg:justify-end lg:pb-0">
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold mb-6 animate-fade-in text-center lg:text-left">
                <span className="italic gradient-text">Turn your life</span>
                <br />
                <span className="text-foreground">into a Game</span>
                <span className="gradient-text"> with AI</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-lg mb-8 animate-fade-in delay-100 text-center lg:text-left mx-auto lg:mx-0">
                Analyze your life with AI using the most beautiful tracker ever. Track habits & tasks, set goals, level up, and turn your day into data.
              </p>

              {/* Sign Up Button */}
              <div ref={signUpButtonRef} className="animate-fade-in delay-200 flex flex-col items-center lg:items-start">
                <Button variant="gradient" size="xl" asChild>
                  <Link to="/signup" className="gap-3" onClick={handleSignupClick}>
                    <span className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                      <img src={googleLogo} alt="Google" className="w-4 h-4" loading="eager" width={16} height={16} />
                    </span>
                    Continue with Google
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right Column - Video/Demo */}
            <div className="lg:order-2 animate-fade-in delay-100">
              <div className="overflow-hidden rounded-3xl">
                <YouTubeEmbed 
                  videoId="0GO0SyFo8dc" 
                  thumbnail={dashboardThumbnail}
                  showThumbnailBottomFade
                  thumbnailClassName="scale-110 object-[50%_35%]"
                  className="[&_img]:rounded-none [&>div]:rounded-none"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lazy loaded sections */}
      <Suspense fallback={<SectionPlaceholder />}>
        <AnalyticsCarousel />
      </Suspense>
      
      <Suspense fallback={<SectionPlaceholder />}>
        <HabitsShowcase />
      </Suspense>
      
      
      <Suspense fallback={<SectionPlaceholder />}>
        <GoalsShowcase />
      </Suspense>
      
      {/* Value Proposition - Combined section */}
      <section className="py-10 px-4">
        <div className="max-w-5xl mx-auto text-center">
          {/* Single Title */}
          <ScrollReveal animation="fade-up">
            <h2 className="font-display text-2xl md:text-4xl font-semibold mb-10">
              Your all in <span className="gradient-text">one tracker</span>
            </h2>
          </ScrollReveal>
          
          {/* Image + To-Do Card side by side */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 mb-10">
            {/* Apps image - shifted slightly left */}
            <ScrollReveal animation="fade-right" delay={100}>
              <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
                <img 
                  src="/images/apps-arrows.png" 
                  alt="Apps flowing into Neyler" 
                  className="h-48 md:h-64 object-contain"
                  loading="lazy"
                  decoding="async"
                  width={200}
                  height={256}
                />
                <img 
                  src="/images/neyler-logo-full.png" 
                  alt="Neyler" 
                  className="h-12 md:h-16 object-contain"
                  loading="lazy"
                  decoding="async"
                  width={150}
                  height={64}
                />
              </div>
            </ScrollReveal>
            
            {/* To-Do List Card - matching Overview exactly */}
            <ScrollReveal animation="fade-left" delay={200}>
              <div className="p-6 rounded-3xl bg-gradient-to-br from-[hsl(30,70%,96%)] to-[hsl(25,60%,92%)] w-[320px] md:w-[360px]">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <h3 className="font-display text-xl font-semibold text-foreground">To-Do List</h3>
                    <p className="text-sm text-muted-foreground">
                      1 décembre 2025
                    </p>
                  </div>
                  <AppleEmoji emoji="😌" size="2xl" />
                </div>
                
                <div className="space-y-2 mt-4">
                  {/* Call mom task - completed */}
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/80 shadow-sm">
                    <AppleEmoji emoji="💬" size="lg" />
                    <span className="text-sm flex-1 text-muted-foreground line-through text-left">
                      Call mom
                    </span>
                    <button className="w-6 h-6 rounded-full border-2 flex items-center justify-center bg-[hsl(25,60%,70%)] border-[hsl(25,60%,70%)]">
                      <Check className="w-4 h-4 text-white" />
                    </button>
                  </div>

                  {/* Add task button */}
                  <button
                    className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl bg-white/50 hover:bg-white/70 transition-colors text-muted-foreground border-2 border-dashed border-muted-foreground/20"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="text-sm">Add task</span>
                  </button>
                </div>
              </div>
            </ScrollReveal>
          </div>
          
          {/* Single description paragraph */}
          <ScrollReveal animation="fade-up" delay={300}>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
              Replace scattered spreadsheets, multiple AI apps, and messy notes with one beautiful solution. No more switching between different tools.
            </p>
          </ScrollReveal>
        </div>
      </section>
      
      {/* Features Grid */}
      <section className="py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal animation="fade-up">
            <h2 className="font-display text-2xl md:text-4xl font-semibold text-center mb-10">
              Everything you need to <span className="gradient-text">succeed</span>
            </h2>
          </ScrollReveal>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ScrollReveal animation="zoom-in" delay={0}>
              <GlassCard className="p-6 h-full" hover>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent/30 to-primary/30 flex items-center justify-center mb-4">
                  <AppleEmoji emoji="🎯" size="2xl" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-3">Habits <span className="font-body">&</span> Tasks Tracking</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Track your daily habits and one-time tasks with a beautiful spreadsheet-style grid. See your progress at a glance and link them directly to your goals.
                </p>
              </GlassCard>
            </ScrollReveal>
            
            <ScrollReveal animation="zoom-in" delay={100}>
              <GlassCard className="p-6 h-full" hover>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent/30 to-primary/30 flex items-center justify-center mb-4">
                  <AppleEmoji emoji="🏆" size="2xl" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-3">Set Goals <span className="font-body">&</span> Track Them</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Create meaningful goals, connect them to your daily habits, and see your progress toward them in a clear, visual way that keeps you motivated.
                </p>
              </GlassCard>
            </ScrollReveal>
            
            <ScrollReveal animation="zoom-in" delay={200}>
              <GlassCard className="p-6 h-full" hover>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent/30 to-primary/30 flex items-center justify-center mb-4">
                  <AppleEmoji emoji="🧠" size="2xl" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-3">AI-Powered</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  AI analyzes all your goals, tasks, and habits to give you personalized structure, actionable insights, and expert guidance to achieve your goals faster.
                </p>
              </GlassCard>
            </ScrollReveal>
            
            <ScrollReveal animation="zoom-in" delay={300}>
              <GlassCard className="p-6 h-full" hover>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent/30 to-primary/30 flex items-center justify-center mb-4">
                  <AppleEmoji emoji="📊" size="2xl" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-3">Beautiful Analytics</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Beautiful charts and insights to understand your patterns, mood trends, and growth over time. See the full picture of your progress.
                </p>
              </GlassCard>
            </ScrollReveal>
            
            <ScrollReveal animation="zoom-in" delay={400}>
              <GlassCard className="p-6 h-full" hover>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent/30 to-primary/30 flex items-center justify-center mb-4">
                  <AppleEmoji emoji="📝" size="2xl" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-3">Add One-Time Tasks Too</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Add to-do lists and one-time tasks alongside your habits, so you don't need any other app to track what you do throughout your day.
                </p>
              </GlassCard>
            </ScrollReveal>
            
            <ScrollReveal animation="zoom-in" delay={500}>
              <GlassCard className="p-6 h-full" hover>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent/30 to-primary/30 flex items-center justify-center mb-4">
                  <AppleEmoji emoji="💬" size="2xl" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-3">AI Buddy</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Your personal AI companion that understands your habits, goals, and journal entries to provide personalized motivation and insights.
                </p>
              </GlassCard>
            </ScrollReveal>
          </div>
        </div>
      </section>

      
      {/* FAQ */}
      <Suspense fallback={<SectionPlaceholder />}>
        <LandingFAQ />
      </Suspense>
      
      {/* Final CTA Section - Duplicate of "Ready to level up" */}
      <section className="py-10 px-4" ref={finalCtaRef}>
        <ScrollReveal animation="zoom-in" duration={800}>
          <div className="max-w-2xl mx-auto text-center">
            <GlassCard className="p-10" glow>
              <h2 className="font-display text-2xl md:text-3xl font-semibold mb-4">
                Ready to level up?
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Build habits, reflect on your days, and keep everything in one calm place designed to help you stay consistent without friction.
              </p>
              
              <Button variant="gradient" size="xl" asChild>
                <Link to="/signup" className="gap-3" onClick={handleSignupClick}>
                  <span className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                    <img src={googleLogo} alt="Google" className="w-4 h-4" loading="lazy" decoding="async" width={16} height={16} />
                  </span>
                  Continue with Google
                </Link>
              </Button>
            </GlassCard>
          </div>
        </ScrollReveal>
      </section>
      
      {/* Footer */}
      <Footer />

      {/* Sticky CTA Button */}
      <div 
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-out ${
          showStickyButton && !nearFinalCta
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <Button variant="gradient" size="xl" asChild className="shadow-lg">
          <Link to="/signup" className="gap-3" onClick={handleSignupClick}>
            <span className="w-6 h-6 bg-white rounded-full flex items-center justify-center flex-shrink-0">
              <img src={googleLogo} alt="Google" className="w-4 h-4 block" loading="eager" width={16} height={16} style={{ opacity: 1 }} />
            </span>
            Start your journey now
          </Link>
        </Button>
      </div>
    </div>
  );
}
