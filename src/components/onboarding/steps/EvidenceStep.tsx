import { Button } from "@/components/ui/button";
import { ChevronRight, Info } from "lucide-react";
import { AppleEmoji } from "@/components/AppleEmoji";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type EvidenceVariant = "tracking" | "accountability" | "reflect";

interface EvidenceStepProps {
  variant: EvidenceVariant;
  onNext: () => void;
}

const EVIDENCE_DATA: Record<
  EvidenceVariant,
  {
    emoji: string;
    title: string;
    body: string;
    dataHighlight: string;
    citation: string;
    fullCitation: string;
    sourceUrl: string;
  }
> = {
  tracking: {
    emoji: "📊",
    title: "Studies show: tracking increases success by up to 2×",
    body: "Research in behaviour-change psychology shows that people who consistently track their actions and progress are far more likely to follow through than those who don't.",
    dataHighlight: "Techniques used in studies: self-monitoring and goal-setting.",
    citation: "Behaviour-change meta-analyses (2023–2024)",
    fullCitation: "Michie, S. et al. Behaviour Change Techniques: A Systematic Review and Meta-Analysis.",
    sourceUrl: "https://scholar.google.com/scholar?q=behaviour+change+self-monitoring+meta-analysis+2024",
  },
  accountability: {
    emoji: "🤝",
    title: "Studies show: accountability increases goal completion up to 95%",
    body: "Studies on accountability show that regular check-ins, reminders, and progress reflection dramatically increase goal completion. Digital and AI-based systems can replicate these effects without a human coach.",
    dataHighlight: "~65% completion with shared commitment. Up to ~95% with structured, scheduled check-ins.",
    citation: "Organizational & behavioural studies on accountability systems",
    fullCitation: "ASTD Research: Accountability increases goal success from 65% to 95%.",
    sourceUrl: "https://scholar.google.com/scholar?q=accountability+goal+achievement+ASTD",
  },
  reflect: {
    emoji: "📝",
    title: "Studies show: short daily journaling improves focus and mood",
    body: "Clinical and behavioural research shows that brief daily reflection reduces stress, improves emotional clarity, and supports better decision-making.",
    dataHighlight: "Observed benefits: improved mood, lower stress, better follow-through.",
    citation: "Journaling trials & psychological reviews",
    fullCitation: "Pennebaker, J.W. et al. Expressive writing and health outcomes meta-analysis.",
    sourceUrl: "https://scholar.google.com/scholar?q=journaling+mental+health+benefits",
  },
};

export function EvidenceStep({ variant, onNext }: EvidenceStepProps) {
  const data = EVIDENCE_DATA[variant];

  return (
    <div
      className={cn(
        "bg-white rounded-[2rem] w-full max-w-xl mx-auto shadow-lg",
        "border border-white/60",
        "animate-fade-in",
        "px-10 py-12"
      )}
    >
      <div className="flex flex-col gap-8">
        {/* Title with emoji */}
        <div className="flex items-start gap-4">
          <AppleEmoji emoji={data.emoji} size="4xl" className="flex-shrink-0 mt-0.5" />
          <h2 className="text-2xl font-bold font-display text-foreground leading-snug">
            {data.title}
          </h2>
        </div>

        {/* Body text */}
        <p className="text-muted-foreground text-base leading-[1.8]">
          {data.body}
        </p>

        {/* Data highlight box */}
        <div className="bg-amber-50/80 rounded-xl px-6 py-5">
          <p className="text-sm font-medium text-foreground/90 leading-relaxed">
            {data.dataHighlight}
          </p>
        </div>

        {/* Study reference with inline info icon */}
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 cursor-help">
                <Info className="w-4 h-4 text-muted-foreground/60 flex-shrink-0" />
                <span className="text-sm text-muted-foreground/60">
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
          className="h-14 w-full text-base hover:opacity-90 mt-2"
        >
          Next <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
