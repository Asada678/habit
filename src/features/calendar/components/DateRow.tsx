import { CheckCell } from "@/features/record/components/CheckCell";
import { resolveHabitColor } from "@/features/habit/constants";
import type { Check, Habit } from "@/lib/types/db";
import { cn } from "@/lib/utils";

interface DateRowProps {
  date: Date;
  habits: Habit[];
  checks: Check[]; // Checks relevant to this date
  onToggle: (habitId: number) => void;
  onEditNote: (habitId: number) => void;
}

export function DateRow({
  date,
  habits,
  checks,
  onToggle,
  onEditNote,
}: DateRowProps) {
  const isToday = new Date().toDateString() === date.toDateString();

  // Format date parts
  const dayOfMonth = date.getDate();
  const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "short" });
  const isWeekend = date.getDay() === 0 || date.getDay() === 6;

  return (
    <div
      className={cn(
        "flex h-10 w-max min-w-full items-center border-b border-border bg-background transition-colors",
        // Highlight today's row slightly if desired, but keep z-index in mind
        isToday && "bg-accent/5",
      )}
    >
      {/* Date Column - Sticky Left */}
      <div
        className={cn(
          "sticky left-0 z-30 flex h-full w-12 shrink-0 items-center justify-center border-r border-border bg-background text-sm font-medium",
          isToday ? "text-primary" : "text-muted-foreground",
          isWeekend && !isToday && "text-muted-foreground/80",
        )}
      >
        <div className="flex flex-col items-center leading-none gap-0.5">
          <span>{dayOfMonth}</span>
          <span className="text-[9px] uppercase tracking-wider opacity-80">
            {dayOfWeek}
          </span>
        </div>
      </div>

      {/* Habits Grid */}
      <div className="flex h-full">
        {habits.map((habit) => {
          // Check if there's a record for this habit on this date
          // Note: Optimizing this find inside render might be needed later for perf,
          // but for < 100 items it's fine.

          // Construct YYYY-MM-DD string manually to avoid timezone issues/locale issues
          const y = date.getFullYear();
          const m = String(date.getMonth() + 1).padStart(2, "0");
          const d = String(date.getDate()).padStart(2, "0");
          const targetDateStr = `${y}-${m}-${d}`;

          const check = checks.find(
            (c) => c.habitId === habit.id && c.date === targetDateStr,
          );

          return (
            <div
              key={habit.id}
              className="flex w-12 shrink-0 items-center justify-center border-r border-border"
            >
              <CheckCell
                status={!!check?.completed}
                hasNote={!!check?.note}
                color={resolveHabitColor(habit.color)}
                onClick={() => habit.id && onToggle(habit.id)}
                onLongPress={() => habit.id && onEditNote(habit.id)}
              />
            </div>
          );
        })}

        {/* Empty Placeholder Cell to match header's + button column */}
        <div className="w-12 shrink-0 border-r border-dashed border-border" />
      </div>
    </div>
  );
}
