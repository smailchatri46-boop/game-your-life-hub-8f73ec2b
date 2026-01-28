import { OnboardingCard } from "../OnboardingCard";
import { Button } from "@/components/ui/button";
import { ChevronRight, CheckCircle2, Users, BookOpen, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type EvidenceVariant = "tracking" | "accountability" | "reflect";

interface EvidenceStepProps {
  variant: EvidenceVariant;
  onNext: () => void;
}

const EVIDENCE_DATA: Record<
  EvidenceVariant,
  {
    icon: typeof CheckCircle2;
    headline: string;
    subline: string;
    citation: string;
    fullCitation: string;
    sourceUrl: string;
    dataNugget: string;
    ctaText: string;
  }
> = {
  tracking: {
    icon: CheckCircle2,
    headline: "Track small wins — it changes behaviour.",
    subline: "Self-monitoring and simple check-ins make habits stick and raise success rates.",
    citation: "(Behaviour-change reviews — 2024)",
    fullCitation: "Michie, S. et al. (2024). Behaviour Change Techniques: A Systematic Review.",
    sourceUrl: "https://scholar.google.com/scholar?q=behaviour+change+self-monitoring+2024",
    dataNugget: "Technique: self-monitoring, goal-setting.",
    ctaText: "Next",
  },
  accountability: {
    icon: Users,
    headline: "Sharing plans makes goals far more likely.",
    subline: "Committing to someone and having short, scheduled check-ins dramatically boost completion rates.",
    citation: "(ASTD / organizational studies)",
    fullCitation: "ASTD Research: Accountability increases goal success from 65% to 95%.",
    sourceUrl: "https://scholar.google.com/scholar?q=accountability+goal+achievement+ASTD",
    dataNugget: "Effect: commit → ~65% success; scheduled check-ins → up to ~95%.",
    ctaText: "Next",
  },
  reflect: {
    icon: BookOpen,
    headline: "Reflecting and short journaling helps focus and mood.",
    subline: "Quick reflections reduce stress and improve clarity — which helps you make better behaviour decisions.",
    citation: "(Journaling trials & reviews)",
    fullCitation: "Pennebaker, J.W. et al. Expressive writing and health outcomes meta-analysis.",
    sourceUrl: "https://scholar.google.com/scholar?q=journaling+mental+health+benefits",
    dataNugget: "Benefit: better mood, stress reduction, improved follow-through.",
    ctaText: "Continue to tutorial",
  },
};

export function EvidenceStep({ variant, onNext }: EvidenceStepProps) {
  const data = EVIDENCE_DATA[variant];
  const IconComponent = data.icon;

  return (
    <OnboardingCard className="animate-fade-in">
      <div className="flex flex-col h-full">
        {/* Header with icon and headline */}
        <div className="flex items-start gap-4 mb-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
            <IconComponent className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold font-display text-foreground leading-tight">
              {data.headline}
            </h2>
          </div>
        </div>

        {/* Subline */}
        <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
          {data.subline}
        </p>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Data nugget */}
        <div className="mb-4">
          <span className="inline-block text-xs text-muted-foreground/80 bg-muted/50 px-3 py-1.5 rounded-full">
            {data.dataNugget}
          </span>
        </div>

        {/* Footer with citation and CTA */}
        <div className="flex items-end justify-between gap-4">
          {/* Citation with info tooltip */}
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1.5 cursor-help">
                  <Info className="w-3.5 h-3.5 text-muted-foreground/60" />
                  <span className="text-xs text-muted-foreground/60">
                    {data.citation}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs p-3">
                <p className="text-sm mb-2">{data.fullCitation}</p>
                <a
                  href={data.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline"
                >
                  Read more →
                </a>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* CTA Button */}
          <Button
            onClick={onNext}
            variant="gradient"
            className="h-10 px-6 hover:opacity-90"
          >
            {data.ctaText} <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </OnboardingCard>
  );
}
