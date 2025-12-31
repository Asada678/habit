"use client";

import { useEffect, useState } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { BottomNav } from "@/components/layout/BottomNav";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CalendarControl } from "@/features/calendar/components/CalendarControl";
import { DateRow } from "@/features/calendar/components/DateRow";
import { useCalendar } from "@/features/calendar/hooks/useCalendar";
import { HabitDialog } from "@/features/habit/components/HabitDialog";
import { HabitHeader } from "@/features/habit/components/HabitHeader";
import { useHabitStore } from "@/features/habit/store";
import { NoteDialog } from "@/features/record/components/NoteDialog";
import { useRecordStore } from "@/features/record/store";

// Helper to match DB format YYYY-MM-DD
function dateToCheckString(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function Home() {
  const { habits, fetchHabits, createHabit } = useHabitStore();
  const { checks, toggle, updateNote, setPeriod } = useRecordStore();
  const { daysInMonth, year, month, currentDate, setDate } = useCalendar();

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
    initialNote: "",
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
    const existingCheck = checks.find(
      (c) => c.habitId === habitId && c.date === dateStr,
    );
    setEditingNote({
      open: true,
      habitId,
      dateStr,
      initialNote: existingCheck?.note || "",
    });
  };

  const handleSaveNote = async (note: string) => {
    if (editingNote.habitId && editingNote.dateStr) {
      await updateNote(editingNote.habitId, editingNote.dateStr, note);
    }
  };

  return (
    <div className="flex h-[100dvh] flex-col bg-background text-foreground overflow-hidden relative">
      <main className="flex-1 overflow-hidden flex flex-col relative z-0">
        <ScrollArea className="flex-1 w-full min-h-0">
          <div className="min-w-max pb-32">

            {/* Scrollable App Header */}
            <AppHeader />

            {/* Sticky Header Container (Month + Habits) */}
            <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm border-b border-border">
              <CalendarControl
                currentDate={currentDate}
                onDateChange={setDate}
              />
              <HabitHeader habits={habits} />
            </div>

            {/* Date Grid */}
            <div className="relative z-0">
              {daysInMonth.map((date) => (
                <DateRow
                  key={date.toISOString()}
                  date={date}
                  habits={habits}
                  checks={checks}
                  onToggle={(habitId) => handleToggle(habitId, date)}
                  onEditNote={(habitId) => handleOpenNote(habitId, date)}
                />
              ))}
            </div>

            {/* Empty state if no habits */}
            {habits.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                <p>No habits yet.</p>
                <p className="text-sm">Tap the + button to add one.</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </main>

      <div className="fixed bottom-24 right-6 z-50">
        <HabitDialog onSave={createHabit} />
      </div>

      <NoteDialog
        open={editingNote.open}
        onOpenChange={(open) => setEditingNote((prev) => ({ ...prev, open }))}
        initialNote={editingNote.initialNote}
        dateStr={editingNote.dateStr}
        onSave={handleSaveNote}
      />
      <BottomNav />
      {/* Paper Texture Overlay using CSS Gradient */}
      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.4] mix-blend-multiply dark:mix-blend-overlay"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0,0,0,0.02) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,0,0,0.02) 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px'
        }}
      />
    </div>
  );
}
