1. [x] Create a `HabitDetailDialog` component that accepts an existing habit, reuses `HabitForm` for editing, and exposes a guarded delete action; cover the save/delete callbacks with component or hook tests.
2. [x] Update `HabitHeader` to manage the dialog state so that tapping/pressing a habit column opens the detail view with the correct habit information.
3. [x] Wire the dialog actions to `useHabitStore.editHabit` / `removeHabit`, ensure the grid refreshes after save/delete, and add regression tests for renaming and removing habits from the header context.
4. [x] Manual QA plus `pnpm test` to confirm the new flow and existing suites pass (tests currently blocked by existing Vitest ESM config error; see report).
