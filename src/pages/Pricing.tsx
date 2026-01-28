import { LandingNavbar } from "@/components/LandingNavbar";
import { PricingSection } from "@/components/landing/PricingSection";

export default function Pricing() {
  return (
    <div className="min-h-screen gradient-hero flex flex-col">
      <LandingNavbar />
      
      <div className="flex-1 flex items-center justify-center pt-20 pb-8">
        <PricingSection />
      </div>
    </div>
  );
}
