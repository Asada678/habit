import type { Habit } from "@/lib/types/db";
import { cn } from "@/lib/utils";

interface HabitHeaderProps {
  habits: Habit[];
}

export function HabitHeader({ habits }: HabitHeaderProps) {
  return (
    <div className="sticky top-0 z-40 flex border-b bg-background/95 backdrop-blur py-2 shadow-sm">
      <div className="w-14 shrink-0 flex items-center justify-center border-r border-border/50 bg-background/50">
        <span className="text-xs font-medium text-muted-foreground">Date</span>
      </div>
      <div className="flex flex-1 gap-2 overflow-x-auto px-2 no-scrollbar">
        {habits.map((habit) => (
          <div
            key={habit.id}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-xl shadow-sm ring-1 ring-inset ring-border/50 transition-transform hover:scale-105"
            title={habit.title}
            style={{
              backgroundColor: habit.color ? `${habit.color}20` : undefined,
            }}
          >
            <span role="img" aria-label={habit.title}>
              {habit.icon || "📝"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
