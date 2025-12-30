import { Navbar } from "@/components/Navbar";
import { GlassCard } from "@/components/GlassCard";
import { AppleEmoji } from "@/components/AppleEmoji";
import { YouTubeEmbed } from "@/components/YouTubeEmbed";
import { Clock } from "lucide-react";

// YouTube video ID for all tutorials (extracted from https://youtu.be/E_sPvPHwpuk)
const TUTORIAL_VIDEO_ID = "E_sPvPHwpuk";
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
  thumbnail: string;
  category: string;
}

interface FAQ {
  question: string;
  answer: React.ReactNode;
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

const faqs: FAQ[] = [
  {
    question: "How does the AI use my data?",
    answer: (
      <>
        Your data stays private and is only used inside the app to personalize your experience. The AI uses your habits, goals, and journal entries to provide tailored reflections, goal support, and motivational insights. We never share your personal data with third parties.
      </>
    ),
  },
  {
    question: "How do I add a new goal?",
    answer: (
      <>
        Head to the <strong>Goals</strong> tab and tap the "Add Goal" button. You'll be guided through a simple step-by-step flow where you define your goal, explain why it matters to you, choose a category and timeline, link habits, and sign your commitment.
      </>
    ),
  },
  {
    question: "What is the difference between habits and tasks?",
    answer: (
      <>
        Habits are recurring actions you want to build into your daily routine—like exercising or reading. Tasks are one-time to-dos you check off when completed. In Locked, the <strong>Dashboard</strong> focuses on habits while daily tasks can be managed separately.
      </>
    ),
  },
  {
    question: "How do progress percentages work?",
    answer: (
      <>
        Progress percentages show how close you are to completing your goal target. For example, if your goal is to complete a habit 100 times and you've done it 50 times, you're at 50%. Check your progress on the <strong>Goals</strong> page.
      </>
    ),
  },
  {
    question: "Can I edit or delete a goal?",
    answer: (
      <>
        Yes! On the <strong>Goals</strong> page, hover over any goal card and click the arrow icon to reveal the edit and delete options. You can rename your goal or remove it entirely.
      </>
    ),
  },
  {
    question: "How do I add a new habit?",
    answer: (
      <>
        On the <strong>Dashboard</strong>, look for the "Add Habit" button. You can create a new habit by giving it a name, choosing an icon, and setting your daily target.
      </>
    ),
  },
  {
    question: "What happens if I miss a day?",
    answer: (
      <>
        Missing a day is completely normal—don't be too hard on yourself! Your streak may reset, but your overall progress and completed counts are preserved. The key is to get back on track the next day.
      </>
    ),
  },
  {
    question: "Can the AI analyze my progress?",
    answer: (
      <>
        Absolutely! The AI Coach can look at your habits, goals, and journal entries to provide personalized insights. Visit the <strong>Overview</strong> page or chat with your AI Buddy to get analysis and encouragement.
      </>
    ),
  },
  {
    question: "How do journals work?",
    answer: (
      <>
        The <strong>Journal</strong> tab is your private space to reflect on your day, thoughts, and feelings. Write entries whenever you want—they're saved automatically and help the AI understand your journey better.
      </>
    ),
  },
  {
    question: "Can I edit journals after writing them?",
    answer: (
      <>
        Currently, journal entries are meant to capture your thoughts in the moment. We encourage authentic reflection, so entries are saved as-is to preserve your genuine feelings at the time of writing.
      </>
    ),
  },
  {
    question: "Are my entries private?",
    answer: (
      <>
        Yes, 100%. Your journal entries, habits, and goals are private to you. The AI uses this data only to provide personalized support within the app—nothing is shared externally.
      </>
    ),
  },
  {
    question: "How are streaks calculated?",
    answer: (
      <>
        A streak counts consecutive days where you completed at least one instance of a habit. If you miss a day, the streak resets to zero. Streaks are a fun way to build consistency!
      </>
    ),
  },
  {
    question: "What is a quarterly goal vs yearly goal?",
    answer: (
      <>
        When creating a goal, you can choose different time periods. A quarterly goal spans 3 months, while a yearly goal gives you 12 months to achieve your target. Choose based on the scope of what you want to accomplish.
      </>
    ),
  },
  {
    question: "Why can't I set a goal shorter than 3 months?",
    answer: (
      <>
        Meaningful goals take time to achieve. We encourage a minimum of 3 months because lasting change happens through consistent effort over time, not quick fixes. This helps you build sustainable habits.
      </>
    ),
  },
  {
    question: "How do reminders work?",
    answer: (
      <>
        Reminders help you stay on track by nudging you to complete your habits. You can customize notification preferences in the <strong>Settings</strong> page to match your schedule.
      </>
    ),
  },
  {
    question: "What are onboarding cards and tips?",
    answer: (
      <>
        When you first start using the app, you'll see helpful tip cards that guide you through features. These onboarding tips can be dismissed once you're familiar with the app.
      </>
    ),
  },
  {
    question: "How do I track my completed actions?",
    answer: (
      <>
        Your completed habits appear on the <strong>Dashboard</strong> with checkmarks. For a broader view, visit the <strong>Overview</strong> page to see your monthly calendar and progress charts.
      </>
    ),
  },
  {
    question: "How does the app help motivation?",
    answer: (
      <>
        Locked uses gamification elements like XP, levels, and streaks to keep you engaged. The AI Coach provides personalized encouragement, and seeing your progress visually helps reinforce your commitment.
      </>
    ),
  },
  {
    question: "What does 'On track' mean on my goals?",
    answer: (
      <>
        "On track" means you're progressing at the right pace to hit your goal by the deadline. If you fall behind, you'll see "Falling behind"—and if you're doing great, you might see "Ahead of schedule"!
      </>
    ),
  },
  {
    question: "Can I connect multiple habits to one goal?",
    answer: (
      <>
        Yes! When creating a goal, you can link as many habits as you want. This is powerful because multiple small habits can work together to help you achieve a bigger goal.
      </>
    ),
  },
];

export default function Tutorials() {
  return (
    <div className="min-h-screen gradient-bg">
      <Navbar />
      
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
            <div className="flex items-center gap-3 mb-2">
              <AppleEmoji emoji="❓" size="2xl" />
              <h2 className="text-2xl font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Frequently Asked Questions</h2>
            </div>
            <p className="font-body text-muted-foreground">Find answers to common questions about using Locked</p>
          </div>

          <GlassCard className="p-6">
            <Accordion type="single" collapsible className="w-full font-body">
              {faqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="border-b border-border/50 last:border-0"
                >
                  <AccordionTrigger className="text-left font-bold text-base hover:text-primary transition-colors py-4">
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
    </div>
  );
}
