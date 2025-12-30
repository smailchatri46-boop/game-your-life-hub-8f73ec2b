import { Navbar } from "@/components/Navbar";
import { GlassCard } from "@/components/GlassCard";
import { AppleEmoji } from "@/components/AppleEmoji";
import { YouTubeEmbed } from "@/components/YouTubeEmbed";
import { Clock, Play } from "lucide-react";
import { Link } from "react-router-dom";

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
    question: "Can I add a to-do list?",
    answer: (
      <>
        Yes! You can add to-do tasks, which are one-time items that get hidden once completed. Navigate to the <strong>Overview</strong> page and find the to-do list section. Click on any day in the monthly calendar to view and add tasks for that specific date—your tasks are automatically saved.
      </>
    ),
  },
  {
    question: "How do goals work?",
    answer: (
      <>
        Goals are long-term targets you want to achieve over a quarter (3 months) or a year. You can link habits to your goals, and every time you complete a linked habit, it counts toward your goal progress. Track your advancement on the <strong>Goals</strong> page where you'll see percentages and status indicators.
      </>
    ),
  },
  {
    question: "Can I schedule a habit or task for specific days of the week?",
    answer: (
      <>
        Yes! This is a native feature. Go to the <strong>Dashboard</strong> and click the plus button at the bottom right corner to add a new habit or task. During the setup, you can choose specific days of the week for it to repeat automatically. Note: this is different from the to-do list—habits and tasks repeat each week on your chosen days, while to-do items are one-time and won't repeat.
      </>
    ),
  },
  {
    question: "Can I add a task only on certain days of the month?",
    answer: (
      <>
        Yes! Go to the <strong>Dashboard</strong> and click the plus button at the bottom right corner. When adding a new habit or task, you can select specific days of the month for it to appear. This is perfect for monthly appointments, deadlines, or recurring monthly reminders.
      </>
    ),
  },
  {
    question: "Can I add a progressive build-up habit?",
    answer: (
      <>
        Yes! Go to the <strong>Dashboard</strong> and click the plus button at the bottom right corner. Follow the steps to add a habit, and you'll see the option to enable progressive build-up. This allows you to start small and gradually increase your target over time—perfect for building sustainable habits without overwhelming yourself.
      </>
    ),
  },
  {
    question: "Can I download my data?",
    answer: (
      <>
        Yes! Go to the <strong>Dashboard</strong> or <strong>Overview</strong> page, open the AI chat box, and click on "Download Data." This includes your habits, journal entries, mood logs, and chat history—everything you need to keep a personal backup or use with other tools.
      </>
    ),
  },
  {
    question: "Can I track my mood and emotions?",
    answer: (
      <>
        Absolutely! Go to the <strong>Dashboard</strong> and scroll down to find the Mood and Motivation section. There you can log how you're feeling each day. Over time, you'll see patterns in your emotional well-being alongside your habit completion—this helps you understand how your routines affect your overall mood.
      </>
    ),
  },
  {
    question: "How can I add a daily reflection or feedback?",
    answer: (
      <>
        Go to the <strong>Dashboard</strong> page and you'll find the daily reflection section where you can log how your day went. This feedback helps the AI understand your patterns and provides better insights over time. It's a quick way to track your daily experience beyond just completing habits.
      </>
    ),
  },
  {
    question: "Is this just a habit tracker?",
    answer: (
      <>
        Not at all! This is a complete life management tool. Beyond habit tracking, you get an AI Buddy that answers your questions, a to-do list for daily tasks, mood and motivation tracking, yearly and quarterly goal setting with progress tracking, journaling, and daily reflections. It's the only tool you need to track everything in your life—no need for multiple apps.
      </>
    ),
  },
  {
    question: "Is there a video tutorial on how to use this app?",
    answer: (
      <>
        Yes! We've created a comprehensive video walkthrough showing you all the features of the app and how to use them effectively. <Link to="/video-tutorial" className="font-bold text-primary hover:underline">Click here to watch it</Link>.
      </>
    ),
  },
  {
    question: "Can I do journaling in the app?",
    answer: (
      <>
        Yes! The <strong>Journal</strong> tab is your personal space to write down your thoughts, memories, and experiences. Everything you write is saved and can be reviewed anytime. You can also share your journal entries with the AI for personalized insights.
      </>
    ),
  },
  {
    question: "What's the difference between daily reflection and journaling?",
    answer: (
      <>
        <strong>Daily Reflection</strong> is a quick log about how your day went—it gives the AI feedback to help analyze your patterns and improve your life over time. <strong>Journaling</strong> is for deeper thoughts: write about what you're going through, capture good moments, process difficult ones. These are your personal notes and memories that stay saved for you to revisit anytime.
      </>
    ),
  },
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
    question: "How do progress percentages work?",
    answer: (
      <>
        Progress percentages show how close you are to completing your goal target. For example, if your goal is to complete a habit or task 100 times and you've done it 50 times, you're at 50%. Check your progress on the <strong>Goals</strong> page.
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
        Go to the <strong>Dashboard</strong> and click the plus button at the bottom right corner. Follow the steps to create a new habit by giving it a name, choosing an icon, and setting your daily target.
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
        Absolutely! The AI Buddy can look at your habits, goals, and journal entries to provide personalized insights. Visit the <strong>Overview</strong> page or chat with your AI Buddy to get analysis and encouragement.
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
        You can edit journal entries within the first 24 hours of writing them. After that, they become permanent—we do this so your memories and authentic feelings are preserved forever. Think of it as a time capsule of your thoughts!
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
      
      {/* Sticky Video Tutorial Button */}
      <Link 
        to="/video-tutorial"
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 btn-primary-gradient px-5 py-3 rounded-full flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
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
    </div>
  );
}
