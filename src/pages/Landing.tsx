import { useRef, useState, useEffect } from "react";
import { LandingNavbar } from "@/components/LandingNavbar";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/GlassCard";
import { AppleEmoji } from "@/components/AppleEmoji";
import { Link } from "react-router-dom";
import { YouTubeEmbed } from "@/components/YouTubeEmbed";
import { Plus, Check } from "lucide-react";
import googleLogo from "@/assets/google-logo.png";
import { AnalyticsCarousel } from "@/components/landing/AnalyticsCarousel";
import { HabitsShowcase } from "@/components/landing/HabitsShowcase";
import { AIBuddyShowcase } from "@/components/landing/AIBuddyShowcase";
import { GoalsShowcase } from "@/components/landing/GoalsShowcase";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { LandingPricing } from "@/components/landing/LandingPricing";
import { LandingFAQ } from "@/components/landing/LandingFAQ";
import { ScrollReveal } from "@/components/ScrollReveal";

export default function Landing() {
  const signUpButtonRef = useRef<HTMLDivElement>(null);
  const [showStickyButton, setShowStickyButton] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show sticky button when Sign Up button is NOT visible
        setShowStickyButton(!entry.isIntersecting);
      },
      { threshold: 0 }
    );

    if (signUpButtonRef.current) {
      observer.observe(signUpButtonRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen gradient-hero overflow-hidden">
      <LandingNavbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-[5fr_7fr] gap-8 lg:gap-8 items-start">
            {/* Left Column - Title, Description, CTA */}
            <div className="order-2 lg:order-1 flex flex-col">
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold mb-5 animate-fade-in text-center lg:text-left">
                <span className="italic gradient-text">Turn your life</span>
                <br />
                <span className="text-foreground">into a Game</span>
                <span className="gradient-text"> for free</span>
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-lg mb-6 animate-fade-in delay-100 text-center lg:text-left mx-auto lg:mx-0">
                Track habits, level up your life, turn your data into insights, and analyze your life with AI using the most beautiful habit tracker you've ever used.
              </p>

              {/* Sign Up Button */}
              <div ref={signUpButtonRef} className="animate-fade-in delay-200 flex flex-col items-center lg:items-start gap-4">
                <Button variant="gradient" size="xl" asChild>
                  <Link to="/signup" className="gap-3">
                    <span className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                      <img src={googleLogo} alt="Google" className="w-4 h-4" />
                    </span>
                    Continue with Google
                  </Link>
                </Button>
                
                {/* Social Proof - below button */}
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    <img src="/images/user-1.png" alt="User" className="w-9 h-9 rounded-full border-2 border-background object-cover" />
                    <img src="/images/user-2.png" alt="User" className="w-9 h-9 rounded-full border-2 border-background object-cover" />
                    <img src="/images/user-3.png" alt="User" className="w-9 h-9 rounded-full border-2 border-background object-cover" />
                    <img src="/images/user-4.png" alt="User" className="w-9 h-9 rounded-full border-2 border-background object-cover" />
                    <img src="/images/user-5.png" alt="User" className="w-9 h-9 rounded-full border-2 border-background object-cover" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Join over <span className="font-medium text-foreground">50,000+</span> people improving their lives with Neyler
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Video/Demo */}
            <div className="order-1 lg:order-2 animate-fade-in delay-100">
              <div className="overflow-hidden rounded-3xl lg:h-[380px]" style={{ background: 'transparent' }}>
                <YouTubeEmbed 
                  videoId="A-o52DwuWSg" 
                  thumbnail="/images/app-demo-thumbnail.jpg"
                  className="h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcases */}
      <AnalyticsCarousel />
      <HabitsShowcase />
      <AIBuddyShowcase />
      <GoalsShowcase />
      
      {/* Value Proposition - Combined section */}
      <section className="py-10 px-4">
        <div className="max-w-5xl mx-auto text-center">
          {/* Single Title */}
          <ScrollReveal animation="fade-up">
            <h2 className="font-display text-3xl md:text-4xl font-semibold mb-8">
              Your all in <span className="italic gradient-text">one tracker</span>
            </h2>
          </ScrollReveal>
          
          {/* Image + To-Do Card side by side */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 mb-8">
            {/* Apps image - shifted slightly left */}
            <ScrollReveal animation="fade-right" delay={100}>
              <div className="flex items-center gap-4 md:gap-8 flex-shrink-0">
                <img 
                  src="/images/apps-arrows.png" 
                  alt="Apps flowing into Neyler" 
                  className="h-48 md:h-64 object-contain"
                />
                <img 
                  src="/images/neyler-logo-full.png" 
                  alt="Neyler" 
                  className="h-12 md:h-16 object-contain"
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
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Replace scattered spreadsheets, multiple AI apps, and messy notes with one beautiful solution.
            </p>
          </ScrollReveal>
        </div>
      </section>
      
      {/* Features Grid */}
      <section className="py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal animation="fade-up">
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-center mb-12">
              Everything you need to <span className="gradient-text italic">succeed</span>
            </h2>
          </ScrollReveal>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ScrollReveal animation="zoom-in" delay={0}>
              <GlassCard className="p-6 h-full" hover>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent/30 to-primary/30 flex items-center justify-center mb-4">
                  <AppleEmoji emoji="🎯" size="2xl" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-2">Habits <span className="font-body">&</span> Tasks Tracking</h3>
                <p className="text-muted-foreground text-sm">
                  Track your daily habits and tasks with a beautiful spreadsheet-style grid. See your progress and link them to your goals.
                </p>
              </GlassCard>
            </ScrollReveal>
            
            <ScrollReveal animation="zoom-in" delay={100}>
              <GlassCard className="p-6 h-full" hover>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent/30 to-primary/30 flex items-center justify-center mb-4">
                  <AppleEmoji emoji="🎯" size="2xl" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-2">Set Goals <span className="font-body">&</span> Track Them</h3>
                <p className="text-muted-foreground text-sm">
                  Create meaningful goals, connect them to your daily habits, and see your progress toward them in a clear visual way.
                </p>
              </GlassCard>
            </ScrollReveal>
            
            <ScrollReveal animation="zoom-in" delay={200}>
              <GlassCard className="p-6 h-full" hover>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent/30 to-primary/30 flex items-center justify-center mb-4">
                  <AppleEmoji emoji="🤖" size="2xl" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-2">AI-Powered Deep Analytics</h3>
                <p className="text-muted-foreground text-sm">
                  AI analyzes all your goals, tasks, and habits to give you personalized structure, actionable insights, and expert guidance to achieve your goals faster.
                </p>
              </GlassCard>
            </ScrollReveal>
            
            <ScrollReveal animation="zoom-in" delay={300}>
              <GlassCard className="p-6 h-full" hover>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent/30 to-primary/30 flex items-center justify-center mb-4">
                  <AppleEmoji emoji="📊" size="2xl" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-2">Analytics</h3>
                <p className="text-muted-foreground text-sm">
                  Beautiful charts and insights to understand your patterns and growth.
                </p>
              </GlassCard>
            </ScrollReveal>
            
            <ScrollReveal animation="zoom-in" delay={400}>
              <GlassCard className="p-6 h-full" hover>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent/30 to-primary/30 flex items-center justify-center mb-4">
                  <AppleEmoji emoji="📝" size="2xl" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-2">Add One-Time Tasks Too</h3>
                <p className="text-muted-foreground text-sm">
                  Add to-do lists and one-time tasks, so you don't need any other app to track what you do throughout your day and your life.
                </p>
              </GlassCard>
            </ScrollReveal>
            
            <ScrollReveal animation="zoom-in" delay={500}>
              <GlassCard className="p-6 h-full" hover>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent/30 to-primary/30 flex items-center justify-center mb-4">
                  <AppleEmoji emoji="💬" size="2xl" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-2">AI Buddy</h3>
                <p className="text-muted-foreground text-sm">
                  Your personal AI companion that understands your habits and provides personalized motivation and insights.
                </p>
              </GlassCard>
            </ScrollReveal>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-10 px-4">
        <ScrollReveal animation="zoom-in" duration={800}>
          <div className="max-w-2xl mx-auto text-center">
            <GlassCard className="p-10" glow>
              <h2 className="font-display text-3xl font-semibold mb-4">
                Ready to level up?
              </h2>
              <p className="text-muted-foreground mb-6">
                Join thousands of people who have transformed their lives with Neyler.
              </p>
              
              {/* Social Proof */}
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="flex -space-x-2">
                  <img src="/images/user-1.png" alt="User" className="w-9 h-9 rounded-full border-2 border-background object-cover" />
                  <img src="/images/user-2.png" alt="User" className="w-9 h-9 rounded-full border-2 border-background object-cover" />
                  <img src="/images/user-3.png" alt="User" className="w-9 h-9 rounded-full border-2 border-background object-cover" />
                  <img src="/images/user-4.png" alt="User" className="w-9 h-9 rounded-full border-2 border-background object-cover" />
                  <img src="/images/user-5.png" alt="User" className="w-9 h-9 rounded-full border-2 border-background object-cover" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Join over <span className="font-medium text-foreground">50,000+</span> people improving their lives with Neyler
                </p>
              </div>
              
              <Button variant="gradient" size="xl" asChild>
                <Link to="/signup" className="gap-3">
                  <span className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                    <img src={googleLogo} alt="Google" className="w-4 h-4" />
                  </span>
                  Start For Free
                </Link>
              </Button>
            </GlassCard>
          </div>
        </ScrollReveal>
      </section>

      {/* Testimonials */}
      <TestimonialsSection />

      {/* Pricing */}
      <LandingPricing />

      {/* FAQ */}
      <LandingFAQ />
      
      {/* Final CTA Section - Duplicate of "Ready to level up" */}
      <section className="py-10 px-4">
        <ScrollReveal animation="zoom-in" duration={800}>
          <div className="max-w-2xl mx-auto text-center">
            <GlassCard className="p-10" glow>
              <h2 className="font-display text-3xl font-semibold mb-4">
                Ready to level up?
              </h2>
              <p className="text-muted-foreground mb-6">
                Join thousands of people who have transformed their lives with Neyler.
              </p>
              
              {/* Social Proof */}
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="flex -space-x-2">
                  <img src="/images/user-1.png" alt="User" className="w-9 h-9 rounded-full border-2 border-background object-cover" />
                  <img src="/images/user-2.png" alt="User" className="w-9 h-9 rounded-full border-2 border-background object-cover" />
                  <img src="/images/user-3.png" alt="User" className="w-9 h-9 rounded-full border-2 border-background object-cover" />
                  <img src="/images/user-4.png" alt="User" className="w-9 h-9 rounded-full border-2 border-background object-cover" />
                  <img src="/images/user-5.png" alt="User" className="w-9 h-9 rounded-full border-2 border-background object-cover" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Join over <span className="font-medium text-foreground">50,000+</span> people improving their lives with Neyler
                </p>
              </div>
              
              <Button variant="gradient" size="xl" asChild>
                <Link to="/signup" className="gap-3">
                  <span className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                    <img src={googleLogo} alt="Google" className="w-4 h-4" />
                  </span>
                  Start For Free
                </Link>
              </Button>
            </GlassCard>
          </div>
        </ScrollReveal>
      </section>
      
      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border/50">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <img src="/neyler-logo.png" alt="Neyler" className="h-6" />
          <p className="text-sm text-muted-foreground">© 2025 Neyler. All rights reserved.</p>
        </div>
      </footer>

      {/* Sticky CTA Button */}
      <div 
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
          showStickyButton 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <Button variant="gradient" size="lg" asChild className="shadow-lg">
          <Link to="/signup" className="gap-2">
            <span className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
              <img src={googleLogo} alt="Google" className="w-3.5 h-3.5" />
            </span>
            Start For Free Now
          </Link>
        </Button>
      </div>
    </div>
  );
}