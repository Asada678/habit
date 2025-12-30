import { db } from '@/lib/db';
import type { Habit } from '@/lib/types/db';
import type { HabitUpdate, NewHabit } from './types';

export async function addHabit(data: NewHabit): Promise<number> {
    return await db.habits.add({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
        archived: false,
    });
}

export async function getHabits(): Promise<Habit[]> {
    return await db.habits.orderBy('createdAt').filter((h) => !h.archived).toArray();
}

export async function updateHabit(id: number, data: HabitUpdate): Promise<number> {
    return await db.habits.update(id, {
        ...data,
        updatedAt: new Date(),
    });
}

export async function deleteHabit(id: number): Promise<void> {
    await db.habits.delete(id);
}
