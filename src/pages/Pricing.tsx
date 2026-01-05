import { LandingNavbar } from "@/components/LandingNavbar";
import { Footer } from "@/components/Footer";
import { PricingSection } from "@/components/landing/PricingSection";

export default function Pricing() {
  return (
    <div className="min-h-screen gradient-hero flex flex-col">
      <LandingNavbar />
      
      <div className="flex-1 pt-28">
        <PricingSection />
      </div>
      
      <Footer />
    </div>
  );
}
