"use client";

import { useEffect, useState } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { BottomNav } from "@/components/layout/BottomNav";
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
    <div className="h-[100dvh] w-full overflow-auto bg-background text-foreground relative">
      {/* 
        Content Wrapper
        min-w-max ensures the container grows horizontally if children (habit columns) overflow 
      */}
      <main className="min-w-max flex flex-col pb-32">
        {/* App Header - Scrolls vertically, Stays fixed horizontally */}
        {/* z-[60] to be safe above others if overlap occurs (though usually flows above) */}
        <div className="sticky left-0 z-[60] w-screen max-w-full bg-background px-4">
          <AppHeader />
        </div>

        {/* Calendar Control - Sticky Top & Left */}
        {/* height 12 (3rem/48px) to serve as offset for HabitHeader */}
        <div className="sticky top-0 left-0 z-[50] w-screen max-w-full bg-background border-b border-border h-12 flex items-center">
          <CalendarControl
            currentDate={currentDate}
            onDateChange={setDate}
            className="w-full border-none px-4"
          />
        </div>

        {/* HabitHeader - Sticky Top (below Calendar) */}
        {/* top-12 matches CalendarControl height */}
        <div className="sticky top-12 z-[40] bg-background">
          <HabitHeader habits={habits} />
        </div>

        {/* Date Grid */}
        <div className="flex flex-col z-0">
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
          <div className="sticky left-0 w-screen max-w-full p-8 text-center text-muted-foreground">
            <p>No habits yet.</p>
            <p className="text-sm">Tap the + button to add one.</p>
          </div>
        )}
      </main>

      {/* Fixed Overlay UI */}
      <div className="fixed bottom-24 right-6 z-[70]">
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

      {/* Paper Texture Overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-[100] opacity-[0.4] mix-blend-multiply dark:mix-blend-overlay"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0,0,0,0.02) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,0,0,0.02) 1px, transparent 1px)
          `,
          backgroundSize: "24px 24px",
        }}
      />
    </div>
  );
}
