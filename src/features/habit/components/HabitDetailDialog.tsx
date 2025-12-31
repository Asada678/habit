import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Habit } from "@/lib/types/db";
import type { HabitUpdate, NewHabit } from "@/features/habit/types";
import { HabitForm } from "./HabitForm";

interface HabitDetailDialogProps {
  habit: Habit | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (id: number, data: HabitUpdate) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export function HabitDetailDialog({
  habit,
  open,
  onOpenChange,
  onSave,
  onDelete,
}: HabitDetailDialogProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSave = async (data: NewHabit) => {
    if (!habit?.id) return;
    setIsSaving(true);
    try {
      await onSave(habit.id, data);
      onOpenChange(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!habit?.id) return;
    const confirmed = window.confirm(
      "Delete this habit? This action cannot be undone.",
    );
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      await onDelete(habit.id);
      onOpenChange(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Habit</DialogTitle>
        </DialogHeader>
        {habit ? (
          <>
            <HabitForm
              initialData={{
                title: habit.title,
                icon: habit.icon,
                color: habit.color,
                frequency: habit.frequency,
                targetCount: habit.targetCount,
              }}
              onSubmit={handleSave}
              onCancel={() => onOpenChange(false)}
            />
            <div className="pt-4">
              <Button
                variant="destructive"
                type="button"
                onClick={handleDelete}
                disabled={isSaving || isDeleting}
                className="w-full"
              >
                Delete Habit
              </Button>
            </div>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            Select a habit to view details.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
