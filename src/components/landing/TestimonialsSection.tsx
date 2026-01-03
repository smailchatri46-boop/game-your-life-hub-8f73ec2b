import { GlassCard } from "@/components/GlassCard";
import { AppleEmoji } from "@/components/AppleEmoji";

interface Review {
  text: string;
  emoji?: string;
  name: string;
  avatar: string;
  avatarBg: string;
  stars: number;
  meta: string;
}

const reviews: Review[] = [
  {
    text: "Neyler makes it so much easier to keep my habits, tasks, and goals together. I finally stopped jumping between five different apps",
    name: "Sara K.",
    avatar: "🧘",
    avatarBg: "bg-rose-100",
    stars: 5,
    meta: "Using Neyler for 6 months"
  },
  {
    text: "I really like the AI reflections. It doesn't just show stats, it actually explains what my patterns mean",
    emoji: "🤖",
    name: "Marcus L.",
    avatar: "💻",
    avatarBg: "bg-blue-100",
    stars: 5,
    meta: "Verified user"
  },
  {
    text: "The dashboard is my favorite part. It gives me a clear picture of my week without feeling overwhelming",
    name: "Elena R.",
    avatar: "🎨",
    avatarBg: "bg-purple-100",
    stars: 5,
    meta: "Designer"
  },
  {
    text: "I'm surprised by how calming the design is. Soft colors, rounded cards, it feels nice to use",
    name: "Jamie T.",
    avatar: "🌿",
    avatarBg: "bg-green-100",
    stars: 4,
    meta: "Using Neyler for 2 months"
  },
  {
    text: "The habit tracker and task manager being in one place is exactly what I needed. I hate separating those two",
    name: "Alex M.",
    avatar: "📚",
    avatarBg: "bg-amber-100",
    stars: 5,
    meta: "Student"
  },
  {
    text: "Analytics helped me notice that weekends are my worst days for consistency",
    emoji: "📊",
    name: "Priya S.",
    avatar: "🔬",
    avatarBg: "bg-cyan-100",
    stars: 4,
    meta: "Verified user"
  },
  {
    text: "I use the journaling feature every night. It's simple and quick and the AI responses sometimes make me think deeper",
    name: "Noah B.",
    avatar: "✍️",
    avatarBg: "bg-indigo-100",
    stars: 5,
    meta: "Writer"
  },
  {
    text: "Goal tracking feels very natural here. Short term and long term both work well",
    emoji: "🎯",
    name: "Chloe W.",
    avatar: "🏃",
    avatarBg: "bg-orange-100",
    stars: 5,
    meta: "Using Neyler for 4 months"
  },
  {
    text: "I appreciate that the app focuses on small steps instead of shouting about productivity all the time",
    name: "David H.",
    avatar: "🧠",
    avatarBg: "bg-teal-100",
    stars: 4,
    meta: "Entrepreneur"
  },
  {
    text: "The reminders actually feel friendly instead of stressful",
    name: "Mia J.",
    avatar: "🌸",
    avatarBg: "bg-pink-100",
    stars: 5,
    meta: "Verified user"
  },
  {
    text: "Neyler helped me organize school work, personal habits, and health routines in one space",
    name: "Lucas F.",
    avatar: "🎓",
    avatarBg: "bg-sky-100",
    stars: 5,
    meta: "Student"
  },
  {
    text: "I like seeing my streaks grow. It gives me motivation in a way checklists never did",
    emoji: "🔥",
    name: "Ava P.",
    avatar: "⚡",
    avatarBg: "bg-yellow-100",
    stars: 5,
    meta: "Using Neyler for 3 months"
  },
  {
    text: "The onboarding experience was smooth and I felt guided without being overloaded with questions",
    name: "Ethan C.",
    avatar: "🚀",
    avatarBg: "bg-violet-100",
    stars: 4,
    meta: "Verified user"
  },
  {
    text: "Being able to add habits for specific days only is super helpful for my schedule",
    emoji: "📆",
    name: "Sophie N.",
    avatar: "📅",
    avatarBg: "bg-lime-100",
    stars: 5,
    meta: "Freelancer"
  },
  {
    text: "This feels like a life tracker more than just a habit app. Tasks, journaling, goals, everything fits together",
    name: "Ryan G.",
    avatar: "🌟",
    avatarBg: "bg-amber-100",
    stars: 5,
    meta: "Using Neyler for 5 months"
  },
  {
    text: "I love how clean and minimal the interface looks. No distractions at all",
    name: "Lily D.",
    avatar: "✨",
    avatarBg: "bg-rose-100",
    stars: 5,
    meta: "Designer"
  },
  {
    text: "AI chat feels supportive. It reacts to my entries like a real coach sometimes",
    emoji: "😊",
    name: "Omar A.",
    avatar: "💬",
    avatarBg: "bg-blue-100",
    stars: 5,
    meta: "Verified user"
  },
  {
    text: "The progress charts made me realize how often I underestimate my own consistency",
    name: "Hannah V.",
    avatar: "📈",
    avatarBg: "bg-emerald-100",
    stars: 4,
    meta: "Using Neyler for 2 months"
  },
  {
    text: "I added my habits, some tasks, and started journaling in the same day and it instantly clicked for me",
    emoji: "🌱",
    name: "Ben Q.",
    avatar: "🌻",
    avatarBg: "bg-green-100",
    stars: 5,
    meta: "Student"
  },
  {
    text: "The best part for me is seeing long term progress instead of just checking boxes every day. It feels meaningful",
    name: "Zoe I.",
    avatar: "🎯",
    avatarBg: "bg-purple-100",
    stars: 5,
    meta: "Entrepreneur"
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <AppleEmoji 
          key={star} 
          emoji={star <= rating ? "⭐" : "☆"} 
          size="sm" 
        />
      ))}
    </div>
  );
}

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
          {reviews.map((review, index) => (
            <GlassCard
              key={index}
              className="p-5 break-inside-avoid"
            >
              {/* Header with avatar, name, and rating */}
              <div className="flex items-start gap-3 mb-3">
                <div className={`w-10 h-10 rounded-full ${review.avatarBg} flex-shrink-0`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-foreground">{review.name}</span>
                    <StarRating rating={review.stars} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{review.meta}</p>
                </div>
              </div>
              
              {/* Review text */}
              <p className="text-foreground/85 leading-relaxed text-[15px]">
                {review.text}
                {review.emoji && (
                  <span className="ml-1 inline-flex">
                    <AppleEmoji emoji={review.emoji} size="md" />
                  </span>
                )}
              </p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
