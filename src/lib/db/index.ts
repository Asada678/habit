import Dexie, { type Table } from "dexie";
import type { Check, Habit } from "../types/db";

export class HabitAppDB extends Dexie {
  habits!: Table<Habit>;
  checks!: Table<Check>;

  constructor() {
    super("HabitAppDB");
    this.version(1).stores({
      habits: "++id, title, createdAt, updatedAt, archived",
      checks: "++id, habitId, date, [habitId+date], updatedAt",
    });
  }
}

export const db = new HabitAppDB();
