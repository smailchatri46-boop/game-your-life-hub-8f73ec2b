import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AppleEmoji } from "@/components/AppleEmoji";
import googleLogo from "@/assets/google-logo.png";
import { ArrowRight, Check, Target, Brain, BarChart3, ListTodo, MessageCircle, Sparkles } from "lucide-react";

/**
 * Test Landing 1 — Inspired by Rotai
 * Clean white bg, bracketed section labels, card-based features, lots of whitespace
 */
export default function TestLanding1() {
  return (
    <div className="min-h-screen bg-background font-body">
      {/* Navbar */}
      <nav className="flex items-center justify-between max-w-6xl mx-auto px-6 py-5">
        <img src="/images/neyler-logo-full.png" alt="Neyler" className="h-8" />
        <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
          <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/login">Log in</Link>
          </Button>
          <Button variant="gradient" size="sm" asChild className="rounded-full">
            <Link to="/signup">Get started <ArrowRight className="w-4 h-4" /></Link>
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-20 pb-16 px-6 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-secondary/50 text-sm text-muted-foreground mb-8">
          <Sparkles className="w-4 h-4 text-primary" />
          Built for ADHD brains
        </div>
        <h1 className="font-display text-5xl md:text-7xl font-semibold leading-[1.1] mb-6">
          Your <span className="gradient-text">ADHD</span> brain,{" "}
          <span className="italic">finally</span> organized
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          One calm place for habits, tasks, goals, and AI coaching—designed for how your brain actually works, not against it.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button variant="gradient" size="xl" asChild>
            <Link to="/signup" className="gap-3">
              <span className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                <img src={googleLogo} alt="Google" className="w-4 h-4" />
              </span>
              Continue with Google
            </Link>
          </Button>
          <Button variant="outline" size="xl" asChild className="rounded-full">
            <Link to="/about">Learn more</Link>
          </Button>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="px-6 pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-2xl border border-border bg-card shadow-large overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
              <div className="w-3 h-3 rounded-full bg-destructive/60" />
              <div className="w-3 h-3 rounded-full bg-accent" />
              <div className="w-3 h-3 rounded-full bg-primary/40" />
            </div>
            <div className="p-8 grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: "Habits tracked", value: "12", icon: "🎯" },
                { label: "Current streak", value: "7 days", icon: "🔥" },
                { label: "Goals active", value: "3", icon: "🏆" },
                { label: "Mood today", value: "Great", icon: "😊" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <AppleEmoji emoji={stat.icon} size="2xl" />
                  <p className="font-display text-2xl font-semibold mt-2">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section: Features — Bracketed label style like Rotai */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs tracking-widest text-muted-foreground uppercase">[ Features ]</span>
            <h2 className="font-display text-3xl md:text-5xl font-semibold mt-3">
              Everything your <span className="gradient-text">ADHD brain</span> needs
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Large feature card */}
            <div className="rounded-2xl border border-border bg-card p-8 md:row-span-2">
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-5">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display text-2xl font-semibold mb-3">Visual Habit Grid</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Your working memory finally has backup. See exactly what you did, when, with instant color-coded completion that gives your brain the dopamine hit it craves.
              </p>
              <div className="rounded-xl bg-secondary/50 p-4">
                <div className="grid grid-cols-7 gap-1.5">
                  {Array.from({ length: 28 }).map((_, i) => (
                    <div
                      key={i}
                      className="aspect-square rounded-md"
                      style={{
                        background: Math.random() > 0.3
                          ? `hsl(24 95% ${53 + Math.random() * 30}%)`
                          : "hsl(30 30% 96%)",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Smaller cards */}
            <div className="rounded-2xl border border-border bg-card p-8">
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-5">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">AI That Gets ADHD</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Your executive function backup. AI provides structure when your brain can't, spots patterns you miss, and gives guidance without the overwhelm.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-8">
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-5">
                <ListTodo className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">Tasks Won't Slip Away</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                One-time tasks and daily habits in the same place. No app-switching means no losing track mid-task—the #1 ADHD struggle, solved.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6 bg-secondary/30">
        <div className="max-w-5xl mx-auto text-center">
          <span className="text-xs tracking-widest text-muted-foreground uppercase">[ How It Works ]</span>
          <h2 className="font-display text-3xl md:text-5xl font-semibold mt-3 mb-14">
            Simple as <span className="gradient-text">1-2-3</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Sign up in seconds", desc: "One tap with Google. No forms, no friction, no forgetting your password." },
              { step: "02", title: "Set your habits & goals", desc: "Tell us what matters. We'll structure it so your brain can follow through." },
              { step: "03", title: "Let AI guide you", desc: "Get daily insights, pattern recognition, and gentle nudges—built for ADHD." },
            ].map((item) => (
              <div key={item.step} className="text-left">
                <span className="font-display text-5xl font-bold gradient-text">{item.step}</span>
                <h3 className="font-display text-xl font-semibold mt-4 mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* More features grid */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs tracking-widest text-muted-foreground uppercase">[ Capabilities ]</span>
            <h2 className="font-display text-3xl md:text-5xl font-semibold mt-3">
              Built for how <span className="gradient-text">ADHD works</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              { icon: <BarChart3 className="w-5 h-5 text-primary" />, title: "See Your Patterns", desc: "AI spots connections between mood, habits, and consistency." },
              { icon: <MessageCircle className="w-5 h-5 text-primary" />, title: "AI Buddy", desc: "An AI that knows your context without you re-explaining everything." },
              { icon: <Target className="w-5 h-5 text-primary" />, title: "Goals You Won't Forget", desc: "Long-term goals broken into daily actions your brain can follow." },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl border border-border bg-card p-6 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">{f.icon}</div>
                <div>
                  <h3 className="font-display text-lg font-semibold mb-1">{f.title}</h3>
                  <p className="text-muted-foreground text-sm">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center rounded-3xl border border-border bg-card p-12">
          <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4">
            Done hopping between apps?
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Finally, a system designed for ADHD brains—not against them.
          </p>
          <Button variant="gradient" size="xl" asChild>
            <Link to="/signup" className="gap-3">
              <span className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                <img src={googleLogo} alt="Google" className="w-4 h-4" />
              </span>
              Get started free
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
        </div>
      </footer>
    </div>
  );
}
