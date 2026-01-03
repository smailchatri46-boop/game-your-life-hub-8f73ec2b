import { GlassCard } from "@/components/GlassCard";
import { AppleEmoji } from "@/components/AppleEmoji";

const reviews = [
  "Locked makes it so much easier to keep my habits, tasks, and goals together. I finally stopped jumping between five different apps",
  { text: "I really like the AI reflections. It doesn't just show stats, it actually explains what my patterns mean", emoji: "🤖" },
  "The dashboard is my favorite part. It gives me a clear picture of my week without feeling overwhelming",
  "I'm surprised by how calming the design is. Soft colors, rounded cards, it feels nice to use",
  "The habit tracker and task manager being in one place is exactly what I needed. I hate separating those two",
  { text: "Analytics helped me notice that weekends are my worst days for consistency", emoji: "📊" },
  "I use the journaling feature every night. It's simple and quick and the AI responses sometimes make me think deeper",
  { text: "Goal tracking feels very natural here. Short term and long term both work well", emoji: "🎯" },
  "I appreciate that the app focuses on small steps instead of shouting about productivity all the time",
  "The reminders actually feel friendly instead of stressful",
  "Locked helped me organize school work, personal habits, and health routines in one space",
  { text: "I like seeing my streaks grow. It gives me motivation in a way checklists never did", emoji: "🔥" },
  "The onboarding experience was smooth and I felt guided without being overloaded with questions",
  { text: "Being able to add habits for specific days only is super helpful for my schedule", emoji: "📆" },
  "This feels like a life tracker more than just a habit app. Tasks, journaling, goals, everything fits together",
  "I love how clean and minimal the interface looks. No distractions at all",
  { text: "AI chat feels supportive. It reacts to my entries like a real coach sometimes", emoji: "😊" },
  "The progress charts made me realize how often I underestimate my own consistency",
  { text: "I added my habits, some tasks, and started journaling in the same day and it instantly clicked for me", emoji: "🌱" },
  "The best part for me is seeing long term progress instead of just checking boxes every day. It feels meaningful",
];

export function TestimonialsSection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-display text-3xl md:text-4xl font-semibold text-center mb-4">
          What people are <span className="gradient-text italic">saying</span>
        </h2>
        <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
          Real feedback from real users building better habits every day.
        </p>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {reviews.map((review, index) => {
            const isObject = typeof review === "object";
            const text = isObject ? review.text : review;
            const emoji = isObject ? review.emoji : null;

            return (
              <GlassCard
                key={index}
                className="p-6 break-inside-avoid"
              >
                <p className="text-foreground/90 leading-relaxed">
                  {text}
                  {emoji && (
                    <span className="ml-1">
                      <AppleEmoji emoji={emoji} size="md" />
                    </span>
                  )}
                </p>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
