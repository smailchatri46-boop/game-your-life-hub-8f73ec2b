import { GlassCard } from "@/components/GlassCard";
import { Plus, Circle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const demoTodos = [
  { text: "Review quarterly goals", completed: true },
  { text: "Call mom", completed: false },
  { text: "Buy groceries", completed: false },
  { text: "Prepare presentation", completed: true },
];

export function TodoShowcase() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="order-2 md:order-1">
            <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4">
              Everything in <span className="gradient-text italic">One App</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              No need for multiple tools. Add your one-time tasks and manage everything in one beautiful interface.
            </p>
          </div>

          {/* Todo List Preview */}
          <div className="order-1 md:order-2">
            <GlassCard className="p-6" glow>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">Today's Tasks</h3>
                <Button variant="ghost" size="sm" className="gap-2 text-primary hover:text-primary">
                  <Plus className="w-4 h-4" />
                  Add task
                </Button>
              </div>

              <div className="space-y-3">
                {demoTodos.map((todo, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 transition-all hover:bg-secondary/70"
                  >
                    {todo.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    )}
                    <span
                      className={`text-sm ${
                        todo.completed ? "line-through text-muted-foreground" : "text-foreground"
                      }`}
                    >
                      {todo.text}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between text-sm text-muted-foreground">
                <span>2 of 4 completed</span>
                <span className="text-primary font-medium">50%</span>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </section>
  );
}
