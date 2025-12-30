import { CheckCell } from "@/features/record/components/CheckCell";
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
        "flex items-center text-sm transition-colors hover:bg-muted/30",
        isToday
          ? "bg-accent/10 hover:bg-accent/20"
          : "border-b border-border/40",
      )}
    >
      {/* Date Column */}
      <div
        className={cn(
          "w-14 shrink-0 flex flex-col items-center justify-center py-3 border-r border-border/50",
          isToday && "text-primary font-bold",
          !isToday && isWeekend && "text-muted-foreground/80",
          !isToday && !isWeekend && "text-muted-foreground",
        )}
      >
        <span className="text-lg leading-none">{dayOfMonth}</span>
        <span className="text-[10px] uppercase tracking-wider leading-none mt-1">
          {dayOfWeek}
        </span>
      </div>

      {/* Habits Grid */}
      <div className="flex flex-1 gap-2 overflow-x-hidden px-2">
        {habits.map((habit) => {
          // Check if there's a record for this habit on this date
          // Note: Optimizing this find inside render might be needed later for perf,
          // but for < 100 items it's fine.
          const dateStr = date.toLocaleDateString("ja-JP").split("/").join("-"); // YYYY-MM-DD format?
          // Wait, in db.ts we use YYYY-MM-DD string format.
          // Let's ensure format matches.
          // The date passed here is a JS Date object from useCalendar.

          // Construct YYYY-MM-DD string manually to avoid timezone issues/locale issues
          const y = date.getFullYear();
          const m = String(date.getMonth() + 1).padStart(2, "0");
          const d = String(date.getDate()).padStart(2, "0");
          const targetDateStr = `${y}-${m}-${d}`;

          const check = checks.find(
            (c) => c.habitId === habit.id && c.date === targetDateStr,
          );

          return (
            <CheckCell
              key={habit.id}
              status={!!check?.completed}
              hasNote={!!check?.note}
              color={habit.color}
              onClick={() => habit.id && onToggle(habit.id)}
              onLongPress={() => habit.id && onEditNote(habit.id)}
            />
          );
        })}
      </div>
    </div>
  );
}
