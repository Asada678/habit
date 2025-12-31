export const HABIT_COLOR_MAP = {
    pink: "var(--habit-pink)",
    orange: "var(--habit-orange)",
    blue: "var(--habit-blue)",
    purple: "var(--habit-purple)",
    yellow: "var(--habit-yellow)",
    green: "var(--habit-green)",
} as const;

export type HabitColorKey = keyof typeof HABIT_COLOR_MAP;

export const HABIT_COLORS = Object.keys(HABIT_COLOR_MAP) as HabitColorKey[];

// Helper to resolve color safely (handling legacy hex codes if any)
export function resolveHabitColor(color?: string): string {
    if (!color) return "var(--habit-pink)"; // Default
    if (color in HABIT_COLOR_MAP) {
        return HABIT_COLOR_MAP[color as HabitColorKey];
    }
    return color; // Fallback for legacy hex codes
}
