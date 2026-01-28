import { ScrollReveal } from "@/components/ScrollReveal";
import { faqs } from "@/data/faqData";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function LandingFAQ() {
  // Only show the first 7 FAQs
  const displayedFaqs = faqs.slice(0, 7);

  return (
    <section className="py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <ScrollReveal animation="fade-up">
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-center mb-4 text-foreground">
            Frequently Asked Questions
          </h2>
        </ScrollReveal>
        <ScrollReveal animation="fade-up" delay={100}>
          <p className="text-muted-foreground text-center mb-10 max-w-xl mx-auto">
            Everything you need to know about Neyler
          </p>
        </ScrollReveal>

        <ScrollReveal animation="fade-up" delay={200}>
          <Accordion type="single" collapsible className="space-y-3">
            {displayedFaqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-white border-0 rounded-2xl px-5 overflow-hidden shadow-sm"
              >
                <AccordionTrigger className="text-left font-medium text-foreground py-4 hover:no-underline font-['Inter',sans-serif]">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ScrollReveal>
      </div>
    </section>
  );
}
