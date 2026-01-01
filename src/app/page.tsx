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

  // Header Scroll Logic with Intersection Observer
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);

  useEffect(() => {
    const sentinel = document.getElementById("scroll-sentinel");
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // If sentinel is interacting (visible at top), show header.
        // If it scrolls out of view, hide header.
        setIsHeaderVisible(entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="h-[100dvh] w-full flex flex-col bg-background text-foreground relative">
      {/* 
        1. Collapsible Top Area (App Header)
        Hides when scrolling down in the main area (Sentinel goes out of view).
      */}
      <div
        className={`shrink-0 z-[60] bg-background w-full transition-all duration-300 ease-in-out overflow-hidden ${isHeaderVisible ? "max-h-24 opacity-100" : "max-h-0 opacity-0"
          }`}
      >
        <AppHeader />
      </div>

      {/* Calendar Control - Sticky Top (Fixed relative to Main) */}
      <div className="shrink-0 z-[50] w-full bg-background border-b border-border h-12 flex items-center relative">
        <CalendarControl
          currentDate={currentDate}
          onDateChange={setDate}
          className="w-full border-none px-4"
        />
      </div>

      {/* 
        2. Main Scrollable Area
      */}
      <div className="flex-1 overflow-auto relative w-full">
        {/* min-w-max ensures horizontal scrolling triggers when content overflows */}
        <main className="min-w-max flex flex-col pb-32">

          {/* Option 4: Sentinel Element for Observer */}
          {/* Placed at the very top of scrollable content. When this scrolls out, header hides. */}
          <div id="scroll-sentinel" className="h-[1px] w-full absolute top-0 pointer-events-none opacity-0" />

          {/* HabitHeader - Sticky Top (at top of scroll container) */}
          <div className="sticky top-0 z-[40] bg-background">
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
      </div>

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
