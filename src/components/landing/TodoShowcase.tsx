import { AppleEmoji } from "@/components/AppleEmoji";
import { Plus, Check } from "lucide-react";

export function TodoShowcase() {
  return (
    <section className="py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Text Content - Aligned to top */}
          <div className="order-2 md:order-1">
            <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4">
              Everything in <span className="gradient-text italic">one app</span>, no need for multiple tools
            </h2>
            <p className="text-muted-foreground text-lg">
              No need for multiple tools. Add your one-time tasks and manage everything in a beautiful clean style.
            </p>
          </div>

          {/* To-Do List - exact same styling as Overview */}
          <div className="order-1 md:order-2">
            <div className="p-6 rounded-3xl bg-gradient-to-br from-[hsl(30,70%,96%)] to-[hsl(25,60%,92%)]">
              <div className="flex items-start justify-between mb-1">
                <div>
                  <h3 className="font-display text-xl font-semibold text-foreground">To-Do List</h3>
                  <p className="text-sm text-muted-foreground">
                    1 décembre 2025
                  </p>
                </div>
                <AppleEmoji emoji="😌" size="2xl" />
              </div>
              
              <div className="space-y-2 mt-4">
                {/* Call mom task - completed */}
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/80 shadow-sm">
                  <AppleEmoji emoji="📞" size="lg" />
                  <span className="text-sm flex-1 text-muted-foreground line-through">
                    Call mom
                  </span>
                  <button className="w-6 h-6 rounded-full border-2 flex items-center justify-center bg-[hsl(25,60%,70%)] border-[hsl(25,60%,70%)]">
                    <Check className="w-4 h-4 text-white" />
                  </button>
                </div>

                {/* Add task button */}
                <button
                  className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl bg-white/50 hover:bg-white/70 transition-colors text-muted-foreground border-2 border-dashed border-muted-foreground/20"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm">Add task</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}