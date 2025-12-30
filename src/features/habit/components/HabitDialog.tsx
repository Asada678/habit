import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { NewHabit } from "@/features/habit/types";
import { HabitForm } from "./HabitForm";

interface HabitDialogProps {
  onSave: (habit: NewHabit) => Promise<void>;
}

export function HabitDialog({ onSave }: HabitDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSave = async (data: NewHabit) => {
    await onSave(data);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div /* Fixed FAB wrapper is better handled in layout, but here just the button */
        >
          <Button size="icon" className="h-14 w-14 rounded-full shadow-lg">
            <Plus className="h-6 w-6" />
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Habit</DialogTitle>
        </DialogHeader>
        <HabitForm onSubmit={handleSave} onCancel={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
