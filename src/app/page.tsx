"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { HabitHeader } from "@/features/habit/components/HabitHeader";
import { HabitDialog } from "@/features/habit/components/HabitDialog";
import { NoteDialog } from "@/features/record/components/NoteDialog";
import { DateRow } from "@/features/calendar/components/DateRow";
import { useCalendar } from "@/features/calendar/hooks/useCalendar";
import { useHabitStore } from "@/features/habit/store";
import { useRecordStore } from "@/features/record/store";
import { ScrollArea } from "@/components/ui/scroll-area";

// Helper to match DB format YYYY-MM-DD
function dateToCheckString(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export default function Home() {
  const { habits, fetchHabits, createHabit } = useHabitStore();
  const { checks, toggle, updateNote, setPeriod } = useRecordStore();
  const { currentDate, daysInMonth, year, month } = useCalendar();

  // Note Dialog State
  const [editingNote, setEditingNote] = useState<{
    open: boolean;
    habitId: number | null;
    dateStr: string;
    initialNote?: string;
  }>({
    open: false,
    habitId: null,
    dateStr: "",
    initialNote: ""
  });

  // Initial Data Load
  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  // Sync Calendar with Record Store
  useEffect(() => {
    setPeriod(year, month);
  }, [year, month, setPeriod]);

  const handleToggle = (habitId: number, date: Date) => {
    toggle(habitId, dateToCheckString(date));
  };

  const handleOpenNote = (habitId: number, date: Date) => {
    const dateStr = dateToCheckString(date);
    const existingCheck = checks.find(c => c.habitId === habitId && c.date === dateStr);
    setEditingNote({
      open: true,
      habitId,
      dateStr,
      initialNote: existingCheck?.note || ""
    });
  };

  const handleSaveNote = async (note: string) => {
    if (editingNote.habitId && editingNote.dateStr) {
      await updateNote(editingNote.habitId, editingNote.dateStr, note);
    }
  };

  return (
    <div className="flex h-[100dvh] flex-col bg-background text-foreground overflow-hidden">
      <Header title={`${year}年 ${month}月`} />
      <HabitHeader habits={habits} />
      <ScrollArea className="flex-1 w-full min-h-0">
        <div className="min-w-full inline-block align-top">

          <div className="pb-32">
            {daysInMonth.map(date => (
              <DateRow
                key={date.toISOString()}
                date={date}
                habits={habits}
                checks={checks}
                onToggle={(habitId) => handleToggle(habitId, date)}
                onEditNote={(habitId) => handleOpenNote(habitId, date)}
              />
            ))}

            {/* Empty state if no habits */}
            {habits.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                <p>No habits yet.</p>
                <p className="text-sm">Tap the + button to add one.</p>
              </div>
            )}
          </div>
        </div>
      </ScrollArea>

      <div className="fixed bottom-6 right-6 z-50">
        <HabitDialog onSave={createHabit} />
      </div>

      <NoteDialog
        open={editingNote.open}
        onOpenChange={(open) => setEditingNote(prev => ({ ...prev, open }))}
        initialNote={editingNote.initialNote}
        dateStr={editingNote.dateStr}
        onSave={handleSaveNote}
      />
    </div>
  );
}
