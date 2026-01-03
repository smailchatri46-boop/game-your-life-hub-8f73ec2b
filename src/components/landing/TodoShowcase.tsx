import { AppleEmoji } from "@/components/AppleEmoji";
import { Plus, Check } from "lucide-react";

const demoTodos = [
  { id: "1", text: "Review quarterly goals", completed: true, emoji: "📋" },
  { id: "2", text: "Call mom", completed: false, emoji: "📞" },
  { id: "3", text: "Buy groceries", completed: false, emoji: "🛒" },
  { id: "4", text: "Prepare presentation", completed: true, emoji: "💼" },
];

export function TodoShowcase() {
  return (
    <section className="py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Text Content - Aligned to top */}
          <div className="order-2 md:order-1">
            <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4">
              Everything in <span className="gradient-text italic">one app</span>, no need for multiple tools
            </h2>
            <p className="text-muted-foreground text-lg">
              No need for multiple tools. Add your one-time tasks and manage everything in one beautiful interface.
            </p>
          </div>

          {/* Exact To-Do List from Overview - same styling */}
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
                {demoTodos.map((todo) => (
                  <div 
                    key={todo.id}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-white/80 shadow-sm"
                  >
                    <AppleEmoji emoji={todo.emoji} size="lg" />
                    <span className={`text-sm flex-1 ${
                      todo.completed 
                        ? 'text-muted-foreground line-through' 
                        : 'text-foreground'
                    }`}>
                      {todo.text}
                    </span>
                    <button
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        todo.completed 
                          ? 'bg-[hsl(25,60%,70%)] border-[hsl(25,60%,70%)]' 
                          : 'border-[hsl(25,40%,80%)] hover:border-[hsl(25,50%,65%)]'
                      }`}
                    >
                      {todo.completed && <Check className="w-4 h-4 text-white" />}
                    </button>
                  </div>
                ))}
                
                {/* Add task button - exactly like Overview */}
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