import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import googleLogo from "@/assets/google-logo.png";
import dashboardThumbnail from "@/assets/dashboard-thumbnail.png";
import { ArrowRight, Target, Brain, BarChart3, ListTodo, MessageCircle, BookOpen } from "lucide-react";

/**
 * Test Landing 3 — Inspired by Qupe
 * Ultra-clean centered layout, pill badge, massive headline with accent last words,
 * two CTA buttons (filled + outline), dashboard preview, minimal sections
 */
export default function TestLanding3() {
  return (
    <div className="min-h-screen bg-background font-body">
      {/* Navbar — clean, wide, minimal like Qupe */}
      <nav className="flex items-center justify-between max-w-6xl mx-auto px-6 py-5">
        <div className="flex items-center gap-2">
          <img src="/images/neyler-logo-full.png" alt="Neyler" className="h-8" />
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-foreground/70">
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#about" className="hover:text-foreground transition-colors">About</a>
          <Link to="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
          <Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link>
        </div>
        <Button variant="outline" size="sm" asChild className="rounded-full border-foreground/20">
          <Link to="/signup">Get started</Link>
        </Button>
      </nav>

      {/* Hero — Centered, massive type like Qupe */}
      <section className="pt-24 pb-8 px-6 text-center relative">
        {/* Subtle warm gradient bg blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -bottom-20 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-10 right-1/4 w-80 h-80 rounded-full bg-accent/8 blur-3xl" />
        </div>

        <div className="relative z-10">
          <div className="inline-flex items-center px-5 py-1.5 rounded-full border border-primary/30 text-primary text-sm font-medium mb-10">
            NEYLER — ADHD SYSTEM
          </div>

          <h1 className="font-display text-5xl md:text-6xl lg:text-[4.5rem] font-semibold leading-[1.1] mb-6 max-w-4xl mx-auto">
            Your brain deserves a system that{" "}
            <span className="italic gradient-text">actually works</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            One calm place for habits, tasks, goals, and AI coaching. Built for ADHD brains—not against them.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button variant="gradient" size="xl" asChild>
              <Link to="/signup" className="gap-3">
                <span className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <img src={googleLogo} alt="Google" className="w-4 h-4" />
                </span>
                Get started — for free
              </Link>
            </Button>
            <Button variant="outline" size="xl" asChild className="rounded-full border-foreground/20">
              <Link to="/about">Discover Neyler</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Dashboard Preview — floating card like Qupe */}
      <section className="px-6 pb-20 relative">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-2xl border border-border bg-card shadow-large overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-3 border-b border-border bg-muted/30">
              <div className="w-3 h-3 rounded-full bg-destructive/50" />
              <div className="w-3 h-3 rounded-full bg-accent/70" />
              <div className="w-3 h-3 rounded-full bg-primary/30" />
              <span className="ml-4 text-xs text-muted-foreground">Neyler — Dashboard</span>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Habits Today", value: "8/12", change: "+2", positive: true },
                  { label: "Current Streak", value: "7 days", change: "+1", positive: true },
                  { label: "Goals Progress", value: "68%", change: "+5%", positive: true },
                  { label: "Mood Score", value: "4.2/5", change: "+0.3", positive: true },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-xl bg-secondary/50 p-4">
                    <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                    <div className="flex items-end gap-2">
                      <span className="font-display text-2xl font-semibold">{stat.value}</span>
                      <span className="text-xs text-primary font-medium mb-1">↑ {stat.change}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features — Clean grid, icon-led like Qupe's solutions */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs tracking-widest text-muted-foreground uppercase">Features</span>
            <h2 className="font-display text-3xl md:text-5xl font-semibold mt-3">
              Everything to <span className="gradient-text">master your day</span>
            </h2>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
              Six powerful tools designed specifically for how ADHD brains process, plan, and perform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: <Target className="w-5 h-5" />, title: "Visual Habits", desc: "Color-coded grid with streaks. Your working memory, backed up." },
              { icon: <ListTodo className="w-5 h-5" />, title: "Daily Tasks", desc: "One-time tasks and habits together. No app-switching needed." },
              { icon: <BarChart3 className="w-5 h-5" />, title: "Goal Tracking", desc: "Long-term goals linked to daily actions. Visual progress bars." },
              { icon: <Brain className="w-5 h-5" />, title: "AI Coaching", desc: "Executive function backup. Structure when your brain can't." },
              { icon: <MessageCircle className="w-5 h-5" />, title: "AI Buddy", desc: "Knows your context. No re-explaining your situation every time." },
              { icon: <BookOpen className="w-5 h-5" />, title: "Journaling", desc: "Quick reflections with mood tracking for self-awareness." },
            ].map((f) => (
              <div key={f.title} className="group rounded-2xl border border-border bg-card p-6 hover:shadow-medium hover:-translate-y-0.5 transition-all duration-300">
                <div className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  {f.icon}
                </div>
                <h3 className="font-display text-lg font-semibold mb-1.5">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About / Why section */}
      <section id="about" className="py-20 px-6 bg-secondary/20">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs tracking-widest text-muted-foreground uppercase">Why Neyler</span>
          <h2 className="font-display text-3xl md:text-5xl font-semibold mt-3 mb-6">
            Done with <span className="gradient-text">Notion overwhelm</span>?
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-10">
            Most productivity apps are built for neurotypical brains. Neyler is different—it's built for the way ADHD brains actually work. Less friction, more dopamine, zero overwhelm.
          </p>

          <div className="grid md:grid-cols-3 gap-6 text-left">
            {[
              { title: "No setup paralysis", desc: "Sign in with Google, answer a few questions, and you're tracking in under 30 seconds." },
              { title: "No context switching", desc: "Habits, tasks, goals, journal, and AI—all in one calm interface." },
              { title: "No motivation needed", desc: "Visual dopamine hits, gentle AI nudges, and pattern insights keep you going." },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-border bg-card p-6">
                <h3 className="font-display text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display text-3xl md:text-5xl font-semibold mb-4">
            Your ADHD brain <span className="italic gradient-text">finally</span> has a system
          </h2>
          <p className="text-muted-foreground text-lg mb-10">
            Start free. No credit card required. Just one tap to begin.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="gradient" size="xl" asChild>
              <Link to="/signup" className="gap-3">
                <span className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <img src={googleLogo} alt="Google" className="w-4 h-4" />
                </span>
                Get started — for free
              </Link>
            </Button>
            <Button variant="outline" size="xl" asChild className="rounded-full border-foreground/20">
              <Link to="/about">Learn more <ArrowRight className="w-4 h-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-start justify-between gap-8">
            <div>
              <img src="/images/neyler-logo-full.png" alt="Neyler" className="h-7 mb-3" />
              <p className="text-sm text-muted-foreground max-w-xs">
                The ADHD productivity system that works with your brain, not against it.
              </p>
            </div>
            <div className="flex gap-12">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Product</p>
                <div className="space-y-2 text-sm">
                  <Link to="/pricing" className="block text-muted-foreground hover:text-foreground">Pricing</Link>
                  <Link to="/faq" className="block text-muted-foreground hover:text-foreground">FAQ</Link>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Legal</p>
                <div className="space-y-2 text-sm">
                  <Link to="/privacy" className="block text-muted-foreground hover:text-foreground">Privacy</Link>
                  <Link to="/terms" className="block text-muted-foreground hover:text-foreground">Terms</Link>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-6 text-center text-xs text-muted-foreground">
            © 2025 Neyler. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
