import { useEffect, useState } from "react";
import type { Habit } from "@/lib/types/db";
import { useHabitStore } from "@/features/habit/store";
import type { HabitUpdate } from "@/features/habit/types";
import { HabitDetailDialog } from "./HabitDetailDialog";

interface HabitHeaderProps {
  habits: Habit[];
}

export function HabitHeader({ habits }: HabitHeaderProps) {
  const editHabit = useHabitStore((state) => state.editHabit);
  const removeHabit = useHabitStore((state) => state.removeHabit);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  useEffect(() => {
    if (!selectedHabit?.id) return;
    const latest = habits.find((habit) => habit.id === selectedHabit.id);
    if (latest && latest !== selectedHabit) {
      setSelectedHabit(latest);
    }
  }, [habits, selectedHabit]);

  const handleOpenHabit = (habit: Habit) => {
    setSelectedHabit(habit);
    setDetailOpen(true);
  };

  const handleDialogChange = (open: boolean) => {
    setDetailOpen(open);
    if (!open) {
      setSelectedHabit(null);
    }
  };

  const handleSave = (id: number, data: HabitUpdate) => editHabit(id, data);
  const handleDelete = (id: number) => removeHabit(id);

  return (
    <>
      <div className="sticky top-0 z-40 flex border-b border-border bg-background">
        {/* Corner "Day" Header - Sticky Left & Top */}
        <div className="sticky left-0 z-50 flex w-12 shrink-0 items-end justify-center border-r border-border bg-background pb-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Day
          </span>
        </div>

        {/* Habit Columns */}
        <div className="flex">
          {habits.map((habit) => (
            <button
              type="button"
              key={habit.id}
              className="group relative flex h-32 w-12 shrink-0 cursor-pointer flex-col items-center justify-center border-r border-border transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              title={habit.title}
              aria-label={habit.title}
              onClick={() => handleOpenHabit(habit)}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  className="whitespace-nowrap text-lg font-medium text-foreground"
                  style={{
                    writingMode: "vertical-rl",
                    textOrientation: "mixed",
                  }}
                >
                  {habit.title}
                </span>
              </div>
              {/* Hover visual cue or color strip could be added here */}
            </button>
          ))}

          {/* Add Button Placeholder (Optional, strictly following dashboard.html logic it might be here) */}
          <div className="flex h-32 w-12 shrink-0 items-center justify-center border-r border-dashed border-border transition-colors hover:bg-muted/50">
            <span className="text-muted-foreground opacity-50">+</span>
          </div>
        </div>
      </div>
      <HabitDetailDialog
        habit={selectedHabit}
        open={detailOpen && Boolean(selectedHabit)}
        onOpenChange={handleDialogChange}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </>
  );
}
