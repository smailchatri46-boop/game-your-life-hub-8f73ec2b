import { LandingNavbar } from "@/components/LandingNavbar";
import { PricingSection } from "@/components/landing/PricingSection";

export default function Pricing() {
  return (
    <div className="min-h-screen gradient-hero">
      <LandingNavbar />
      
      <div className="pt-28">
        <PricingSection />
      </div>
      
      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border/50">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <img src="/neyler-logo.png" alt="Neyler" className="h-6" />
          <p className="text-sm text-muted-foreground">© 2025 Neyler. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
