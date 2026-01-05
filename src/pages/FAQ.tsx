import { LandingNavbar } from "@/components/LandingNavbar";
import { GlassCard } from "@/components/GlassCard";
import { faqs } from "@/data/faqData";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQ() {
  return (
    <div className="min-h-screen gradient-hero flex flex-col">
      <LandingNavbar />
      
      <main className="flex-1 pt-28 pb-12 px-4 max-w-5xl mx-auto w-full">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-semibold mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>Frequently Asked Questions</h1>
          <p className="font-body text-muted-foreground">Find answers to common questions about using Neyler</p>
        </div>

        <GlassCard className="p-6">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border-b border-border/50 last:border-0"
              >
                <AccordionTrigger 
                  className="text-left font-bold text-base hover:text-primary transition-colors py-4"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm font-medium leading-relaxed pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </GlassCard>
      </main>
    </div>
  );
}
