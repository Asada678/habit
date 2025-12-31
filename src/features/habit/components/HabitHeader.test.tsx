import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Habit } from "@/lib/types/db";
import { HabitHeader } from "./HabitHeader";
import { useHabitStore } from "../store";

const baseHabit: Habit = {
  id: 1,
  title: "Read",
  icon: "📚",
  color: "#3b82f6",
  frequency: [1, 1, 1, 1, 1, 1, 1],
  targetCount: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
  archived: false,
};

const originalEdit = useHabitStore.getState().editHabit;
const originalRemove = useHabitStore.getState().removeHabit;

describe("HabitHeader", () => {
  beforeEach(() => {
    useHabitStore.setState({
      editHabit: vi.fn().mockResolvedValue(undefined),
      removeHabit: vi.fn().mockResolvedValue(undefined),
    });
  });

  afterEach(() => {
    useHabitStore.setState({
      editHabit: originalEdit,
      removeHabit: originalRemove,
    });
    vi.restoreAllMocks();
  });

  it("opens the detail dialog and saves habit edits", async () => {
    const editHabitMock = vi.fn().mockResolvedValue(undefined);
    useHabitStore.setState({ editHabit: editHabitMock });

    render(<HabitHeader habits={[baseHabit]} />);

    fireEvent.click(screen.getByRole("button", { name: /read/i }));
    const titleInput = await screen.findByLabelText("Habit Title");
    fireEvent.change(titleInput, { target: { value: "Read Books" } });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() =>
      expect(editHabitMock).toHaveBeenCalledWith(
        1,
        expect.objectContaining({ title: "Read Books" }),
      ),
    );
  });

  it("deletes a habit after confirmation", async () => {
    const removeHabitMock = vi.fn().mockResolvedValue(undefined);
    useHabitStore.setState({ removeHabit: removeHabitMock });
    vi.spyOn(window, "confirm").mockReturnValue(true);

    render(<HabitHeader habits={[baseHabit]} />);

    fireEvent.click(screen.getByRole("button", { name: /read/i }));
    const deleteButton = await screen.findByRole("button", {
      name: /delete habit/i,
    });
    fireEvent.click(deleteButton);

    await waitFor(() => expect(removeHabitMock).toHaveBeenCalledWith(1));
  });
});
