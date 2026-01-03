import { AppleEmoji } from "@/components/AppleEmoji";
import { Plus } from "lucide-react";

export function TodoShowcase() {
  return (
    <section className="py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-end">
          {/* Text Content - Aligned to bottom of card */}
          <div className="order-2 md:order-1">
            <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4">
              Everything in <span className="gradient-text italic">one app</span>, no need for multiple tools
            </h2>
            <p className="text-muted-foreground text-lg">
              No need for multiple tools. Add your one-time tasks and manage everything in a beautiful clean style.
            </p>
          </div>

          {/* To-Do List - only Add task button */}
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
                {/* Add task button only */}
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