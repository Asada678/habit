import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { db } from "@/lib/db";
import { useHabitStore } from "../store";
import { useHabit } from "./useHabit";
import "fake-indexeddb/auto";

describe("useHabit", () => {
  beforeEach(async () => {
    // Reset DB and Store for isolation
    await db.delete();
    await db.open();
    useHabitStore.setState({ habits: [], isLoading: false, error: null });
  });

  it("should start with empty habits", () => {
    const { result } = renderHook(() => useHabit());
    expect(result.current.habits).toEqual([]);
  });

  it("should add a habit and update state", async () => {
    const { result } = renderHook(() => useHabit());
    const title = "Drink Water";

    await act(async () => {
      await result.current.createHabit({ title });
    });

    expect(result.current.habits).toHaveLength(1);
    expect(result.current.habits[0].title).toBe(title);
    expect(result.current.habits[0].id).toBeDefined();
  });

  it("should fetch habits from DB", async () => {
    // Add directly to DB
    await db.habits.add({
      title: "Exercise",
      createdAt: new Date(),
      updatedAt: new Date(),

      archived: false,
    });

    const { result } = renderHook(() => useHabit());

    await act(async () => {
      await result.current.fetchHabits();
    });

    expect(result.current.habits).toHaveLength(1);
    expect(result.current.habits[0].title).toBe("Exercise");
  });

  it("should update a habit", async () => {
    const { result } = renderHook(() => useHabit());

    await act(async () => {
      await result.current.createHabit({ title: "Old Title" });
    });

    const id = result.current.habits[0].id!;

    await act(async () => {
      await result.current.editHabit(id, { title: "New Title" });
    });

    expect(result.current.habits[0].title).toBe("New Title");
  });

  it("should delete a habit", async () => {
    const { result } = renderHook(() => useHabit());

    await act(async () => {
      await result.current.createHabit({ title: "To Delete" });
    });

    const id = result.current.habits[0].id!;

    await act(async () => {
      await result.current.removeHabit(id);
    });

    expect(result.current.habits).toHaveLength(0);
  });
});
