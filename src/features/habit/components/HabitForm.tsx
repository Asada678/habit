import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; // Check if Label exists, usually in shadcn
import {
  HABIT_COLORS,
  HABIT_COLOR_MAP,
  resolveHabitColor,
} from "@/features/habit/constants";
import type { NewHabit } from "@/features/habit/types";

interface HabitFormProps {
  initialData?: Partial<NewHabit>;
  onSubmit: (data: NewHabit) => void;
  onCancel: () => void;
}

export function HabitForm({ initialData, onSubmit, onCancel }: HabitFormProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [icon, setIcon] = useState(initialData?.icon || "📝");
  const [color, setColor] = useState(initialData?.color || HABIT_COLORS[0]);

  useEffect(() => {
    setTitle(initialData?.title || "");
    setIcon(initialData?.icon || "📝");
    setColor(initialData?.color || HABIT_COLORS[0]);
  }, [initialData?.title, initialData?.icon, initialData?.color]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      icon,
      color,
      frequency: initialData?.frequency || [1, 1, 1, 1, 1, 1, 1], // default everyday
      targetCount: initialData?.targetCount || 1,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Habit Title</Label>
        <Input
          id="title"
          placeholder="e.g. Read Books"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          autoFocus
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="icon">Icon (Emoji)</Label>
          <div className="flex">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-l-md border border-r-0 text-xl"
              style={{
                backgroundColor: resolveHabitColor(color),
                opacity: 0.8,
              }}
            >
              {icon}
            </div>
            <Input
              id="icon"
              className="rounded-l-none"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              maxLength={2}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Color</Label>
          <div className="flex flex-wrap gap-2">
            {HABIT_COLORS.map((cKey) => (
              <button
                type="button"
                key={cKey}
                className={`h-6 w-6 rounded-full ring-offset-background transition-transform hover:scale-110 ${color === cKey ? "ring-2 ring-offset-2 ring-primary" : ""}`}
                style={{ backgroundColor: HABIT_COLOR_MAP[cKey] }}
                onClick={() => setColor(cKey)}
                aria-label={`Select ${cKey} color`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={!title.trim()}>
          Save
        </Button>
      </div>
    </form>
  );
}
