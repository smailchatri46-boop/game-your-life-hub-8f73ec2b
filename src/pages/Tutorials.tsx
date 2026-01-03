import { GlassCard } from "@/components/GlassCard";
import { YouTubeEmbed } from "@/components/YouTubeEmbed";
import { Clock, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { faqs } from "@/data/faqData";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// YouTube video ID for all tutorials (extracted from https://youtu.be/E_sPvPHwpuk)
const TUTORIAL_VIDEO_ID = "E_sPvPHwpuk";

interface Tutorial {
  id: string;
  title: string;
  description: string;
  duration: string;
  thumbnail: string;
  category: string;
}

const tutorials: Tutorial[] = [
  {
    id: "1",
    title: "Getting Started with Locked",
    description: "Learn the basics of tracking your habits and setting up your first goals.",
    duration: "5 min",
    thumbnail: "🎯",
    category: "Basics",
  },
  {
    id: "2",
    title: "Mastering the Dashboard",
    description: "Understand all the stats, progress indicators, and how to interpret your data.",
    duration: "7 min",
    thumbnail: "📊",
    category: "Dashboard",
  },
  {
    id: "3",
    title: "Building Effective Habits",
    description: "Tips and strategies for creating habits that stick using the habits tracker.",
    duration: "10 min",
    thumbnail: "✅",
    category: "Habits",
  },
  {
    id: "4",
    title: "Monthly Overview Guide",
    description: "How to use the calendar view to track your progress over time.",
    duration: "4 min",
    thumbnail: "📅",
    category: "Overview",
  },
  {
    id: "5",
    title: "Journaling for Growth",
    description: "Make the most of the journal feature to reflect and improve.",
    duration: "6 min",
    thumbnail: "📝",
    category: "Journal",
  },
  {
    id: "6",
    title: "AI Coach Features",
    description: "Unlock the power of AI coaching for personalized insights and motivation.",
    duration: "8 min",
    thumbnail: "🤖",
    category: "AI Chat",
  },
  {
    id: "7",
    title: "Leveling Up & Gamification",
    description: "Understanding XP, levels, streaks, and how to stay motivated.",
    duration: "5 min",
    thumbnail: "🏆",
    category: "Gamification",
  },
  {
    id: "8",
    title: "Pro Tips & Tricks",
    description: "Advanced strategies from power users to maximize your productivity.",
    duration: "12 min",
    thumbnail: "💡",
    category: "Advanced",
  },
];


export default function Tutorials() {
  return (
    <>
      
      {/* Sticky Video Tutorial Button */}
      <Link 
        to="/video-tutorial"
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 btn-primary-gradient px-5 py-3 rounded-full flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-x-1/2 hover:-translate-y-0.5 transition-all duration-300"
      >
        <Play className="w-5 h-5 fill-current" />
        <span className="font-body font-semibold">Watch a full tutorial</span>
      </Link>
      
      <main className="pt-28 pb-12 px-4 max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-semibold">Tutorials</h1>
          <p className="font-body text-muted-foreground mt-1">Learn how to get the most out of Locked</p>
        </div>
        
        {/* Tutorial Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {tutorials.map((tutorial, index) => (
            <GlassCard 
              key={tutorial.id} 
              className="overflow-hidden animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` } as React.CSSProperties}
            >
              <div className="relative">
                <YouTubeEmbed videoId={TUTORIAL_VIDEO_ID} />
                <span className="absolute top-3 left-3 px-2 py-1 bg-card/80 backdrop-blur-sm rounded-lg text-xs font-body font-semibold z-10">
                  {tutorial.category}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-body text-xl font-bold mb-2">
                  {tutorial.title}
                </h3>
                <p className="font-body text-sm text-muted-foreground mb-3">
                  {tutorial.description}
                </p>
                <div className="flex items-center gap-2 text-xs font-body font-medium text-muted-foreground">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{tutorial.duration}</span>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Frequently Asked Questions</h2>
            <p className="font-body text-muted-foreground">Find answers to common questions about using Locked</p>
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
        </div>
      </main>
    </>
  );
}
