import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import dashboardThumbnail from "@/assets/dashboard-thumbnail.png";

interface DashboardPreviewStepProps {
  onNext: () => void;
}

export function DashboardPreviewStep({ onNext }: DashboardPreviewStepProps) {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center gradient-hero px-4 py-8">
      {/* Dashboard Preview Image */}
      <div className="w-full max-w-5xl mb-8">
        <div className="rounded-2xl overflow-hidden shadow-2xl">
          <img
            src={dashboardThumbnail}
            alt="Neyler Dashboard Preview"
            className="w-full h-auto"
            loading="eager"
          />
        </div>
      </div>

      {/* CTA Button */}
      <Button
        onClick={onNext}
        variant="gradient"
        className="h-12 px-8 text-base hover:opacity-90"
      >
        Next <ChevronRight className="w-4 h-4 ml-1" />
      </Button>
    </div>
  );
}
