import type { Check } from "@/lib/types/db";

export type { Check };

export type CheckToggle = Pick<Check, "habitId" | "date"> & {
  completed?: boolean;
}; // If undefined, toggle?
export type CheckNote = Pick<Check, "habitId" | "date" | "note">;
