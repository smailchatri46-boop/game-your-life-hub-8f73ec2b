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

interface Tutorial {
  id: string;
  title: string;
  description: string;
  duration: string;
  videoId: string;
  category: string;
}

const tutorials: Tutorial[] = [
  {
    id: "1",
    title: "How to add a to-do list on Neyler",
    description: "Learn how to create and manage your daily to-do lists to stay organized and productive.",
    duration: "2 min",
    videoId: "mUnuNuWcKp4",
    category: "To-Do",
  },
  {
    id: "2",
    title: "How to write notes and journals on Neyler",
    description: "Discover how to capture your thoughts and ideas using the notes and journal features.",
    duration: "2 min",
    videoId: "h8DVZF-HWkE",
    category: "Journal",
  },
  {
    id: "3",
    title: "How to write a daily reflection on Neyler",
    description: "Master the daily reflection feature to track your progress and gain insights.",
    duration: "2 min",
    videoId: "XMB_0CMDNL4",
    category: "Reflection",
  },
  {
    id: "4",
    title: "How to add a new habit or task on Neyler",
    description: "Step-by-step guide to creating new habits and tasks to build your routine.",
    duration: "2 min",
    videoId: "gfq5_vW1H6w",
    category: "Habits",
  },
  {
    id: "5",
    title: "How to track your mood and motivation on Neyler",
    description: "Learn to monitor your emotional well-being and motivation levels over time.",
    duration: "2 min",
    videoId: "9fajFN68ZkQ",
    category: "Mood",
  },
  {
    id: "6",
    title: "How to add a new goal on Neyler",
    description: "Learn how to set meaningful goals and track your progress towards achieving them.",
    duration: "2 min",
    videoId: "Ud6fX0mgX6Y",
    category: "Goals",
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
                <YouTubeEmbed videoId={tutorial.videoId} />
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
