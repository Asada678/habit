import { useHabitStore } from "../store";

export const useHabit = () => {
  const habits = useHabitStore((state) => state.habits);
  const isLoading = useHabitStore((state) => state.isLoading);
  const error = useHabitStore((state) => state.error);
  const fetchHabits = useHabitStore((state) => state.fetchHabits);
  const createHabit = useHabitStore((state) => state.createHabit);
  const editHabit = useHabitStore((state) => state.editHabit);
  const removeHabit = useHabitStore((state) => state.removeHabit);

  return {
    habits,
    isLoading,
    error,
    fetchHabits,
    createHabit,
    editHabit,
    removeHabit,
  };
};
