import { LandingNavbar } from "@/components/LandingNavbar";
import { Footer } from "@/components/Footer";
import { Helmet } from "react-helmet-async";
import { Heart, Sparkles, Target } from "lucide-react";

export default function About() {
  return (
    <>
      <Helmet>
        <title>About Neyler | Your Personal Growth Companion</title>
        <meta name="description" content="Learn about Neyler - your all-in-one companion for tracking habits, tasks, goals, and reflections. Built with clarity and simplicity in mind." />
      </Helmet>
      
      <div className="min-h-screen gradient-hero flex flex-col">
        <LandingNavbar />
        
        <div className="flex-1 pt-28 pb-16 px-4">
          <div className="max-w-3xl mx-auto">
            {/* Hero */}
            <div className="text-center mb-12">
              <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-2xl btn-primary-gradient shadow-lg">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
                About Neyler
              </h1>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                Your friendly companion for building better habits and reaching your goals.
              </p>
            </div>

            {/* Main content */}
            <div className="glass-card p-8 md:p-10 rounded-2xl space-y-8">
              <div>
                <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                  What is Neyler?
                </h2>
                <p className="text-foreground/90 leading-relaxed">
                  Neyler is an all-in-one personal growth app that helps you track your habits, manage tasks, 
                  set meaningful goals, and reflect on your journey — all in one clean, focused place. 
                  Whether you're building new routines or working toward big dreams, Neyler keeps everything 
                  organized so you can focus on what matters most: making progress.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-5 rounded-xl bg-secondary/50 border border-border/30">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                    <Target className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-display font-semibold text-foreground mb-2">Clarity <span className="font-inter">&</span> Simplicity</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    We believe self-improvement shouldn't feel overwhelming. Neyler is designed to be 
                    intuitive and distraction-free, so you can focus on your growth, not on learning a 
                    complex app.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-secondary/50 border border-border/30">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                    <Heart className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-display font-semibold text-foreground mb-2">Built to Support You</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Neyler is here to help you become the best version of yourself. Track your habits, 
                    celebrate your wins, and learn from your reflections — all at your own pace.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-secondary/50 border border-border/30">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-display font-semibold text-foreground mb-2">AI That Guides, Not Replaces</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Our AI features are designed to gently guide and encourage you — offering insights 
                    and suggestions while you do the real work. The effort is yours; we just help you 
                    stay on track.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-border/30">
                <p className="text-muted-foreground text-center">
                  We're a small team passionate about helping people grow. If you have any questions 
                  or feedback, we'd love to hear from you at{" "}
                  <a href="mailto:hello@neyler.com" className="text-primary hover:underline">
                    hello@neyler.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}
