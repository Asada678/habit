## Why
- The Habit header currently renders static habit titles, so tapping a habit does nothing.
- Users cannot edit or delete an existing habit without a secondary navigation path, which contradicts the UI design doc that expects the same dialog to handle "既存習慣の長押し/設定メニュー".
- Enabling inline editing from the header keeps the MVP focused on quick, low-friction adjustments.

## What Changes
- Introduce a Habit Detail dialog that reuses the HabitForm, pre-fills the selected habit, and can be opened directly from the header columns.
- Wire the dialog to `useHabitStore.editHabit` / `removeHabit`, including an inline delete confirmation, so edits and deletions immediately refresh the grid.
- Keep the floating `+` dialog for creation, but ensure the header click target is accessible and keyboard operable.

## Impact
- **UI**: HabitHeader gains interaction state and renders the dialog; HabitDialog/HabitForm gain props for edit/delete context.
- **State**: No schema change; we reuse the existing store methods and Dexie tables.
- **Testing**: Need component/unit coverage for the new dialog behaviours plus a quick regression check around header interactions.
