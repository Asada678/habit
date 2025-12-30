import type { Habit } from '@/lib/types/db';

export type { Habit };

export type NewHabit = Pick<Habit, 'title'>;
export type HabitUpdate = Partial<Pick<Habit, 'title' | 'archived'>>;
