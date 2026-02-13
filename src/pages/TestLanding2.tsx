import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AppleEmoji } from "@/components/AppleEmoji";
import googleLogo from "@/assets/google-logo.png";
import { ArrowRight, Check, Zap, Trophy, Calendar, TrendingUp } from "lucide-react";

/**
 * Test Landing 2 — Inspired by Recroot
 * Large serif headings, stats banner, step-by-step process cards, clean structure
 */
export default function TestLanding2() {
  return (
    <div className="min-h-screen bg-background font-body">
      {/* Navbar */}
      <nav className="flex items-center justify-between max-w-6xl mx-auto px-6 py-5">
        <img src="/images/neyler-logo-full.png" alt="Neyler" className="h-8" />
        <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#process" className="hover:text-foreground transition-colors">How It Works</a>
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <Link to="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
        </div>
        <Button variant="gradient" size="sm" asChild className="rounded-full">
          <Link to="/signup">Get Started <ArrowRight className="w-4 h-4" /></Link>
        </Button>
      </nav>

      {/* Hero — Large serif, left-aligned like Recroot */}
      <section className="pt-16 pb-12 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide uppercase mb-6">
              ADHD Productivity System
            </div>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-semibold leading-[1.05] mb-6">
              Build habits that{" "}
              <span className="italic gradient-text">stick</span> with your{" "}
              <span className="gradient-text">ADHD</span> brain.
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg mb-8 leading-relaxed">
              Stop app-switching. Stop forgetting. One calm place for habits, tasks, goals, and AI that actually understands how your brain works.
            </p>
            <Button variant="gradient" size="xl" asChild>
              <Link to="/signup" className="gap-3">
                <span className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <img src={googleLogo} alt="Google" className="w-4 h-4" />
                </span>
                Continue with Google
              </Link>
            </Button>
          </div>

          {/* Right side — feature preview cards */}
          <div className="space-y-4">
            {[
              { emoji: "🎯", title: "Track 12 habits daily", subtitle: "Visual grid with streaks" },
              { emoji: "🏆", title: "3 active goals", subtitle: "Linked to daily habits" },
              { emoji: "📝", title: "Today's tasks ready", subtitle: "Simple, no overwhelm" },
              { emoji: "🧠", title: "AI insights available", subtitle: "Pattern recognition running" },
            ].map((item) => (
              <div key={item.title} className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-card">
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                  <AppleEmoji emoji={item.emoji} size="xl" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.subtitle}</p>
                </div>
                <Check className="w-5 h-5 text-primary" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Banner — colored bg like Recroot */}
      <section className="mx-6 my-8">
        <div className="max-w-6xl mx-auto rounded-3xl overflow-hidden" style={{ background: "var(--gradient-primary)" }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px">
            {[
              { value: "10k+", label: "Habits tracked" },
              { value: "92%", label: "Weekly retention" },
              { value: "4.8★", label: "User satisfaction" },
              { value: "30s", label: "Average setup time" },
            ].map((stat, i) => (
              <div key={stat.label} className={`p-8 text-center ${i === 0 ? 'text-white' : 'text-white/90'}`}>
                <p className="font-display text-3xl md:text-4xl font-bold">{stat.value}</p>
                <p className="text-sm mt-1 text-white/70">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Steps — like Recroot's recruitment process */}
      <section id="process" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs tracking-widest text-muted-foreground uppercase">How It Works</span>
            <h2 className="font-display text-3xl md:text-5xl font-semibold mt-3">
              Smooth process,<br />
              <span className="gradient-text">outstanding results.</span>
            </h2>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
              From sign-up to daily breakthroughs—three simple steps to finally take control.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Step 1 */}
            <div className="rounded-2xl border border-border bg-card p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm flex-shrink-0">1</div>
                <div>
                  <h3 className="font-display text-xl font-semibold">Set up your profile</h3>
                  <p className="text-sm text-muted-foreground mt-1">Sign in with Google in one tap. Tell us about your goals and struggles.</p>
                </div>
              </div>
              <div className="rounded-xl bg-secondary/50 p-5 space-y-3">
                {["Focus areas", "ADHD challenges", "Goal timeline"].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-primary" />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 2 */}
            <div className="rounded-2xl border border-border bg-card p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm flex-shrink-0">2</div>
                <div>
                  <h3 className="font-display text-xl font-semibold">Build your routine</h3>
                  <p className="text-sm text-muted-foreground mt-1">Create habits, link them to goals, and add daily tasks—all in one view.</p>
                </div>
              </div>
              <div className="rounded-xl bg-secondary/50 p-5 space-y-3">
                {["Habit tracker", "Goal linking", "Daily to-do list"].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-primary" />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 3 — full width */}
            <div className="rounded-2xl border border-border bg-card p-8 md:col-span-2">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm flex-shrink-0">3</div>
                <div className="flex-1">
                  <h3 className="font-display text-xl font-semibold">Let AI coach you daily</h3>
                  <p className="text-sm text-muted-foreground mt-1 max-w-lg">
                    Your AI buddy spots patterns, remembers your context, and gives ADHD-friendly insights—no re-explaining needed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-6 bg-secondary/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs tracking-widest text-muted-foreground uppercase">Features</span>
            <h2 className="font-display text-3xl md:text-5xl font-semibold mt-3">
              Everything in <span className="gradient-text">one place</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <Zap className="w-5 h-5" />, title: "Visual Habit Grid", desc: "Color-coded completion that gives your brain the dopamine hit it craves." },
              { icon: <Trophy className="w-5 h-5" />, title: "Goal Tracking", desc: "Long-term goals broken into daily actions your brain can follow." },
              { icon: <Calendar className="w-5 h-5" />, title: "Daily To-Do", desc: "Tasks and habits in one view. No app-switching, no losing track." },
              { icon: <TrendingUp className="w-5 h-5" />, title: "Mood & Patterns", desc: "Understand why some days feel impossible with AI-powered insights." },
              { icon: <AppleEmoji emoji="🧠" size="lg" />, title: "AI Coach", desc: "Structure when your brain can't provide it, without the overwhelm." },
              { icon: <AppleEmoji emoji="📓" size="lg" />, title: "Journaling", desc: "Quick reflections with mood tracking to build self-awareness." },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl border border-border bg-card p-6">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-primary mb-4">
                  {f.icon}
                </div>
                <h3 className="font-display text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-5xl font-semibold mb-4">
            Ready to take <span className="gradient-text">control</span>?
          </h2>
          <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
            Join thousands of ADHD brains who finally found a system that works with them, not against them.
          </p>
          <Button variant="gradient" size="xl" asChild>
            <Link to="/signup" className="gap-3">
              <span className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                <img src={googleLogo} alt="Google" className="w-4 h-4" />
              </span>
              Start your journey now
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <img src="/images/neyler-logo-full.png" alt="Neyler" className="h-6" />
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link to="/privacy" className="hover:text-foreground">Privacy</Link>
            <Link to="/terms" className="hover:text-foreground">Terms</Link>
            <Link to="/contact" className="hover:text-foreground">Contact</Link>
          </div>
          <p className="text-xs text-muted-foreground">© 2025 Neyler. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
