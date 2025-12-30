import { create } from "zustand";
import type { Habit } from "@/lib/types/db";
import { addHabit, deleteHabit, getHabits, updateHabit } from "./db";
import type { HabitUpdate, NewHabit } from "./types";

interface HabitState {
  habits: Habit[];
  isLoading: boolean;
  error: Error | null;
  fetchHabits: () => Promise<void>;
  createHabit: (data: NewHabit) => Promise<void>;
  editHabit: (id: number, data: HabitUpdate) => Promise<void>;
  removeHabit: (id: number) => Promise<void>;
}

export const useHabitStore = create<HabitState>((set, get) => ({
  habits: [],
  isLoading: false,
  error: null,
  fetchHabits: async () => {
    set({ isLoading: true, error: null });
    try {
      const habits = await getHabits();
      set({ habits });
    } catch (error) {
      set({ error: error as Error });
    } finally {
      set({ isLoading: false });
    }
  },
  createHabit: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await addHabit(data);
      // Refresh list
      await get().fetchHabits();
    } catch (error) {
      set({ error: error as Error });
    } finally {
      set({ isLoading: false });
    }
  },
  editHabit: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      await updateHabit(id, data);
      await get().fetchHabits();
    } catch (error) {
      set({ error: error as Error });
    } finally {
      set({ isLoading: false });
    }
  },
  removeHabit: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await deleteHabit(id);
      await get().fetchHabits();
    } catch (error) {
      set({ error: error as Error });
    } finally {
      set({ isLoading: false });
    }
  },
}));
