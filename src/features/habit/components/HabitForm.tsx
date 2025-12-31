import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; // Check if Label exists, usually in shadcn
import type { NewHabit } from "@/features/habit/types";

interface HabitFormProps {
  initialData?: Partial<NewHabit>;
  onSubmit: (data: NewHabit) => void;
  onCancel: () => void;
}

const COLORS = [
  "#ef4444", // red
  "#f97316", // orange
  "#f59e0b", // amber
  "#84cc16", // lime
  "#10b981", // emerald
  "#06b6d4", // cyan
  "#3b82f6", // blue
  "#8b5cf6", // violet
  "#d946ef", // fuchsia
  "#f43f5e", // rose
];

export function HabitForm({ initialData, onSubmit, onCancel }: HabitFormProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [icon, setIcon] = useState(initialData?.icon || "📝");
  const [color, setColor] = useState(initialData?.color || COLORS[6]);

  useEffect(() => {
    setTitle(initialData?.title || "");
    setIcon(initialData?.icon || "📝");
    setColor(initialData?.color || COLORS[6]);
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
            <div className="flex h-10 w-10 items-center justify-center rounded-l-md border border-r-0 bg-muted text-xl">
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
            {COLORS.map((c) => (
              <button
                type="button"
                key={c}
                className={`h-6 w-6 rounded-full transition-transform hover:scale-110 ${color === c ? "ring-2 ring-offset-2 ring-primary" : ""}`}
                style={{ backgroundColor: c }}
                onClick={() => setColor(c)}
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
