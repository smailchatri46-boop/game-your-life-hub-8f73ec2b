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
        Progressive buildup is built in. Start with 1 minute of meditation instead of 30. The app automatically increases your target over time—so you build habits gradually without overwhelming yourself. No more overcommitting on day 1 and quitting by week 2.
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
        It's built around how ADHD works, not against it. Visual dopamine hits from colored completion boxes. External memory so you don't forget what you did. AI that spots patterns your brain misses. No overwhelming features—just what you need, visible at a glance.
      </>
    ),
  },
  {
    question: "Can I add habits that happen only on certain days?",
    answer: (
      <>
        Yes! Go to the <strong>Dashboard</strong> and click the plus button. You can set habits for specific days of the week or month. The app shows only what's relevant today—no visual clutter from habits that don't apply.
      </>
    ),
  },
  {
    question: "How does the AI understand my ADHD patterns?",
    answer: (
      <>
        The AI looks at your habits, mood, and completion patterns to spot connections you can't see yourself. It'll notice things like "you skip exercise when your sleep was bad" or "your mood dips after missing morning routines." Time blindness and pattern recognition—finally externalized.
      </>
    ),
  },
  {
    question: "What if I miss a day (or a week)?",
    answer: (
      <>
        No shame, no broken streaks staring at you. Your overall progress is preserved. The goal isn't perfection—it's consistency over time. Missing days is normal, especially with ADHD. Just pick back up when you can.
      </>
    ),
  },
  {
    question: "Can I track mood alongside habits?",
    answer: (
      <>
        Yes! The <strong>Dashboard</strong> has mood and motivation tracking built in. This helps the AI understand why some days feel impossible—and shows you patterns between your emotional state and habit completion you'd never notice otherwise.
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
        Yes! Navigate to the <strong>Overview</strong> page. You can add one-time tasks that disappear when completed—alongside your repeating habits. Everything in one place, no app-switching to lose your focus.
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
        Yes! We have a video showing all the features. <Link to="/video-tutorial" className="font-bold text-primary hover:underline">Watch it here</Link>—it's short and covers everything you need to get started.
      </>
    ),
  },
  {
    question: "Can I write journals and reflections?",
    answer: (
      <>
        Yes. The <strong>Journal</strong> tab is for deeper thoughts, while daily reflections are quick notes about how your day went. Both are saved and can be shared with the AI for personalized insights about your patterns.
      </>
    ),
  },
];