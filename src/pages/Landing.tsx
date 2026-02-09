import { useRef, useState, useEffect, lazy, Suspense } from "react";
import { LandingNavbar } from "@/components/LandingNavbar";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/GlassCard";
import { AppleEmoji } from "@/components/AppleEmoji";
import { Link } from "react-router-dom";
import { YouTubeEmbed } from "@/components/YouTubeEmbed";
import { Check } from "lucide-react";
import googleLogo from "@/assets/google-logo.png";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Footer } from "@/components/Footer";
import dashboardThumbnail from "@/assets/dashboard-thumbnail.png";
import { useReferral } from "@/hooks/use-referral";

const LandingFAQ = lazy(() => import("@/components/landing/LandingFAQ").then(m => ({ default: m.LandingFAQ })));

// Minimal section placeholder
const SectionPlaceholder = () => <div className="min-h-[200px]" />;

export default function Landing() {
  const signUpButtonRef = useRef<HTMLDivElement>(null);
  const finalCtaRef = useRef<HTMLDivElement>(null);
  const [showStickyButton, setShowStickyButton] = useState(false);
  const [nearFinalCta, setNearFinalCta] = useState(false);

  // Capture affiliate referral ID from URL
  useReferral();

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
            <div className="order-2 lg:order-1 flex flex-col lg:justify-end lg:pb-0">
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold mb-6 animate-fade-in text-center lg:text-left">
                <span className="italic gradient-text">Your </span><span className="gradient-text">ADHD</span><span className="italic gradient-text"> brain</span>
                <br />
                <span className="text-foreground">finally has a </span>
                <span className="gradient-text">system</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-lg mb-8 animate-fade-in delay-100 text-center lg:text-left mx-auto lg:mx-0">
                Stop app-switching. Stop forgetting. One calm place for habits, tasks, goals, and AI that actually understands how your brain works.
              </p>

              {/* Sign Up Button */}
              <div ref={signUpButtonRef} className="animate-fade-in delay-200 flex flex-col items-center lg:items-start">
                <Button variant="gradient" size="xl" asChild>
                  <Link to="/signup" className="gap-3">
                    <span className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                      <img src={googleLogo} alt="Google" className="w-4 h-4" loading="eager" width={16} height={16} />
                    </span>
                    Continue with Google
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right Column - Video/Demo */}
            <div className="order-1 lg:order-2 animate-fade-in delay-100">
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

      
      
      {/* Features Grid */}
      <section className="py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal animation="fade-up">
            <h2 className="font-display text-2xl md:text-4xl font-semibold text-center mb-10">
              Built for how <span className="gradient-text">ADHD works</span>
            </h2>
          </ScrollReveal>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ScrollReveal animation="zoom-in" delay={0}>
              <GlassCard className="p-6 h-full" hover>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent/30 to-primary/30 flex items-center justify-center mb-4">
                  <AppleEmoji emoji="🎯" size="2xl" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-3">Visual Habit Grid</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Your working memory finally has backup. See exactly what you did, when, with instant color-coded completion that gives your brain the dopamine hit it craves.
                </p>
              </GlassCard>
            </ScrollReveal>
            
            <ScrollReveal animation="zoom-in" delay={100}>
              <GlassCard className="p-6 h-full" hover>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent/30 to-primary/30 flex items-center justify-center mb-4">
                  <AppleEmoji emoji="🏆" size="2xl" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-3">Goals You Won't Forget</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Long-term goals broken into daily actions your ADHD brain can actually follow. Visual progress bars show exactly where you stand—no more time blindness.
                </p>
              </GlassCard>
            </ScrollReveal>
            
            <ScrollReveal animation="zoom-in" delay={200}>
              <GlassCard className="p-6 h-full" hover>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent/30 to-primary/30 flex items-center justify-center mb-4">
                  <AppleEmoji emoji="🧠" size="2xl" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-3">AI That Gets ADHD</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Your executive function backup. AI provides structure when your brain can't, spots patterns you miss, and gives guidance without the overwhelm.
                </p>
              </GlassCard>
            </ScrollReveal>
            
            <ScrollReveal animation="zoom-in" delay={300}>
              <GlassCard className="p-6 h-full" hover>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent/30 to-primary/30 flex items-center justify-center mb-4">
                  <AppleEmoji emoji="📊" size="2xl" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-3">See Your Patterns</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Finally understand why some days feel impossible. AI spots connections between mood, habits, and consistency your brain can't track alone.
                </p>
              </GlassCard>
            </ScrollReveal>
            
            <ScrollReveal animation="zoom-in" delay={400}>
              <GlassCard className="p-6 h-full" hover>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent/30 to-primary/30 flex items-center justify-center mb-4">
                  <AppleEmoji emoji="📝" size="2xl" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-3">Tasks Won't Slip Away</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  One-time tasks and daily habits in the same place. No app-switching means no losing track mid-task—the #1 ADHD struggle, solved.
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
                  An AI that knows your context without you re-explaining everything. Ask anything about your progress—it remembers what your ADHD brain forgets.
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
                Done hopping between apps?
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Finally, a system designed for ADHD brains—not against them. One calm place that works with your executive dysfunction, not around it.
              </p>
              
              <Button variant="gradient" size="xl" asChild>
                <Link to="/signup" className="gap-3">
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
          <Link to="/signup" className="gap-3">
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
