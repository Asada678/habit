## ADDED Requirements

### Requirement: Habit header opens a detail dialog
The month grid header MUST treat each habit column header as an entry point to that habit's settings.

#### Scenario: Tap or focus-activate a habit header
- **GIVEN** the month grid renders at least one habit
- **WHEN** the user taps, clicks, or presses Enter/Space on a habit header column
- **THEN** a Habit Detail dialog opens
- **AND** the dialog shows the selected habit's title, icon, and color in editable controls.

#### Scenario: Dismiss without changes
- **WHEN** the user closes the dialog via the Cancel button or Escape key
- **THEN** the dialog closes
- **AND** no habit data changes are persisted.

### Requirement: Habit detail dialog saves edits
Editing a habit from the header MUST reuse the existing HabitForm and persist updates immediately.

#### Scenario: Save habit edits
- **GIVEN** the Habit Detail dialog is open for a habit
- **WHEN** the user updates the title/icon/color and presses Save
- **THEN** the form validates the required title
- **AND** the app persists the changes via `useHabitStore.editHabit`
- **AND** the header/grid re-render to reflect the updated habit without a full page reload.

### Requirement: Habit detail dialog deletes a habit
Users MUST be able to remove a habit from the same dialog with an explicit confirmation step.

#### Scenario: Confirm delete
- **GIVEN** the Habit Detail dialog is open
- **WHEN** the user chooses Delete and confirms the destructive action
- **THEN** the app calls `useHabitStore.removeHabit`
- **AND** the habit column disappears from the header/grid immediately.

#### Scenario: Abort delete
- **WHEN** the user cancels the delete confirmation
- **THEN** the dialog stays open
- **AND** the habit remains unchanged.
