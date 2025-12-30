import { create } from "zustand";
import type { Check } from "@/lib/types/db";
import { getChecksForMonth, saveNote, toggleCheck } from "./db";

interface RecordState {
  checks: Check[];
  currentYear: number;
  currentMonth: number;
  isLoading: boolean;
  error: Error | null;

  setPeriod: (year: number, month: number) => void;
  fetchChecks: () => Promise<void>;
  toggle: (habitId: number, date: string) => Promise<void>;
  updateNote: (habitId: number, date: string, note: string) => Promise<void>;
}

const today = new Date();

export const useRecordStore = create<RecordState>((set, get) => ({
  checks: [],
  currentYear: today.getFullYear(),
  currentMonth: today.getMonth() + 1,
  isLoading: false,
  error: null,

  setPeriod: (year, month) => {
    set({ currentYear: year, currentMonth: month });
    get().fetchChecks();
  },

  fetchChecks: async () => {
    const { currentYear, currentMonth } = get();
    set({ isLoading: true, error: null });
    try {
      const checks = await getChecksForMonth(currentYear, currentMonth);
      set({ checks });
    } catch (error) {
      set({ error: error as Error });
    } finally {
      set({ isLoading: false });
    }
  },

  toggle: async (habitId, date) => {
    // Optimistic update could go here, but for now simple await
    try {
      await toggleCheck(habitId, date);
      await get().fetchChecks();
    } catch (error) {
      console.error("Toggle failed", error);
      // Maybe rollback or show toast
    }
  },

  updateNote: async (habitId, date, note) => {
    try {
      await saveNote(habitId, date, note);
      await get().fetchChecks();
    } catch (error) {
      console.error("Save note failed", error);
    }
  },
}));
