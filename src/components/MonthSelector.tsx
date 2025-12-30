import { ChevronLeft, ChevronRight } from "lucide-react";

interface MonthSelectorProps {
  monthName: string;
  year: number;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
}

export function MonthSelector({ monthName, year, onPreviousMonth, onNextMonth }: MonthSelectorProps) {
  return (
    <div className="flex items-center justify-center mb-6">
      <div 
        className="inline-flex items-center gap-3 bg-white rounded-[18px] px-4 py-2"
        style={{ 
          boxShadow: 'none',
        }}
      >
        <button 
          onClick={onPreviousMonth}
          className="w-8 h-8 flex items-center justify-center rounded-full transition-colors hover:bg-[#F5F5F5]"
        >
          <ChevronLeft className="w-5 h-5 text-muted-foreground" />
        </button>
        
        <h2 className="font-display text-lg min-w-[180px] text-center">
          <span className="text-primary font-semibold">{monthName}</span>
          <span className="text-foreground ml-2 font-sans font-semibold italic">{year}</span>
        </h2>
        
        <button 
          onClick={onNextMonth}
          className="w-8 h-8 flex items-center justify-center rounded-full transition-colors hover:bg-[#F5F5F5]"
        >
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
}
