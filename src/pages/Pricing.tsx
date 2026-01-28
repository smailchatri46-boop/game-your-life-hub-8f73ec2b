import { useEffect } from "react";
import { LandingNavbar } from "@/components/LandingNavbar";
import { PricingSection } from "@/components/landing/PricingSection";

export default function Pricing() {
  // Disable scrolling on this page
  useEffect(() => {
    const html = document.documentElement;
    const originalOverflow = html.style.overflow;
    html.style.overflow = 'hidden';
    
    return () => {
      html.style.overflow = originalOverflow;
    };
  }, []);

  return (
    <div 
      className="fixed inset-0 gradient-hero flex flex-col overflow-hidden"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      <style>{`
        ::-webkit-scrollbar { display: none !important; }
      `}</style>
      <LandingNavbar />
      
      <div className="flex-1 flex items-center justify-center pt-16">
        <PricingSection />
      </div>
    </div>
  );
}
