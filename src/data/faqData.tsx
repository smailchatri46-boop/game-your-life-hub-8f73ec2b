import { Link } from "react-router-dom";

export interface FAQ {
  question: string;
  answer: React.ReactNode;
}

export const faqs: FAQ[] = [
  {
    question: "How does this prevent the ADHD burnout cycle?",
    answer: (
      <>
        Progressive buildup is built in. Start with 1 minute of meditation instead of 30—the app automatically increases your target over time so you build habits gradually without overwhelming yourself. No more overcommitting on day 1 and quitting by week 2.
      </>
    ),
  },
  {
    question: "How is this different from Notion, Habitica, or other apps I've tried?",
    answer: (
      <>
        No blank pages. No complex setup. No gamification that loses its novelty. Everything you need is in one clean grid—habits, tasks, goals, mood tracking—with zero app-switching. Designed specifically for ADHD brains, not neurotypical productivity systems.
      </>
    ),
  },
  {
    question: "Will this actually work for my ADHD brain?",
    answer: (
      <>
        It's built around how ADHD works, not against it. Visual dopamine hits from colored completion boxes, external memory so you don't forget what you did, AI that spots patterns your brain misses. No overwhelming features—just what you need, visible at a glance.
      </>
    ),
  },
  {
    question: "Can I add habits that happen only on certain days?",
    answer: (
      <>
        Yes! Set habits for specific days of the week or month—the app shows only what's relevant today, no visual clutter from habits that don't apply. Progress is calculated only for scheduled days, so no guilt for "off" days.
      </>
    ),
  },
  {
    question: "How does the AI understand my ADHD patterns?",
    answer: (
      <>
        The AI sees your habits, mood, tasks, and journal entries to spot connections you can't see yourself. It notices things like "you skip exercise when your sleep was bad" or "your mood dips after missing morning routines." Time blindness and pattern recognition—finally externalized.
      </>
    ),
  },
  {
    question: "What if I miss a day (or a week)?",
    answer: (
      <>
        No shame, no broken streaks staring at you. Your overall progress is preserved, and the AI helps you understand why gaps happened—not to judge, but to learn. Missing days is normal with ADHD; just pick back up when you can.
      </>
    ),
  },
  {
    question: "Can I track mood alongside habits?",
    answer: (
      <>
        Yes! Mood and motivation tracking is built into the Dashboard. The AI correlates your emotional state with habit completion, showing patterns you'd never notice otherwise—like why some days feel impossible and others flow easily.
      </>
    ),
  },
  {
    question: "How fast can I add a task?",
    answer: (
      <>
        Under 10 seconds. ADHD brains need low friction—if it takes too long to add something, you won't add it. Quick entry means your thoughts actually make it into the system before you forget them.
      </>
    ),
  },
  {
    question: "Is there a to-do list for one-time tasks?",
    answer: (
      <>
        Yes! The Overview page has one-time tasks alongside your repeating habits. Everything in one place, no app-switching to lose your focus.
      </>
    ),
  },
  {
    question: "How do goals work without overwhelming me?",
    answer: (
      <>
        Goals are broken down into daily habits you can actually follow. You see visual progress bars, not abstract future deadlines. Quarterly or yearly goals feel manageable because you're just focused on today's linked habits.
      </>
    ),
  },
  {
    question: "Is there a video walkthrough?",
    answer: (
      <>
        Yes! We have a short video showing all the features. <Link to="/video-tutorial" className="font-bold text-primary hover:underline">Watch it here</Link>—it covers everything you need to get started.
      </>
    ),
  },
  {
    question: "Can I write journals and reflections?",
    answer: (
      <>
        Yes. The Journal tab is for deeper thoughts, while daily reflections are quick notes about how your day went. Both feed into the AI for personalized insights about your patterns.
      </>
    ),
  },
];