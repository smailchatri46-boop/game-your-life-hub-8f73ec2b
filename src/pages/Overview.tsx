import { Navbar } from "@/components/Navbar";
import { GlassCard } from "@/components/GlassCard";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useState } from "react";

interface DayData {
  date: number;
  habits: { name: string; completed: boolean }[];
  mood: string;
  journal?: string;
}

const generateMonthData = (): Record<number, DayData> => {
  const data: Record<number, DayData> = {};
  const habits = ["Morning Meditation", "Exercise", "Read 30 mins", "Drink Water", "No Social Media"];
  const moods = ["😊", "😌", "😐", "😔", "🥳"];
  
  for (let i = 1; i <= 25; i++) {
    data[i] = {
      date: i,
      habits: habits.map(name => ({
        name,
        completed: Math.random() > 0.3,
      })),
      mood: moods[Math.floor(Math.random() * 5)],
      journal: Math.random() > 0.5 ? "Had a great day today. Feeling productive and motivated." : undefined,
    };
  }
  return data;
};

export default function Overview() {
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [monthData] = useState(generateMonthData);
  const daysInMonth = 31;
  const startDay = 1; // Monday (0 = Sunday)
  
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  
  const getCompletionRate = (day: number) => {
    const data = monthData[day];
    if (!data) return 0;
    const completed = data.habits.filter(h => h.completed).length;
    return Math.round((completed / data.habits.length) * 100);
  };

  return (
    <div className="min-h-screen gradient-bg">
      <Navbar />
      
      <main className="pt-28 pb-12 px-4 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-semibold">Overview</h1>
            <p className="text-muted-foreground mt-1">Monthly calendar view</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full hover:bg-secondary transition-colors">
              <ChevronLeft className="w-5 h-5 text-muted-foreground" />
            </button>
            <h2 className="font-display text-xl">
              <span className="text-primary font-semibold">December</span>
              <span className="text-foreground ml-2">2025</span>
            </h2>
            <button className="p-2 rounded-full hover:bg-secondary transition-colors">
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <GlassCard className="p-6">
              {/* Week days header */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {weekDays.map(day => (
                  <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-2">
                {/* Empty cells for offset */}
                {Array.from({ length: startDay }, (_, i) => (
                  <div key={`empty-${i}`} className="aspect-square" />
                ))}
                
                {/* Day cells */}
                {Array.from({ length: daysInMonth }, (_, i) => {
                  const day = i + 1;
                  const completionRate = getCompletionRate(day);
                  const isFuture = day > 25;
                  const isSelected = selectedDate === day;
                  
                  return (
                    <button
                      key={day}
                      onClick={() => !isFuture && setSelectedDate(day)}
                      disabled={isFuture}
                      className={`aspect-square rounded-2xl flex flex-col items-center justify-center transition-all duration-200 ${
                        isFuture 
                          ? 'bg-muted/30 cursor-not-allowed'
                          : isSelected
                            ? 'bg-gradient-to-br from-accent to-primary text-primary-foreground shadow-medium scale-105'
                            : completionRate >= 80
                              ? 'bg-primary/20 hover:bg-primary/30'
                              : completionRate >= 50
                                ? 'bg-accent/20 hover:bg-accent/30'
                                : 'bg-secondary hover:bg-secondary/80'
                      }`}
                    >
                      <span className={`text-sm font-semibold ${isSelected ? 'text-primary-foreground' : ''}`}>
                        {day}
                      </span>
                      {!isFuture && (
                        <span className={`text-xs ${isSelected ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                          {completionRate}%
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </GlassCard>
          </div>
          
          {/* Day Details Panel */}
          <div>
            {selectedDate ? (
              <GlassCard className="p-6 sticky top-28">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display text-xl font-semibold">
                    December {selectedDate}
                  </h3>
                  <button 
                    onClick={() => setSelectedDate(null)}
                    className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                {monthData[selectedDate] ? (
                  <>
                    {/* Mood */}
                    <div className="mb-6">
                      <p className="text-sm font-medium text-muted-foreground mb-2">Mood</p>
                      <span className="text-3xl">{monthData[selectedDate].mood}</span>
                    </div>
                    
                    {/* Habits */}
                    <div className="mb-6">
                      <p className="text-sm font-medium text-muted-foreground mb-3">Habits</p>
                      <div className="space-y-2">
                        {monthData[selectedDate].habits.map((habit, i) => (
                          <div 
                            key={i}
                            className={`flex items-center gap-3 p-3 rounded-xl ${
                              habit.completed ? 'bg-primary/10' : 'bg-secondary'
                            }`}
                          >
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                              habit.completed 
                                ? 'bg-primary text-primary-foreground' 
                                : 'bg-muted'
                            }`}>
                              {habit.completed ? '✓' : ''}
                            </span>
                            <span className={`text-sm ${habit.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                              {habit.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Journal */}
                    {monthData[selectedDate].journal && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">Journal</p>
                        <p className="text-sm text-foreground bg-secondary/50 p-3 rounded-xl">
                          {monthData[selectedDate].journal}
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-muted-foreground text-center py-8">No data for this day</p>
                )}
              </GlassCard>
            ) : (
              <GlassCard className="p-6 text-center">
                <span className="text-4xl mb-4 block">📅</span>
                <h3 className="font-display text-lg font-semibold mb-2">Select a day</h3>
                <p className="text-sm text-muted-foreground">
                  Click on any day to see your habits, mood, and journal entry
                </p>
              </GlassCard>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
